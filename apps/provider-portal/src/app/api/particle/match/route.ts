// src/app/api/particle/match/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { matchPatient, fetchAllRecords, isParticleConfigured } from '@/lib/particle-health'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Surface config state so the UI can show the right message
  if (!isParticleConfigured()) {
    return NextResponse.json({
      matched: false,
      needsClientId: true,
      message: 'Particle Health client ID not configured. Add PARTICLE_CLIENT_ID to environment variables.',
    })
  }

  try {
    const body = await req.json() as {
      name?: string
      dob?: string
      gender?: string
      postalCode?: string
    }

    const { name, dob, gender, postalCode } = body
    if (!name || !dob) {
      return NextResponse.json({ error: 'name and dob are required' }, { status: 400 })
    }

    const parts = name.trim().split(/\s+/)
    const given_name = parts[0] ?? name
    const family_name = parts.slice(1).join(' ') || 'Unknown'

    const genderMap: Record<string, 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN'> = {
      male: 'MALE', female: 'FEMALE', other: 'OTHER',
    }
    const normalizedGender = genderMap[gender?.toLowerCase() ?? ''] ?? 'UNKNOWN'

    const match = await matchPatient({
      given_name,
      family_name,
      date_of_birth: dob,
      gender: normalizedGender,
      postal_code: postalCode,
    })

    if (!match) {
      return NextResponse.json({ matched: false, message: 'No matching patient found in network' })
    }

    const records = await fetchAllRecords(match.particle_patient_id)

    return NextResponse.json({
      matched: true,
      patientId: match.particle_patient_id,
      matchedName: `${match.given_name} ${match.family_name}`,
      records,
    })
  } catch (err) {
    console.error('[particle/match] error:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
