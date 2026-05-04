'use client'
import { useState, useCallback } from 'react'

// ── CONSTANTS (from original model) ──
const PARTICLE_COST   = 2      // $ per patient/mo (Particle Health aggregator)
const PROVIDER_BASE   = 250    // $ flat monthly platform base
const CPT_SETUP       = 20     // CPT 99453 one-time
const CPT_DEVICE      = 47     // CPT 99454 /month
const CPT_MGMT        = 48     // CPT 99457 /month

// ── FULL BILLING CONSTANTS (CCM / BHI / TCM) ──
const CCM_RATE        = 62     // $ avg CCM reimbursement per patient/mo
const BHI_RATE        = 57     // $ BHI per patient/mo
const TCM_RATE        = 175    // $ avg TCM per transition event
const PRIOR_AUTH_SAVE = 35     // $ prior auth facilitation savings per patient

const TIERS = [
  { id: 'a', name: 'Starter',  pricePerPt: 2,  desc: '$2 / patient' },
  { id: 'b', name: 'Growth',   pricePerPt: 5,  desc: '$5 / patient' },
  { id: 'c', name: 'Pro',      pricePerPt: 10, desc: '$10 / patient' },
]

function fmt(n: number, digits = 0) {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: digits })
}

function fmtPct(n: number) {
  return n.toFixed(0) + '%'
}

