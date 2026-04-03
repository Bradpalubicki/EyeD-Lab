// src/app/api/particle/match/route.ts
// Particle Health patient registration + async query initiation
//
// Flow:
//   1. Register patient → get particle_patient_id (store in DB)
//   2. Submit query (async — returns query_id immediately, data arrives via webhook)
//   3. Return { queued: true, particle_patient_id, query_id } to UI
//   4. UI shows "pending" state; webhook handler updates DB when COMPLETE
//   5. UI polls /api/particle/status OR subscribes to realtime DB update

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { registerPatient, submitQuery, isParticleConfigured } from '@/lib/particle-health'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isParticleConfigured()) {
    return NextResponse.json({
      queued: false,
      needsClientId: true,
      message: 'Particle Health not configured. Add PARTICLE_CLIENT_ID to environment variables.',
    })
  }

  try {
    const body = await req.json() as {
      name?: string
      dob?: string
      gender?: string
      postalCode?: string
      addressCity?: string
      addressState?: string
      // For returning patients — pass last query date to get deltas only
      lastQueriedAt?: string
      // If already registered — skip registration, go straight to query
      existingParticlePatientId?: string
    }

    const { name, dob, gender, postalCode, addressCity, addressState, lastQueriedAt, existingParticlePatientId } = body

    if (!name || !dob) {
      return NextResponse.json({ error: 'name and dob are required' }, { status: 400 })
    }

    const parts = name.trim().split(/\s+/)
    const first_name = parts[0] ?? name
    const last_name = parts.slice(1).join(' ') || 'Unknown'

    const genderMap: Record<string, 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN'> = {
      male: 'MALE', female: 'FEMALE', other: 'OTHER',
    }
    const normalizedGender = genderMap[gender?.toLowerCase() ?? ''] ?? 'UNKNOWN'

    // ── Step 1: Register or reuse particle_patient_id ──────────────────────────
    let particlePatientId = existingParticlePatientId ?? null

    if (!particlePatientId) {
      if (!addressCity || !addressState) {
        return NextResponse.json(
          { error: 'addressCity and addressState are required for patient registration' },
          { status: 400 }
        )
      }

      particlePatientId = await registerPatient({
        first_name,
        last_name,
        dob,
        gender: normalizedGender,
        address_city: addressCity,
        address_state: addressState,
        ...(postalCode ? { postal_code: postalCode } : {}),
      })

      if (!particlePatientId) {
        return NextResponse.json(
          { queued: false, message: 'Could not register patient with Particle Health network' },
          { status: 502 }
        )
      }
    }

    // ── Step 2: Submit async query ─────────────────────────────────────────────
    // Returns immediately with query_id. Data arrives via webhook.
    const queryId = await submitQuery(particlePatientId, lastQueriedAt ?? undefined)

    if (!queryId) {
      return NextResponse.json(
        { queued: false, particle_patient_id: particlePatientId, message: 'Query submission failed' },
        { status: 502 }
      )
    }

    // ── Return queued state to UI ──────────────────────────────────────────────
    // UI should show "Querying network..." and wait for DB update from webhook.
    return NextResponse.json({
      queued: true,
      particle_patient_id: particlePatientId,
      query_id: queryId,
      message: 'Query submitted. Records will appear when the network responds (typically 3–6 minutes for C-CDA, 5–12 minutes for full FHIR coverage).',
    })

  } catch (err) {
    console.error('[particle/match] error:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
