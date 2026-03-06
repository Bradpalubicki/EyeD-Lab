/**
 * EyeD Decryption Gateway — Cloudflare Worker
 *
 * Stateless edge compute:
 * 1. Validate session token + PIN
 * 2. Fetch encrypted record from storage (Phase 1: PostgreSQL, Phase 2: IPFS)
 * 3. Decrypt in-memory
 * 4. Stream to browser
 * 5. Discard — nothing persisted
 */

export interface Env {
  ENVIRONMENT: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', env: env.ENVIRONMENT }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname === '/v1/decrypt' && request.method === 'POST') {
      // Phase 1: Stub — real decryption pipeline in Sprint 1
      return new Response(JSON.stringify({ error: 'Not implemented — Phase 1' }), {
        status: 501,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};
