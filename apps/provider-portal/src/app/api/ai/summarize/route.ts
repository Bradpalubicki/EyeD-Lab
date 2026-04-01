import { NextRequest, NextResponse } from "next/server";
import { getPatientByPin } from "@/lib/get-patient";
import { claudeSummarize } from "@/lib/claude";
import { getRatelimit } from "@/lib/ratelimit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // Rate limiting — 20 requests/IP/hour (skipped if Upstash not configured)
  const rl = getRatelimit();
  if (rl) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
    const { success, limit, remaining, reset } = await rl.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded — try again shortly" },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(reset),
          },
        }
      );
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { sessionId } = body as { sessionId?: string };

  if (typeof sessionId !== "string" || !sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  try {
    const { patient } = await getPatientByPin(sessionId);
    const result = await claudeSummarize(patient);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("ANTHROPIC_API_KEY is not configured")) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
    }
    if (message.includes("rate limit") || message.includes("429")) {
      return NextResponse.json({ error: "Rate limit exceeded — try again shortly" }, { status: 429 });
    }
    return NextResponse.json({ error: "AI service error" }, { status: 500 });
  }
}
