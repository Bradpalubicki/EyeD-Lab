// src/app/api/fhir/callback/route.ts
// Handles Epic OAuth2 callback — exchanges code for token, sets HttpOnly session cookie
import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForToken } from '@/lib/epic-fhir'

const isProduction = process.env.NODE_ENV === 'production'

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // Epic returned an error
  if (error) {
    return NextResponse.redirect(new URL('/dashboard?error=epic_auth_failed', req.url))
  }

  // Read PKCE cookies
  const storedState = req.cookies.get('oauth_state')?.value
  const codeVerifier = req.cookies.get('pkce_verifier')?.value

  // Validate state
  if (!storedState || state !== storedState) {
    console.error('[fhir/callback] State mismatch — storedState:', storedState, 'received:', state, 'cookies:', JSON.stringify([...req.cookies.getAll().map(c=>c.name)]))
    return NextResponse.redirect(new URL('/dashboard?error=state_mismatch', req.url))
  }

  if (!codeVerifier) {
    console.error('[fhir/callback] Missing verifier — cookies:', JSON.stringify([...req.cookies.getAll().map(c=>c.name)]))
    return NextResponse.redirect(new URL('/dashboard?error=missing_verifier', req.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard?error=missing_code', req.url))
  }

  // Exchange code for token
  let tokenData
  try {
    tokenData = await exchangeCodeForToken(code, codeVerifier)
    console.log('[fhir/callback] token fields:', Object.keys(tokenData).join(','), 'patient:', tokenData.patient)
  } catch (err) {
    console.error('[fhir/callback] Token exchange failed:', err)
    return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', req.url))
  }

  // Epic sandbox may not return patient field — fall back to dashboard
  const patientId = tokenData.patient || 'DEFAULT'

  // Build redirect to records page
  const response = NextResponse.redirect(
    new URL(`/records/${patientId}`, req.url)
  )

  // Store Epic session in HttpOnly cookie
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

  // Clear PKCE cookies
  response.cookies.set('pkce_verifier', '', { maxAge: 0, path: '/' })
  response.cookies.set('oauth_state', '', { maxAge: 0, path: '/' })

  return response
}
