'use client'
import { useState, useCallback } from 'react'
import Link from 'next/link'

// ── CONSTANTS ──
const CPT_SETUP  = 20   // 99453 one-time
const CPT_DEVICE = 47   // 99454 /month
const CPT_MGMT   = 48   // 99457 /month
const PLAT_BASE  = 250
const PLAT_PER_PT = 5

function fmt(n: number) {
  return '$' + Math.round(Math.abs(n)).toLocaleString()
}
function fmtSigned(n: number) {
  return (n < 0 ? '-$' : '$') + Math.round(Math.abs(n)).toLocaleString()
}

// ── LIVE CALC ──
function LiveCalc() {
  const [pts,    setPts]    = useState(100)
  const [rpmPct, setRpmPct] = useState(50)
  const [recPct, setRecPct] = useState(40)

  const calc = useCallback(() => {
    const rpmPts  = Math.round(pts * rpmPct / 100)
    const recPts  = Math.round(rpmPts * recPct / 100)
    const newPts  = rpmPts - recPts

    const onetimeMo  = newPts  * CPT_SETUP
    const monitorMo  = recPts  * CPT_DEVICE
    const reviewMo   = recPts  * CPT_MGMT
    const platMo     = PLAT_BASE + pts * PLAT_PER_PT
    const totalMo    = onetimeMo + monitorMo + reviewMo
    const netMo      = totalMo - platMo
    const netAnnual  = netMo * 12
    const staffAnnual = Math.round((6 / 60) * pts * 22 * 12)
    const totalNet   = netAnnual + staffAnnual
    const roi        = platMo > 0 ? Math.round((netMo / platMo) * 100) : 0

    return { rpmPts, recPts, newPts, onetimeMo, monitorMo, reviewMo, platMo, totalMo, netMo, netAnnual, staffAnnual, totalNet, roi }
  }, [pts, rpmPct, recPct])

  const r = calc()

  return (
    <div style={{
      background: 'rgba(255,255,255,.04)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(13,107,110,.2)',
        borderBottom: '1px solid rgba(255,255,255,.08)',
        padding: '20px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{fontFamily: 'var(--bm)', fontWeight: 700, fontSize: 18, color: '#fff'}}>Run Your Numbers</div>
          <div style={{fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 2}}>Everything updates in real time</div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontSize: 10, color: '#5de8c0', letterSpacing: '.1em', textTransform: 'uppercase'}}>
          <span style={{width: 6, height: 6, borderRadius: '50%', background: '#5de8c0', display: 'inline-block', animation: 'pulse 2s infinite'}} />
          Live
        </div>
      </div>

      <div style={{padding: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32}}>
        {/* Inputs */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
          {[
            { label: 'Monthly patients', val: `${pts}`, min: 10, max: 500, step: 10, value: pts, set: setPts, display: pts.toLocaleString() },
            { label: '% Qualify for RPM', val: `${rpmPct}% (${r.rpmPts} patients)`, min: 10, max: 80, step: 5, value: rpmPct, set: setRpmPct, display: `${rpmPct}%` },
            { label: '% Recurring patients', val: `${recPct}% (${r.recPts} patients)`, min: 10, max: 90, step: 5, value: recPct, set: setRecPct, display: `${recPct}%` },
          ].map(f => (
            <div key={f.label}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10}}>
                <span style={{fontFamily: 'monospace', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)'}}>{f.label}</span>
                <span style={{fontFamily: 'var(--bm)', fontSize: 20, fontWeight: 700, color: '#5de8c0'}}>{f.display}</span>
              </div>
              <input
                type="range" min={f.min} max={f.max} step={f.step} value={f.value}
                onChange={e => f.set(Number(e.target.value))}
                style={{width: '100%', height: 4, borderRadius: 2, background: 'rgba(255,255,255,.15)', outline: 'none', cursor: 'pointer', accentColor: '#0D6B6E'}}
              />
            </div>
          ))}
        </div>

        {/* Results */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {[
            { label: '99453 — First-visit billings/mo', val: fmt(r.onetimeMo), color: 'rgba(255,255,255,.7)' },
            { label: '99454 — Monthly monitoring/mo', val: fmt(r.monitorMo), color: 'rgba(255,255,255,.7)' },
            { label: '99457 — Provider review/mo', val: fmt(r.reviewMo), color: 'rgba(255,255,255,.7)' },
            { label: 'Staff time recovered/yr (6 min/pt)', val: fmt(r.staffAnnual), color: 'rgba(255,255,255,.7)' },
            { label: 'MyPulseScan monthly cost', val: fmtSigned(-r.platMo), color: '#f08080' },
          ].map(row => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px', borderRadius: 6,
              background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.06)',
              fontSize: 13,
            }}>
              <span style={{color: 'rgba(255,255,255,.5)'}}>{row.label}</span>
              <span style={{fontFamily: 'monospace', fontWeight: 600, color: row.color}}>{row.val}</span>
            </div>
          ))}
          {/* Big result */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 18px', borderRadius: 8,
            background: 'linear-gradient(135deg, rgba(13,107,110,.4) 0%, rgba(13,107,110,.2) 100%)',
            border: '1px solid rgba(93,232,192,.2)',
            marginTop: 4,
          }}>
            <span style={{color: 'rgba(255,255,255,.7)', fontSize: 14}}>Net annual gain for your clinic</span>
            <span style={{fontFamily: 'var(--bm)', fontSize: 28, fontWeight: 900, color: '#5de8c0'}}>{fmt(r.totalNet)}</span>
          </div>
          <div style={{fontSize: 11, color: 'rgba(255,255,255,.25)', lineHeight: 1.6, marginTop: 4}}>
            Monthly ROI on platform cost: <strong style={{color: 'rgba(255,255,255,.4)'}}>{r.roi}%</strong>
          </div>
        </div>
      </div>

      <div style={{
        padding: '14px 28px',
        borderTop: '1px solid rgba(255,255,255,.06)',
        fontSize: 11, color: 'rgba(255,255,255,.25)', lineHeight: 1.65,
      }}>
        Based on 2025–2026 Medicare Physician Fee Schedule national averages. Actual reimbursement varies by payer, region, and eligibility. RPM billing requires a licensed NPI. Consult your billing department. Staff savings modeled at $22/hr, 6 min/patient.
      </div>
    </div>
  )
}

