import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForToken } from '@/lib/epic-fhir'

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

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