export default function RoiCalculator() {
  const [tier, setTier]           = useState<'a'|'b'|'c'>('b')
  const [patients, setPatients]   = useState(200)
  const [staffRate, setStaffRate] = useState(22)
  const [rpmPct, setRpmPct]       = useState(30)
  const [recurringPct, setRecurringPct] = useState(60)
  const [showOurPanel, setShowOurPanel] = useState(false)
  const [fullBilling, setFullBilling]   = useState(false)

  // Full billing sliders
  const [ccmPct, setCcmPct]   = useState(37)  // % of patients eligible for CCM
  const [bhiPct, setBhiPct]   = useState(15)  // % of patients eligible for BHI
  const [tcmPct, setTcmPct]   = useState(10)  // % of patients with TCM events

  const calc = useCallback(() => {
    const t = TIERS.find(x => x.id === tier)!
    const rpmPatients       = Math.round(patients * rpmPct / 100)
    const recurringPatients = Math.round(patients * recurringPct / 100)

    const platformCost  = PROVIDER_BASE + (patients * t.pricePerPt)
    const rpmSetup      = rpmPatients * CPT_SETUP           // one-time, spread over 12mo
    const rpmMonthly    = rpmPatients * (CPT_DEVICE + CPT_MGMT)
    const rpmRevenue    = rpmMonthly + rpmSetup / 12

    // Staff savings: 6 min/patient @ hourly rate
    const staffSavings  = patients * (6 / 60) * staffRate

    // Full billing streams
    const ccmPatients   = Math.round(patients * ccmPct / 100)
    const bhiPatients   = Math.round(patients * bhiPct / 100)
    const tcmEvents     = Math.round(patients * tcmPct / 100)
    const ccmRevenue    = ccmPatients * CCM_RATE
    const bhiRevenue    = bhiPatients * BHI_RATE
    const tcmRevenue    = tcmEvents * TCM_RATE
    const priorAuthSave = patients * PRIOR_AUTH_SAVE

    const baseNet       = rpmRevenue + staffSavings - platformCost
    const fullNet       = rpmRevenue + ccmRevenue + bhiRevenue + tcmRevenue + priorAuthSave + staffSavings - platformCost
    const netMonthly    = fullBilling ? fullNet : baseNet
    const roi           = platformCost > 0 ? (netMonthly / platformCost) * 100 : 0
    const breakeven     = netMonthly > 0 ? (platformCost / (netMonthly / 30)).toFixed(1) : '—'

    // Annual
    const annualRevenue = (netMonthly + platformCost) * 12
    const annualCost    = platformCost * 12
    const annualNet     = netMonthly * 12

    // Our economics (NuStack)
    const particleCostTotal = patients * PARTICLE_COST
    const ourRevenue        = patients * t.pricePerPt + PROVIDER_BASE
    const ourGross          = ourRevenue - particleCostTotal
    const ourMargin         = ourRevenue > 0 ? (ourGross / ourRevenue) * 100 : 0

    // Volume tier table
    const volumeTiers = [50, 100, 200, 500, 1000].map(v => {
      const pCost  = PROVIDER_BASE + v * t.pricePerPt
      const rpmPts = Math.round(v * rpmPct / 100)
      const rpmR   = rpmPts * (CPT_DEVICE + CPT_MGMT) + (rpmPts * CPT_SETUP / 12)
      const staff  = v * (6 / 60) * staffRate
      const net    = rpmR + staff - pCost
      const roiV   = pCost > 0 ? (net / pCost) * 100 : 0
      return { v, pCost, net, roiV }
    })

    return {
      rpmPatients, recurringPatients,
      platformCost, rpmRevenue, staffSavings,
      netMonthly, roi, breakeven,
      annualRevenue, annualCost, annualNet,
      ourRevenue, particleCostTotal, ourGross, ourMargin,
      volumeTiers,
      ccmPatients, bhiPatients, tcmEvents,
      ccmRevenue, bhiRevenue, tcmRevenue, priorAuthSave,
    }
  }, [tier, patients, staffRate, rpmPct, recurringPct, fullBilling, ccmPct, bhiPct, tcmPct])

  const r = calc()
  const activeTier = TIERS.find(x => x.id === tier)!

  return (
    <div className="calc-wrapper">
      {/* Header */}
      <div className="calc-header">
        <h2>Urgent Care ROI Calculator</h2>
        <p>Adjust the sliders below — all figures update in real time.</p>
      </div>

      <div className="calc-body">

        {/* VIEW TOGGLE */}
        <div style={{display: 'flex', gap: 8, marginBottom: 20, background: 'var(--bg-alt)', borderRadius: 'var(--r)', padding: 4}}>
          <button
            onClick={() => setFullBilling(false)}
            style={{
              flex: 1, padding: '10px 16px', borderRadius: 'calc(var(--r) - 2px)', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all .15s',
              background: !fullBilling ? 'var(--bg-card)' : 'transparent',
              color: !fullBilling ? 'var(--teal)' : 'var(--ink-muted)',
              boxShadow: !fullBilling ? 'var(--shadow)' : 'none',
            }}
          >
            RPM Only
          </button>
          <button
            onClick={() => setFullBilling(true)}
            style={{
              flex: 1, padding: '10px 16px', borderRadius: 'calc(var(--r) - 2px)', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all .15s',
              background: fullBilling ? 'var(--teal)' : 'transparent',
              color: fullBilling ? '#fff' : 'var(--ink-muted)',
              boxShadow: fullBilling ? 'var(--shadow-teal)' : 'none',
            }}
          >
            Full Billing Picture (CCM + BHI + TCM)
          </button>
        </div>

        {fullBilling && (
          <div style={{background: 'var(--teal-pale)', border: '1px solid var(--teal-lt)', borderRadius: 'var(--r)', padding: '16px 20px', marginBottom: 20, fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6}}>
            <strong style={{color: 'var(--teal)'}}>Full billing view applies to eligible patients at practices that offer these services.</strong>{' '}
            CCM, BHI, and TCM require clinical programs to already be in place. Your billing team determines what codes apply.
            Adjust the sliders below to match your eligible patient population.
          </div>
        )}

        {/* TIER BUTTONS */}
        <div className="tier-btns">
          {TIERS.map(t => (
            <button
              key={t.id}
              className={'tier-btn' + (tier === t.id ? ' active' : '')}
              onClick={() => setTier(t.id as 'a'|'b'|'c')}
            >
              <span className="tier-btn-name">{t.name}</span>
              <span className="tier-btn-price">{t.desc}/mo</span>
            </button>
          ))}
        </div>

        {/* ASSUMPTION STRIP */}
        <div className="assumption-strip">
          <span className="assumption-tag">Particle Health: $2/patient/mo</span>
          <span className="assumption-tag">Platform base: $250/mo</span>
          <span className="assumption-tag">CPT 99453: $20 one-time</span>
          <span className="assumption-tag">CPT 99454: $47/mo</span>
          <span className="assumption-tag">CPT 99457: $48/mo</span>
          <span className="assumption-tag">Staff: 6 min saved/patient</span>
          <span className="assumption-tag">Medicare fee schedule (national avg)</span>
        </div>

        {/* CONTROLS */}
        <div className="controls-grid">
          <div className="control-group">
            <label id="lbl-patients" className="control-label" htmlFor="slider-patients">
              Monthly patient volume
              <span>{patients.toLocaleString()} patients</span>
            </label>
            <input
              id="slider-patients"
              type="range" min={10} max={2000} step={10}
              value={patients}
              onChange={e => setPatients(Number(e.target.value))}
              className="control-slider"
              aria-labelledby="lbl-patients"
            />
          </div>
          <div className="control-group">
            <label id="lbl-staff" className="control-label" htmlFor="slider-staff">
              Staff hourly rate
              <span>{fmt(staffRate)}/hr</span>
            </label>
            <input
              id="slider-staff"
              type="range" min={12} max={60} step={1}
              value={staffRate}
              onChange={e => setStaffRate(Number(e.target.value))}
              className="control-slider"
              aria-labelledby="lbl-staff"
            />
          </div>
          <div className="control-group">
            <label id="lbl-rpm" className="control-label" htmlFor="slider-rpm">
              RPM enrollment rate
              <span>{fmtPct(rpmPct)} ({r.rpmPatients} patients)</span>
            </label>
            <input
              id="slider-rpm"
              type="range" min={5} max={80} step={5}
              value={rpmPct}
              onChange={e => setRpmPct(Number(e.target.value))}
              className="control-slider"
              aria-labelledby="lbl-rpm"
            />
          </div>
          <div className="control-group">
            <label id="lbl-recurring" className="control-label" htmlFor="slider-recurring">
              Returning patients (recurring)
              <span>{fmtPct(recurringPct)} ({r.recurringPatients} patients)</span>
            </label>
            <input
              id="slider-recurring"
              type="range" min={10} max={90} step={5}
              value={recurringPct}
              onChange={e => setRecurringPct(Number(e.target.value))}
              className="control-slider"
              aria-labelledby="lbl-recurring"
            />
          </div>
        </div>

        {/* FULL BILLING SLIDERS */}
        {fullBilling && (
          <div style={{background: 'var(--bg-alt)', borderRadius: 'var(--r)', padding: '20px 24px', marginBottom: 24}}>
            <div style={{fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: 16}}>
              Additional billing streams — adjust to your patient mix
            </div>
            <div className="controls-grid">
              <div className="control-group">
                <label id="lbl-ccm" className="control-label" htmlFor="slider-ccm">
                  CCM-eligible patients
                  <span>{ccmPct}% ({r.ccmPatients} patients × {fmt(CCM_RATE)}/mo = {fmt(r.ccmRevenue)})</span>
                </label>
                <input id="slider-ccm" type="range" min={0} max={80} step={5} value={ccmPct} onChange={e => setCcmPct(Number(e.target.value))} className="control-slider" aria-labelledby="lbl-ccm" />
              </div>
              <div className="control-group">
                <label id="lbl-bhi" className="control-label" htmlFor="slider-bhi">
                  BHI-eligible patients
                  <span>{bhiPct}% ({r.bhiPatients} patients × {fmt(BHI_RATE)}/mo = {fmt(r.bhiRevenue)})</span>
                </label>
                <input id="slider-bhi" type="range" min={0} max={50} step={5} value={bhiPct} onChange={e => setBhiPct(Number(e.target.value))} className="control-slider" aria-labelledby="lbl-bhi" />
              </div>
              <div className="control-group">
                <label id="lbl-tcm" className="control-label" htmlFor="slider-tcm">
                  Post-discharge TCM events
                  <span>{tcmPct}% ({r.tcmEvents} events × {fmt(TCM_RATE)} = {fmt(r.tcmRevenue)})</span>
                </label>
                <input id="slider-tcm" type="range" min={0} max={50} step={5} value={tcmPct} onChange={e => setTcmPct(Number(e.target.value))} className="control-slider" aria-labelledby="lbl-tcm" />
              </div>
              <div className="control-group">
                <label className="control-label">
                  Prior auth facilitation savings
                  <span>{patients} patients × {fmt(PRIOR_AUTH_SAVE)}/pt = {fmt(r.priorAuthSave)}</span>
                </label>
                <div style={{height: 6, background: 'var(--teal-lt)', borderRadius: 3, marginTop: 8}} />
              </div>
            </div>
          </div>
        )}

        {/* BIG PANEL */}
        <div className="big-panel">
          <div className="big-stat">
            <div className="big-stat-label">Net Monthly Gain</div>
            <div className="big-stat-val" style={r.netMonthly < 0 ? {color: 'var(--red)'} : {}}>
              {fmt(r.netMonthly)}
            </div>
            <div className="big-stat-sub">After platform cost</div>
          </div>
          <div className="big-divider" />
          <div className="big-stat">
            <div className="big-stat-label">Annual Net Revenue</div>
            <div className="big-stat-val">{fmt(r.annualNet)}</div>
            <div className="big-stat-sub">12-month projection</div>
          </div>
          <div className="big-divider" />
          <div className="big-stat">
            <div className="big-stat-label">Return on Investment</div>
            <div className="big-stat-val">{fmtPct(r.roi)}</div>
            <div className="big-stat-sub">Monthly ROI on platform cost</div>
          </div>
        </div>

        {/* RESULTS GRID */}
        <div className="results-grid">
          <div className="result-card">
            <div className="result-icon">💊</div>
            <div className="result-title">Platform Cost</div>
            <div className="result-sub">
              {fmt(PROVIDER_BASE)} base + {fmt(activeTier.pricePerPt)}/pt × {patients.toLocaleString()} patients
            </div>
            <div className="result-val red">{fmt(r.platformCost)}</div>
          </div>
          <div className="result-card">
            <div className="result-icon">📈</div>
            <div className="result-title">RPM Revenue</div>
            <div className="result-sub">
              {r.rpmPatients} patients × {fmt(CPT_DEVICE + CPT_MGMT)}/mo + setup amortized
            </div>
            <div className="result-val">{fmt(r.rpmRevenue)}</div>
          </div>
          <div className="result-card">
            <div className="result-icon">⏱</div>
            <div className="result-title">Staff Savings</div>
            <div className="result-sub">
              6 min/patient × {patients} × {fmt(staffRate)}/hr
            </div>
            <div className="result-val">{fmt(r.staffSavings)}</div>
          </div>
          <div className="result-card">
            <div className="result-icon">📅</div>
            <div className="result-title">Breakeven</div>
            <div className="result-sub">
              Days until platform cost is recovered from new revenue
            </div>
            <div className="result-val amber">
              {r.breakeven === '—' ? '—' : r.breakeven + ' days'}
            </div>
          </div>
        </div>

        {/* VOLUME TIER TABLE */}
        <div style={{marginBottom: 32}}>
          <div style={{fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 12}}>
            Monthly net by patient volume — {activeTier.name} tier
          </div>
          <table className="tier-table" style={{width: '100%', borderCollapse: 'collapse', fontSize: 13}}>
            <thead>
              <tr>
                <th style={{fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', textAlign: 'left', padding: '10px 16px', borderBottom: '2px solid var(--border)'}}>Patient Volume</th>
                <th style={{fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', textAlign: 'right', padding: '10px 16px', borderBottom: '2px solid var(--border)'}}>Platform Cost</th>
                <th style={{fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', textAlign: 'right', padding: '10px 16px', borderBottom: '2px solid var(--border)'}}>Net Monthly</th>
                <th style={{fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', textAlign: 'right', padding: '10px 16px', borderBottom: '2px solid var(--border)'}}>ROI</th>
              </tr>
            </thead>
            <tbody>
              {r.volumeTiers.map(row => {
                const isActive = row.v === patients
                return (
                  <tr key={row.v} style={isActive ? {background: 'var(--teal-pale)'} : {}}>
                    <td style={{padding: '14px 16px', borderBottom: '1px solid var(--border)', fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--teal)' : 'var(--ink)'}}>
                      {row.v.toLocaleString()} patients
                    </td>
                    <td style={{padding: '14px 16px', borderBottom: '1px solid var(--border)', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--red)'}}>
                      {fmt(row.pCost)}
                    </td>
                    <td style={{padding: '14px 16px', borderBottom: '1px solid var(--border)', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: isActive ? 600 : 400, color: row.net >= 0 ? 'var(--teal)' : 'var(--red)'}}>
                      {fmt(row.net)}
                    </td>
                    <td style={{padding: '14px 16px', borderBottom: '1px solid var(--border)', textAlign: 'right'}}>
                      <span style={{display: 'inline-block', background: row.roiV >= 200 ? 'var(--teal-lt)' : 'var(--bg-alt)', color: row.roiV >= 200 ? 'var(--teal)' : 'var(--ink-muted)', fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 7px', borderRadius: 20, letterSpacing: '.06em'}}>
                        {fmtPct(row.roiV)} ROI
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* OUR ECONOMICS */}
        <div className="our-panel">
          <div className="our-panel-header">
            <div>
              <div className="our-panel-title">Our Economics</div>
              <div className="our-panel-sub">MyPulseScan P&amp;L at your current settings</div>
            </div>
            <button className="our-toggle-btn" onClick={() => setShowOurPanel(!showOurPanel)}>
              {showOurPanel ? 'Hide' : 'Show'}
            </button>
          </div>
          {showOurPanel && (
            <div className="our-metrics">
              <div>
                <div className="our-metric-label">Our Revenue</div>
                <div className="our-metric-val white">{fmt(r.ourRevenue)}</div>
              </div>
              <div>
                <div className="our-metric-label">Particle Cost</div>
                <div className="our-metric-val red">{fmt(r.particleCostTotal)}</div>
              </div>
              <div>
                <div className="our-metric-label">Gross Profit</div>
                <div className="our-metric-val">{fmt(r.ourGross)}</div>
              </div>
              <div>
                <div className="our-metric-label">Gross Margin</div>
                <div className="our-metric-val">{fmtPct(r.ourMargin)}</div>
              </div>
            </div>
          )}
        </div>

        <div className="disclaimer">
          <strong>Disclaimer:</strong> All figures are estimates based on national Medicare fee schedules and industry-average assumptions.
          Actual reimbursement varies by payer, patient eligibility, and billing codes used. Staff time savings are modeled at 6 minutes per patient.
          Platform cost assumes {activeTier.name} tier at {fmt(activeTier.pricePerPt)}/patient/month + {fmt(PROVIDER_BASE)}/month base.
          {fullBilling && ' CCM, BHI, and TCM figures apply to eligible patients at practices that already offer these services. Your billing team determines applicable codes. MyPulseScan retrieves the verified external record — your clinical team decides what to do with it.'}
          {' '}This calculator is for illustrative purposes only and does not constitute a guarantee of revenue or savings.
          Consult your billing department and legal counsel before implementing any new billing program.
        </div>
      </div>
    </div>
  )
}
