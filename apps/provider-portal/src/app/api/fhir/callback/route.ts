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
    console.log('[fhir/callback] token ok — patient:', tokenData.patient, 'fields:', Object.keys(tokenData).join(','))
  } catch (err) {
    console.error('[fhir/callback] Token exchange failed:', err)
    return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', req.url))
  }

  const patientId = tokenData.patient || 'DEFAULT'

  const response = NextResponse.redirect(
    new URL(`/records/${patientId}`, req.url)
  )

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
