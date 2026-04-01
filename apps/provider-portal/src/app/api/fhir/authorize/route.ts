// src/app/api/fhir/authorize/route.ts
// Initiates Epic SMART on FHIR OAuth2 PKCE flow
// State param encodes the verifier: "<uuid>.<base64url(verifier)>"
// This avoids cookie loss on cross-site redirects from Epic back to our portal
import { NextResponse } from 'next/server'
import { generateCodeVerifier, generateCodeChallenge, buildAuthorizeUrl } from '@/lib/epic-fhir'

export async function GET(): Promise<Response> {
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const nonce = crypto.randomUUID()
  const state = `${nonce}.${codeVerifier}`
  const authorizeUrl = buildAuthorizeUrl(state, codeChallenge)

  return NextResponse.redirect(authorizeUrl)
}
