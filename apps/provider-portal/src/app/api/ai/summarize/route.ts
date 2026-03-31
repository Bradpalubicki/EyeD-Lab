import { NextRequest, NextResponse } from "next/server";
import { getMockPatient } from "@/lib/mock-fhir";
import { claudeSummarize } from "@/lib/claude";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
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
    const { patient } = getMockPatient(sessionId);
    const result = await claudeSummarize(patient);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/ai/summarize]", message);

    if (message.includes("ANTHROPIC_API_KEY is not configured")) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
    }
    if (message.includes("rate limit") || message.includes("429")) {
      return NextResponse.json({ error: "Rate limit exceeded — try again shortly" }, { status: 429 });
    }
    return NextResponse.json({ error: "AI service error" }, { status: 500 });
  }
}
