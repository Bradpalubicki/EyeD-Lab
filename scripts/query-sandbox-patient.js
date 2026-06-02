#!/usr/bin/env node
// Query Particle Health sandbox for Gold-tier patient Elvira Valadez-Nucleus
// Outputs the Flat JSON response to stdout for use in demo data

const path = require('path')
const fs = require('fs')

// Load env from provider-portal manually
const envPath = path.resolve(__dirname, '../apps/provider-portal/.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eqIdx = trimmed.indexOf('=')
  if (eqIdx === -1) continue
  const key = trimmed.slice(0, eqIdx)
  const val = trimmed.slice(eqIdx + 1)
  if (!process.env[key]) process.env[key] = val
}

const BASE = 'https://sandbox.particlehealth.com'
const CLIENT_ID = process.env.PARTICLE_CLIENT_ID
const API_KEY = process.env.PARTICLE_API_KEY

if (!CLIENT_ID || !API_KEY) {
  console.error('Missing PARTICLE_CLIENT_ID or PARTICLE_API_KEY')
  process.exit(1)
}

async function getToken() {
  const cred = Buffer.from(CLIENT_ID + ':' + API_KEY).toString('base64')
  const res = await fetch(BASE + '/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + cred,
    },
    body: '{}',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Auth failed (${res.status}): ${text}`)
  }
  const text = await res.text()
  if (text.startsWith('{')) {
    const data = JSON.parse(text)
    return data.token || data.access_token
  }
  return new URLSearchParams(text).get('access_token')
}

async function registerPatient(token) {
  // Elvira Valadez-Nucleus — Gold tier synthetic patient
  // API v2 uses: given_name, family_name, date_of_birth, patient_id
  const patientId = 'elvira-demo-' + Date.now()
  const res = await fetch(BASE + '/api/v2/patients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({
      given_name: 'Elvira',
      family_name: 'Valadez-Nucleus',
      date_of_birth: '1970-12-26',
      gender: 'FEMALE',
      patient_id: patientId,
      address_line_1: '703 Ankunding Trail Unit 45',
      address_city: 'Boston',
      address_state: 'MA',
      postal_code: '02215',
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Register failed (${res.status}): ${text}`)
  }
  const data = await res.json()
  console.error('Registered patient:', JSON.stringify(data, null, 2))
  return data.id || data.particle_patient_id || data.data?.id
}

async function queryPatient(token, patientId) {
  const res = await fetch(BASE + `/api/v2/patients/${patientId}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({
      purpose_of_use: 'TREATMENT',
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Query failed (${res.status}): ${text}`)
  }
  const data = await res.json()
  console.error('Query submitted:', JSON.stringify(data, null, 2))
  return data
}

async function waitForQuery(token, patientId, queryId) {
  // Poll query status until COMPLETE
  const maxAttempts = 12
  for (let i = 0; i < maxAttempts; i++) {
    console.error(`Polling query status (attempt ${i + 1}/${maxAttempts})...`)
    await new Promise(r => setTimeout(r, 5000))

    const res = await fetch(BASE + `/api/v2/patients/${patientId}/query/${queryId}`, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token },
    })
    if (res.ok) {
      const data = await res.json()
      console.error('Query status:', JSON.stringify(data, null, 2))
      if (data.status === 'COMPLETE') return true
      if (data.status === 'FAILED') throw new Error('Query FAILED')
    } else {
      // Try alternate status endpoint
      const res2 = await fetch(BASE + `/api/v2/queries/${queryId}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token },
      })
      if (res2.ok) {
        const data = await res2.json()
        console.error('Query status (alt):', JSON.stringify(data, null, 2))
        if (data.status === 'COMPLETE') return true
        if (data.status === 'FAILED') throw new Error('Query FAILED')
      } else {
        console.error(`Status check returned ${res.status} / ${res2.status}`)
      }
    }
  }
  throw new Error('Query did not complete within timeout')
}

async function getFlatData(token, patientId) {
  const res = await fetch(BASE + `/api/v2/patients/${patientId}/flat`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Flat data failed (${res.status}): ${text}`)
  }
  return res.json()
}

async function getCCDA(token, patientId) {
  const res = await fetch(BASE + `/api/v2/patients/${patientId}/ccda`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    console.error(`CCDA fetch failed (${res.status}): ${text}`)
    return null
  }
  return res.text()
}

async function main() {
  console.error('=== Particle Sandbox Query — Elvira Valadez-Nucleus ===')

  const token = await getToken()
  console.error('Token obtained.')

  const patientId = await registerPatient(token)
  if (!patientId) throw new Error('No patient ID returned')
  console.error('Patient ID:', patientId)

  const query = await queryPatient(token, patientId)

  // Sandbox may process instantly or need a brief wait — try flat immediately, then retry
  let flatData = null
  for (let attempt = 1; attempt <= 6; attempt++) {
    console.error(`Attempting flat data retrieval (attempt ${attempt}/6)...`)
    await new Promise(r => setTimeout(r, attempt === 1 ? 3000 : 10000))
    try {
      flatData = await getFlatData(token, patientId)
      break
    } catch (err) {
      console.error(`  ${err.message}`)
      if (attempt === 6) {
        // Last resort: try CCDA instead
        console.error('Flat data unavailable. Trying CCDA...')
        const ccdaData = await getCCDA(token, patientId)
        if (ccdaData) {
          const outPath = path.resolve(__dirname, '../sandbox-data/elvira-valadez-ccda.xml')
          fs.mkdirSync(path.dirname(outPath), { recursive: true })
          fs.writeFileSync(outPath, ccdaData)
          console.error(`CCDA saved to: ${outPath}`)
          console.error('NOTE: Flat data not available — use CCDA for data extraction')
          process.exit(0)
        }
        throw new Error('Neither Flat nor CCDA data available')
      }
    }
  }

  // Save Flat JSON
  const outPath = path.resolve(__dirname, '../sandbox-data/elvira-valadez-flat.json')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(flatData, null, 2))
  console.error(`\nFlat JSON saved to: ${outPath}`)

  // Print summary
  const categories = Object.keys(flatData)
  console.error('\n=== DATA CATEGORIES ===')
  for (const cat of categories) {
    const count = Array.isArray(flatData[cat]) ? flatData[cat].length : 'N/A'
    console.error(`  ${cat}: ${count} records`)
  }

  // Also output to stdout for piping
  console.log(JSON.stringify(flatData, null, 2))
}

main().catch(err => {
  console.error('ERROR:', err.message)
  process.exit(1)
})
