// src/lib/epic-fhir.ts
// Epic SMART on FHIR OAuth2 client — PKCE, token exchange, resource fetch, FHIR→MockPatient mapping
import type { MockPatient } from '@/lib/mock-fhir'

// ─── Constants ────────────────────────────────────────────────────────────────

const EPIC_BASE = 'https://fhir.epic.com/interconnect-fhir-oauth'
const EPIC_AUTHORIZE_URL = `${EPIC_BASE}/oauth2/authorize`
const EPIC_TOKEN_URL = `${EPIC_BASE}/oauth2/token`
const EPIC_FHIR_R4 = `${EPIC_BASE}/api/FHIR/R4`

const EPIC_SCOPES = [
  'launch/patient',
  'openid',
  'fhirUser',
  'patient/Patient.read',
  'patient/AllergyIntolerance.read',
  'patient/Condition.read',
  'patient/MedicationRequest.read',
  'patient/Observation.read',
  'patient/Immunization.read',
].join(' ')

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EpicTokenResponse {
  access_token: string
  token_type: string
  expires_in: number       // seconds, typically 3240
  scope: string
  patient: string          // Epic FHIR patient ID
  id_token?: string
}

export interface FhirBundle {
  resourceType: 'Bundle'
  entry?: Array<{ resource: Record<string, unknown> }>
}

// ─── PKCE Helpers ─────────────────────────────────────────────────────────────

/** Generate PKCE code_verifier: 64 random bytes → base64url (no +, /, or =) */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(64)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/** Generate S256 code_challenge from verifier */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// ─── OAuth Flow ───────────────────────────────────────────────────────────────

/** Build the Epic authorize URL with PKCE */
export function buildAuthorizeUrl(state: string, codeChallenge: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.EPIC_CLIENT_ID ?? '',
    redirect_uri: process.env.EPIC_REDIRECT_URI ?? '',
    scope: EPIC_SCOPES,
    state,
    aud: EPIC_FHIR_R4,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })
  return `${EPIC_AUTHORIZE_URL}?${params.toString()}`
}

