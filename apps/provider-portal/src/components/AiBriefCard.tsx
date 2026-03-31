import type { AiSummaryResult, DrugInteractionFlag } from "@/lib/claude";

interface AiBriefCardProps {
  sessionId: string;
}

const severityPill: Record<DrugInteractionFlag["severity"], string> = {
  moderate: "pill-moderate",
  major: "pill-abnormal",
  contraindicated: "pill-critical",
};

const severityBorder: Record<DrugInteractionFlag["severity"], string> = {
  moderate: "var(--amber)",
  major: "var(--amber)",
  contraindicated: "var(--red)",
};

export default async function AiBriefCard({ sessionId }: AiBriefCardProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  let result: AiSummaryResult;
  let errorMessage: string | null = null;

  try {
    const res = await fetch(`${baseUrl}/api/ai/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
      cache: "no-store",
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({ error: "Unknown error" }));
      errorMessage = (json as { error?: string }).error ?? "AI service error";
      result = { summary: "", drugInteractions: [], generatedAt: "" };
    } else {
      result = (await res.json()) as AiSummaryResult;
    }
  } catch {
    errorMessage = "AI summary temporarily unavailable";
    result = { summary: "", drugInteractions: [], generatedAt: "" };
  }

  if (errorMessage) {
    return (
      <div className="glass-card" style={{ padding: "20px 24px", borderColor: "var(--red-dim)", background: "var(--red-dim)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--red)", flexShrink: 0 }} />
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>AI summary unavailable — {errorMessage}</p>
        </div>
      </div>
    );
  }

  const generatedTime = result.generatedAt
    ? new Date(result.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className="glass-card" style={{ padding: "24px", borderColor: "var(--teal)", boxShadow: "0 0 24px var(--teal-glow)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--teal)" }} />
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>AI Clinical Brief</span>
        </div>
        <span className="pill pill-abnormal">SYNTHETIC DATA</span>
      </div>

      {/* Summary */}
      <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "20px" }}>{result.summary}</p>

      {/* Drug Interactions */}
      <div>
        <div className="section-label">Drug Interactions</div>
        {result.drugInteractions.length === 0 ? (
          <span className="pill pill-normal">No interactions identified</span>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {result.drugInteractions.map((flag, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-elevated)",
                  border: `1px solid ${severityBorder[flag.severity]}`,
                  borderRadius: "var(--radius-sm)",
                  padding: "12px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <code style={{ fontSize: "13px", color: "var(--teal)", fontFamily: "monospace", background: "var(--teal-dim)", padding: "2px 6px", borderRadius: "4px" }}>{flag.drug1}</code>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>↔</span>
                  <code style={{ fontSize: "13px", color: "var(--teal)", fontFamily: "monospace", background: "var(--teal-dim)", padding: "2px 6px", borderRadius: "4px" }}>{flag.drug2}</code>
                  <span className={`pill ${severityPill[flag.severity]}`}>{flag.severity}</span>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>{flag.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
        Generated {generatedTime} · Synthetic demo data only · Not for clinical use
      </p>
    </div>
  );
}
