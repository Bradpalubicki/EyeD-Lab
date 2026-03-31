import type { AiSummaryResult, DrugInteractionFlag } from "@/lib/claude";

interface AiBriefCardProps {
  sessionId: string;
}

const severityColors: Record<DrugInteractionFlag["severity"], string> = {
  moderate: "bg-yellow-50 border-yellow-200 text-yellow-800",
  major: "bg-orange-50 border-orange-200 text-orange-800",
  contraindicated: "bg-red-50 border-red-200 text-red-800",
};

const severityBadge: Record<DrugInteractionFlag["severity"], string> = {
  moderate: "bg-yellow-100 text-yellow-700",
  major: "bg-orange-100 text-orange-700",
  contraindicated: "bg-red-100 text-red-700",
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
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-800">⚠ AI summary unavailable — {errorMessage}</p>
      </div>
    );
  }

  const generatedTime = result.generatedAt
    ? new Date(result.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className="rounded-xl border-2 border-teal-200 bg-teal-50 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-teal-800 flex items-center gap-2">
          <span>✦</span> AI Patient Brief
        </h2>
        <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
          DEMO
        </span>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-700 leading-relaxed mb-4">{result.summary}</p>

      {/* Drug Interactions */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Drug Interactions
        </h3>
        {result.drugInteractions.length === 0 ? (
          <p className="text-sm text-green-700 flex items-center gap-1">
            <span>✓</span> No drug interactions identified in provided data
          </p>
        ) : (
          <ul className="space-y-2">
            {result.drugInteractions.map((flag, i) => (
              <li
                key={i}
                className={`rounded-lg border p-3 ${severityColors[flag.severity]}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {flag.drug1} ↔ {flag.drug2}
                  </span>
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${severityBadge[flag.severity]}`}>
                    {flag.severity}
                  </span>
                </div>
                <p className="text-xs">{flag.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-4">
        Generated {generatedTime} · Synthetic demo data only · Not for clinical use
      </p>
    </div>
  );
}