/** Exchange auth code for access token */
export async function exchangeCodeForToken(
  code: string,
  codeVerifier: string
): Promise<EpicTokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.EPIC_REDIRECT_URI ?? '',
    client_id: process.env.EPIC_CLIENT_ID ?? '',
    code_verifier: codeVerifier,
  })

  const res = await fetch(EPIC_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Epic token exchange failed: ${res.status} ${text}`)
  }

  return res.json() as Promise<EpicTokenResponse>
}

// ─── FHIR Resource Fetch ──────────────────────────────────────────────────────

type FhirResource =
  | 'AllergyIntolerance'
  | 'Condition'
  | 'MedicationRequest'
  | 'Observation'
  | 'Immunization'
  | 'Patient'

/** Fetch a FHIR resource bundle from Epic */
export async function fetchFhirResource(
  accessToken: string,
  patientId: string,
  resource: FhirResource,
  category?: string
): Promise<FhirBundle> {
  let url: string

  if (resource === 'Patient') {
    url = `${EPIC_FHIR_R4}/Patient/${patientId}`
  } else if (resource === 'Observation' && category) {
    url = `${EPIC_FHIR_R4}/Observation?patient=${patientId}&category=${category}`
  } else {
    url = `${EPIC_FHIR_R4}/${resource}?patient=${patientId}`
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/fhir+json',
    },
  })

  if (!res.ok) {
    throw new Error(`FHIR fetch ${resource} failed: ${res.status}`)
  }

  return res.json() as Promise<FhirBundle>
}

// ─── FHIR → MockPatient Mapping ───────────────────────────────────────────────

type AnyRecord = Record<string, unknown>

function safeStr(val: unknown): string {
  return typeof val === 'string' ? val : ''
}

function safeNum(val: unknown): number {
  return typeof val === 'number' ? val : 0
}

function getEntry(bundle: FhirBundle): AnyRecord[] {
  return (bundle.entry ?? []).map(e => e.resource as AnyRecord)
}

/** Map Epic FHIR bundles → MockPatient shape */
export function mapFhirBundleToPatient(
  patientResource: FhirBundle,
  allergies: FhirBundle,
  conditions: FhirBundle,
  medications: FhirBundle,
  labsObs: FhirBundle,
  vitalsObs: FhirBundle,
  immunizations: FhirBundle
): MockPatient {
  // ── Patient demographics ──
  const ptEntries = getEntry(patientResource)
  // Patient resource is a single resource, not a bundle — handle both cases
  let pt: AnyRecord = {}
  if (patientResource.resourceType === 'Bundle' && ptEntries.length > 0) {
    pt = ptEntries[0]
  } else {
    // Single Patient resource returned directly
    pt = patientResource as unknown as AnyRecord
  }

  const nameArr = Array.isArray(pt.name) ? (pt.name as AnyRecord[]) : []
  const firstName = nameArr.length > 0
    ? safeStr((nameArr[0] as AnyRecord).text) ||
      [
        ...((nameArr[0] as AnyRecord).given as string[] ?? []),
        safeStr((nameArr[0] as AnyRecord).family),
      ].filter(Boolean).join(' ')
    : 'Unknown Patient'

  const dob = safeStr(pt.birthDate)
  let age = 0
  if (dob) {
    const birthYear = new Date(dob).getFullYear()
    age = new Date().getFullYear() - birthYear
  }

  const genderRaw = safeStr(pt.gender).toLowerCase()
  const gender: 'male' | 'female' | 'other' =
    genderRaw === 'male' ? 'male' : genderRaw === 'female' ? 'female' : 'other'

  const patientId = safeStr(pt.id)

  // ── Allergies ──
  const mappedAllergies = getEntry(allergies).map(a => {
    const substance = (() => {
      const code = a.code as AnyRecord | undefined
      return safeStr(code?.text) || ''
    })()
    const reactionArr = Array.isArray(a.reaction) ? (a.reaction as AnyRecord[]) : []
    const severity = reactionArr.length > 0
      ? safeStr((reactionArr[0] as AnyRecord).severity)
      : 'mild'
    const noteArr = Array.isArray(a.note) ? (a.note as AnyRecord[]) : []
    const reaction = noteArr.length > 0 ? safeStr(noteArr[0].text) : substance

    const severityNorm: 'mild' | 'moderate' | 'severe' =
      severity === 'severe' ? 'severe' : severity === 'moderate' ? 'moderate' : 'mild'

    return { substance, reaction: reaction || substance, severity: severityNorm }
  })

  // ── Conditions ──
  const mappedConditions = getEntry(conditions).map(c => {
    const code = c.code as AnyRecord | undefined
    const name = safeStr(code?.text) || ''
    const clinicalStatus = (() => {
      const cs = c.clinicalStatus as AnyRecord | undefined
      const coding = Array.isArray(cs?.coding) ? (cs!.coding as AnyRecord[]) : []
      return safeStr(coding[0]?.code)
    })()
    const status: 'active' | 'resolved' = clinicalStatus === 'resolved' ? 'resolved' : 'active'
    const onsetRaw = safeStr(c.onsetDateTime)
    const onsetYear = onsetRaw ? new Date(onsetRaw).getFullYear() : undefined
    return { name, status, onsetYear }
  })

  // ── Medications ──
  const mappedMedications = getEntry(medications).map(m => {
    const medCode = m.medicationCodeableConcept as AnyRecord | undefined
    const name = safeStr(medCode?.text) || ''
    const dosageArr = Array.isArray(m.dosageInstruction) ? (m.dosageInstruction as AnyRecord[]) : []
    const dosage = dosageArr.length > 0 ? safeStr(dosageArr[0].text) : ''
    return { name, dosage, indication: '' }
  })

  // ── Lab Results ──
  const mappedLabs = getEntry(labsObs).map(o => {
    const code = o.code as AnyRecord | undefined
    const name = safeStr(code?.text) || ''
    const vq = o.valueQuantity as AnyRecord | undefined
    const value = vq ? `${safeNum(vq.value)} ${safeStr(vq.unit)}`.trim() : ''
    const date = safeStr(o.effectiveDateTime).slice(0, 10) || ''
    const refRange = (() => {
      const rr = Array.isArray(o.referenceRange) ? (o.referenceRange as AnyRecord[]) : []
      return rr.length > 0 ? safeStr(rr[0].text) : undefined
    })()
    const interp = (() => {
      const interpArr = Array.isArray(o.interpretation) ? (o.interpretation as AnyRecord[]) : []
      if (!interpArr.length) return 'normal'
      const coding = Array.isArray((interpArr[0] as AnyRecord).coding)
        ? ((interpArr[0] as AnyRecord).coding as AnyRecord[])
        : []
      return safeStr(coding[0]?.code).toLowerCase()
    })()
    const status: 'normal' | 'abnormal' | 'critical' =
      interp === 'critical' || interp === 'aa' || interp === 'hh' || interp === 'll'
        ? 'critical'
        : interp === 'abnormal' || interp === 'h' || interp === 'l' || interp === 'a'
        ? 'abnormal'
        : 'normal'
    return { name, value, date, status, referenceRange: refRange }
  })

  // ── Vitals ──
  const mappedVitals = getEntry(vitalsObs).map(o => {
    const code = o.code as AnyRecord | undefined
    const name = safeStr(code?.text) || ''
    const vq = o.valueQuantity as AnyRecord | undefined
    const value = vq ? `${safeNum(vq.value)} ${safeStr(vq.unit)}`.trim() : ''
    const date = safeStr(o.effectiveDateTime).slice(0, 10) || ''
    return { name, value, date }
  })

  // ── Immunizations ──
  const mappedImmunizations = getEntry(immunizations).map(imm => {
    const vaccCode = imm.vaccineCode as AnyRecord | undefined
    const vaccine = safeStr(vaccCode?.text) || ''
    const date = safeStr(imm.occurrenceDateTime).slice(0, 10) || ''
    return { vaccine, date }
  })

  return {
    mrn: patientId,
    name: firstName,
    dob,
    age,
    gender,
    bloodType: '',
    primaryProvider: 'Epic MyChart',
    medications: mappedMedications,
    allergies: mappedAllergies,
    conditions: mappedConditions,
    labs: mappedLabs,
    vitals: mappedVitals,
    lastVisit: new Date().toISOString().slice(0, 10),
    immunizations: mappedImmunizations,
    treatmentSessions: [],
  }
}
