import { cookies } from "next/headers";
import AiBriefCard from "@/components/AiBriefCard";
import RecordSourcesPanel from "@/components/RecordSourcesPanel";
import { getPatientByPin, getPatientByEpicId } from "@/lib/get-patient";

export default async function RecordsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  // Check for live Epic session cookie
  const cookieStore = await cookies();
  const epicCookie = cookieStore.get("epic_session");

  let epicActive = false
  let patient;
  if (epicCookie) {
    try {
      const session = JSON.parse(decodeURIComponent(epicCookie.value)) as {
        access_token: string;
        patient_id: string;
        expires_at: number;
      };
      if (session.expires_at > Date.now()) {
        const bundle = await getPatientByEpicId(session.patient_id, session.access_token);
        patient = bundle.patient;
        epicActive = true
      }
    } catch (err) {
      console.error('[records] Epic session parse/fetch failed:', err instanceof Error ? err.message : String(err))
    }
  }

  if (!patient) {
    const bundle = await getPatientByPin(sessionId);
    patient = bundle.patient;
  }

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
            <div style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: 600 }}>{patient.bloodType || "N/A"}</div>
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

      {/* AI Brief — client component, no Suspense needed */}
      <div style={{ marginBottom: "16px" }}>
        <AiBriefCard sessionId={sessionId} isEpicPatient={!!epicCookie} />
      </div>

      {/* All health record sources: Epic, Particle, Apple Health, Google Health */}
      <RecordSourcesPanel
        patientName={patient.name}
        patientDob={patient.dob}
        patientGender={patient.gender}
        epicSource={epicActive ? 'live' : 'none'}
      />

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
            {patient.height && (
              <div style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", padding: "12px 16px" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "6px" }}>Height</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", fontFamily: "monospace" }}>{patient.height}</div>
              </div>
            )}
            {patient.temperature && (
              <div style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", padding: "12px 16px" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "6px" }}>Temperature</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", fontFamily: "monospace" }}>{patient.temperature}</div>
              </div>
            )}
            {patient.oxygenSaturation && (
              <div style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", padding: "12px 16px" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "6px" }}>O₂ Saturation</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", fontFamily: "monospace" }}>{patient.oxygenSaturation}</div>
              </div>
            )}
            {patient.respiratoryRate && (
              <div style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", padding: "12px 16px" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "6px" }}>Respiratory Rate</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", fontFamily: "monospace" }}>{patient.respiratoryRate}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Surgical History */}
      {patient.surgicalHistory && patient.surgicalHistory.length > 0 && (
        <div className="glass-card" style={{ padding: "24px", marginBottom: "16px" }}>
          <div className="section-label">Surgical History</div>
          {patient.surgicalHistory.map((s: { procedure: string; year: number; outcome?: string }, i: number) => (
            <div key={i} className="data-row">
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{s.procedure}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{s.year}</div>
              </div>
              {s.outcome && (
                <span style={{
                  fontSize: "11px", fontWeight: 600, padding: "2px 10px", borderRadius: "999px",
                  background: s.outcome.toLowerCase().includes("uncomplicated") || s.outcome.toLowerCase().includes("full") ? "rgba(16,185,129,0.12)" : "var(--bg-elevated)",
                  color: s.outcome.toLowerCase().includes("uncomplicated") || s.outcome.toLowerCase().includes("full") ? "rgb(16,185,129)" : "var(--text-secondary)",
                  border: `1px solid ${s.outcome.toLowerCase().includes("uncomplicated") || s.outcome.toLowerCase().includes("full") ? "rgba(16,185,129,0.3)" : "var(--border)"}`,
                }}>
                  {s.outcome}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Immunizations */}
      {patient.immunizations && patient.immunizations.length > 0 && (
        <div className="glass-card" style={{ padding: "24px", marginBottom: "16px" }}>
          <div className="section-label">Immunizations</div>
          {patient.immunizations.map((im: { vaccine: string; date: string; provider?: string }, i: number) => (
            <div key={i} className="data-row">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "13px", color: "rgb(16,185,129)", fontWeight: 700 }}>✓</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{im.vaccine}</div>
                  {im.provider && <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{im.provider}</div>}
                </div>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontFamily: "monospace", flexShrink: 0 }}>
                {new Date(im.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Social History */}
      {patient.socialHistory && (
        <div className="glass-card" style={{ padding: "24px", marginBottom: "16px" }}>
          <div className="section-label">Social History</div>
          <div className="data-row">
            <span className="data-row-label">Smoking Status</span>
            <span style={{
              fontSize: "11px", fontWeight: 600, padding: "2px 10px", borderRadius: "999px",
              background: patient.socialHistory.smokingStatus === "never" ? "rgba(16,185,129,0.12)" : patient.socialHistory.smokingStatus === "current" ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
              color: patient.socialHistory.smokingStatus === "never" ? "rgb(16,185,129)" : patient.socialHistory.smokingStatus === "current" ? "rgb(239,68,68)" : "rgb(245,158,11)",
              border: `1px solid ${patient.socialHistory.smokingStatus === "never" ? "rgba(16,185,129,0.3)" : patient.socialHistory.smokingStatus === "current" ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)"}`,
            }}>
              {patient.socialHistory.smokingStatus === "never" ? "Never" : patient.socialHistory.smokingStatus === "current" ? "Current" : "Former"}
            </span>
          </div>
          <div className="data-row">
            <span className="data-row-label">Alcohol Use</span>
            <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>
              {patient.socialHistory.alcoholDrinksPerWeek != null ? `${patient.socialHistory.alcoholDrinksPerWeek} drinks/week` : "Not reported"}
            </span>
          </div>
          <div className="data-row">
            <span className="data-row-label">Occupation</span>
            <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>{patient.socialHistory.occupation ?? "Not reported"}</span>
          </div>
        </div>
      )}

      {/* Emergency Contact */}
      {patient.emergencyContact && (
        <div className="glass-card" style={{ padding: "24px", marginBottom: "16px" }}>
          <div className="section-label">Emergency Contact</div>
          <div className="data-row">
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                {patient.emergencyContact.name}
                <span style={{ fontSize: "12px", fontWeight: 400, color: "var(--text-secondary)", marginLeft: "8px" }}>{patient.emergencyContact.relationship}</span>
              </div>
              <div style={{ fontSize: "13px", color: "var(--teal)", marginTop: "4px", fontFamily: "monospace" }}>{patient.emergencyContact.phone}</div>
            </div>
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
