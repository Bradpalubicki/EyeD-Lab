"use client"
import { use } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TreatmentSchema, type TreatmentInput, logTreatment } from "@/app/actions/treatment"
import { useState } from "react"

const SESSION_TYPES = [
  { value: "tcyp_injection",   label: "T-Cyp Injection" },
  { value: "pellet_insertion", label: "Pellet Insertion" },
  { value: "shockwave",        label: "Shockwave Therapy" },
  { value: "eros",             label: "Eros Therapy" },
  { value: "follow_up",        label: "Follow-Up Visit" },
  { value: "initial_visit",    label: "Initial Visit" },
]

export default function TreatmentPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const router = useRouter()
  const { sessionId } = use(params)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TreatmentInput>({
    resolver: zodResolver(TreatmentSchema),
    defaultValues: { session_pin: sessionId },
  })

  const sessionType = watch("session_type")
  const showDosageFields = sessionType === "tcyp_injection" || sessionType === "pellet_insertion"

  async function onSubmit(data: TreatmentInput) {
    const result = await logTreatment(data)
    if (!result.success) {
      setError("root", { message: result.error ?? "Failed to save" })
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px", textAlign: "center" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: "var(--teal-dim)", border: "1px solid var(--teal)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: "24px", color: "var(--teal)"
        }}>✓</div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", letterSpacing: "-0.01em" }}>
          Treatment Recorded
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "32px" }}>
          Session logged for PIN{" "}
          <code style={{ fontFamily: "monospace", color: "var(--teal)", background: "var(--teal-dim)", padding: "2px 8px", borderRadius: "4px" }}>
            {sessionId}
          </code>
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button className="btn-ghost" onClick={() => router.push(`/records/${sessionId}`)}>← Back to Records</button>
          <button className="btn-primary" onClick={() => { setSubmitted(false); reset({ session_pin: sessionId }) }}>
            Add Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--teal)", marginBottom: "8px" }}>
          Treatment Record
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "0 0 8px" }}>
          Add Treatment Session
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
          Log a treatment for PIN{" "}
          <code style={{ fontFamily: "monospace", color: "var(--teal)", background: "var(--teal-dim)", padding: "2px 8px", borderRadius: "4px" }}>
            {sessionId}
          </code>
        </p>
      </div>

      <div className="glass-card" style={{ padding: "32px" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("session_pin")} />

          {/* Session Type */}
          <div style={{ marginBottom: "20px" }}>
            <label className="field-label">Session Type *</label>
            <select className="field-input" {...register("session_type")}>
              <option value="">Select type</option>
              {SESSION_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            {errors.session_type && (
              <p style={{ fontSize: "12px", color: "var(--red)", marginTop: "4px" }}>{errors.session_type.message}</p>
            )}
          </div>

          {/* Dosage + Side — injections / pellets only */}
          {showDosageFields && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label className="field-label">Dosage (mg)</label>
                <input
                  className="field-input"
                  type="number"
                  placeholder="e.g. 200"
                  step="0.1"
                  min="0"
                  {...register("dosage_mg")}
                />
              </div>
              <div>
                <label className="field-label">Side</label>
                <select className="field-input" {...register("side")}>
                  <option value="">N/A</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="bilateral">Bilateral</option>
                </select>
              </div>
            </div>
          )}

          {/* Follow-up Date */}
          <div style={{ marginBottom: "20px" }}>
            <label className="field-label">Follow-up Date</label>
            <input className="field-input" type="date" {...register("followup_date")} />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: "24px" }}>
            <label className="field-label">Clinical Notes</label>
            <textarea
              className="field-input"
              rows={4}
              placeholder="Observations, patient response, next steps..."
              style={{ resize: "vertical", minHeight: "96px" }}
              {...register("notes")}
            />
          </div>

          {errors.root && (
            <p style={{ fontSize: "13px", color: "var(--red)", marginBottom: "16px" }}>{errors.root.message}</p>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => router.push(`/records/${sessionId}`)}
            >
              ← Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving…" : "Save Treatment Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
