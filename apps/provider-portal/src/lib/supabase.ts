// src/lib/supabase.ts
// Server-side Supabase admin client — lazy initialized, service role key
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (!_client) {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error('Supabase env vars not configured')
    _client = createClient(url, key, { auth: { persistSession: false } })
  }
  return _client
}
