// src/app/api/fhir/callback/route.ts
// Handles Epic OAuth2 callback — exchanges code for token, sets HttpOnly session cookie
// Verifier is extracted from state param ("<nonce>.<verifier>") — no cookies needed for PKCE
import { NextRequest } from 'next/server'
import { exchangeCodeForToken } from '@/lib/epic-fhir'
import { getPatientByEpicId } from '@/lib/get-patient'
import { getSupabaseAdmin } from '@/lib/supabase'

const isProduction = process.env.NODE_ENV === 'production'

function errorPage(title: string, detail: string): Response {
  return new Response(
    `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>
    <h2>EyeD Lab — Epic Auth Error</h2>
    <h3>${title}</h3>
    <pre>${detail}</pre>
    <p><a href="/dashboard">Back to dashboard</a></p>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html' }, status: 200 }
  )
}

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    const errorDesc = searchParams.get('error_description') ?? ''
    console.error('[fhir/callback] Epic error:', error, errorDesc)
    return errorPage('Epic returned an error', `${error}: ${errorDesc}`)
  }

  if (!code || !state) {
    console.error('[fhir/callback] Missing code or state. code=', !!code, 'state=', !!state)
    return errorPage('Missing OAuth params', `code present: ${!!code} | state present: ${!!state}\n\nFull URL: ${req.url}`)
  }

  // Extract verifier from state: "<nonce>.<verifier>"
  const dotIndex = state.indexOf('.')
  if (dotIndex === -1) {
    console.error('[fhir/callback] Invalid state format:', state.slice(0, 40))
    return errorPage('Invalid state format', `State received: ${state.slice(0, 60)}`)
  }
  const codeVerifier = state.slice(dotIndex + 1)

  // Exchange code for token
  let tokenData
  try {
    tokenData = await exchangeCodeForToken(code, codeVerifier)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return errorPage('Epic token exchange failed', msg)
  }

  // Persist patient data to Supabase (fire-and-forget — don't block redirect)
  if (tokenData.patient && tokenData.access_token) {
    getPatientByEpicId(tokenData.patient, tokenData.access_token)
      .then(async (bundle) => {
        const p = bundle.patient
        const supabase = getSupabaseAdmin()
        await supabase.from('epic_patients').upsert({
          epic_patient_id: tokenData.patient,
          name: p.name,
          dob: p.dob,
          gender: p.gender,
          age: p.age,
          fhir_data: p as unknown as Record<string, unknown>,
          last_synced_at: new Date().toISOString(),
        }, { onConflict: 'epic_patient_id' })
      })
      .catch((err) => {
        console.error('[fhir/callback] Supabase persist failed:', err instanceof Error ? err.message : String(err))
      })
  }

  const sessionValue = JSON.stringify({
    access_token: tokenData.access_token,
    patient_id: tokenData.patient,
    expires_at: Date.now() + tokenData.expires_in * 1000,
  })

  const cookieFlags = isProduction
    ? `Path=/; Max-Age=${tokenData.expires_in}; HttpOnly; Secure; SameSite=Lax`
    : `Path=/; Max-Age=${tokenData.expires_in}; HttpOnly; SameSite=Lax`

  // Return HTML that redirects client-side — avoids server-side redirect being intercepted by Clerk
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<script>window.location.href = '/dashboard';</script>
</head><body>Connecting to EyeD...</body></html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Set-Cookie': `epic_session=${encodeURIComponent(sessionValue)}; ${cookieFlags}`,
    },
  })
}
