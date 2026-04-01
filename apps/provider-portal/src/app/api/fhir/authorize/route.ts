// src/app/api/fhir/authorize/route.ts
// Initiates Epic SMART on FHIR OAuth2 PKCE flow
import { NextResponse } from 'next/server'
import { generateCodeVerifier, generateCodeChallenge, buildAuthorizeUrl } from '@/lib/epic-fhir'

export async function GET(): Promise<Response> {
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const state = crypto.randomUUID()
  const authorizeUrl = buildAuthorizeUrl(state, codeChallenge)

  const response = NextResponse.redirect(authorizeUrl)

  response.cookies.set('pkce_verifier', codeVerifier, {
    httpOnly: true,
    sameSite: 'none',
    path: '/',
    maxAge: 300,
    secure: true,
  })

  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    sameSite: 'none',
    path: '/',
    maxAge: 300,
    secure: true,
  })

  return response
}
