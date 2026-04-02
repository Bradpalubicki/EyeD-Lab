// src/lib/particle-health.ts
// Particle Health TEFCA aggregator — patient match + FHIR R4 record fetch
// Covers CommonWell + Carequality networks (~320M US patients)
// Docs: https://docs.particlehealth.com

const PARTICLE_BASE = 'https://sandbox.particlehealth.com'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ParticleMatchInput {
  given_name: string
  family_name: string
  date_of_birth: string   // YYYY-MM-DD
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN'
  postal_code?: string
}

export interface ParticleMatchResult {
  given_name: string
  family_name: string
  date_of_birth: string
  gender: string
  postal_code?: string
  particle_patient_id: string
  patient_id: string
}

export interface ParticleFhirBundle {
  resourceType: 'Bundle'
  type?: string
  entry?: Array<{ resource: Record<string, unknown> }>
  total?: number
}

export type ParticleFhirResource =
  | 'AllergyIntolerance'
  | 'Condition'
  | 'MedicationRequest'
  | 'MedicationStatement'
  | 'Observation'
  | 'Immunization'
  | 'DiagnosticReport'

// ─── Auth ─────────────────────────────────────────────────────────────────────

let _cachedToken: string | null = null
let _tokenExpiry = 0

/**
 * Get a valid JWT for the Particle Health API.
 * Requires PARTICLE_CLIENT_ID + PARTICLE_CLIENT_SECRET (two separate env vars)
 * or PARTICLE_API_KEY as the client_secret with PARTICLE_CLIENT_ID for the id.
 */
export async function getParticleToken(): Promise<string> {
  if (_cachedToken && Date.now() < _tokenExpiry - 30_000) {
    return _cachedToken
  }

  const clientId = process.env.PARTICLE_CLIENT_ID
  const clientSecret = process.env.PARTICLE_CLIENT_SECRET ?? process.env.PARTICLE_API_KEY

  if (!clientId || !clientSecret) {
    throw new Error('PARTICLE_CLIENT_ID and PARTICLE_CLIENT_SECRET (or PARTICLE_API_KEY) required')
  }

  const res = await fetch(`${PARTICLE_BASE}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, clientSecret }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Particle auth failed (${res.status}): ${text}`)
  }

  const data = await res.json() as { token?: string; access_token?: string; expires_in?: number }
  const token = data.token ?? data.access_token
  if (!token) throw new Error('Particle auth: no token in response')

  _cachedToken = token
  _tokenExpiry = Date.now() + (data.expires_in ?? 3600) * 1000
  return token
}

// Check if Particle is configured
export function isParticleConfigured(): boolean {
  const clientId = process.env.PARTICLE_CLIENT_ID
  return !!clientId
}

// ─── Patient Match ─────────────────────────────────────────────────────────────

export async function matchPatient(
  input: ParticleMatchInput
): Promise<ParticleMatchResult | null> {
  try {
    const token = await getParticleToken()

    const res = await fetch(`${PARTICLE_BASE}/api/v2/patients/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`,
      },
      body: JSON.stringify(input),
    })

    if (res.status === 204) return null
    if (!res.ok) {
      const text = await res.text()
      console.error(`[particle] patient match failed (${res.status}):`, text)
      return null
    }

    const matches = await res.json() as ParticleMatchResult[]
    return matches[0] ?? null
  } catch (err) {
    console.error('[particle] matchPatient error:', err instanceof Error ? err.message : String(err))
    return null
  }
}

// ─── Query submission ──────────────────────────────────────────────────────────

export async function submitQuery(particlePatientId: string): Promise<string | null> {
  try {
    const token = await getParticleToken()

    const res = await fetch(`${PARTICLE_BASE}/R4/Patient/${particlePatientId}/$query`, {
      method: 'POST',
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`[particle] $query submit failed (${res.status}):`, text)
      return null
    }

    const data = await res.json() as { id?: string; queryId?: string }
    return data.id ?? data.queryId ?? particlePatientId
  } catch (err) {
    console.error('[particle] submitQuery error:', err instanceof Error ? err.message : String(err))
    return null
  }
}

export async function waitForQuery(particlePatientId: string): Promise<boolean> {
  const token = await getParticleToken()
  const maxAttempts = 4
  const delayMs = 5000

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`${PARTICLE_BASE}/R4/Patient/${particlePatientId}/$query`, {
        headers: { 'Authorization': `JWT ${token}` },
      })

      if (res.status === 200) return true
      if (res.status === 202) {
        await new Promise(r => setTimeout(r, delayMs))
        continue
      }
      return false
    } catch {
      return false
    }
  }
  return false
}

// ─── FHIR Resource Fetch ───────────────────────────────────────────────────────

export async function fetchFhirResources(
  particlePatientId: string,
  resourceType: ParticleFhirResource,
  params: Record<string, string> = {}
): Promise<ParticleFhirBundle> {
  const empty: ParticleFhirBundle = { resourceType: 'Bundle', entry: [] }
  try {
    const token = await getParticleToken()
    const qs = new URLSearchParams({ patient: particlePatientId, ...params })

    const res = await fetch(`${PARTICLE_BASE}/R4/${resourceType}?${qs}`, {
      headers: { 'Authorization': `JWT ${token}` },
    })

    if (!res.ok) {
      console.error(`[particle] fetchFhirResources ${resourceType} failed (${res.status})`)
      return empty
    }

    return await res.json() as ParticleFhirBundle
  } catch (err) {
    console.error('[particle] fetchFhirResources error:', err instanceof Error ? err.message : String(err))
    return empty
  }
}

// ─── High-level: fetch all records ────────────────────────────────────────────

export interface ParticleRecords {
  source: 'particle'
  patientId: string
  allergies: ParticleFhirBundle
  conditions: ParticleFhirBundle
  medications: ParticleFhirBundle
  observations: ParticleFhirBundle
  immunizations: ParticleFhirBundle
}

export async function fetchAllRecords(particlePatientId: string): Promise<ParticleRecords> {
  await submitQuery(particlePatientId)
  await waitForQuery(particlePatientId)

  const [allergies, conditions, medications, observations, immunizations] = await Promise.all([
    fetchFhirResources(particlePatientId, 'AllergyIntolerance'),
    fetchFhirResources(particlePatientId, 'Condition'),
    fetchFhirResources(particlePatientId, 'MedicationRequest'),
    fetchFhirResources(particlePatientId, 'Observation'),
    fetchFhirResources(particlePatientId, 'Immunization'),
  ])

  return {
    source: 'particle',
    patientId: particlePatientId,
    allergies,
    conditions,
    medications,
    observations,
    immunizations,
  }
}
