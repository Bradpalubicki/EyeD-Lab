// src/lib/claude.ts
// Server-side only — never import this in "use client" components

import type { MockPatient } from "./mock-fhir";

export interface DrugInteractionFlag {
  drug1: string;
  drug2: string;
  severity: "moderate" | "major" | "contraindicated";
  description: string;
}

export interface AiSummaryResult {
  summary: string;
  drugInteractions: DrugInteractionFlag[];
  generatedAt: string;
}

function buildPrompt(patient: MockPatient): string {
  const medications = patient.medications.length > 0
    ? patient.medications.map(m => `  - ${m.name} ${m.dosage} (${m.indication})`).join("\n")
    : "  None documented";

  const allergies = patient.allergies.length > 0
    ? patient.allergies.map(a => `  - ${a.substance}: ${a.reaction} (${a.severity})`).join("\n")
    : "  None documented";

  const conditions = patient.conditions.length > 0
    ? patient.conditions.map(c => `  - ${c.name} [${c.status}]${c.onsetYear ? ` since ${c.onsetYear}` : ""}`).join("\n")
    : "  None documented";

  const labs = patient.labs.length > 0
    ? patient.labs.map(l => `  - ${l.name}: ${l.value} [${l.status}]${l.referenceRange ? ` (ref: ${l.referenceRange})` : ""}`).join("\n")
    : "  None documented";

  return `SYNTHETIC DEMO PATIENT DATA (no real patient information):

Patient: ${patient.name} | MRN: ${patient.mrn} | DOB: ${patient.dob} | Age: ${patient.age} | Gender: ${patient.gender}
Blood Type: ${patient.bloodType} | Primary Provider: ${patient.primaryProvider} | Last Visit: ${patient.lastVisit}

ACTIVE MEDICATIONS:
${medications}

ALLERGIES:
${allergies}

CONDITIONS:
${conditions}

RECENT LABS:
${labs}

---

Respond with ONLY valid JSON in this exact format:
{
  "summary": "3-4 plain English sentences summarizing this patient's current health status. Do not use medical jargon. Do not invent information not present above. If a field is missing, omit it.",
  "drugInteractions": [
    {
      "drug1": "medication name",
      "drug2": "medication name",
      "severity": "moderate|major|contraindicated",
      "description": "brief plain English description of the interaction risk"
    }
  ]
}

If there are no drug interactions, return an empty array for drugInteractions.
Only flag interactions supported by the medication list above. Do not speculate.`;
}

export async function claudeSummarize(patient: MockPatient): Promise<AiSummaryResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system:
        "You are a clinical decision support assistant for a DEMO healthcare application. " +
        "All patient data is SYNTHETIC — no real patient information. " +
        "Summarize patient health status in plain English and identify drug interactions. " +
        "Never invent information not present in the provided data. " +
        "If a field is missing, omit it from the summary. " +
        "Respond only with valid JSON as instructed.",
      messages: [{ role: "user", content: buildPrompt(patient) }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json() as {
    content: Array<{ type: string; text: string }>;
  };

  const textBlock = data.content.find(b => b.type === "text");
  if (!textBlock) {
    throw new Error("Unexpected Claude response format");
  }

  // Strip markdown code fences if Claude wrapped the JSON
  const rawText = textBlock.text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  try {
    const parsed = JSON.parse(rawText) as { summary: string; drugInteractions: DrugInteractionFlag[] };
    return {
      summary: parsed.summary ?? rawText,
      drugInteractions: Array.isArray(parsed.drugInteractions) ? parsed.drugInteractions : [],
      generatedAt: new Date().toISOString(),
    };
  } catch {
    return {
      summary: rawText,
      drugInteractions: [],
      generatedAt: new Date().toISOString(),
    };
  }
}
