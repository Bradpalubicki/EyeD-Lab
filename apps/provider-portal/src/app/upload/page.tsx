"use client"
import { useState } from "react"

type Medication = { name: string; dosage: string; indication: string }
type Allergy = { substance: string; reaction: string; severity: string }
type Condition = { name: string; status: string; onsetYear: string }
type Lab = { name: string; value: string; date: string; status: string }
type SurgicalHistory = { procedure: string; year: string; outcome: string }
type Immunization = { vaccine: string; date: string }

const STEP_LABELS = ["Demographics", "Medications", "Allergies", "Conditions & Labs", "Vitals", "History", "Social", "Your PIN"]
const TOTAL_STEPS = 8

// ── Hoisted to module level — prevents remount on every state change ──────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        {STEP_LABELS.map((label, i) => (
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
}

interface Step1Props {
  name: string; setName: (v: string) => void
  dob: string; setDob: (v: string) => void
  gender: string; setGender: (v: string) => void
  bloodType: string; setBloodType: (v: string) => void
  height: string; setHeight: (v: string) => void
  onNext: () => void
}
function Step1({ name, setName, dob, setDob, gender, setGender, bloodType, setBloodType, height, setHeight, onNext }: Step1Props) {
  return (
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
        <div>
          <label className="field-label">Height</label>
          <input className="field-input" value={height} onChange={e => setHeight(e.target.value)} placeholder={`e.g. 5'10"`} />
        </div>
      </div>
      <button className="btn-primary" onClick={onNext} disabled={!name || !dob || !gender} style={{ width: "100%", marginTop: "8px" }}>Continue →</button>
    </div>
  )
}

interface Step2Props {
  medications: Medication[]
  setMedications: (v: Medication[]) => void
  newMed: Medication
  setNewMed: (v: Medication) => void
  onBack: () => void
  onNext: () => void
}
function Step2({ medications, setMedications, newMed, setNewMed, onBack, onNext }: Step2Props) {
  return (
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
        <button className="btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={onNext} style={{ flex: 1 }}>Continue →</button>
      </div>
    </div>
  )
}

interface Step3Props {
  allergies: Allergy[]
  setAllergies: (v: Allergy[]) => void
  newAllergy: Allergy
  setNewAllergy: (v: Allergy) => void
  onBack: () => void
  onNext: () => void
}
function Step3({ allergies, setAllergies, newAllergy, setNewAllergy, onBack, onNext }: Step3Props) {
  return (
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
        <button className="btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={onNext} style={{ flex: 1 }}>Continue →</button>
      </div>
    </div>
  )
}

interface Step4Props {
  conditions: Condition[]
  setConditions: (v: Condition[]) => void
  newCondition: Condition
  setNewCondition: (v: Condition) => void
  labs: Lab[]
  setLabs: (v: Lab[]) => void
  newLab: Lab
  setNewLab: (v: Lab) => void
  onBack: () => void
  onNext: () => void
}
function Step4({ conditions, setConditions, newCondition, setNewCondition, labs, setLabs, newLab, setNewLab, onBack, onNext }: Step4Props) {
  return (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px", letterSpacing: "-0.01em" }}>Medical History & Labs</h2>
      <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>Active conditions and any recent lab results you have.</p>

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
        <button className="btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={onNext} style={{ flex: 1 }}>Continue →</button>
      </div>
    </div>
  )
}

