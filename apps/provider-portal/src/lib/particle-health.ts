// src/lib/particle-health.ts
// Particle Health v2 API — patient registration + async query + Flat data retrieval
// Networks: CommonWell, Carequality, eHealthExchange, Surescripts, Healthix (NY), Manifest MedEx (CA)
// Docs: https://docs.particlehealth.com
//
// IMPORTANT — API NOTES:
//   - v2 FHIR R4 is DISABLED. Use Flat API for all data retrieval.
//   - Query is ASYNC. Submit → return immediately → webhook fires on COMPLETE → then fetch.
//   - Patient must be REGISTERED (POST /api/v2/patients) before any query or Signal subscription.
//   - POU must be declared on every query body: { purpose_of_use: "TREATMENT" }
//   - C-CDA is faster (P90 ~6min) but requires client-side parsing.
//     Flat is developer-friendly JSON — use Flat for all new builds.

const PARTICLE_BASE = process.env.PARTICLE_BASE_URL ?? 'https://sandbox.particlehealth.com'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ParticlePatientInput {
  first_name: string
  last_name: string
  dob: string             // YYYY-MM-DD
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN'
  address_city: string    // REQUIRED by Record Validator
  address_state: string   // REQUIRED by Record Validator (2-letter)
  postal_code?: string
  // NY patients on Healthix: pass consent array
  // consent?: Array<{ hie_id: string; status: 'OPTIN' | 'OPTOUT' }>
}

export interface ParticlePatient {
  id: string              // particle_patient_id — store this in DB
  first_name: string
  last_name: string
  dob: string
  gender: string
}

export interface ParticleQueryResult {
  query_id: string
  status: 'PENDING' | 'COMPLETE' | 'FAILED'
}

// Flat API response — each key is a dataset name, value is array of records
export interface ParticleFlatResponse {
  ALLERGIES?: FlatAllergy[]
  MEDICATIONS?: FlatMedication[]
  LABS?: FlatLab[]
  PROBLEMS?: FlatProblem[]
  ENCOUNTERS?: FlatEncounter[]
  IMMUNIZATIONS?: FlatImmunization[]
  PROCEDURES?: FlatProcedure[]
  VITAL_SIGNS?: FlatVitalSign[]
  SOCIAL_HISTORIES?: FlatSocialHistory[]
  FAMILY_MEMBER_HISTORIES?: FlatFamilyHistory[]
  AI_Outputs?: FlatAiOutput[]
  AI_Citations?: FlatAiCitation[]
}

export interface FlatAllergy {
  Allergy_Name?: string
  Reaction?: string
  Severity?: string
  Status?: string
  Onset_Date?: string
  Source_Name?: string
  Source_Network?: string
}

export interface FlatMedication {
  Medication_Name?: string
  Dose?: string
  Frequency?: string
  Status?: string
  Prescriber?: string
  Fill_Date?: string        // Surescripts pharmacy fill data
  Source_Name?: string
  Source_Network?: string
  Is_Pharmacy_Verified?: boolean  // true = Surescripts fill
}

export interface FlatLab {
  Test_Name?: string
  Value?: string
  Unit?: string
  Reference_Range?: string
  Status?: string
  Result_Date?: string
  Loinc_Code?: string
  Source_Name?: string
  Source_Network?: string
}

export interface FlatProblem {
  Problem_Name?: string
  Status?: string
  Onset_Date?: string
  Snomed_Code?: string
  Icd_Code?: string
  Source_Name?: string
  Source_Network?: string
}

export interface FlatEncounter {
  Encounter_Type?: string
  Facility_Name?: string
  Provider_Name?: string
  Encounter_Date?: string
  Discharge_Date?: string
  Diagnoses?: string[]
  Source_Name?: string
  Source_Network?: string
}

export interface FlatImmunization {
  Vaccine_Name?: string
  Date_Given?: string
  Lot_Number?: string
  Source_Name?: string
  Source_Network?: string
}

export interface FlatProcedure {
  Procedure_Name?: string
  Date?: string
  Cpt_Code?: string
  Source_Name?: string
  Source_Network?: string
}

export interface FlatVitalSign {
  Vital_Name?: string
  Value?: string
  Unit?: string
  Date?: string
  Source_Name?: string
}

export interface FlatSocialHistory {
  Category?: string
  Description?: string
  Date?: string
}

export interface FlatFamilyHistory {
  Condition?: string
  Relationship?: string
  Onset_Age?: string
}

export interface FlatAiOutput {
  Output_Type?: string    // 'PATIENT_HISTORY' | 'DISCHARGE_SUMMARY'
  Summary?: string
  Generated_At?: string
}

