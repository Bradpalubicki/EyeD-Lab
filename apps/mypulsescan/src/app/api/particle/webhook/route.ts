import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

// ── helpers ────────────────────────────────────────────────────────────────

function verifySignature(rawBody: string, header: string | null): boolean {
  const secret = process.env.PARTICLE_WEBHOOK_SECRET;
  if (!secret || !header) return false;

  // Header format: "t=1684152014,{signature}"
  const commaIdx = header.indexOf(",");
  if (commaIdx === -1) return false;
  const tPart = header.slice(0, commaIdx); // "t=1684152014"
  const receivedSig = header.slice(commaIdx + 1);

  const timestamp = tPart.startsWith("t=") ? tPart.slice(2) : null;
  if (!timestamp) return false;

  const buildString = `${timestamp}.${rawBody}`;
  const computed = crypto
    .createHmac("sha256", secret)
    .update(buildString, "utf8")
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(computed, "hex"),
    Buffer.from(receivedSig.length === computed.length ? receivedSig : computed, "hex")
  );
}

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function logWebhook(eventType: string, payload: unknown) {
  const db = supabaseAdmin();
  await db.from("particle_webhook_events").insert({
    event_type: eventType,
    payload,
    received_at: new Date().toISOString(),
  });
}

// ── event handlers (async — called after 200 returned) ────────────────────

async function handleQueryComplete(data: {
  particle_patient_id: string;
  query_id: string;
  status: string;
  file_count?: number;
}) {
  if (data.status !== "COMPLETE") return;

  const db = supabaseAdmin();

  // Update patient record: mark query complete, store last_queried_at
  await db
    .from("patients")
    .update({
      last_particle_query_status: "COMPLETE",
      last_queried_at: new Date().toISOString(),
      particle_query_id: data.query_id,
    })
    .eq("particle_patient_id", data.particle_patient_id);

  // Subscribe to Signal after first successful query (idempotent check)
  const { data: patient } = await db
    .from("patients")
    .select("id, signal_subscribed")
    .eq("particle_patient_id", data.particle_patient_id)
    .single();

  if (patient && !patient.signal_subscribed) {
    await subscribeToSignal(data.particle_patient_id, patient.id);
  }
}

async function handleAdtEvent(data: { message_id: string; patient_id: string }) {
  const db = supabaseAdmin();

  // Look up our patient by Particle patient ID
  const { data: patient } = await db
    .from("patients")
    .select("id, particle_patient_id, last_queried_at")
    .eq("particle_patient_id", data.patient_id)
    .single();

  if (!patient) return;

  const baseUrl = process.env.PARTICLE_BASE_URL ?? "https://sandbox.particlehealth.com";
  const apiKey = process.env.PARTICLE_API_KEY;

  // Fetch the HL7 message for context
  await fetch(`${baseUrl}/api/v2/hl7v2/${data.message_id}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  // Trigger a delta query using _since
  const sinceParam = patient.last_queried_at
    ? `?_since=${encodeURIComponent(patient.last_queried_at)}`
    : "";

  await fetch(
    `${baseUrl}/api/v2/patients/${data.patient_id}/query${sinceParam}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ purpose_of_use: "TREATMENT" }),
    }
  );

  // Record Signal event + increment monitoring days
  await db
    .from("patients")
    .update({
      last_signal_event: new Date().toISOString(),
      last_signal_event_type: "TRANSITION",
    })
    .eq("id", patient.id);

  // Increment monitoring_days_this_period
  await db.rpc("increment_monitoring_days", { patient_id: patient.id });
}

async function handleSnapshotReady(data: {
  outputs: Array<{
    ai_output_id: string;
    output_type: string;
    status: string;
  }>;
  particle_patient_id?: string;
}) {
  const db = supabaseAdmin();
  const baseUrl = process.env.PARTICLE_BASE_URL ?? "https://sandbox.particlehealth.com";
  const apiKey = process.env.PARTICLE_API_KEY;

  for (const output of data.outputs ?? []) {
    if (output.status !== "COMPLETE") continue;

    const res = await fetch(
      `${baseUrl}/api/v2/aioutput/${output.ai_output_id}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    const summary = await res.json();

    await db.from("particle_snapshots").insert({
      ai_output_id: output.ai_output_id,
      output_type: output.output_type,
      particle_patient_id: data.particle_patient_id ?? null,
      summary,
      created_at: new Date().toISOString(),
    });
  }
}

async function subscribeToSignal(
  particlePatientId: string,
  internalPatientId: string
) {
  const baseUrl = process.env.PARTICLE_BASE_URL ?? "https://sandbox.particlehealth.com";
  const apiKey = process.env.PARTICLE_API_KEY;

  const res = await fetch(
    `${baseUrl}/api/v2/patients/${particlePatientId}/subscribe`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        alert_types: ["TRANSITION", "ENCOUNTER", "DISCHARGE", "REFERRAL"],
      }),
    }
  );

  if (res.ok) {
    const db = supabaseAdmin();
    await db
      .from("patients")
      .update({
        signal_subscribed: true,
        signal_subscribed_at: new Date().toISOString(),
      })
      .eq("id", internalPatientId);
  }
}

// ── route handler ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sigHeader = req.headers.get("x-ph-signature-256");

  if (!verifySignature(rawBody, sigHeader)) {
    console.error("[particle/webhook] HMAC verification failed", {
      header: sigHeader,
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Return 200 immediately — process async
  const payload = JSON.parse(rawBody) as {
    type: string;
    data: Record<string, unknown>;
  };

  // Log to audit table (fire-and-forget)
  void logWebhook(payload.type, payload);

  // Process async after response
  setImmediate(async () => {
    try {
      switch (payload.type) {
        case "com.particlehealth.api.v2.query":
          await handleQueryComplete(
            payload.data as Parameters<typeof handleQueryComplete>[0]
          );
          break;
        case "com.particlehealth.api.v2.hl7v2":
          await handleAdtEvent(
            payload.data as Parameters<typeof handleAdtEvent>[0]
          );
          break;
        case "com.particlehealth.api.v2.aioutput":
          await handleSnapshotReady(
            payload.data as Parameters<typeof handleSnapshotReady>[0]
          );
          break;
        default:
          console.warn("[particle/webhook] Unknown event type:", payload.type);
      }
    } catch (err) {
      console.error("[particle/webhook] async processing error:", err);
    }
  });

  return NextResponse.json({ received: true });
}