interface Step5Props {
  weight: string; setWeight: (v: string) => void
  temperature: string; setTemperature: (v: string) => void
  bpSystolic: string; setBpSystolic: (v: string) => void
  bpDiastolic: string; setBpDiastolic: (v: string) => void
  heartRate: string; setHeartRate: (v: string) => void
  o2Sat: string; setO2Sat: (v: string) => void
  respRate: string; setRespRate: (v: string) => void
  onBack: () => void
  onNext: () => void
}
function Step5({ weight, setWeight, temperature, setTemperature, bpSystolic, setBpSystolic, bpDiastolic, setBpDiastolic, heartRate, setHeartRate, o2Sat, setO2Sat, respRate, setRespRate, onBack, onNext }: Step5Props) {
  return (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px", letterSpacing: "-0.01em" }}>Vital Signs</h2>
      <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>Enter your most recent vital measurements. All fields are optional.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div>
          <label className="field-label">Weight</label>
          <input className="field-input" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 180 lbs" />
        </div>
        <div>
          <label className="field-label">Temperature</label>
          <input className="field-input" value={temperature} onChange={e => setTemperature(e.target.value)} placeholder="e.g. 98.6°F" />
        </div>
        <div>
          <label className="field-label">Blood Pressure — Systolic</label>
          <input className="field-input" value={bpSystolic} onChange={e => setBpSystolic(e.target.value)} placeholder="e.g. 120" />
        </div>
        <div>
          <label className="field-label">Blood Pressure — Diastolic</label>
          <input className="field-input" value={bpDiastolic} onChange={e => setBpDiastolic(e.target.value)} placeholder="e.g. 80" />
        </div>
        <div>
          <label className="field-label">Heart Rate (bpm)</label>
          <input className="field-input" value={heartRate} onChange={e => setHeartRate(e.target.value)} placeholder="e.g. 72" />
        </div>
        <div>
          <label className="field-label">O₂ Saturation</label>
          <input className="field-input" value={o2Sat} onChange={e => setO2Sat(e.target.value)} placeholder="e.g. 98%" />
        </div>
        <div>
          <label className="field-label">Respiratory Rate (breaths/min)</label>
          <input className="field-input" value={respRate} onChange={e => setRespRate(e.target.value)} placeholder="e.g. 16" />
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button className="btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={onNext} style={{ flex: 1 }}>Continue →</button>
      </div>
    </div>
  )
}