export interface FlatAiCitation {
  Citation_Id?: string
  Source_Name?: string
  Source_Date?: string
  Citation_Text?: string
}

export interface ParticleRecords {
  source: 'particle'
  particle_patient_id: string
  queried_at: string
  data: ParticleFlatResponse
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

let _cachedToken: string | null = null
let _tokenExpiry = 0

export async function getParticleToken(): Promise<string> {
  if (_cachedToken && Date.now() < _tokenExpiry - 30_000) {
    return _cachedToken
  }

  const clientId = process.env.PARTICLE_CLIENT_ID
  const clientSecret = process.env.PARTICLE_CLIENT_SECRET ?? process.env.PARTICLE_API_KEY

  if (!clientId || !clientSecret) {
    throw new Error('PARTICLE_CLIENT_ID and PARTICLE_CLIENT_SECRET required')
  }

  const basicCred = Buffer.from(clientId + ':' + clientSecret).toString('base64')
  const res = await fetch(PARTICLE_BASE + '/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + basicCred,
    },
    body: '{}',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error('Particle auth failed (' + res.status + '): ' + text)
  }

  const text = await res.text()
  let token: string | undefined
  if (text.startsWith('{')) {
    const data = JSON.parse(text) as { token?: string; access_token?: string }
    token = data.token ?? data.access_token
  } else {
    const params = new URLSearchParams(text)
    token = params.get('access_token') ?? undefined
  }
  if (!token) throw new Error('Particle auth: no token in response')

  _cachedToken = token
  _tokenExpiry = Date.now() + 3600 * 1000
  return token
}

export function isParticleConfigured(): boolean {
  return !!(process.env.PARTICLE_CLIENT_ID)
}

// ─── Retry wrapper (handles 429) ──────────────────────────────────────────────

async function particleFetch(
  url: string,
  options: RequestInit,
  attempt = 0
): Promise<Response> {
  const res = await fetch(url, options)
  if (res.status === 429 && attempt < 2) {
    // Rate limited — wait 60s then retry (max 2 retries)
    await new Promise(r => setTimeout(r, 60_000))
    return particleFetch(url, options, attempt + 1)
  }
  return res
}

// ─── Step 1: Register patient ─────────────────────────────────────────────────
// Must be called before any query or Signal subscription.
// Returns particle_patient_id — store in DB immediately.

export async function registerPatient(
  input: ParticlePatientInput
): Promise<string | null> {
  try {
    const token = await getParticleToken()
    const res = await particleFetch(PARTICLE_BASE + '/api/v2/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({
        first_name: input.first_name,
        last_name: input.last_name,
        dob: input.dob,
        gender: input.gender,
        address_city: input.address_city,
        address_state: input.address_state,
        ...(input.postal_code ? { postal_code: input.postal_code } : {}),
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[particle] registerPatient failed (' + res.status + '):', text)
      return null
    }

    const data = await res.json() as { id?: string; patient_id?: string }
    const id = data.id ?? data.patient_id ?? null
    if (!id) {
      console.error('[particle] registerPatient: no id in response', data)
      return null
    }
    return id
  } catch (err) {
    console.error('[particle] registerPatient error:', err instanceof Error ? err.message : String(err))
    return null
  }
}

// ─── Step 2: Submit query (async — does NOT return data) ──────────────────────
// Returns query_id. Data arrives via webhook when status = COMPLETE.
// For returning patients: pass lastQueriedAt to get only new records (_since delta).

export async function submitQuery(
  particlePatientId: string,
  lastQueriedAt?: string
): Promise<string | null> {
  try {
    const token = await getParticleToken()
    const url = PARTICLE_BASE + '/api/v2/patients/' + particlePatientId + '/query'
    const body: Record<string, unknown> = {
      purpose_of_use: 'TREATMENT',
    }
    if (lastQueriedAt) {
      body._since = lastQueriedAt
    }

    const res = await particleFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[particle] submitQuery failed (' + res.status + '):', text)
      return null
    }

    const data = await res.json() as { query_id?: string; id?: string; status?: string }
    return data.query_id ?? data.id ?? particlePatientId
  } catch (err) {
    console.error('[particle] submitQuery error:', err instanceof Error ? err.message : String(err))
    return null
  }
}

// ─── Step 3: Fetch Flat data (call AFTER webhook confirms COMPLETE) ────────────
// v2 FHIR is disabled — Flat is the correct format for v2.
// Pass datasets as array, e.g. ['ALLERGIES', 'MEDICATIONS', 'LABS']
// Pass lastQueriedAt for delta retrieval (new records only).