// ── MAIN PAGE ──
export default function BillingClient() {
  const [audience, setAudience] = useState<'urgent' | 'primary'>('urgent')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        :root {
          --bm: 'Playfair Display', Georgia, serif;
          --bs: 'DM Sans', sans-serif;
          --teal:      #0D6B6E;
          --teal-mid:  #0e8285;
          --teal-lt:   #5de8c0;
          --teal-pale: rgba(13,107,110,.15);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        body.billing-page {
          background: #060c0d;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          line-height: 1.7;
          -webkit-font-smoothing: antialiased;
        }

        .b-wrap { max-width: 960px; margin: 0 auto; padding: 0 48px; }

        /* NAV */
        .b-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(6,12,13,.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,.08);
          height: 60px;
          display: flex; align-items: center; padding: 0 48px;
          justify-content: space-between;
        }
        .b-nav-logo { font-family: var(--bm); font-size: 18px; color: #fff; text-decoration: none; }
        .b-nav-logo span { color: var(--teal-lt); }
        .b-nav-right { display: flex; gap: 24px; align-items: center; }
        .b-nav-link { font-size: 13px; color: rgba(255,255,255,.45); text-decoration: none; transition: color .15s; }
        .b-nav-link:hover { color: #fff; }
        .b-nav-cta {
          background: var(--teal); color: #fff;
          font-size: 13px; font-weight: 500;
          padding: 8px 18px; border-radius: 6px;
          text-decoration: none; transition: background .15s;
        }
        .b-nav-cta:hover { background: var(--teal-mid); }

        /* HERO */
        .b-hero {
          background: #060c0d;
          padding: 96px 48px 80px;
          border-bottom: 1px solid rgba(255,255,255,.07);
          position: relative; overflow: hidden;
        }
        .b-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 55% 60% at 50% 0%, rgba(13,107,110,.25) 0%, transparent 65%);
          pointer-events: none;
        }
        .b-hero-inner { max-width: 760px; margin: 0 auto; text-align: center; position: relative; z-index: 1; }
        .b-kicker {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: .2em; text-transform: uppercase;
          color: var(--teal-lt); margin-bottom: 24px;
          display: inline-flex; align-items: center; gap: 10px;
        }
        .b-kicker::before, .b-kicker::after {
          content: ''; display: block; width: 24px; height: 1px; background: var(--teal-lt); opacity: .4;
        }
        .b-hero h1 {
          font-family: var(--bm);
          font-size: clamp(38px, 5.5vw, 66px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #fff;
          margin-bottom: 20px;
        }
        .b-hero h1 em { color: var(--teal-lt); font-style: italic; font-weight: 400; }
        .b-hero-sub {
          font-size: 18px; color: rgba(255,255,255,.5);
          line-height: 1.65; font-weight: 300; max-width: 580px;
          margin: 0 auto 40px;
        }

        /* AUDIENCE TOGGLE */
        .audience-toggle {
          display: inline-flex;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 10px;
          padding: 4px;
          gap: 4px;
          margin-bottom: 0;
        }
        .aud-btn {
          padding: 10px 24px; border-radius: 7px;
          font-size: 13px; font-weight: 500;
          border: none; cursor: pointer;
          transition: all .2s;
          background: transparent; color: rgba(255,255,255,.45);
        }
        .aud-btn.active { background: var(--teal); color: #fff; }

        /* SECTION */
        .b-section { padding: 80px 0; border-bottom: 1px solid rgba(255,255,255,.06); }
        .b-section-inner { }
        .b-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: .18em; text-transform: uppercase;
          color: var(--teal-lt); margin-bottom: 14px;
          display: flex; align-items: center; gap: 10px;
        }
        .b-eyebrow::before { content: ''; display: block; width: 20px; height: 1px; background: var(--teal-lt); opacity: .5; }
        .b-section-h {
          font-family: var(--bm);
          font-size: clamp(30px, 3.5vw, 48px);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.08;
          color: #fff;
          margin-bottom: 16px;
        }
        .b-section-h em { font-style: italic; color: var(--teal-lt); font-weight: 400; }
        .b-section-lead {
          font-size: 17px; color: rgba(255,255,255,.45);
          line-height: 1.7; font-weight: 300;
          max-width: 620px; margin-bottom: 56px;
        }

        /* STORY STEPS */
        .b-steps { display: flex; flex-direction: column; gap: 0; }
        .b-step {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 0;
          position: relative;
        }
        .b-step:not(:last-child)::before {
          content: '';
          position: absolute;
          left: 39px; top: 72px; bottom: -40px;
          width: 2px;
          background: linear-gradient(180deg, rgba(13,107,110,.5) 0%, rgba(255,255,255,.06) 100%);
          z-index: 0;
        }
        .b-step-left {
          display: flex; flex-direction: column;
          align-items: center; padding-top: 12px;
          position: relative; z-index: 1;
        }
        .b-step-circle {
          width: 56px; height: 56px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--bm);
          font-size: 20px; font-weight: 900;
          flex-shrink: 0;
          border: 2px solid;
          background: #060c0d;
          transition: transform .2s;
        }
        .b-step-circle.teal { border-color: var(--teal); color: var(--teal-lt); }
        .b-step-circle.gold { border-color: #c8960a; color: #f5c842; }
        .b-step-circle.lit  { background: var(--teal); border-color: var(--teal); color: #fff; box-shadow: 0 0 0 8px rgba(13,107,110,.15); }

        .b-step-right { padding: 0 0 56px 32px; }
        .b-step-tag {
          display: inline-block;
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: .16em; text-transform: uppercase;
          padding: 4px 12px; border-radius: 20px; margin-bottom: 12px;
        }
        .b-step-tag.teal { background: rgba(13,107,110,.25); color: var(--teal-lt); border: 1px solid rgba(93,232,192,.15); }
        .b-step-tag.gold { background: rgba(200,150,10,.15); color: #f5c842; border: 1px solid rgba(245,200,66,.15); }
        .b-step-tag.lit  { background: var(--teal); color: #fff; border: 1px solid var(--teal); }
        .b-step-tag.amber { background: rgba(196,90,0,.2); color: #f5a742; border: 1px solid rgba(245,167,66,.15); }

        .b-step-h {
          font-family: var(--bm);
          font-size: 26px; font-weight: 700;
          letter-spacing: -0.02em; line-height: 1.15;
          color: #fff; margin-bottom: 10px;
        }
        .b-step-p {
          font-size: 15px; color: rgba(255,255,255,.5);
          line-height: 1.75; font-weight: 300; margin-bottom: 20px;
        }
        .b-step-p strong { font-weight: 600; color: rgba(255,255,255,.85); }

        /* WHAT STAFF DOES */
        .b-req-box {
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 8px; padding: 20px 24px; max-width: 520px;
        }
        .b-req-h { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.3); margin-bottom: 12px; }
        .b-req-list { display: flex; flex-direction: column; gap: 8px; }
        .b-req-item { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: rgba(255,255,255,.6); line-height: 1.55; }
        .b-req-check {
          width: 18px; height: 18px; border-radius: 50%;
          background: rgba(13,107,110,.25); color: var(--teal-lt);
          font-size: 9px; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 1px; font-weight: 700;
        }

        /* CPT CARD */
        .b-cpt-card {
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 12px; overflow: hidden;
          max-width: 540px; margin-bottom: 8px;
        }
        .b-cpt-card-header {
          padding: 14px 20px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,.06);
        }
        .b-cpt-card-header.teal { background: rgba(13,107,110,.2); }
        .b-cpt-card-header.gold { background: rgba(200,150,10,.12); }
        .b-cpt-code { font-family: 'DM Mono', monospace; font-size: 14px; font-weight: 500; letter-spacing: .06em; }
        .b-cpt-code.teal { color: var(--teal-lt); }
        .b-cpt-code.gold { color: #f5c842; }
        .b-cpt-badge {
          font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: .12em; text-transform: uppercase;
          padding: 4px 10px; border-radius: 20px;
        }
        .b-cpt-badge.teal { background: rgba(13,107,110,.3); color: var(--teal-lt); }
        .b-cpt-badge.gold { background: rgba(200,150,10,.2); color: #f5c842; }
        .b-cpt-body { padding: 18px 20px; }
        .b-cpt-desc { font-size: 13px; color: rgba(255,255,255,.45); line-height: 1.6; margin-bottom: 16px; }
        .b-cpt-desc strong { color: rgba(255,255,255,.8); font-weight: 600; }
        .b-cpt-amounts { display: flex; gap: 12px; flex-wrap: wrap; }
        .b-cpt-amt {
          flex: 1; min-width: 110px;
          padding: 12px 14px; border-radius: 6px;
          background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
        }
        .b-cpt-amt-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.3); margin-bottom: 4px; }
        .b-cpt-amt-val { font-family: var(--bm); font-size: 24px; font-weight: 700; line-height: 1; }
        .b-cpt-amt-val.teal { color: var(--teal-lt); }
        .b-cpt-amt-val.gold { color: #f5c842; }
        .b-cpt-amt-sub { font-size: 11px; color: rgba(255,255,255,.25); margin-top: 3px; }
        .b-who-pays {
          display: inline-flex; align-items: center; gap: 8px;
          margin-top: 14px; padding: 8px 14px; border-radius: 6px;
          border: 1px solid rgba(255,255,255,.07); background: rgba(255,255,255,.03);
          font-size: 12px; color: rgba(255,255,255,.45);
        }
        .b-who-pays strong { color: rgba(255,255,255,.75); font-weight: 600; }

        /* MATH STRIP */
        .b-math-strip {
          display: flex; align-items: center; gap: 0;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 12px; overflow: hidden;
          margin-bottom: 32px; flex-wrap: wrap;
        }
        .b-math-cell {
          flex: 1; min-width: 120px;
          padding: 20px 20px; text-align: center;
          border-right: 1px solid rgba(255,255,255,.06);
        }
        .b-math-cell:last-child { border-right: none; }
        .b-math-cell.lit { background: rgba(13,107,110,.2); }
        .b-math-op {
          display: flex; align-items: center; justify-content: center;
          width: 36px; padding: 20px 0;
          font-family: var(--bm); font-size: 24px; font-weight: 300;
          color: rgba(255,255,255,.2); flex-shrink: 0;
          border-right: 1px solid rgba(255,255,255,.06);
          background: rgba(255,255,255,.02);
        }
        .b-math-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.3); margin-bottom: 6px; }
        .b-math-val { font-family: var(--bm); font-size: 26px; font-weight: 700; line-height: 1; letter-spacing: -0.02em; }
        .b-math-sub { font-size: 11px; color: rgba(255,255,255,.3); margin-top: 4px; }

        /* PATIENT EXAMPLES */
        .b-patient-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
        .b-patient-card {
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 12px; padding: 24px;
        }
        .b-patient-card.uc { border-top: 3px solid #f5a742; }
        .b-patient-card.pc { border-top: 3px solid var(--teal-lt); }
        .b-patient-type { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: .16em; text-transform: uppercase; margin-bottom: 8px; }
        .b-patient-card.uc .b-patient-type { color: #f5a742; }
        .b-patient-card.pc .b-patient-type { color: var(--teal-lt); }
        .b-patient-name { font-family: var(--bm); font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .b-patient-desc { font-size: 13px; color: rgba(255,255,255,.4); margin-bottom: 18px; font-weight: 300; }
        .b-billing-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 8px 12px; border-radius: 6px;
          background: rgba(255,255,255,.04);
          font-size: 12px; margin-bottom: 6px;
        }
        .b-billing-code { font-family: 'DM Mono', monospace; color: rgba(255,255,255,.3); }
        .b-billing-desc { color: rgba(255,255,255,.5); flex: 1; margin: 0 8px; }
        .b-billing-amt { font-family: 'DM Mono', monospace; font-weight: 500; }
        .b-billing-total {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 12px; border-radius: 6px; margin-top: 4px;
          font-weight: 600; font-size: 13px; border: 1px solid;
        }
        .b-patient-card.uc .b-billing-total { border-color: rgba(245,167,66,.2); background: rgba(245,167,66,.08); color: #f5a742; }
        .b-patient-card.pc .b-billing-total { border-color: rgba(93,232,192,.2); background: rgba(93,232,192,.08); color: var(--teal-lt); }
        .b-billing-total-val { font-family: var(--bm); font-size: 20px; font-weight: 700; }

        /* CHECK VISUAL */
        .b-check {
          background: rgba(255,255,255,.03);
          border: 2px solid rgba(255,255,255,.1);
          border-radius: 14px; overflow: hidden;
          max-width: 600px; margin-bottom: 32px;
        }
        .b-check-top {
          background: var(--teal); padding: 18px 26px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .b-check-top-title { font-family: var(--bm); font-size: 18px; font-weight: 700; color: #fff; }
        .b-check-top-sub { font-size: 12px; color: rgba(255,255,255,.55); margin-top: 2px; }
        .b-check-num { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(255,255,255,.4); }
        .b-check-mid { padding: 22px 26px; border-bottom: 1px solid rgba(255,255,255,.07); }
        .b-check-payto-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.3); margin-bottom: 6px; }
        .b-check-payto-val { font-family: var(--bm); font-size: 26px; font-weight: 700; color: #fff; }
        .b-check-memo { font-size: 12px; color: rgba(255,255,255,.3); margin-top: 8px; font-weight: 300; }
        .b-check-bot { padding: 18px 26px; display: flex; justify-content: space-between; align-items: flex-end; }
        .b-check-amt-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.3); margin-bottom: 4px; }
        .b-check-amt-val { font-family: var(--bm); font-size: 52px; font-weight: 900; color: var(--teal-lt); letter-spacing: -0.03em; line-height: 1; }
        .b-check-period { font-size: 12px; color: rgba(255,255,255,.25); margin-top: 4px; }
        .b-check-source { text-align: right; }
        .b-check-source-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.25); margin-bottom: 4px; }
        .b-check-source-val { font-size: 13px; color: rgba(255,255,255,.4); font-weight: 300; }

        /* TOTALS TABLE */
        .b-totals {
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 14px; overflow: hidden; margin-bottom: 40px;
        }
        .b-totals-header {
          padding: 24px 32px; border-bottom: 1px solid rgba(255,255,255,.07);
          display: flex; align-items: center; justify-content: space-between;
        }
        .b-totals-title { font-family: var(--bm); font-size: 20px; font-weight: 700; color: #fff; }
        .b-totals-sub { font-size: 12px; color: rgba(255,255,255,.3); margin-top: 2px; }
        .b-vol-toggle { display: flex; gap: 4px; }
        .b-vol-btn {
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08);
          color: rgba(255,255,255,.4); font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: .1em; padding: 6px 14px;
          border-radius: 4px; cursor: pointer; transition: all .15s;
        }
        .b-vol-btn.active { background: var(--teal); border-color: var(--teal); color: #fff; }
        .b-totals-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: rgba(255,255,255,.06); }
        .b-total-cell { background: #060c0d; padding: 24px; }
        .b-total-cell.lit { background: rgba(13,107,110,.12); }
        .b-total-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.3); margin-bottom: 10px; line-height: 1.5; }
        .b-total-val { font-family: var(--bm); font-size: 32px; font-weight: 900; line-height: 1; letter-spacing: -0.03em; margin-bottom: 6px; }
        .b-total-val.g { color: var(--teal-lt); }
        .b-total-val.r { color: #f08080; }
        .b-total-sub { font-size: 11px; color: rgba(255,255,255,.25); }

        /* CTA */
        .b-cta {
          background: linear-gradient(135deg, rgba(13,107,110,.3) 0%, rgba(6,12,13,0) 100%);
          border: 1px solid rgba(13,107,110,.3);
          border-radius: 16px; padding: 56px 48px; text-align: center;
          margin: 80px 0;
        }
        .b-cta h2 { font-family: var(--bm); font-size: clamp(28px, 4vw, 48px); font-weight: 900; letter-spacing: -0.03em; color: #fff; margin-bottom: 14px; }
        .b-cta h2 em { color: var(--teal-lt); font-style: italic; font-weight: 400; }
        .b-cta p { font-size: 16px; color: rgba(255,255,255,.45); font-weight: 300; margin-bottom: 36px; max-width: 520px; margin-left: auto; margin-right: auto; }
        .b-cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .b-btn-main {
          background: var(--teal); color: #fff;
          font-size: 14px; font-weight: 500;
          padding: 14px 32px; border-radius: 6px;
          text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
          transition: background .15s, transform .1s;
          border: none; cursor: pointer;
        }
        .b-btn-main:hover { background: var(--teal-mid); transform: translateY(-1px); }
        .b-btn-outline {
          background: transparent; color: rgba(255,255,255,.6);
          border: 1px solid rgba(255,255,255,.15);
          font-size: 14px; padding: 14px 32px; border-radius: 6px;
          text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
          transition: all .15s; cursor: pointer;
        }
        .b-btn-outline:hover { color: #fff; border-color: rgba(255,255,255,.35); }

        /* CONTEXT NOTE */
        .b-context-box {
          background: rgba(200,150,10,.07);
          border: 1px solid rgba(245,200,66,.12);
          border-left: 3px solid #f5c842;
          border-radius: 0 8px 8px 0;
          padding: 14px 18px;
          font-size: 13px; color: rgba(255,255,255,.55);
          max-width: 540px; margin-bottom: 24px; line-height: 1.65;
        }
        .b-context-box strong { color: rgba(255,255,255,.8); }

        /* FOOTER */
        .b-footer {
          padding: 32px 48px;
          border-top: 1px solid rgba(255,255,255,.07);
          display: flex; justify-content: space-between; align-items: center;
        }
        .b-footer-logo { font-family: var(--bm); font-size: 17px; color: rgba(255,255,255,.6); }
        .b-footer-logo span { color: var(--teal-lt); }
        .b-footer-copy { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(255,255,255,.2); letter-spacing: .07em; }
        .b-footer-back { font-size: 13px; color: rgba(255,255,255,.3); text-decoration: none; transition: color .15s; }
        .b-footer-back:hover { color: var(--teal-lt); }

        @media (max-width: 768px) {
          .b-nav, .b-hero, .b-footer { padding-left: 24px; padding-right: 24px; }
          .b-wrap { padding: 0 24px; }
          .b-hero { padding-top: 64px; padding-bottom: 56px; }
          .b-patient-grid { grid-template-columns: 1fr; }
          .b-totals-grid { grid-template-columns: 1fr 1fr; }
          .b-math-strip { flex-direction: column; }
          .b-math-op { width: 100%; height: 36px; border-right: none; border-bottom: 1px solid rgba(255,255,255,.06); }
          .b-cta { padding: 40px 24px; }
        }
      `}</style>

      <body className="billing-page">
        {/* NAV */}
        <nav className="b-nav">
          <Link href="/" className="b-nav-logo">MyPulse<span>Scan</span></Link>
          <div className="b-nav-right">
            <Link href="/" className="b-nav-link">← Back to site</Link>
            <Link href="/#calculator" className="b-nav-link">ROI Calculator</Link>
            <a href="mailto:hello@mypulsescan.com" className="b-nav-cta">Request Demo →</a>
          </div>
        </nav>

        {/* HERO */}
        <div className="b-hero">
          <div className="b-hero-inner">
            <div className="b-kicker">For Practice Managers &amp; Owners</div>
            <h1>Medicare will <em>literally</em><br />pay for this.</h1>
            <p className="b-hero-sub">
              We&apos;re going to show you exactly which billing codes pay for MyPulseScan — in plain English,
              step by step, with the actual dollar amounts that hit your bank account every month.
            </p>

            {/* Audience toggle */}
            <div style={{marginBottom: 40}}>
              <p style={{fontSize: 10, color: 'rgba(255,255,255,.35)', marginBottom: 12, letterSpacing: '.06em', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase'}}>
                I run a...
              </p>
              <div className="audience-toggle">
                <button className={'aud-btn' + (audience === 'urgent' ? ' active' : '')} onClick={() => setAudience('urgent')}>
                  🚑 Urgent Care
                </button>
                <button className={'aud-btn' + (audience === 'primary' ? ' active' : '')} onClick={() => setAudience('primary')}>
                  🩺 Primary Care
                </button>
              </div>
            </div>

            {/* Audience-aware promise */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
              borderRadius: 8, padding: '14px 24px', fontSize: 15, color: 'rgba(255,255,255,.65)',
              maxWidth: 600, textAlign: 'left',
            }}>
              <span style={{fontSize: 20}}>💰</span>
              {audience === 'urgent'
                ? <span>No insurance expertise required. <strong style={{color: 'var(--teal-lt)'}}>We handle the codes. You keep the check.</strong></span>
                : <span>You&apos;re already doing the work. <strong style={{color: 'var(--teal-lt)'}}>You&apos;re just not submitting the code.</strong></span>
              }
            </div>
          </div>
        </div>

        {/* ── SECTION 1: THE STORY ── */}
        <div className="b-section">
          <div className="b-wrap">
            <div className="b-eyebrow">Start Here</div>
            <h2 className="b-section-h">The short version<br />in <em>60 seconds.</em></h2>
            <p className="b-section-lead">
              {audience === 'urgent'
                ? "Here's what happens when a patient walks into your urgent care and you use MyPulseScan. No jargon — just what happens and what you get paid."
                : "Here's what happens when your established patient comes back for their monthly visit and you use MyPulseScan. You're already doing this. Here's what it's worth."}
            </p>

            <div className="b-steps">

              {/* STEP 1 */}
              <div className="b-step">
                <div className="b-step-left"><div className="b-step-circle teal">1</div></div>
                <div className="b-step-right">
                  <div className="b-step-tag teal">The Patient Walks In</div>
                  <h3 className="b-step-h">Your staff types their name + birthday. That&apos;s it.</h3>
                  <p className="b-step-p">
                    No clipboard. No 4-page form. No &ldquo;can you spell that?&rdquo; In under 30 seconds, MyPulseScan pulls
                    their full medical history — allergies, medications, past diagnoses, recent labs — from Epic,
                    Apple Health, and 320M+ US patient records. <strong>The provider walks in already knowing who they&apos;re treating.</strong>
                  </p>
                  <div className="b-req-box">
                    <div className="b-req-h">What your staff actually does</div>
                    <div className="b-req-list">
                      {['Type patient first name, last name, and date of birth', 'Hit search — complete record appears in under 30 seconds', 'Provider reviews the summary before entering the room'].map(t => (
                        <div key={t} className="b-req-item"><div className="b-req-check">✓</div>{t}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 2 */}
              <div className="b-step">
                <div className="b-step-left"><div className="b-step-circle teal">2</div></div>
                <div className="b-step-right">
                  <div className="b-step-tag amber">This Is the Part Most Clinics Don&apos;t Know About</div>
                  <h3 className="b-step-h">The government has a billing code for exactly what you just did.</h3>
                  <p className="b-step-p">
                    When you digitally collect and review a patient&apos;s health data — which is <strong>exactly what MyPulseScan does</strong> —
                    Medicare has specific billing codes for that. They&apos;re called <strong>Remote Patient Monitoring codes</strong>, or RPM.
                    They exist because Congress decided in 2019 that digital health data collection should be reimbursed
                    just like any other clinical service.
                    {audience === 'urgent'
                      ? <> Most urgent cares have <strong>never billed a single one.</strong></>
                      : <> Most primary care practices bill visits. <strong>Almost none bill for the digital record work they&apos;re already doing.</strong></>
                    }
                  </p>
                  <div className="b-context-box">
                    <span>🏛 </span>
                    {audience === 'urgent'
                      ? <span>These codes have existed since <strong>2019</strong>. Most urgent cares leave this money on the table every single month.</span>
                      : <span><strong>Primary care context:</strong> Your diabetic patients, hypertension patients, and heart failure patients are already on your schedule every month. The 20 minutes your provider spends reviewing their data and talking to them? <strong>That&apos;s already billable. Most practices just don&apos;t know it.</strong></span>
                    }
                  </div>
                </div>
              </div>

              {/* STEP 3 */}
              <div className="b-step">
                <div className="b-step-left"><div className="b-step-circle gold">3</div></div>
                <div className="b-step-right">
                  <div className="b-step-tag gold">The First Check</div>
                  <h3 className="b-step-h">Every new patient = $20. One time. Medicare pays it.</h3>
                  <p className="b-step-p">
                    The first time a patient uses MyPulseScan at your clinic, you can bill this code.
                    Medicare pays you — not the patient — just for enrolling them in digital monitoring.
                  </p>
                  <div className="b-cpt-card">
                    <div className="b-cpt-card-header teal">
                      <span className="b-cpt-code teal">CPT 99453</span>
                      <span className="b-cpt-badge teal">One-time per patient</span>
                    </div>
                    <div className="b-cpt-body">
                      <div className="b-cpt-desc">
                        <strong>&ldquo;Initial setup and patient education on remote monitoring.&rdquo;</strong><br />
                        Translation: You used a digital tool to pull their health data for the first time. That qualifies.
                      </div>
                      <div className="b-cpt-amounts">
                        {[{label: 'Medicare pays you', val: '$20', sub: 'per patient, one time', cls: 'teal'}, {label: 'Patient owes', val: '$0', sub: 'Medicare covers it', cls: 'teal'}, {label: '100 new patients/yr', val: '$2,000', sub: 'just from this code', cls: 'teal'}].map(a => (
                          <div key={a.label} className="b-cpt-amt">
                            <div className="b-cpt-amt-label">{a.label}</div>
                            <div className={'b-cpt-amt-val ' + a.cls}>{a.val}</div>
                            <div className="b-cpt-amt-sub">{a.sub}</div>
                          </div>
                        ))}
                      </div>
                      <div className="b-who-pays">
                        <span>💳</span>
                        <span><strong>Who pays:</strong> Medicare Part B covers 80%. Secondary insurance covers the other 20%. Most patients owe $0.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 4 */}
              <div className="b-step">
                <div className="b-step-left"><div className="b-step-circle gold">4</div></div>
                <div className="b-step-right">
                  <div className="b-step-tag gold">The Monthly Check — This Is Where It Gets Good</div>
                  <h3 className="b-step-h">
                    {audience === 'urgent'
                      ? 'For patients who come back: $47 every single month.'
                      : 'Your chronic care patients: $47 every single month. You already see them.'}
                  </h3>
                  <p className="b-step-p">
                    {audience === 'urgent'
                      ? 'For patients with chronic conditions — diabetes, hypertension, heart disease — who return regularly, you can bill this code every month as long as MyPulseScan is monitoring their data.'
                      : <>Your diabetic, hypertensive, and chronic care patients are <strong>already on your schedule monthly</strong>. MyPulseScan keeps their digital record current between visits. That continuous monitoring is exactly what this code covers — and you&apos;re doing it whether you bill for it or not.</>
                    }
                  </p>
                  <div className="b-cpt-card">
                    <div className="b-cpt-card-header gold">
                      <span className="b-cpt-code gold">CPT 99454</span>
                      <span className="b-cpt-badge gold">Every 30 days</span>
                    </div>
                    <div className="b-cpt-body">
                      <div className="b-cpt-desc">
                        <strong>&ldquo;Monthly device supply with daily data transmission.&rdquo;</strong><br />
                        Translation: MyPulseScan continuously monitors this patient&apos;s health data. Ongoing digital monitoring = this code.
                      </div>
                      <div className="b-cpt-amounts">
                        {[{label: 'Medicare pays you', val: '$47', sub: 'per patient, per month', cls: 'gold'}, {label: 'Per year per patient', val: '$564', sub: 'annually recurring', cls: 'gold'}, {label: 'Requirement', val: '16 days', sub: 'of data per month', cls: 'gold'}].map(a => (
                          <div key={a.label} className="b-cpt-amt">
                            <div className="b-cpt-amt-label">{a.label}</div>
                            <div className={'b-cpt-amt-val ' + a.cls}>{a.val}</div>
                            <div className="b-cpt-amt-sub">{a.sub}</div>
                          </div>
                        ))}
                      </div>
                      <div className="b-who-pays">
                        <span>📅</span>
                        <span><strong>Fine print:</strong> Requires 16 days of patient data per 30-day period. MyPulseScan&apos;s continuous monitoring handles this automatically.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 5 */}
              <div className="b-step">
                <div className="b-step-left"><div className="b-step-circle teal">5</div></div>
                <div className="b-step-right">
                  <div className="b-step-tag teal">One More Monthly Code</div>
                  <h3 className="b-step-h">
                    {audience === 'urgent'
                      ? 'Add $48 more when the provider reviews the data.'
                      : 'Add $48 for the review your provider is already doing.'}
                  </h3>
                  <p className="b-step-p">
                    {audience === 'urgent'
                      ? "When your provider reviews a patient's MyPulseScan summary and spends at least 20 minutes during the month interacting with the patient about their health data — that's this code."
                      : <>Your providers are <strong>already spending 20 minutes per month</strong> with chronic care patients — reviewing labs, adjusting medications, talking through symptoms. That interaction is exactly what this code covers. <strong>It&apos;s not extra work. It&apos;s work you&apos;re already doing, unbilled.</strong></>
                    }
                  </p>
                  <div className="b-cpt-card">
                    <div className="b-cpt-card-header teal">
                      <span className="b-cpt-code teal">CPT 99457</span>
                      <span className="b-cpt-badge teal">Every calendar month</span>
                    </div>
                    <div className="b-cpt-body">
                      <div className="b-cpt-desc">
                        <strong>&ldquo;Remote monitoring treatment management — 20 minutes of provider time.&rdquo;</strong><br />
                        Translation: Your provider reviewed the patient&apos;s digital record and talked to them for 20 minutes this month. That&apos;s already happening. Now it pays extra.
                      </div>
                      <div className="b-cpt-amounts">
                        {[{label: 'Medicare pays you', val: '$48', sub: 'per patient, per month', cls: 'teal'}, {label: 'Per year per patient', val: '$576', sub: 'annually recurring', cls: 'teal'}, {label: 'Requirement', val: '20 min', sub: 'provider time/month', cls: 'teal'}].map(a => (
                          <div key={a.label} className="b-cpt-amt">
                            <div className="b-cpt-amt-label">{a.label}</div>
                            <div className={'b-cpt-amt-val ' + a.cls}>{a.val}</div>
                            <div className="b-cpt-amt-sub">{a.sub}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 6 — THE PUNCHLINE */}
              <div className="b-step">
                <div className="b-step-left"><div className="b-step-circle lit">$</div></div>
                <div className="b-step-right">
                  <div className="b-step-tag lit">The Punchline</div>
                  <h3 className="b-step-h">Stack 99454 + 99457 on the same patient. That&apos;s $95/month.</h3>
                  <p className="b-step-p">
                    For any patient with a chronic condition, bill <strong>both codes in the same month</strong>.
                    $47 for data monitoring + $48 for provider review = <strong>$95 per patient per month from Medicare.
                    Every month. Without changing a single thing about how you practice.</strong>
                  </p>
                  <div className="b-math-strip">
                    {[
                      {label: 'CPT 99454', val: '$47', sub: 'data monitoring', color: 'var(--teal-lt)', op: null},
                      {label: '', val: '+', sub: '', color: 'rgba(255,255,255,.3)', op: true},
                      {label: 'CPT 99457', val: '$48', sub: 'provider review', color: 'var(--teal-lt)', op: null},
                      {label: '', val: '=', sub: '', color: 'rgba(255,255,255,.3)', op: true},
                      {label: 'Monthly per patient', val: '$95', sub: 'recurring revenue', color: '#5de8c0', op: null, lit: true},
                      {label: '', val: '×', sub: '', color: 'rgba(255,255,255,.3)', op: true},
                      {label: '12 months', val: '$1,140', sub: 'per patient per year', color: '#fff', op: null},
                    ].map((c, i) => c.op
                      ? <div key={i} className="b-math-op">{c.val}</div>
                      : <div key={i} className={'b-math-cell' + (c.lit ? ' lit' : '')}>
                          <div className="b-math-label">{c.label}</div>
                          <div className="b-math-val" style={{color: c.color}}>{c.val}</div>
                          <div className="b-math-sub">{c.sub}</div>
                        </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── SECTION 2: TWO PATIENT EXAMPLES ── */}
        <div className="b-section" style={{background: 'rgba(255,255,255,.015)'}}>
          <div className="b-wrap">
            <div className="b-eyebrow">Real Examples</div>
            <h2 className="b-section-h">
              {audience === 'urgent'
                ? <>Two patients. <em>Two different checks.</em></>
                : <>Your patient panel. <em>Already qualified.</em></>
              }
            </h2>
            <p className="b-section-lead">
              {audience === 'urgent'
                ? "Not every patient generates the same revenue. Here's exactly what your billing looks like for the two most common visit types."
                : "Primary care is different from urgent care. Almost your entire chronic care panel qualifies for monthly billing. Here's what two common patients look like."
              }
            </p>

            <div className="b-patient-grid">
              {/* Patient A */}
              <div className={'b-patient-card ' + (audience === 'urgent' ? 'uc' : 'pc')}>
                <div className="b-patient-type">{audience === 'urgent' ? 'One-Time / Acute Visit' : 'New Chronic Care Patient'}</div>
                <div className="b-patient-name">{audience === 'urgent' ? 'Maria G.' : 'Robert T.'}</div>
                <div className="b-patient-desc">
                  {audience === 'urgent'
                    ? 'Sprained ankle. First visit. Probably won\'t be back. Typical urgent care walk-in.'
                    : 'Type 2 diabetic. Just transferred to your practice. Medicare Part B. First visit this month.'
                  }
                </div>
                <div>
                  {[
                    {code: '99453', desc: 'First-time digital setup', amt: '$20', active: true},
                    {code: '99454', desc: 'Monthly monitoring — N/A', amt: '—', active: audience === 'primary'},
                    {code: '99457', desc: 'Provider review — N/A', amt: '—', active: audience === 'primary'},
                  ].map(row => (
                    <div key={row.code} className="b-billing-row" style={{opacity: row.active ? 1 : 0.35}}>
                      <span className="b-billing-code">{row.code}</span>
                      <span className="b-billing-desc">{row.desc}</span>
                      <span className="b-billing-amt" style={{color: row.active ? (audience === 'urgent' ? '#f5a742' : 'var(--teal-lt)') : 'rgba(255,255,255,.25)'}}>{row.amt}</span>
                    </div>
                  ))}
                  <div className={'b-billing-total ' + (audience === 'urgent' ? 'uc' : 'pc')} style={{borderColor: audience === 'urgent' ? 'rgba(245,167,66,.2)' : 'rgba(93,232,192,.2)', background: audience === 'urgent' ? 'rgba(245,167,66,.08)' : 'rgba(93,232,192,.08)', color: audience === 'urgent' ? '#f5a742' : 'var(--teal-lt)'}}>
                    <span>Medicare pays you</span>
                    <span className="b-billing-total-val">{audience === 'urgent' ? '$20' : '$115'}</span>
                  </div>
                </div>
                <div style={{marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,.3)', fontWeight: 300, lineHeight: 1.6}}>
                  {audience === 'urgent'
                    ? <>One time only. At 60 new walk-ins a month: <strong style={{color: '#f5a742'}}>$1,200/month</strong> just from first-visit codes.</>
                    : <>Month 1: $20 setup + $47 monitoring + $48 review = <strong style={{color: 'var(--teal-lt)'}}>$115. Then $95 every month after.</strong></>
                  }
                </div>
              </div>

              {/* Patient B */}
              <div className="b-patient-card pc">
                <div className="b-patient-type">{audience === 'urgent' ? 'Recurring / Chronic Patient' : 'Established Chronic Care Patient'}</div>
                <div className="b-patient-name">{audience === 'urgent' ? 'Robert T.' : 'Linda M.'}</div>
                <div className="b-patient-desc">
                  {audience === 'urgent'
                    ? 'Type 2 diabetic. Comes in monthly. Hypertension. Medicare Part B.'
                    : 'Hypertension + heart failure. Monthly visit, quarterly labs. Has been your patient for 4 years. Medicare Part B.'
                  }
                </div>
                <div>
                  {[
                    {code: '99453', desc: 'First-time setup (month 1 only)', amt: '+$20'},
                    {code: '99454', desc: 'Monthly data monitoring', amt: '$47/mo'},
                    {code: '99457', desc: 'Provider review (20 min)', amt: '$48/mo'},
                  ].map(row => (
                    <div key={row.code} className="b-billing-row">
                      <span className="b-billing-code">{row.code}</span>
                      <span className="b-billing-desc">{row.desc}</span>
                      <span className="b-billing-amt" style={{color: 'var(--teal-lt)'}}>{row.amt}</span>
                    </div>
                  ))}
                  <div className="b-billing-total" style={{borderColor: 'rgba(93,232,192,.2)', background: 'rgba(93,232,192,.08)', color: 'var(--teal-lt)'}}>
                    <span>Medicare pays you</span>
                    <span className="b-billing-total-val">$95/mo</span>
                  </div>
                </div>
                <div style={{marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,.3)', fontWeight: 300, lineHeight: 1.6}}>
                  {audience === 'urgent'
                    ? <>Month after month. <strong style={{color: 'var(--teal-lt)'}}>$1,140/year from this one patient.</strong> You have dozens of Roberts.</>
                    : <>She&apos;s been coming every month for 4 years. You&apos;ve been doing the work. <strong style={{color: 'var(--teal-lt)'}}>You haven&apos;t been submitting the code.</strong></>
                  }
                </div>
              </div>
            </div>

            {/* CHECK VISUAL */}
            <div className="b-eyebrow" style={{marginTop: 56}}>What This Looks Like</div>
            <h3 style={{fontFamily: 'var(--bm)', fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 24, color: '#fff'}}>
              Here&apos;s the actual Medicare reimbursement for a 100-patient practice.
            </h3>
            <div className="b-check">
              <div className="b-check-top">
                <div>
                  <div className="b-check-top-title">Medicare / Insurance Reimbursement</div>
                  <div className="b-check-top-sub">Remote Patient Monitoring — Monthly Payment</div>
                </div>
                <div className="b-check-num">RPM-2026-0042</div>
              </div>
              <div className="b-check-mid">
                <div className="b-check-payto-label">Pay To The Order Of</div>
                <div className="b-check-payto-val">Your {audience === 'urgent' ? 'Urgent Care' : 'Primary Care'} Practice</div>
                <div className="b-check-memo">
                  For: Remote Patient Monitoring services — CPT 99453, 99454, 99457 — 100 patients, {new Date().toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}
                </div>
              </div>
              <div className="b-check-bot">
                <div>
                  <div className="b-check-amt-label">Amount</div>
                  <div className="b-check-amt-val">{audience === 'urgent' ? '$2,900' : '$4,100'}</div>
                  <div className="b-check-period">per month · 100 patients</div>
                </div>
                <div className="b-check-source">
                  <div className="b-check-source-label">Funding Source</div>
                  <div className="b-check-source-val">Medicare Part B (80%)<br />Secondary Insurance (20%)</div>
                </div>
              </div>
            </div>

            <div style={{fontSize: 13, color: 'rgba(255,255,255,.35)', fontWeight: 300, lineHeight: 1.7, marginBottom: 48, padding: '16px 20px', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 8, maxWidth: 620}}>
              {audience === 'urgent'
                ? <><strong style={{color: 'rgba(255,255,255,.6)'}}>Where that $2,900 comes from:</strong> 60 one-time patients × $20 = $1,200 + 40 recurring patients × $47 = $1,880 + 40 recurring patients × $48 = $1,920. Conservative 40% recurring rate. <strong style={{color: 'var(--teal-lt)'}}>The number grows every month as your recurring base builds.</strong></>
                : <><strong style={{color: 'rgba(255,255,255,.6)'}}>Where that $4,100 comes from:</strong> Primary care practices typically have 70%+ chronic care patients. 70 recurring patients × $47 = $3,290 + 70 × $48 = $3,360 + 30 new enrollments × $20 = $600. <strong style={{color: 'var(--teal-lt)'}}>Month 2 onwards: recurring revenue with no new setup needed.</strong></>
              }
            </div>
          </div>
        </div>

        {/* ── SECTION 3: TOTALS TABLE ── */}
        <div className="b-section">
          <div className="b-wrap">
            <div className="b-eyebrow">The Bottom Line</div>
            <h2 className="b-section-h">Here&apos;s what hits your bank<br />at every <em>patient volume.</em></h2>
            <p className="b-section-lead">
              {audience === 'primary'
                ? 'Primary care numbers assume 70% of patients qualify for RPM — conservative for a typical chronic care panel.'
                : 'Urgent care numbers assume 40% of patients have recurring conditions — conservative for most walk-in practices.'}
            </p>

            <div className="b-totals" style={{marginBottom: 40}}>
              <div className="b-totals-header">
                <div>
                  <div className="b-totals-title">Annual RPM Revenue vs. Platform Cost</div>
                  <div className="b-totals-sub">
                    {audience === 'urgent' ? '40% recurring rate · ' : '70% qualifying rate · '}
                    Growth tier · $250 base + $5/patient
                  </div>
                </div>
                <div className="b-vol-toggle">
                  {[50, 100, 200, 500].map(v => {
                    const rpmRate = audience === 'primary' ? 0.7 : 0.4
                    const rpmPts = Math.round(v * rpmRate)
                    const newPts = Math.round(v * (1 - rpmRate) * 0.5)
                    const monthly = newPts * 20 + rpmPts * 95
                    const cost = 250 + v * 5
                    const _net = (monthly - cost) * 12
                    return null
                  })}
                  {[50, 100, 200, 500].map(v => (
                    <button key={v} className="b-vol-btn" style={{}} onClick={e => {
                      document.querySelectorAll('.b-vol-btn').forEach(b => b.classList.remove('active'))
                      ;(e.target as HTMLButtonElement).classList.add('active')
                      const rpmRate = audience === 'primary' ? 0.7 : 0.4
                      const rpmPts = Math.round(v * rpmRate)
                      const newPts = Math.round(v * 0.3)
                      const monthly = newPts * 20 + rpmPts * 95
                      const cost = 250 + v * 5
                      const netMo = monthly - cost
                      const netAnnual = netMo * 12
                      const staffAnnual = Math.round((6/60) * v * 22 * 12)
                      const total = netAnnual + staffAnnual
                      const roi = Math.round((netMo / cost) * 100)
                      ;(document.getElementById('tv-rpm') as HTMLElement).textContent = '$' + monthly.toLocaleString()
                      ;(document.getElementById('tv-staff') as HTMLElement).textContent = '$' + Math.round(staffAnnual / 12).toLocaleString()
                      ;(document.getElementById('tv-cost') as HTMLElement).textContent = '-$' + cost.toLocaleString()
                      ;(document.getElementById('tv-net') as HTMLElement).textContent = '$' + total.toLocaleString()
                      ;(document.getElementById('tv-roi') as HTMLElement).textContent = roi + '% monthly ROI on cost'
                    }}>
                      {v} pts
                    </button>
                  ))}
                </div>
              </div>
              <div className="b-totals-grid">
                <div className="b-total-cell">
                  <div className="b-total-label">RPM Revenue<br />Monthly from Medicare</div>
                  <div className="b-total-val g" id="tv-rpm">$3,800</div>
                  <div className="b-total-sub">CPT 99453 + 99454 + 99457</div>
                </div>
                <div className="b-total-cell">
                  <div className="b-total-label">Staff Time Saved<br />Value per Month</div>
                  <div className="b-total-val g" id="tv-staff">$1,320</div>
                  <div className="b-total-sub">6 min/patient × $22/hr</div>
                </div>
                <div className="b-total-cell">
                  <div className="b-total-label">MyPulseScan Cost<br />Per Month</div>
                  <div className="b-total-val r" id="tv-cost">-$750</div>
                  <div className="b-total-sub">$250 + $5/patient</div>
                </div>
                <div className="b-total-cell lit">
                  <div className="b-total-label">Your Net Gain<br />This Year</div>
                  <div className="b-total-val g" id="tv-net">$52,440</div>
                  <div className="b-total-sub" id="tv-roi">407% monthly ROI</div>
                </div>
              </div>
            </div>

            <LiveCalc />
          </div>
        </div>

        {/* CTA */}
        <div className="b-wrap">
          <div className="b-cta">
            <h2>Stop leaving <em>free money</em> behind.</h2>
            <p>
              {audience === 'urgent'
                ? "Every month you don't use MyPulseScan is another month of RPM revenue you're not collecting. Setup takes one afternoon."
                : "You're already doing the clinical work. You're already seeing these patients. You're just not submitting the codes. That changes on day one."
              }
            </p>
            <div className="b-cta-actions">
              <a href="mailto:hello@mypulsescan.com" className="b-btn-main">Schedule a 20-Min Demo →</a>
              <Link href="/#calculator" className="b-btn-outline">Full ROI Calculator</Link>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="b-footer">
          <div className="b-footer-logo">MyPulse<span>Scan</span></div>
          <Link href="/" className="b-footer-back">← Back to mypulsescan.com</Link>
          <div className="b-footer-copy">© {new Date().getFullYear()} MyPulseScan · HIPAA Compliant · FHIR R4</div>
        </footer>
      </body>
    </>
  )
}
