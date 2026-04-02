'use server'
// src/app/actions/upload.ts
// Persists patient self-upload wizard data to Supabase

import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase'

// ── Input schemas ─────────────────────────────────────────────────────────────

const MedicationSchema = z.object({
  name: z.string().min(1),
  dosage: z.string().default(''),
  indication: z.string().default(''),
  rxnormCode: z.string().optional(),
})

const AllergySchema = z.object({
  substance: z.string().min(1),
  reaction: z.string().default(''),
  severity: z.enum(['mild', 'moderate', 'severe']).default('moderate'),
})

const ConditionSchema = z.object({
  name: z.string().min(1),
  status: z.enum(['active', 'resolved', 'chronic']).default('active'),
  onsetYear: z.string().optional(),
  icdCode: z.string().optional(),
})

const LabSchema = z.object({
  name: z.string().min(1),
  value: z.string().default(''),
  date: z.string().default(''),
  status: z.enum(['normal', 'abnormal', 'critical']).default('normal'),
  loincCode: z.string().optional(),
})

export const UploadSchema = z.object({
  name: z.string().min(1),
  dob: z.string().min(1),
  gender: z.enum(['male', 'female', 'other']),
  bloodType: z.string().optional(),
  height: z.string().optional(),
  medications: z.array(MedicationSchema).default([]),
  allergies: z.array(AllergySchema).default([]),
  conditions: z.array(ConditionSchema).default([]),
  labs: z.array(LabSchema).default([]),
  weight: z.string().optional(),
  bpSystolic: z.string().optional(),
  bpDiastolic: z.string().optional(),
  heartRate: z.string().optional(),
  pin: z.string().length(6),
})

export type UploadInput = z.infer<typeof UploadSchema>

export interface UploadActionResult {
  success: boolean
  error?: string
  patientId?: string
}

// ── Action ────────────────────────────────────────────────────────────────────

export async function savePatientRecord(input: UploadInput): Promise<UploadActionResult> {
  const parsed = UploadSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  const db = getSupabaseAdmin()
  const d = parsed.data

  // Check if PIN is already in use
  const { data: existing } = await db
    .from('access_sessions')
    .select('id')
    .eq('session_pin', d.pin)
    .limit(1)
    .single()

  if (existing) {
    return { success: false, error: 'PIN collision — please generate a new PIN' }
  }

  // Generate unique identifiers
  const chartNumber = `CHT-${Date.now()}`
  const mrn = `MRN-${d.pin}`

  // Parse name into first/last
  const nameParts = d.name.trim().split(/\s+/)
  const firstName = nameParts[0] ?? d.name
  const lastName = nameParts.slice(1).join(' ') || 'Unknown'

  // Compute age
  const dobDate = new Date(d.dob)
  const age = Math.floor((Date.now() - dobDate.getTime()) / (365.25 * 24 * 3600 * 1000))

  // 1. Insert patient
  const { data: patient, error: patientErr } = await db
    .from('patients')
    .insert({
      chart_number: chartNumber,
      mrn,
      first_name: firstName,
      last_name: lastName,
      dob: d.dob,
      age,
      gender: d.gender,
      blood_type: d.bloodType || null,
    })
    .select('id')
    .single()

  if (patientErr || !patient) {
    console.error('patient insert error:', patientErr)
    return { success: false, error: 'Failed to create patient record' }
  }

  const patientId = patient.id

  // 2. Insert medications
  if (d.medications.length > 0) {
    const { error } = await db.from('medications').insert(
      d.medications.map(m => ({
        patient_id: patientId,
        name: m.name,
        dosage: m.dosage || 'as directed',
        frequency: 'as directed',
        route: 'oral',
        indication: m.indication || null,
        start_date: new Date().toISOString().split('T')[0],
        status: 'active',
      }))
    )
    if (error) console.error('medications insert error:', error)
  }

  // 3. Insert allergies
  if (d.allergies.length > 0) {
    const { error } = await db.from('allergies').insert(
      d.allergies.map(a => ({
        patient_id: patientId,
        substance: a.substance,
        reaction: a.reaction || 'unknown',
        severity: a.severity,
      }))
    )
    if (error) console.error('allergies insert error:', error)
  }

  // 4. Insert conditions
  if (d.conditions.length > 0) {
    const { error } = await db.from('conditions').insert(
      d.conditions.map(c => ({
        patient_id: patientId,
        name: c.name,
        icd10_code: c.icdCode || 'Z99.9',
        status: c.status,
        onset_year: c.onsetYear ? parseInt(c.onsetYear) : null,
      }))
    )
    if (error) console.error('conditions insert error:', error)
  }

  // 5. Insert lab results
  if (d.labs.length > 0) {
    const { error } = await db.from('lab_results').insert(
      d.labs.map(l => ({
        patient_id: patientId,
        test_name: l.name,
        value: l.value || 'pending',
        unit: '',
        status: l.status,
        collected_date: l.date || new Date().toISOString().split('T')[0],
        resulted_date: l.date || new Date().toISOString().split('T')[0],
      }))
    )
    if (error) console.error('labs insert error:', error)
  }

  // 6. Insert vitals (if any provided)
  const hasVitals = d.weight || d.bpSystolic || d.bpDiastolic || d.heartRate
  if (hasVitals) {
    const toInt = (v?: string) => (v && v !== '' ? parseInt(v) : null)
    const toNum = (v?: string) => (v && v !== '' ? parseFloat(v) : null)
    const { error } = await db.from('vitals').insert({
      patient_id: patientId,
      recorded_date: new Date().toISOString().split('T')[0],
      weight_lbs: toNum(d.weight),
      bp_systolic: toInt(d.bpSystolic),
      bp_diastolic: toInt(d.bpDiastolic),
      heart_rate: toInt(d.heartRate),
    })
    if (error) console.error('vitals insert error:', error)
  }

  // 7. Create access session with PIN (24h expiry, full scope)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  const { error: sessionErr } = await db.from('access_sessions').insert({
    patient_id: patientId,
    session_pin: d.pin,
    scope: ['medications', 'allergies', 'conditions', 'labs', 'vitals'],
    expires_at: expiresAt,
    status: 'active',
  })

  if (sessionErr) {
    console.error('access_sessions insert error:', sessionErr)
    return { success: false, error: 'Failed to create access session' }
  }

  return { success: true, patientId }
}