export async function fetchFlatData(
  particlePatientId: string,
  datasets: string[] = [
    'ALLERGIES', 'MEDICATIONS', 'LABS', 'PROBLEMS',
    'ENCOUNTERS', 'IMMUNIZATIONS', 'PROCEDURES',
    'VITAL_SIGNS', 'SOCIAL_HISTORIES', 'FAMILY_MEMBER_HISTORIES',
  ],
  lastQueriedAt?: string
): Promise<ParticleFlatResponse> {
  try {
    const token = await getParticleToken()
    const qs = new URLSearchParams()
    datasets.forEach(d => qs.append(d, ''))
    if (lastQueriedAt) qs.set('_since', lastQueriedAt)

    const url = PARTICLE_BASE + '/api/v2/patients/' + particlePatientId + '/flat?' + qs.toString()
    const res = await particleFetch(url, {
      headers: { 'Authorization': 'Bearer ' + token },
    })

    if (!res.ok) {
      console.error('[particle] fetchFlatData failed (' + res.status + ')')
      return {}
    }

    return await res.json() as ParticleFlatResponse
  } catch (err) {
    console.error('[particle] fetchFlatData error:', err instanceof Error ? err.message : String(err))
    return {}
  }
}

// ─── Fetch Snapshot AI summary (call after aioutput webhook) ──────────────────
// Retrieves AI_Outputs + AI_Citations from the Flat endpoint.
// NOT /api/v2/aioutput/{id} — that endpoint does not exist.

export async function fetchSnapshot(
  particlePatientId: string
): Promise<{ outputs: FlatAiOutput[]; citations: FlatAiCitation[] }> {
  try {
    const token = await getParticleToken()
    const url = PARTICLE_BASE + '/api/v2/patients/' + particlePatientId + '/flat?AI_OUTPUTS&AI_CITATIONS'
    const res = await particleFetch(url, {
      headers: { 'Authorization': 'Bearer ' + token },
    })

    if (!res.ok) {
      console.error('[particle] fetchSnapshot failed (' + res.status + ')')
      return { outputs: [], citations: [] }
    }

    const data = await res.json() as ParticleFlatResponse
    return {
      outputs: data.AI_Outputs ?? [],
      citations: data.AI_Citations ?? [],
    }
  } catch (err) {
    console.error('[particle] fetchSnapshot error:', err instanceof Error ? err.message : String(err))
    return { outputs: [], citations: [] }
  }
}

// ─── Signal: subscribe patient to monitoring ──────────────────────────────────
// Call AFTER initial query completes (particle_patient_id must exist in Particle).
// Alert types: TRANSITION (ADT), ENCOUNTER (new docs), DISCHARGE (full summary), REFERRAL.
// Correct endpoint: POST /api/v1/patients/{id}/subscriptions (v1, not v2)

export async function subscribeToSignal(
  particlePatientId: string
): Promise<boolean> {
  try {
    const token = await getParticleToken()
    const res = await particleFetch(
      PARTICLE_BASE + '/api/v1/patients/' + particlePatientId + '/subscriptions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          subscriptions: [{ type: 'MONITORING' }],
        }),
      }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error('[particle] subscribeToSignal failed (' + res.status + '):', text)
      return false
    }
    return true
  } catch (err) {
    console.error('[particle] subscribeToSignal error:', err instanceof Error ? err.message : String(err))
    return false
  }
}

// ─── Signal: unsubscribe patient ──────────────────────────────────────────────

export async function unsubscribeFromSignal(
  particlePatientId: string
): Promise<boolean> {
  try {
    const token = await getParticleToken()
    const res = await particleFetch(
      PARTICLE_BASE + '/api/v1/patients/' + particlePatientId + '/subscriptions',
      {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token },
      }
    )
    return res.ok || res.status === 404
  } catch (err) {
    console.error('[particle] unsubscribeFromSignal error:', err instanceof Error ? err.message : String(err))
    return false
  }
}

// ─── Check query status (polling fallback — prefer webhooks) ──────────────────

export async function getQueryStatus(
  particlePatientId: string,
  queryId?: string
): Promise<'PENDING' | 'COMPLETE' | 'FAILED' | null> {
  try {
    const token = await getParticleToken()
    const qs = queryId ? '?query_id=' + queryId : ''
    const res = await fetch(
      PARTICLE_BASE + '/api/v2/patients/' + particlePatientId + '/query' + qs,
      { headers: { 'Authorization': 'Bearer ' + token } }
    )

    if (!res.ok) return null
    const data = await res.json() as { status?: string }
    const s = data.status?.toUpperCase()
    if (s === 'COMPLETE') return 'COMPLETE'
    if (s === 'FAILED') return 'FAILED'
    return 'PENDING'
  } catch {
    return null
  }
}
