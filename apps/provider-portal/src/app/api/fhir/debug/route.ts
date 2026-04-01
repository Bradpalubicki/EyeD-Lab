import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForToken, generateCodeVerifier, generateCodeChallenge, buildAuthorizeUrl } from '@/lib/epic-fhir'

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // No params = show config + sample authorize URL
  if (!code && !state && !error) {
    const clientId = (process.env.EPIC_CLIENT_ID ?? '').trim()
    const redirectUri = (process.env.EPIC_REDIRECT_URI ?? '').trim()
    const verifier = generateCodeVerifier()
    const challenge = await generateCodeChallenge(verifier)
    const sampleState = `debug-nonce.${verifier}`
    const authorizeUrl = buildAuthorizeUrl(sampleState, challenge)
    return NextResponse.json({
      config: {
        client_id: clientId ? `${clientId.slice(0, 8)}...` : 'MISSING',
        redirect_uri: redirectUri || 'MISSING',
        node_env: process.env.NODE_ENV,
      },
      sample_authorize_url: authorizeUrl,
    })
  }

  if (error) return NextResponse.json({ error })
  if (!code || !state) return NextResponse.json({ error: 'missing code or state', code: !!code, state: !!state })

  const dotIndex = state.indexOf('.')
  if (dotIndex === -1) return NextResponse.json({ error: 'no dot in state', state_preview: state.slice(0, 30) })

  const codeVerifier = state.slice(dotIndex + 1)

  try {
    const tokenData = await exchangeCodeForToken(code, codeVerifier)
    return NextResponse.json({ ok: true, patient: tokenData.patient, fields: Object.keys(tokenData), expires_in: tokenData.expires_in })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) })
  }
}
