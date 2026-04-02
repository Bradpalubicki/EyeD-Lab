// src/app/api/upload/route.ts
// Replaces the broken Server Action — plain POST route, no "use server" boundary issues
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, dob, gender, bloodType, medications, allergies, conditions, labs, weight, bpSystolic, bpDiastolic, heartRate, pin } = body

    if (!name || !dob || !gender || !pin) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = getSupabaseAdmin()

    // Check PIN collision
    const { data: existing } = await db
      .from('access_sessions')
      .select('id')
      .eq('session_pin', pin)
      .limit(1)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'PIN collision — please try again' }, { status: 409 })
    }

    // Parse name
    const parts = name.trim().split(/\s+/)
    const firstName = parts[0] ?? name
    const lastName = parts.slice(1).join(' ') || 'Unknown'

    // Age from DOB
    const age = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000))

    // Insert patient
    const { data: patient, error: patientErr } = await db
      .from('patients')
      .insert({
        chart_number: `CHT-${Date.now()}`,
        mrn: `MRN-${pin}`,
        first_name: firstName,
        last_name: lastName,
        dob,
        age,
        gender,
        blood_type: bloodType || null,
      })
      .select('id')
      .single()

    if (patientErr || !patient) {
      console.error('patient insert:', patientErr)
      return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 })
    }

    const pid = patient.id
    const today = new Date().toISOString().split('T')[0]

    // Medications
    if (medications?.length > 0) {
      await db.from('medications').insert(
        medications.map((m: { name: string; dosage: string; indication: string }) => ({
          patient_id: pid,
          name: m.name,
          dosage: m.dosage || 'as directed',
          frequency: 'as directed',
          route: 'oral',
          indication: m.indication || null,
          start_date: today,
          status: 'active',
        }))
      )
    }

    // Allergies
    if (allergies?.length > 0) {
      await db.from('allergies').insert(
        allergies.map((a: { substance: string; reaction: string; severity: string }) => ({
          patient_id: pid,
          substance: a.substance,
          reaction: a.reaction || 'unknown',
          severity: ['mild', 'moderate', 'severe'].includes(a.severity) ? a.severity : 'moderate',
        }))
      )
    }

    // Conditions
    if (conditions?.length > 0) {
      await db.from('conditions').insert(
        conditions.map((c: { name: string; status: string; onsetYear: string; icdCode: string }) => ({
          patient_id: pid,
          name: c.name,
          icd10_code: c.icdCode || 'Z99.9',
          status: ['active', 'resolved', 'chronic'].includes(c.status) ? c.status : 'active',
          onset_year: c.onsetYear ? parseInt(c.onsetYear) : null,
        }))
      )
    }

    // Labs
    if (labs?.length > 0) {
      await db.from('lab_results').insert(
        labs.map((l: { name: string; value: string; date: string; status: string }) => ({
          patient_id: pid,
          test_name: l.name,
          value: l.value || 'pending',
          unit: '',
          status: ['normal', 'abnormal', 'critical'].includes(l.status) ? l.status : 'normal',
          collected_date: l.date || today,
          resulted_date: l.date || today,
        }))
      )
    }

    // Vitals
    if (weight || bpSystolic || bpDiastolic || heartRate) {
      await db.from('vitals').insert({
        patient_id: pid,
        recorded_date: today,
        weight_lbs: weight ? parseFloat(weight) : null,
        bp_systolic: bpSystolic ? parseInt(bpSystolic) : null,
        bp_diastolic: bpDiastolic ? parseInt(bpDiastolic) : null,
        heart_rate: heartRate ? parseInt(heartRate) : null,
      })
    }

    // Access session with PIN
    const { error: sessionErr } = await db.from('access_sessions').insert({
      patient_id: pid,
      session_pin: pin,
      scope: ['medications', 'allergies', 'conditions', 'labs', 'vitals'],
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
    })

    if (sessionErr) {
      console.error('access_sessions insert:', sessionErr)
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    }

    return NextResponse.json({ success: true, patientId: pid })
  } catch (err) {
    console.error('upload route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
