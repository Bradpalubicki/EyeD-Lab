"use client"
import { useState } from "react"

type Medication = { name: string; dosage: string; indication: string }
type Allergy = { substance: string; reaction: string; severity: string }
type Condition = { name: string; status: string; onsetYear: string }
type Lab = { name: string; value: string; date: string; status: string }

export default function UploadPage() {
  const [step, setStep] = useState(1)
  const TOTAL_STEPS = 5

  // Demographics
  const [name, setName] = useState("")
  const [dob, setDob] = useState("")
  const [gender, setGender] = useState("")
  const [bloodType, setBloodType] = useState("")

  // Dynamic lists
  const [medications, setMedications] = useState<Medication[]>([])
  const [newMed, setNewMed] = useState<Medication>({ name: "", dosage: "", indication: "" })

  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [newAllergy, setNewAllergy] = useState<Allergy>({ substance: "", reaction: "", severity: "moderate" })

  const [conditions, setConditions] = useState<Condition[]>([])
  const [newCondition, setNewCondition] = useState<Condition>({ name: "", status: "active", onsetYear: "" })

  const [labs, setLabs] = useState<Lab[]>([])
  const [newLab, setNewLab] = useState<Lab>({ name: "", value: "", date: "", status: "normal" })

  // Generated PIN
  const [pin, setPin] = useState("")

  function generatePin() {
    const generated = String(Math.floor(100000 + Math.random() * 900000))
    setPin(generated)
    setStep(5)
  }

  // Progress bar
  const ProgressBar = () => (
    <div style={{ marginBottom: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        {["Demographics", "Medications", "Allergies", "Conditions & Labs", "Your PIN"].map((label, i) => (
          <div key={i} style={{
            fontSize: "10px",
            color: step > i + 1 ? "var(--teal)" : step === i + 1 ? "var(--text-primary)" : "var(--text-muted)",
            fontWeight: step === i + 1 ? 600 : 400,
            flex: 1,
            textAlign: "center"
          }}>
            {label}
          </div>
        ))}
      </div>
      <div style={{ height: "3px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%`,
          background: "var(--teal)",
          borderRadius: "2px",
          transition: "width 0.3s ease"
        }} />
      </div>
    </div>
  )

  // Step 1: Demographics
  const Step1 = () => (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px", letterSpacing: "-0.01em" }}>Your Information</h2>
      <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "28px" }}>Basic details that help providers identify your record.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div>
          <label className="field-label">Full Name *</label>
          <input className="field-input" value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" />
        </div>
        <div>
          <label className="field-label">Date of Birth *</label>
          <input className="field-input" type="date" value={dob} onChange={e => setDob(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Gender *</label>
          <select className="field-input" value={gender} onChange={e => setGender(e.target.value)}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other / Prefer not to say</option>
          </select>
        </div>
        <div>
          <label className="field-label">Blood Type</label>
          <select className="field-input" value={bloodType} onChange={e => setBloodType(e.target.value)}>
            <option value="">Unknown</option>
            {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bt => <option key={bt} value={bt}>{bt}</option>)}
          </select>
        </div>
      </div>
      <button className="btn-primary" onClick={() => setStep(2)} disabled={!name || !dob || !gender} style={{ width: "100%", marginTop: "8px" }}>Continue →</button>
    </div>
  )

  // Step 2: Medications
  const Step2 = () => (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px", letterSpacing: "-0.01em" }}>Current Medications</h2>
      <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>List all prescription and over-the-counter medications you currently take.</p>

      {medications.map((m, i) => (
        <div key={i} className="glass-card" style={{ padding: "12px 16px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{m.name}</span>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", marginLeft: "10px" }}>{m.dosage}</span>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "10px" }}>{m.indication}</span>
          </div>
          <button onClick={() => setMedications(medications.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px", padding: "4px", lineHeight: 1 }}>×</button>
        </div>
      ))}

      <div className="glass-card" style={{ padding: "16px", marginBottom: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "10px" }}>
          <div>
            <label className="field-label">Medication Name</label>
            <input className="field-input" placeholder="e.g. Metformin" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} />
          </div>
          <div>
            <label className="field-label">Dosage</label>
            <input className="field-input" placeholder="e.g. 500mg daily" value={newMed.dosage} onChange={e => setNewMed({...newMed, dosage: e.target.value})} />
          </div>
          <div>
            <label className="field-label">Reason / Condition</label>
            <input className="field-input" placeholder="e.g. Type 2 Diabetes" value={newMed.indication} onChange={e => setNewMed({...newMed, indication: e.target.value})} />
          </div>
        </div>
        <button className="btn-ghost" onClick={() => {
          if (newMed.name) {
            setMedications([...medications, newMed])
            setNewMed({ name: "", dosage: "", indication: "" })
          }
        }} style={{ width: "100%" }}>+ Add Medication</button>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
        <button className="btn-primary" onClick={() => setStep(3)} style={{ flex: 1 }}>Continue →</button>
      </div>
    </div>
  )

  // Step 3: Allergies
  const Step3 = () => (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px", letterSpacing: "-0.01em" }}>Allergies</h2>
      <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>List any known drug, food, or environmental allergies.</p>

      {allergies.map((a, i) => (
        <div key={i} className="glass-card" style={{ padding: "12px 16px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{a.substance}</span>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{a.reaction}</span>
            <span className={`pill pill-${a.severity}`}>{a.severity}</span>
          </div>
          <button onClick={() => setAllergies(allergies.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px", padding: "4px", lineHeight: 1 }}>×</button>
        </div>
      ))}

      <div className="glass-card" style={{ padding: "16px", marginBottom: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "10px" }}>
          <div>
            <label className="field-label">Substance</label>
            <input className="field-input" placeholder="e.g. Penicillin" value={newAllergy.substance} onChange={e => setNewAllergy({...newAllergy, substance: e.target.value})} />
          </div>
          <div>
            <label className="field-label">Reaction</label>
            <input className="field-input" placeholder="e.g. Anaphylaxis" value={newAllergy.reaction} onChange={e => setNewAllergy({...newAllergy, reaction: e.target.value})} />
          </div>
          <div>
            <label className="field-label">Severity</label>
            <select className="field-input" value={newAllergy.severity} onChange={e => setNewAllergy({...newAllergy, severity: e.target.value})}>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>
        </div>
        <button className="btn-ghost" onClick={() => {
          if (newAllergy.substance) {
            setAllergies([...allergies, newAllergy])
            setNewAllergy({ substance: "", reaction: "", severity: "moderate" })
          }
        }} style={{ width: "100%" }}>+ Add Allergy</button>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button className="btn-ghost" onClick={() => setStep(2)}>← Back</button>
        <button className="btn-primary" onClick={() => setStep(4)} style={{ flex: 1 }}>Continue →</button>
      </div>
    </div>
  )

  // Step 4: Conditions + Labs
  const Step4 = () => (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px", letterSpacing: "-0.01em" }}>Medical History & Labs</h2>
      <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>Active conditions and any recent lab results you have.</p>

      {/* Conditions */}
      <div className="section-label">Conditions</div>
      {conditions.map((c, i) => (
        <div key={i} className="glass-card" style={{ padding: "12px 16px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{c.name}</span>
            <span className={`pill pill-${c.status}`}>{c.status}</span>
            {c.onsetYear && <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>since {c.onsetYear}</span>}
          </div>
          <button onClick={() => setConditions(conditions.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px", padding: "4px", lineHeight: 1 }}>×</button>
        </div>
      ))}
      <div className="glass-card" style={{ padding: "16px", marginBottom: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "10px", marginBottom: "10px" }}>
          <div>
            <label className="field-label">Condition</label>
            <input className="field-input" placeholder="e.g. Type 2 Diabetes" value={newCondition.name} onChange={e => setNewCondition({...newCondition, name: e.target.value})} />
          </div>
          <div>
            <label className="field-label">Status</label>
            <select className="field-input" value={newCondition.status} onChange={e => setNewCondition({...newCondition, status: e.target.value})}>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label className="field-label">Onset Year</label>
            <input className="field-input" placeholder="e.g. 2018" value={newCondition.onsetYear} onChange={e => setNewCondition({...newCondition, onsetYear: e.target.value})} />
          </div>
        </div>
        <button className="btn-ghost" onClick={() => {
          if (newCondition.name) {
            setConditions([...conditions, newCondition])
            setNewCondition({ name: "", status: "active", onsetYear: "" })
          }
        }} style={{ width: "100%" }}>+ Add Condition</button>
      </div>

      {/* Labs */}
      <div className="section-label">Recent Lab Results</div>
      {labs.map((l, i) => (
        <div key={i} className="glass-card" style={{ padding: "12px 16px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{l.name}</span>
            <code style={{ fontSize: "13px", color: "var(--teal)", fontFamily: "monospace" }}>{l.value}</code>
            <span className={`pill pill-${l.status}`}>{l.status}</span>
          </div>
          <button onClick={() => setLabs(labs.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px", padding: "4px", lineHeight: 1 }}>×</button>
        </div>
      ))}
      <div className="glass-card" style={{ padding: "16px", marginBottom: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "10px", marginBottom: "10px" }}>
          <div>
            <label className="field-label">Test Name</label>
            <input className="field-input" placeholder="e.g. HbA1c" value={newLab.name} onChange={e => setNewLab({...newLab, name: e.target.value})} />
          </div>
          <div>
            <label className="field-label">Value</label>
            <input className="field-input" placeholder="e.g. 7.2%" value={newLab.value} onChange={e => setNewLab({...newLab, value: e.target.value})} />
          </div>
          <div>
            <label className="field-label">Date</label>
            <input className="field-input" type="date" value={newLab.date} onChange={e => setNewLab({...newLab, date: e.target.value})} />
          </div>
          <div>
            <label className="field-label">Status</label>
            <select className="field-input" value={newLab.status} onChange={e => setNewLab({...newLab, status: e.target.value})}>
              <option value="normal">Normal</option>
              <option value="abnormal">Abnormal</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        <button className="btn-ghost" onClick={() => {
          if (newLab.name) {
            setLabs([...labs, newLab])
            setNewLab({ name: "", value: "", date: "", status: "normal" })
          }
        }} style={{ width: "100%" }}>+ Add Lab Result</button>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button className="btn-ghost" onClick={() => setStep(3)}>← Back</button>
        <button className="btn-primary" onClick={generatePin} style={{ flex: 1 }}>Generate My PIN →</button>
      </div>
    </div>
  )

  // Step 5: PIN Generated
  const Step5 = () => (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: "32px" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: "var(--teal-dim)", border: "1px solid var(--teal)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", fontSize: "24px", color: "var(--teal)"
        }}>✓</div>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", letterSpacing: "-0.01em" }}>Your Record is Ready</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Share this PIN with your provider — they&apos;ll use it to access your complete medical summary.</p>
      </div>

      <div style={{ background: "var(--teal-dim)", border: "1px solid var(--teal)", borderRadius: "var(--radius-lg)", padding: "40px", marginBottom: "32px", boxShadow: "0 0 40px var(--teal-glow)" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--teal)", marginBottom: "16px" }}>Your Patient PIN</div>
        <div style={{ fontSize: "64px", fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.2em", color: "var(--text-primary)", lineHeight: 1 }}>{pin}</div>
        <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "16px" }}>
          {name}{dob ? ` · ${new Date(dob).toLocaleDateString()}` : ""}
        </div>
      </div>

      <div className="glass-card" style={{ padding: "16px", marginBottom: "24px", textAlign: "left" }}>
        <div className="section-label">What was captured</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
          {([
            ["Medications", medications.length],
            ["Allergies", allergies.length],
            ["Conditions", conditions.length],
            ["Lab Results", labs.length],
          ] as [string, number][]).map(([label, count]) => (
            <div key={label} className="data-row" style={{ padding: "8px 0" }}>
              <span className="data-row-label">{label}</span>
              <span className="data-row-value">{count > 0 ? `${count} recorded` : "None entered"}</span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.6" }}>
        In production, this record is encrypted and stored in EyeD&apos;s HIPAA-compliant database. The PIN is single-use and expires after 24 hours. Demo mode — no data was stored.
      </p>

      <button className="btn-ghost" onClick={() => {
        setStep(1)
        setPin("")
        setName("")
        setDob("")
        setGender("")
        setBloodType("")
        setMedications([])
        setAllergies([])
        setConditions([])
        setLabs([])
      }} style={{ marginTop: "16px", width: "100%" }}>
        Start New Record
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--teal)", marginBottom: "8px" }}>Patient Self-Upload</div>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "0 0 8px" }}>Build Your Health Record</h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>Enter your medical information once — share it instantly with any provider via QR code.</p>
      </div>

      <div className="glass-card" style={{ padding: "32px" }}>
        <ProgressBar />
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
        {step === 4 && <Step4 />}
        {step === 5 && <Step5 />}
      </div>
    </div>
  )
}
