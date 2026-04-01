// src/app/api/fhir/callback/route.ts
// Handles Epic OAuth2 callback — exchanges code for token, sets HttpOnly session cookie
// Verifier is extracted from state param ("<nonce>.<verifier>") — no cookies needed for PKCE
import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForToken } from '@/lib/epic-fhir'

const isProduction = process.env.NODE_ENV === 'production'

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    console.error('[fhir/callback] Epic error:', error)
    return NextResponse.redirect(new URL('/dashboard?error=epic_auth_failed', req.url))
  }

  if (!code || !state) {
    console.error('[fhir/callback] Missing code or state')
    return NextResponse.redirect(new URL('/dashboard?error=missing_code', req.url))
  }

  // Extract verifier from state: "<nonce>.<verifier>"
  const dotIndex = state.indexOf('.')
  if (dotIndex === -1) {
    console.error('[fhir/callback] Invalid state format:', state.slice(0, 20))
    return NextResponse.redirect(new URL('/dashboard?error=invalid_state', req.url))
  }
  const codeVerifier = state.slice(dotIndex + 1)

  // Exchange code for token
  let tokenData
  try {
    tokenData = await exchangeCodeForToken(code, codeVerifier)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.redirect(new URL(`/dashboard?error=${encodeURIComponent(msg)}`, req.url))
  }

  const patientId = tokenData.patient || 'DEFAULT'

  // Return HTML that stores the session and redirects client-side
  // This avoids Clerk middleware intercepting a server-side redirect
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<script>
  document.cookie = 'epic_patient_pending=${patientId}; path=/; max-age=300';
  window.location.href = '/dashboard';
</script>
</head><body>Connecting to EyeD...</body></html>`

  const response = new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })

  response.cookies.set(
    'epic_session',
    JSON.stringify({
      access_token: tokenData.access_token,
      patient_id: tokenData.patient,
      expires_at: Date.now() + tokenData.expires_in * 1000,
    }),
    {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: tokenData.expires_in,
      secure: isProduction,
    }
  )

  return response
}