interface Step6Props {
  surgeries: SurgicalHistory[]
  setSurgeries: (v: SurgicalHistory[]) => void
  newSurgery: SurgicalHistory
  setNewSurgery: (v: SurgicalHistory) => void
  immunizations: Immunization[]
  setImmunizations: (v: Immunization[]) => void
  newImmunization: Immunization
  setNewImmunization: (v: Immunization) => void
  onBack: () => void
  onNext: () => void
}
function Step6({ surgeries, setSurgeries, newSurgery, setNewSurgery, immunizations, setImmunizations, newImmunization, setNewImmunization, onBack, onNext }: Step6Props) {
  return (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px", letterSpacing: "-0.01em" }}>Surgical History & Immunizations</h2>
      <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>Past surgeries and your current vaccine history.</p>

      <div className="section-label">Surgical History</div>
      {surgeries.map((s, i) => (
        <div key={i} className="glass-card" style={{ padding: "12px 16px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{s.procedure}</span>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{s.year}</span>
            {s.outcome && <span className="pill pill-active">{s.outcome}</span>}
          </div>
          <button onClick={() => setSurgeries(surgeries.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px", padding: "4px", lineHeight: 1 }}>×</button>
        </div>
      ))}
      <div className="glass-card" style={{ padding: "16px", marginBottom: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr", gap: "10px", marginBottom: "10px" }}>
          <div>
            <label className="field-label">Procedure</label>
            <input className="field-input" placeholder="e.g. Appendectomy" value={newSurgery.procedure} onChange={e => setNewSurgery({...newSurgery, procedure: e.target.value})} />
          </div>
          <div>
            <label className="field-label">Year</label>
            <input className="field-input" placeholder="e.g. 2015" value={newSurgery.year} onChange={e => setNewSurgery({...newSurgery, year: e.target.value})} />
          </div>
          <div>
            <label className="field-label">Outcome</label>
            <input className="field-input" placeholder="e.g. Uncomplicated" value={newSurgery.outcome} onChange={e => setNewSurgery({...newSurgery, outcome: e.target.value})} />
          </div>
        </div>
        <button className="btn-ghost" onClick={() => {
          if (newSurgery.procedure) {
            setSurgeries([...surgeries, newSurgery])
            setNewSurgery({ procedure: "", year: "", outcome: "" })
          }
        }} style={{ width: "100%" }}>+ Add Surgery</button>
      </div>

      <div className="section-label">Immunizations</div>
      {immunizations.map((im, i) => (
        <div key={i} className="glass-card" style={{ padding: "12px 16px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", color: "var(--teal)" }}>✓</span>
            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{im.vaccine}</span>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{im.date}</span>
          </div>
          <button onClick={() => setImmunizations(immunizations.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px", padding: "4px", lineHeight: 1 }}>×</button>
        </div>
      ))}
      <div className="glass-card" style={{ padding: "16px", marginBottom: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px", marginBottom: "10px" }}>
          <div>
            <label className="field-label">Vaccine</label>
            <input className="field-input" placeholder="e.g. Influenza" value={newImmunization.vaccine} onChange={e => setNewImmunization({...newImmunization, vaccine: e.target.value})} />
          </div>
          <div>
            <label className="field-label">Date</label>
            <input className="field-input" type="date" value={newImmunization.date} onChange={e => setNewImmunization({...newImmunization, date: e.target.value})} />
          </div>
        </div>
        <button className="btn-ghost" onClick={() => {
          if (newImmunization.vaccine) {
            setImmunizations([...immunizations, newImmunization])
            setNewImmunization({ vaccine: "", date: "" })
          }
        }} style={{ width: "100%" }}>+ Add Immunization</button>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button className="btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={onNext} style={{ flex: 1 }}>Continue →</button>
      </div>
    </div>
  )
}

interface Step7Props {
  smokingStatus: string; setSmokingStatus: (v: string) => void
  alcoholPerWeek: string; setAlcoholPerWeek: (v: string) => void
  occupation: string; setOccupation: (v: string) => void
  ecName: string; setEcName: (v: string) => void
  ecRelationship: string; setEcRelationship: (v: string) => void
  ecPhone: string; setEcPhone: (v: string) => void
  onBack: () => void
  onGenerate: () => void
}
function Step7({ smokingStatus, setSmokingStatus, alcoholPerWeek, setAlcoholPerWeek, occupation, setOccupation, ecName, setEcName, ecRelationship, setEcRelationship, ecPhone, setEcPhone, onBack, onGenerate }: Step7Props) {
  return (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px", letterSpacing: "-0.01em" }}>Social History & Emergency Contact</h2>
      <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>Lifestyle context and who to contact in an emergency.</p>

      <div className="section-label">Social History</div>
      <div className="glass-card" style={{ padding: "16px", marginBottom: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          <div>
            <label className="field-label">Smoking Status</label>
            <select className="field-input" value={smokingStatus} onChange={e => setSmokingStatus(e.target.value)}>
              <option value="never">Never smoked</option>
              <option value="former">Former smoker</option>
              <option value="current">Current smoker</option>
            </select>
          </div>
          <div>
            <label className="field-label">Alcohol (drinks/week)</label>
            <input className="field-input" value={alcoholPerWeek} onChange={e => setAlcoholPerWeek(e.target.value)} placeholder="e.g. 3" />
          </div>
          <div>
            <label className="field-label">Occupation</label>
            <input className="field-input" value={occupation} onChange={e => setOccupation(e.target.value)} placeholder="e.g. Nurse" />
          </div>
        </div>
      </div>

      <div className="section-label">Emergency Contact</div>
      <div className="glass-card" style={{ padding: "16px", marginBottom: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          <div>
            <label className="field-label">Full Name</label>
            <input className="field-input" value={ecName} onChange={e => setEcName(e.target.value)} placeholder="e.g. Jane Smith" />
          </div>
          <div>
            <label className="field-label">Relationship</label>
            <input className="field-input" value={ecRelationship} onChange={e => setEcRelationship(e.target.value)} placeholder="e.g. Spouse" />
          </div>
          <div>
            <label className="field-label">Phone Number</label>
            <input className="field-input" value={ecPhone} onChange={e => setEcPhone(e.target.value)} placeholder="e.g. (555) 123-4567" />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button className="btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={onGenerate} style={{ flex: 1 }}>Generate My PIN →</button>
      </div>
    </div>
  )
}

interface Step8Props {
  pin: string
  name: string
  dob: string
  medications: Medication[]
  allergies: Allergy[]
  conditions: Condition[]
  labs: Lab[]
  surgeries: SurgicalHistory[]
  immunizations: Immunization[]
  ecName: string
  onReset: () => void
}
function Step8({ pin, name, dob, medications, allergies, conditions, labs, surgeries, immunizations, ecName, onReset }: Step8Props) {
  return (
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
            ["Medications", medications.length > 0 ? `${medications.length} recorded` : "None entered"],
            ["Allergies", allergies.length > 0 ? `${allergies.length} recorded` : "None entered"],
            ["Conditions", conditions.length > 0 ? `${conditions.length} recorded` : "None entered"],
            ["Lab Results", labs.length > 0 ? `${labs.length} recorded` : "None entered"],
            ["Surgeries", surgeries.length > 0 ? `${surgeries.length} recorded` : "None entered"],
            ["Immunizations", immunizations.length > 0 ? `${immunizations.length} recorded` : "None entered"],
            ["Emergency Contact", ecName || "Not provided"],
          ] as [string, string][]).map(([label, value]) => (
            <div key={label} className="data-row" style={{ padding: "8px 0" }}>
              <span className="data-row-label">{label}</span>
              <span className="data-row-value">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.6" }}>
        In production, this record is encrypted and stored in EyeD&apos;s HIPAA-compliant database. The PIN is single-use and expires after 24 hours. Demo mode — no data was stored.
      </p>

      <button className="btn-ghost" onClick={onReset} style={{ marginTop: "16px", width: "100%" }}>
        Start New Record
      </button>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function UploadPage() {
  const [step, setStep] = useState(1)

  const [name, setName] = useState("")
  const [dob, setDob] = useState("")
  const [gender, setGender] = useState("")
  const [bloodType, setBloodType] = useState("")
  const [height, setHeight] = useState("")

  const [medications, setMedications] = useState<Medication[]>([])
  const [newMed, setNewMed] = useState<Medication>({ name: "", dosage: "", indication: "" })

  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [newAllergy, setNewAllergy] = useState<Allergy>({ substance: "", reaction: "", severity: "moderate" })

  const [conditions, setConditions] = useState<Condition[]>([])
  const [newCondition, setNewCondition] = useState<Condition>({ name: "", status: "active", onsetYear: "" })

  const [labs, setLabs] = useState<Lab[]>([])
  const [newLab, setNewLab] = useState<Lab>({ name: "", value: "", date: "", status: "normal" })

  const [weight, setWeight] = useState("")
  const [temperature, setTemperature] = useState("")
  const [bpSystolic, setBpSystolic] = useState("")
  const [bpDiastolic, setBpDiastolic] = useState("")
  const [heartRate, setHeartRate] = useState("")
  const [o2Sat, setO2Sat] = useState("")
  const [respRate, setRespRate] = useState("")

  const [surgeries, setSurgeries] = useState<SurgicalHistory[]>([])
  const [newSurgery, setNewSurgery] = useState<SurgicalHistory>({ procedure: "", year: "", outcome: "" })
  const [immunizations, setImmunizations] = useState<Immunization[]>([])
  const [newImmunization, setNewImmunization] = useState<Immunization>({ vaccine: "", date: "" })

  const [smokingStatus, setSmokingStatus] = useState("never")
  const [alcoholPerWeek, setAlcoholPerWeek] = useState("")
  const [occupation, setOccupation] = useState("")
  const [ecName, setEcName] = useState("")
  const [ecRelationship, setEcRelationship] = useState("")
  const [ecPhone, setEcPhone] = useState("")

  const [pin, setPin] = useState("")

  function generatePin() {
    const generated = String(Math.floor(100000 + Math.random() * 900000))
    setPin(generated)
    setStep(8)
  }

  function handleReset() {
    setStep(1)
    setPin("")
    setName("")
    setDob("")
    setGender("")
    setBloodType("")
    setHeight("")
    setMedications([])
    setAllergies([])
    setConditions([])
    setLabs([])
    setWeight("")
    setTemperature("")
    setBpSystolic("")
    setBpDiastolic("")
    setHeartRate("")
    setO2Sat("")
    setRespRate("")
    setSurgeries([])
    setImmunizations([])
    setSmokingStatus("never")
    setAlcoholPerWeek("")
    setOccupation("")
    setEcName("")
    setEcRelationship("")
    setEcPhone("")
  }

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--teal)", marginBottom: "8px" }}>Patient Self-Upload</div>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "0 0 8px" }}>Build Your Health Record</h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>Enter your medical information once — share it instantly with any provider via QR code.</p>
      </div>

      <div className="glass-card" style={{ padding: "32px" }}>
        <ProgressBar step={step} />
        {step === 1 && (
          <Step1
            name={name} setName={setName}
            dob={dob} setDob={setDob}
            gender={gender} setGender={setGender}
            bloodType={bloodType} setBloodType={setBloodType}
            height={height} setHeight={setHeight}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <Step2
            medications={medications} setMedications={setMedications}
            newMed={newMed} setNewMed={setNewMed}
            onBack={() => setStep(1)} onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <Step3
            allergies={allergies} setAllergies={setAllergies}
            newAllergy={newAllergy} setNewAllergy={setNewAllergy}
            onBack={() => setStep(2)} onNext={() => setStep(4)}
          />
        )}
        {step === 4 && (
          <Step4
            conditions={conditions} setConditions={setConditions}
            newCondition={newCondition} setNewCondition={setNewCondition}
            labs={labs} setLabs={setLabs}
            newLab={newLab} setNewLab={setNewLab}
            onBack={() => setStep(3)} onNext={() => setStep(5)}
          />
        )}
        {step === 5 && (
          <Step5
            weight={weight} setWeight={setWeight}
            temperature={temperature} setTemperature={setTemperature}
            bpSystolic={bpSystolic} setBpSystolic={setBpSystolic}
            bpDiastolic={bpDiastolic} setBpDiastolic={setBpDiastolic}
            heartRate={heartRate} setHeartRate={setHeartRate}
            o2Sat={o2Sat} setO2Sat={setO2Sat}
            respRate={respRate} setRespRate={setRespRate}
            onBack={() => setStep(4)} onNext={() => setStep(6)}
          />
        )}
        {step === 6 && (
          <Step6
            surgeries={surgeries} setSurgeries={setSurgeries}
            newSurgery={newSurgery} setNewSurgery={setNewSurgery}
            immunizations={immunizations} setImmunizations={setImmunizations}
            newImmunization={newImmunization} setNewImmunization={setNewImmunization}
            onBack={() => setStep(5)} onNext={() => setStep(7)}
          />
        )}
        {step === 7 && (
          <Step7
            smokingStatus={smokingStatus} setSmokingStatus={setSmokingStatus}
            alcoholPerWeek={alcoholPerWeek} setAlcoholPerWeek={setAlcoholPerWeek}
            occupation={occupation} setOccupation={setOccupation}
            ecName={ecName} setEcName={setEcName}
            ecRelationship={ecRelationship} setEcRelationship={setEcRelationship}
            ecPhone={ecPhone} setEcPhone={setEcPhone}
            onBack={() => setStep(6)} onGenerate={generatePin}
          />
        )}
        {step === 8 && (
          <Step8
            pin={pin} name={name} dob={dob}
            medications={medications} allergies={allergies}
            conditions={conditions} labs={labs}
            surgeries={surgeries} immunizations={immunizations}
            ecName={ecName}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  )
}
