// src/lib/get-patient.ts
// Resolves a PIN to a patient record — Supabase for real PINs, mock fallback for demo/unknown PINs
import { getMockPatient, MockFhirBundle, MockMedication, MockAllergy, MockCondition, MockLabResult, MockVital, MockTreatmentSession } from '@/lib/mock-fhir'
import { getSupabaseAdmin } from '@/lib/supabase'
import type { Patient, Provider, Medication, Allergy, Condition, LabResult, Vital, TreatmentSession } from '@/lib/db-types'

const PIN_TO_CHART: Record<string, string> = {
  '111111': '90001',
  '222222': '90002',
  '333333': '90003',
}

interface PatientRow extends Patient {
  providers: Provider | null
}

type VitalRow = Vital;

interface TreatmentSessionRow extends TreatmentSession {
  providers: Pick<Provider, 'first_name' | 'last_name' | 'title'> | null
}

const SESSION_TYPE_LABELS: Record<string, string> = {
  tcyp_injection: 'T-Cyp Injection',
  pellet_insertion: 'Pellet Insertion',
  shockwave: 'Shockwave Therapy',
  eros: 'Eros Therapy',
  follow_up: 'Follow-Up',
  initial_visit: 'Initial Visit',
}

export async function getPatientByPin(pin: string): Promise<MockFhirBundle> {
  const chartNumber = PIN_TO_CHART[pin]

  // Fall back to mock for demo PINs or any unrecognised PIN
  if (!chartNumber) {
    return getMockPatient(pin)
  }

  try {
    const supabase = getSupabaseAdmin()

    // Fetch patient + provider in one query
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('*, providers(*)')
      .eq('chart_number', chartNumber)
      .single()

    if (patientError || !patientData) {
      console.error('[get-patient] Supabase patient query failed, falling back to mock:', patientError?.message)
      return getMockPatient(pin)
    }

    const row = patientData as PatientRow

    // Parallel fetch of related tables
    const [
      { data: medications },
      { data: allergies },
      { data: conditions },
      { data: labs },
      { data: vitals },
      { data: sessions },
    ] = await Promise.all([
      supabase.from('medications').select('*').eq('patient_id', row.id).eq('status', 'active'),
      supabase.from('allergies').select('*').eq('patient_id', row.id),
      supabase.from('conditions').select('*').eq('patient_id', row.id),
      supabase.from('lab_results').select('*').eq('patient_id', row.id).order('collected_date', { ascending: false }),
      supabase.from('vitals').select('*').eq('patient_id', row.id).order('recorded_date', { ascending: false }).limit(1),
      supabase.from('treatment_sessions').select('*, providers(first_name, last_name, title)').eq('patient_id', row.id).order('session_date', { ascending: false }),
    ])

    // Build primaryProvider string
    const prov = row.providers
    const primaryProvider = prov
      ? `${prov.first_name} ${prov.last_name}, ${prov.title}`
      : 'Unassigned'

    // Map medications
    const mappedMedications: MockMedication[] = (medications ?? []).map((m: Medication) => ({
      name: m.name,
      dosage: m.dosage,
      indication: m.indication ?? '',
    }))

    // Map allergies
    const mappedAllergies: MockAllergy[] = (allergies ?? []).map((a: Allergy) => ({
      substance: a.substance,
      reaction: a.reaction,
      severity: a.severity,
    }))

    // Map conditions
    const mappedConditions: MockCondition[] = (conditions ?? []).map((c: Condition) => ({
      name: c.name,
      status: c.status === 'chronic' ? 'active' : c.status,
      onsetYear: c.onset_year ?? undefined,
      icdCode: c.icd10_code,
    }))

    // Map lab results
    const mappedLabs: MockLabResult[] = (labs ?? []).map((l: LabResult) => ({
      name: l.test_name,
      value: l.unit ? `${l.value} ${l.unit}` : l.value,
      date: l.collected_date,
      status: l.status,
      referenceRange: l.reference_range ?? undefined,
    }))

    // Map vitals from the most recent vitals row
    const mappedVitals: MockVital[] = []
    if (vitals && vitals.length > 0) {
      const v = vitals[0] as VitalRow
      const vDate = v.recorded_date

      if (v.weight_lbs != null) {
        mappedVitals.push({ name: 'Weight', value: `${v.weight_lbs} lbs`, date: vDate })
      }
      if (v.bmi != null) {
        mappedVitals.push({ name: 'BMI', value: String(v.bmi), date: vDate })
      }
      if (v.bp_systolic != null && v.bp_diastolic != null) {
        mappedVitals.push({ name: 'Blood Pressure', value: `${v.bp_systolic}/${v.bp_diastolic} mmHg`, date: vDate })
      }
      if (v.heart_rate != null) {
        mappedVitals.push({ name: 'Heart Rate', value: `${v.heart_rate} bpm`, date: vDate })
      }
    }

    // Map treatment sessions
    const mappedSessions: MockTreatmentSession[] = (sessions ?? []).map((s) => {
      const sr = s as TreatmentSessionRow
      const prov = sr.providers
      return {
        sessionDate: sr.session_date,
        sessionType: SESSION_TYPE_LABELS[sr.session_type] ?? sr.session_type,
        dosageMg: sr.dosage_mg,
        providerName: prov ? `${prov.first_name} ${prov.last_name}, ${prov.title}` : undefined,
        notes: sr.notes,
      }
    })

    // Last visit from most recent treatment session
    const lastVisit = sessions && sessions.length > 0
      ? (sessions[0] as { session_date: string }).session_date
      : row.updated_at.slice(0, 10)

    // Normalise gender
    const gender = (['male', 'female', 'other'].includes(row.gender)
      ? row.gender
      : 'other') as 'male' | 'female' | 'other'

    return {
      patient: {
        mrn: row.mrn,
        name: `${row.first_name} ${row.last_name}`,
        dob: row.dob,
        age: row.age,
        gender,
        bloodType: row.blood_type ?? 'Unknown',
        primaryProvider,
        medications: mappedMedications,
        allergies: mappedAllergies,
        conditions: mappedConditions,
        labs: mappedLabs,
        vitals: mappedVitals,
        lastVisit,
        treatmentSessions: mappedSessions,
      },
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[get-patient] Unexpected error, falling back to mock:', message)
    return getMockPatient(pin)
  }
}
