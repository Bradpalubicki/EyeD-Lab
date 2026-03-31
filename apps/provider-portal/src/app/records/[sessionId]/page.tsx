import { Suspense } from "react";
import AiBriefCard from "@/components/AiBriefCard";
import AiBriefSkeleton from "@/components/AiBriefSkeleton";
import { getPatientByPin } from "@/lib/get-patient";

export default async function RecordsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const { patient } = await getPatientByPin(sessionId);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px", position: "relative" }}>

      {/* Watermark overlay */}
      <div className="pointer-events-none" style={{ position: "fixed", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ transform: "rotate(-30deg)", userSelect: "none", fontSize: "72px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.03)" }}>
          CONFIDENTIAL
        </span>
      </div>

      {/* Page label */}
      <div style={{ marginBottom: "6px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--teal)" }}>
        Patient Records
      </div>

      {/* Patient Identity Bar */}
      <div className="glass-card" style={{ padding: "20px 24px", marginBottom: "28px", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--teal-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, color: "var(--teal)", flexShrink: 0 }}>
          {patient.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{patient.name}</div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
            {patient.age && `Age ${patient.age}`}{patient.age && patient.gender ? " · " : ""}{patient.gender && patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
            {patient.dob ? ` · DOB ${new Date(patient.dob).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : ""}
          </div>
        </div>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "2px" }}>MRN</div>
            <code style={{ fontSize: "13px", color: "var(--teal)", fontFamily: "monospace" }}>{patient.mrn}</code>
          </div>
          <div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "2px" }}>Blood Type</div>
            <div style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: 600 }}>{patient.bloodType ?? "Unknown"}</div>
          </div>
          <div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "2px" }}>Provider</div>
            <div style={{ fontSize: "13px", color: "var(--text-primary)" }}>{patient.primaryProvider}</div>
          </div>
          <div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "2px" }}>Session PIN</div>
            <code style={{ fontSize: "13px", color: "var(--text-secondary)", fontFamily: "monospace", background: "var(--bg-elevated)", padding: "2px 8px", borderRadius: "4px" }}>{sessionId}</code>
          </div>
        </div>
      </div>

      {/* AI Brief — Suspense boundary */}
      <div style={{ marginBottom: "28px" }}>
        <Suspense fallback={<AiBriefSkeleton />}>
          <AiBriefCard sessionId={sessionId} />
        </Suspense>
      </div>

      {/* Medical Data Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>

        {/* Allergies */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <div className="section-label">Allergies</div>
          {patient.allergies.length === 0 ? (
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>No known allergies recorded</div>
          ) : (
            patient.allergies.map((a: { substance: string; reaction: string; severity: string }, i: number) => (
              <div key={i} className="data-row">
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{a.substance}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>{a.reaction}</div>
                </div>
                <span className={`pill pill-${a.severity}`}>{a.severity}</span>
              </div>
            ))
          )}
        </div>

        {/* Medications */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <div className="section-label">Medications</div>
          {patient.medications.length === 0 ? (
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>No active medications</div>
          ) : (
            patient.medications.map((m: { name: string; dosage: string; indication: string }, i: number) => (
              <div key={i} className="data-row">
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{m.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>{m.indication}</div>
                </div>
                <div style={{ fontSize: "12px", color: "var(--teal)", fontFamily: "monospace", textAlign: "right", flexShrink: 0 }}>{m.dosage}</div>
              </div>
            ))
          )}
        </div>

        {/* Conditions */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <div className="section-label">Conditions</div>
          {patient.conditions.length === 0 ? (
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>No conditions on file</div>
          ) : (
            patient.conditions.map((c: { name: string; status: string; onsetYear?: number; icdCode?: string }, i: number) => (
              <div key={i} className="data-row">
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{c.name}</div>
                  {c.icdCode && <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px", fontFamily: "monospace" }}>{c.icdCode}</div>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                  <span className={`pill pill-${c.status}`}>{c.status}</span>
                  {c.onsetYear && <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>since {c.onsetYear}</span>}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Labs */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <div className="section-label">Lab Results</div>
          {patient.labs.length === 0 ? (
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>No recent lab results</div>
          ) : (
            patient.labs.map((l: { name: string; value: string; status: string; date?: string; referenceRange?: string }, i: number) => (
              <div key={i} className="data-row">
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{l.name}</div>
                  {l.referenceRange && <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>ref {l.referenceRange}</div>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", fontFamily: "monospace" }}>{l.value}</span>
                  <span className={`pill pill-${l.status}`}>{l.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Vitals — if present */}
      {patient.vitals && patient.vitals.length > 0 && (
        <div className="glass-card" style={{ padding: "24px", marginBottom: "16px" }}>
          <div className="section-label">Vitals</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
            {patient.vitals.map((v: { name: string; value: string; date?: string }, i: number) => (
              <div key={i} style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", padding: "12px 16px" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "6px" }}>{v.name}</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", fontFamily: "monospace" }}>{v.value}</div>
                {v.date && <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>{new Date(v.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Treatment Sessions — TRT patients only */}
      {patient.treatmentSessions && patient.treatmentSessions.length > 0 && (
        <div className="glass-card" style={{ padding: "24px" }}>
          <div className="section-label">Treatment Sessions</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Date", "Type", "Dose", "Provider", "Notes"].map(h => (
                    <th key={h} style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", textAlign: "left", paddingBottom: "10px", paddingRight: "16px", borderBottom: "1px solid var(--border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patient.treatmentSessions.map((s: { sessionDate: string; sessionType: string; dosageMg?: number | null; providerName?: string; notes?: string | null }, i: number) => (
                  <tr key={i}>
                    <td style={{ fontSize: "13px", color: "var(--text-secondary)", paddingTop: "12px", paddingBottom: "12px", paddingRight: "16px", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                      {new Date(s.sessionDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td style={{ paddingTop: "12px", paddingBottom: "12px", paddingRight: "16px", borderBottom: "1px solid var(--border)" }}>
                      <span className="pill pill-active">{s.sessionType}</span>
                    </td>
                    <td style={{ fontSize: "13px", color: "var(--text-primary)", paddingTop: "12px", paddingBottom: "12px", paddingRight: "16px", borderBottom: "1px solid var(--border)", fontFamily: "monospace" }}>
                      {s.dosageMg != null ? `${s.dosageMg} mg` : "—"}
                    </td>
                    <td style={{ fontSize: "13px", color: "var(--text-secondary)", paddingTop: "12px", paddingBottom: "12px", paddingRight: "16px", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                      {s.providerName ?? "—"}
                    </td>
                    <td style={{ fontSize: "12px", color: "var(--text-muted)", paddingTop: "12px", paddingBottom: "12px", borderBottom: "1px solid var(--border)", maxWidth: "260px" }}>
                      {s.notes ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
