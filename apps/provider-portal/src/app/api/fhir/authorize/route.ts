// src/app/api/fhir/authorize/route.ts
// Initiates Epic SMART on FHIR OAuth2 PKCE flow
import { NextResponse } from 'next/server'
import { generateCodeVerifier, generateCodeChallenge, buildAuthorizeUrl } from '@/lib/epic-fhir'

const isProduction = process.env.NODE_ENV === 'production'

export async function GET(): Promise<Response> {
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const state = crypto.randomUUID()
  const authorizeUrl = buildAuthorizeUrl(state, codeChallenge)

  const response = NextResponse.redirect(authorizeUrl)

  response.cookies.set('pkce_verifier', codeVerifier, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 300,
    secure: isProduction,
  })

  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 300,
    secure: isProduction,
  })

  return response
}
