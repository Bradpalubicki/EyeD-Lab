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

// Resource types we care about for the patient record view
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
 * Tokens expire after 60 minutes — cached in memory for the lambda lifecycle.
 */
async function getToken(): Promise<string> {
  if (_cachedToken && Date.now() < _tokenExpiry - 30_000) {
    return _cachedToken
  }

  const apiKey = process.env.PARTICLE_API_KEY
  if (!apiKey) throw new Error('PARTICLE_API_KEY not set')

  // Particle sandbox: POST /auth with client credentials
  // The single API key serves as the client_secret; client_id is the key prefix
  const res = await fetch(`${PARTICLE_BASE}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: apiKey.slice(0, 32),   // first 32 chars as client_id
      clientSecret: apiKey,
    }),
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

// ─── Patient Match ─────────────────────────────────────────────────────────────

/**
 * Match a patient by demographics against the Particle Health network.
 * Returns null if no match found (204) or on error.
 */
export async function matchPatient(
  input: ParticleMatchInput
): Promise<ParticleMatchResult | null> {
  try {
    const token = await getToken()

    const res = await fetch(`${PARTICLE_BASE}/api/v2/patients/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`,
      },
      body: JSON.stringify(input),
    })

    if (res.status === 204) return null  // no match
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

// ─── Query submission (async) ──────────────────────────────────────────────────

/**
 * Submit a query against CommonWell/CareQuality for the patient.
 * Returns queryId or null on failure.
 */
export async function submitQuery(particlePatientId: string): Promise<string | null> {
  try {
    const token = await getToken()

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

/**
 * Poll query status until complete or timeout (max 20s).
 * Returns true when ready, false on timeout/error.
 */
export async function waitForQuery(particlePatientId: string): Promise<boolean> {
  const token = await getToken()
  const maxAttempts = 4
  const delayMs = 5000

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`${PARTICLE_BASE}/R4/Patient/${particlePatientId}/$query`, {
        headers: { 'Authorization': `JWT ${token}` },
      })

      if (res.status === 200) return true
      if (res.status === 202) {
        // still processing
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

/**
 * Fetch a FHIR resource bundle for a matched patient.
 */
export async function fetchFhirResources(
  particlePatientId: string,
  resourceType: ParticleFhirResource,
  params: Record<string, string> = {}
): Promise<ParticleFhirBundle> {
  const empty: ParticleFhirBundle = { resourceType: 'Bundle', entry: [] }
  try {
    const token = await getToken()
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

// ─── High-level: fetch all records for matched patient ────────────────────────

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
  // Submit async query first, wait for results
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
