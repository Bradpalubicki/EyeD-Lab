// src/lib/ratelimit.ts
// Upstash Redis rate limiter — 20 AI summarize calls per IP per hour
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

let _ratelimit: Ratelimit | null = null

export function getRatelimit(): Ratelimit | null {
  if (_ratelimit) return _ratelimit

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  // If not configured, skip rate limiting (dev mode)
  if (!url || !token) return null

  _ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(20, "1 h"),
    prefix: "eyed:rl",
    analytics: false,
  })

  return _ratelimit
}
