'use server'
// src/app/actions/treatment.ts
import { z } from 'zod/v4'
import { getSupabaseAdmin } from '@/lib/supabase'

export const TreatmentSchema = z.object({
  session_pin:           z.string().min(1),
  session_type:          z.enum(['tcyp_injection', 'pellet_insertion', 'shockwave', 'eros', 'follow_up', 'initial_visit']),
  side:                  z.enum(['left', 'right', 'bilateral', '']).optional(),
  dosage_mg:             z.string().optional(),
  pellet_count:          z.string().optional(),
  testosterone_total:    z.string().optional(),
  followup_date:         z.string().optional(),
  notes:                 z.string().max(4000).optional(),
})

export type TreatmentInput = z.infer<typeof TreatmentSchema>

export interface TreatmentActionResult {
  success: boolean
  error?: string
  id?: string
}

export async function logTreatment(input: TreatmentInput): Promise<TreatmentActionResult> {
  const parsed = TreatmentSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  const db = getSupabaseAdmin()

  // Resolve patient_id from access_sessions using session_pin
  const { data: session, error: sessionErr } = await db
    .from('access_sessions')
    .select('patient_id')
    .eq('session_pin', parsed.data.session_pin)
    .in('status', ['active', 'accessed'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (sessionErr || !session) {
    return { success: false, error: 'Session PIN not found or expired' }
  }

  const toNum = (v?: string) => (v && v !== '' ? Number(v) : null)
  const { session_pin: _, followup_date: _followup_date, dosage_mg, pellet_count, testosterone_total, ...rest } = parsed.data

  const { data, error } = await db
    .from('treatment_sessions')
    .insert({
      ...rest,
      patient_id:         session.patient_id,
      session_date:       new Date().toISOString().split('T')[0],
      side:               rest.side || null,
      dosage_mg:          toNum(dosage_mg),
      pellet_count:       toNum(pellet_count),
      testosterone_total: toNum(testosterone_total),
    })
    .select('id')
    .single()

  if (error) {
    console.error('treatment insert error:', error)
    return { success: false, error: 'Failed to save treatment record' }
  }

  return { success: true, id: data.id }
}
