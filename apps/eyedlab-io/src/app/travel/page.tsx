"use client";

import { useEffect, useRef, useState } from "react";

export default function TravelPage() {
  /* ── financial model state ── */
  const [policies, setPolicies] = useState(500000);
  const [fee, setFee] = useState(5);
  const [eventPct, setEventPct] = useState(0.5);
  const [preventPct, setPreventPct] = useState(10);
  const [evacCost, setEvacCost] = useState(150000);
  const [partner, setPartner] = useState(0);

  /* ── scroll reveal ── */
  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("vis")),
      { threshold: 0.12 }
    );
    revealRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);
  const r = (_delay = 0) => ({
    ref: (el: HTMLElement | null) => {
      if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
    },
  });

  /* ── financial calcs ── */
  const events = Math.round((policies * eventPct) / 100);
  const prevented = Math.round((events * preventPct) / 100);
  const savings = prevented * evacCost;
  const enrollRev = policies * fee;
  const shareRev = savings * 0.1;
  const bestRev = Math.max(enrollRev, shareRev);
  const roi = enrollRev > 0 ? Math.round(savings / enrollRev) : 0;
  const fmt = (n: number) =>
    n >= 1_000_000
      ? `$${(n / 1_000_000).toFixed(1)}M`
      : n >= 1_000
      ? `$${Math.round(n / 1_000)}K`
      : `$${n}`;

  const partnerNames = ["Large Insurer (2M)", "Large Insurer (5M)", "Cruise Line", "Medical Tourism"];
  const partnerPolicies = [2_000_000, 5_000_000, 6_000_000, 500_000];
  const partnerFees = [5, 5, 3, 50];

  function applyPreset(idx: number) {
    setPartner(idx);
    setPolicies(partnerPolicies[idx]);
    setFee(partnerFees[idx]);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Barlow+Condensed:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        .t-wrap * { box-sizing: border-box; }
        .t-wrap {
          --space:    #03060f;
          --space-2:  #060c1a;
          --space-3:  #0a1226;
          --space-4:  #0e1830;
          --space-5:  #141f3a;
          --cyan:     #00d4ff;
          --cyan-d:   #00a8cc;
          --cyan-p:   rgba(0,212,255,.08);
          --gold:     #f5c842;
          --gold-p:   rgba(245,200,66,.08);
          --green:    #2ecc88;
          --green-p:  rgba(46,204,136,.08);
          --red:      #ff4757;
          --amber:    #ffa502;
          --border:   rgba(0,212,255,.1);
          --border-2: rgba(0,212,255,.2);
          --border-w: rgba(255,255,255,.07);
          --ink:      #c8dff0;
          --ink-2:    #8aafc8;
          --ink-3:    #4a7090;
          --serif:    'Bebas Neue', Impact, sans-serif;
          --sans:     'Barlow', sans-serif;
          --cond:     'Barlow Condensed', sans-serif;
          --mono:     'DM Mono', monospace;
          background: var(--space);
          color: var(--ink);
          font-family: var(--sans);
          font-size: 16px;
          line-height: 1.7;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          position: relative;
        }

        /* STAR FIELD */
        .t-stars {
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(1px 1px at 15% 20%, rgba(255,255,255,.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 45% 65%, rgba(255,255,255,.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 70% 12%, rgba(255,255,255,.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 82% 78%, rgba(255,255,255,.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 32% 88%, rgba(255,255,255,.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 92% 42%, rgba(255,255,255,.35) 0%, transparent 100%),
            radial-gradient(1px 1px at 58% 35%, rgba(255,255,255,.25) 0%, transparent 100%),
            radial-gradient(2px 2px at 25% 50%, rgba(0,212,255,.15) 0%, transparent 100%),
            radial-gradient(2px 2px at 75% 90%, rgba(245,200,66,.12) 0%, transparent 100%);
          pointer-events: none;
          z-index: 0;
        }

        /* NAV */
        .t-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          height: 56px; display: flex; align-items: center; padding: 0 52px;
          border-bottom: 1px solid var(--border);
          background: rgba(3,6,15,.92); backdrop-filter: blur(20px);
        }
        .t-nav-logo {
          font-family: var(--serif); font-size: 22px; letter-spacing: .06em;
          color: var(--ink); text-decoration: none; margin-right: auto;
          display: flex; align-items: center; gap: 10px;
        }
        .t-nav-eye {
          width: 32px; height: 32px; border-radius: 50%;
          border: 2px solid var(--cyan); display: flex; align-items: center;
          justify-content: center; box-shadow: 0 0 12px rgba(0,212,255,.3);
        }
        .t-nav-iris {
          width: 14px; height: 14px; border-radius: 50%;
          background: var(--cyan); box-shadow: 0 0 8px var(--cyan);
          animation: t-iris-pulse 3s ease-in-out infinite;
        }
        @keyframes t-iris-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        .t-nav-sub { color: var(--cyan); font-size: .8em; letter-spacing: .04em; }
        .t-nav-links { display: flex; gap: 28px; margin-right: 28px; }
        .t-nav-link {
          font-family: var(--mono); font-size: 9px; letter-spacing: .14em;
          text-transform: uppercase; color: var(--ink-3); text-decoration: none; transition: color .15s;
        }
        .t-nav-link:hover { color: var(--cyan); }
        .t-nav-cta {
          background: var(--cyan); color: var(--space); border: none;
          font-family: var(--cond); font-size: 12px; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase; padding: 10px 22px;
          border-radius: 2px; cursor: pointer; transition: all .15s; text-decoration: none;
          display: inline-block;
        }
        .t-nav-cta:hover { background: #fff; transform: translateY(-1px); }

        /* HERO */
        .t-hero {
          min-height: calc(100svh - 56px); padding-top: 56px;
          display: grid; grid-template-columns: 1fr 1fr;
          position: relative; z-index: 1;
        }
        .t-hero::before {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 60% 70% at 100% 0%, rgba(0,212,255,.07) 0%, transparent 55%),
            radial-gradient(ellipse 40% 50% at 0% 100%, rgba(245,200,66,.04) 0%, transparent 55%);
          pointer-events: none;
        }
        .t-hero-left {
          padding: 80px 56px 80px 52px;
          display: flex; flex-direction: column; justify-content: center;
          position: relative; z-index: 2;
        }
        .t-kicker {
          font-family: var(--mono); font-size: 9px; letter-spacing: .24em;
          text-transform: uppercase; color: var(--cyan); margin-bottom: 24px;
          display: flex; align-items: center; gap: 12px;
        }
        .t-kicker::before { content: ''; width: 28px; height: 1px; background: var(--cyan); }
        .t-h1 {
          font-family: var(--serif); font-size: clamp(60px, 7vw, 100px);
          letter-spacing: .04em; line-height: .93; color: #fff; margin-bottom: 28px;
        }
        .t-h1 .tc { color: var(--cyan); }
        .t-h1 .ti { font-family: var(--sans); font-weight: 300; font-style: italic;
          font-size: clamp(28px, 3.2vw, 44px); display: block; letter-spacing: -.01em;
          line-height: 1.25; color: var(--ink-2); margin-bottom: 8px; }
        .t-p { font-size: 17px; color: var(--ink-3); line-height: 1.72; font-weight: 300; max-width: 460px; margin-bottom: 44px; }
        .t-p strong { color: var(--ink-2); font-weight: 400; }
        .t-btns { display: flex; gap: 12px; flex-wrap: wrap; }
        .btn-t-cyan {
          background: var(--cyan); color: var(--space); border: none;
          font-family: var(--cond); font-size: 12px; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase; padding: 16px 36px;
          border-radius: 2px; cursor: pointer; transition: all .2s; text-decoration: none; display: inline-block;
        }
        .btn-t-cyan:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,212,255,.3); }
        .btn-t-outline {
          background: transparent; color: var(--cyan); border: 1px solid var(--border-2);
          font-family: var(--cond); font-size: 12px; font-weight: 600;
          letter-spacing: .12em; text-transform: uppercase; padding: 16px 30px;
          border-radius: 2px; cursor: pointer; transition: all .2s; text-decoration: none; display: inline-block;
        }
        .btn-t-outline:hover { background: var(--cyan-p); }

        /* WORLD CARD */
        .t-hero-right {
          display: flex; align-items: center; justify-content: center;
          padding: 80px 52px 80px 20px; position: relative; z-index: 2;
        }
        .t-world-card {
          width: 100%; max-width: 480px;
          background: var(--space-3); border: 1px solid var(--border);
          border-radius: 10px; overflow: hidden;
          box-shadow: 0 0 0 1px rgba(0,212,255,.06), 0 40px 100px rgba(0,0,0,.8);
        }
        .t-world-bar {
          background: var(--space-4); padding: 13px 20px;
          border-bottom: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
        }
        .t-world-title { font-family: var(--mono); font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--cyan); }
        .t-world-live { display: flex; align-items: center; gap: 6px; font-family: var(--mono); font-size: 9px; color: var(--ink-3); }
        .t-live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 8px var(--green); animation: t-blink 2s ease infinite; }
        @keyframes t-blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .t-world-map { padding: 20px; }
        .t-world-svg { width: 100%; height: auto; }
        .t-map-pulse { animation: t-mpulse 2.5s ease-in-out infinite; transform-origin: center; }
        @keyframes t-mpulse { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:.1;transform:scale(2.2)} }
        .t-scan-line { stroke-dasharray: 300; stroke-dashoffset: 300; animation: t-scan 3s linear infinite; }
        @keyframes t-scan { 0%{stroke-dashoffset:300} 100%{stroke-dashoffset:-300} }
        .t-world-stats {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 1px;
          background: var(--border-w); border-top: 1px solid var(--border);
        }
        .t-ws-cell { background: var(--space-3); padding: 14px 16px; text-align: center; }
        .t-ws-n { font-family: var(--serif); font-size: 24px; letter-spacing: .04em; color: var(--cyan); line-height: 1; margin-bottom: 3px; }
        .t-ws-l { font-family: var(--mono); font-size: 9px; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); }
        .t-scan-evt { padding: 12px 20px; border-top: 1px solid var(--border-w); font-family: var(--mono); font-size: 10px; color: var(--green); letter-spacing: .06em; display: flex; align-items: center; gap: 8px; }
        .t-scan-evt::before { content: '▶'; font-size: 8px; }

        /* TICKER */
        .t-ticker { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 12px 0; overflow: hidden; background: var(--space-2); position: relative; z-index: 1; }
        .t-ticker-inner { display: flex; gap: 60px; animation: t-tick 36s linear infinite; white-space: nowrap; }
        @keyframes t-tick { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .t-ti { display: flex; align-items: center; gap: 8px; font-family: var(--mono); font-size: 10px; letter-spacing: .1em; color: var(--ink-3); flex-shrink: 0; }
        .t-ti .tv { color: var(--cyan); font-weight: 500; }

        /* SECTIONS */
        .t-section { padding: 100px 52px; position: relative; z-index: 1; }
        .t-section-alt { background: var(--space-2); }
        .t-inner { max-width: 1100px; margin: 0 auto; }
        .t-eyebrow { font-family: var(--mono); font-size: 9px; letter-spacing: .24em; text-transform: uppercase; color: var(--cyan); margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
        .t-eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--cyan); }
        .t-sh { font-family: var(--serif); font-size: clamp(44px, 5vw, 72px); letter-spacing: .04em; line-height: .92; color: #fff; margin-bottom: 20px; }
        .t-sh .tc { color: var(--cyan); }
        .t-sh .tg { color: var(--gold); }
        .t-sp { font-size: 17px; color: var(--ink-3); line-height: 1.72; font-weight: 300; max-width: 600px; margin-bottom: 56px; }

        /* REVEAL */
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity .65s ease, transform .65s ease; }
        .reveal.vis { opacity: 1; transform: translateY(0); }
        .rd0{} .rd1{transition-delay:.1s} .rd2{transition-delay:.2s} .rd3{transition-delay:.3s} .rd4{transition-delay:.4s}

        /* CRISIS */
        .t-crisis-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1px; background: var(--border-w); border: 1px solid var(--border-w); border-radius: 10px; overflow: hidden; }
        .t-crisis-card { background: var(--space-3); padding: 36px 30px; position: relative; overflow: hidden; transition: background .2s; }
        .t-crisis-card:hover { background: var(--space-4); }
        .t-crisis-card::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--red); transform: scaleX(0); transition: transform .3s; transform-origin: left; }
        .t-crisis-card:hover::after { transform: scaleX(1); }
        .t-crisis-icon { font-size: 36px; margin-bottom: 16px; display: block; }
        .t-crisis-stat { font-family: var(--serif); font-size: 52px; letter-spacing: .04em; color: var(--red); line-height: 1; margin-bottom: 8px; }
        .t-crisis-h { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 8px; }
        .t-crisis-p { font-size: 13px; color: var(--ink-3); line-height: 1.65; font-weight: 300; }

        /* SCAN DEMO */
        .t-scan-demo { background: var(--space-3); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; box-shadow: 0 24px 80px rgba(0,0,0,.6); }
        .t-scan-bar { background: var(--space-4); padding: 13px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .t-scan-bar-title { font-family: var(--mono); font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--cyan); }
        .t-scan-bar-status { font-family: var(--mono); font-size: 10px; color: var(--green); display: flex; align-items: center; gap: 6px; }
        .t-scan-eye-area { padding: 32px; display: flex; align-items: center; justify-content: center; background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,212,255,.05) 0%, transparent 70%); }
        .t-eye-graphic { position: relative; width: 160px; height: 160px; display: flex; align-items: center; justify-content: center; }
        .t-eye-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(0,212,255,.3); animation: t-eye-expand 3s ease-in-out infinite; }
        .t-eye-ring:nth-child(1) { width: 100%; height: 100%; animation-delay: 0s; }
        .t-eye-ring:nth-child(2) { width: 78%; height: 78%; animation-delay: .4s; }
        .t-eye-ring:nth-child(3) { width: 56%; height: 56%; animation-delay: .8s; }
        @keyframes t-eye-expand { 0%,100%{border-color:rgba(0,212,255,.2)} 50%{border-color:rgba(0,212,255,.6)} }
        .t-eye-iris { width: 64px; height: 64px; border-radius: 50%; background: radial-gradient(circle, var(--cyan) 0%, var(--cyan-d) 50%, rgba(0,168,204,.4) 100%); box-shadow: 0 0 32px rgba(0,212,255,.5); animation: t-iris-beat 2s ease-in-out infinite; position: relative; z-index: 2; display: flex; align-items: center; justify-content: center; }
        @keyframes t-iris-beat { 0%,100%{transform:scale(1);box-shadow:0 0 24px rgba(0,212,255,.4)} 50%{transform:scale(1.08);box-shadow:0 0 48px rgba(0,212,255,.7)} }
        .t-eye-pupil { width: 22px; height: 22px; border-radius: 50%; background: var(--space); }
        .t-scan-progress { height: 2px; background: var(--border-w); position: relative; overflow: hidden; }
        .t-scan-progress-bar { height: 100%; background: linear-gradient(90deg, transparent, var(--cyan), transparent); animation: t-progress 2.5s linear infinite; }
        @keyframes t-progress { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        .t-scan-result { padding: 0 20px 4px; }
        .t-scan-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,.04); }
        .t-scan-row:last-child { border-bottom: none; }
        .t-scan-label { font-family: var(--mono); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); }
        .t-scan-val { font-size: 13px; color: var(--ink); }
        .t-scan-val.alert { color: var(--red); font-weight: 600; font-size: 12px; }
        .t-scan-val.ok { color: var(--green); }
        .t-scan-val.tc { color: var(--cyan); }
        .t-scan-flag { margin: 0 20px 16px; padding: 11px 14px; background: rgba(255,71,87,.06); border: 1px solid rgba(255,71,87,.2); border-radius: 6px; font-family: var(--mono); font-size: 10px; color: var(--red); letter-spacing: .04em; line-height: 1.55; }
        .t-scan-lang { padding: 10px 20px; border-top: 1px solid var(--border); font-family: var(--mono); font-size: 9px; color: var(--cyan); letter-spacing: .1em; display: flex; gap: 10px; flex-wrap: wrap; }
        .t-lang-badge { padding: 2px 8px; border: 1px solid var(--border); border-radius: 2px; }

        /* LAYERS */
        .t-layers { display: flex; flex-direction: column; gap: 12px; }
        .t-layer { display: grid; grid-template-columns: 80px 1fr auto; gap: 0; border: 1px solid var(--border-w); border-radius: 8px; overflow: hidden; transition: all .2s; }
        .t-layer:hover { border-color: var(--cyan); transform: translateX(4px); }
        .t-layer-num { background: var(--space-4); display: flex; align-items: center; justify-content: center; font-family: var(--serif); font-size: 42px; letter-spacing: .04em; color: var(--cyan); border-right: 1px solid var(--border-w); padding: 24px 0; }
        .t-layer-body { padding: 24px 28px; background: var(--space-3); }
        .t-layer-tag { font-family: var(--mono); font-size: 9px; letter-spacing: .18em; text-transform: uppercase; color: var(--cyan); margin-bottom: 8px; }
        .t-layer-h { font-family: var(--cond); font-size: 20px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #fff; margin-bottom: 6px; }
        .t-layer-p { font-size: 13px; color: var(--ink-3); line-height: 1.65; font-weight: 300; margin-bottom: 10px; }
        .t-layer-targets { font-family: var(--mono); font-size: 10px; color: var(--ink-3); letter-spacing: .06em; }
        .t-layer-targets span { color: var(--gold); }
        .t-layer-rev { background: var(--space-4); padding: 24px 28px; border-left: 1px solid var(--border-w); display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 160px; text-align: center; }
        .t-layer-rev-n { font-family: var(--serif); font-size: 36px; letter-spacing: .04em; color: var(--gold); line-height: 1; margin-bottom: 4px; }
        .t-layer-rev-l { font-family: var(--mono); font-size: 9px; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
        .t-layer-timeline { margin-top: 6px; font-family: var(--mono); font-size: 9px; color: var(--cyan); letter-spacing: .06em; }

        /* DEALS */
        .t-deals { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        .t-deal-card { background: var(--space-3); border: 1px solid var(--border-w); border-radius: 10px; overflow: hidden; transition: all .25s; }
        .t-deal-card:hover { border-color: var(--cyan); transform: translateY(-4px); box-shadow: 0 0 0 1px rgba(0,212,255,.1), 0 24px 60px rgba(0,0,0,.5); }
        .t-deal-card.featured { border-color: var(--gold); position: relative; }
        .t-deal-card.featured::before { content: 'RECOMMENDED'; position: absolute; top: 14px; right: -28px; background: var(--gold); color: var(--space); font-family: var(--mono); font-size: 8px; letter-spacing: .14em; font-weight: 700; padding: 4px 36px; transform: rotate(45deg); }
        .t-deal-top { padding: 28px 24px 20px; border-bottom: 1px solid var(--border-w); }
        .t-deal-letter { font-family: var(--serif); font-size: 14px; letter-spacing: .1em; color: var(--cyan); margin-bottom: 12px; }
        .t-deal-name { font-family: var(--cond); font-size: 20px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #fff; margin-bottom: 8px; }
        .t-deal-rate { font-family: var(--serif); font-size: 30px; letter-spacing: .02em; color: var(--gold); margin-bottom: 8px; }
        .t-deal-desc { font-size: 13px; color: var(--ink-3); line-height: 1.65; font-weight: 300; }
        .t-deal-bottom { padding: 20px 24px; }
        .t-deal-hook { font-size: 14px; font-style: italic; color: var(--ink-2); font-weight: 300; line-height: 1.6; padding-left: 14px; border-left: 2px solid var(--cyan); margin-bottom: 12px; }
        .t-deal-upside { font-family: var(--mono); font-size: 10px; color: var(--gold); letter-spacing: .08em; }

        /* FINANCIAL MODEL */
        .t-fin-shell { background: var(--space-3); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; box-shadow: 0 40px 120px rgba(0,0,0,.5); }
        .t-fin-bar { background: var(--space-4); padding: 16px 28px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
        .t-fin-bar-title { font-family: var(--cond); font-size: 16px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #fff; }
        .t-fin-bar-live { display: flex; align-items: center; gap: 6px; font-family: var(--mono); font-size: 10px; color: var(--green); }
        .t-fin-body { display: grid; grid-template-columns: 1fr 1fr; }
        .t-fin-inputs { padding: 28px 32px; border-right: 1px solid var(--border-w); display: flex; flex-direction: column; gap: 22px; }
        .t-fi-label { font-family: var(--mono); font-size: 9px; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
        .t-fi-val { font-family: var(--serif); font-size: 20px; letter-spacing: .04em; color: var(--gold); }
        .t-range { -webkit-appearance: none; width: 100%; height: 3px; background: var(--border-w); border-radius: 2px; cursor: pointer; outline: none; margin-top: 10px; }
        .t-range::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--cyan); border: 3px solid var(--space-3); box-shadow: 0 0 0 2px var(--cyan); transition: transform .15s; }
        .t-range::-webkit-slider-thumb:hover { transform: scale(1.2); }
        .t-partner-btns { display: flex; gap: 6px; flex-wrap: wrap; }
        .t-pb { padding: 8px 10px; background: var(--space-4); border: 1px solid var(--border-w); border-radius: 3px; color: var(--ink-3); font-family: var(--mono); font-size: 9px; letter-spacing: .08em; text-transform: uppercase; cursor: pointer; transition: all .15s; font-weight: 500; }
        .t-pb.active { background: var(--cyan-p); border-color: var(--cyan); color: var(--cyan); }
        .t-fin-outputs { padding: 28px 32px; display: flex; flex-direction: column; gap: 12px; }
        .t-fo-big { background: linear-gradient(135deg, rgba(0,212,255,.08) 0%, transparent 100%); border: 1px solid var(--border); border-radius: 6px; padding: 20px 24px; display: flex; justify-content: space-between; align-items: flex-start; }
        .t-fo-big-label { font-size: 14px; color: var(--ink-2); }
        .t-fo-big-sub { font-family: var(--mono); font-size: 10px; color: var(--ink-3); margin-top: 3px; }
        .t-fo-big-val { font-family: var(--serif); font-size: 44px; letter-spacing: .02em; color: var(--cyan); line-height: 1; text-align: right; }
        .t-fo-big-sub2 { font-family: var(--mono); font-size: 10px; color: var(--cyan); text-align: right; margin-top: 4px; }
        .t-fo-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 16px; background: var(--space-4); border: 1px solid var(--border-w); border-radius: 4px; }
        .t-fo-label { font-size: 13px; color: var(--ink-3); }
        .t-fo-val { font-family: var(--mono); font-size: 14px; font-weight: 500; }
        .t-fo-val.tc { color: var(--cyan); }
        .t-fo-val.tg { color: var(--green); }
        .t-fo-val.gold { color: var(--gold); }
        .t-fin-disc { padding: 13px 28px; border-top: 1px solid var(--border-w); background: var(--space-4); font-size: 11px; color: var(--ink-3); line-height: 1.6; }

        /* JOHN NOEL */
        .t-noel-card { background: var(--space-3); border: 1px solid var(--gold); border-radius: 10px; overflow: hidden; box-shadow: 0 0 0 1px rgba(245,200,66,.08), 0 24px 80px rgba(0,0,0,.6); }
        .t-noel-header { background: var(--gold); padding: 18px 28px; display: flex; align-items: center; justify-content: space-between; }
        .t-noel-header-title { font-family: var(--cond); font-size: 18px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--space); }
        .t-noel-header-tag { font-family: var(--mono); font-size: 9px; letter-spacing: .14em; text-transform: uppercase; color: var(--space); background: rgba(3,6,15,.2); padding: 4px 12px; border-radius: 2px; }
        .t-noel-body { padding: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .t-noel-timeline { display: flex; flex-direction: column; gap: 0; }
        .t-noel-event { display: grid; grid-template-columns: 80px 1fr; position: relative; }
        .t-noel-event:not(:last-child)::before { content: ''; position: absolute; left: 39px; top: 32px; bottom: -8px; width: 2px; background: linear-gradient(180deg, var(--border-2) 0%, transparent 100%); }
        .t-noel-year { padding: 8px 12px 8px 0; font-family: var(--mono); font-size: 10px; color: var(--gold); letter-spacing: .08em; padding-top: 10px; }
        .t-noel-fact-wrap { padding: 8px 0 16px 20px; border-left: 2px solid var(--border-w); }
        .t-noel-fact { font-size: 13px; color: var(--ink-3); line-height: 1.6; font-weight: 300; }
        .t-noel-fact strong { color: var(--ink-2); font-weight: 400; }
        .t-noel-right { display: flex; flex-direction: column; gap: 14px; }
        .t-noel-strategy { background: var(--space-4); border: 1px solid var(--border-w); border-radius: 8px; padding: 18px 20px; }
        .t-noel-strategy-h { font-family: var(--mono); font-size: 9px; letter-spacing: .16em; text-transform: uppercase; color: var(--cyan); margin-bottom: 10px; }
        .t-noel-strategy-p { font-size: 13px; color: var(--ink-3); line-height: 1.65; font-weight: 300; }
        .t-noel-strategy-p strong { color: var(--gold); font-weight: 400; }
        .t-noel-email { background: var(--space-4); border: 1px solid rgba(245,200,66,.2); border-radius: 8px; padding: 18px 20px; }
        .t-noel-email-h { font-family: var(--mono); font-size: 9px; letter-spacing: .16em; text-transform: uppercase; color: var(--gold); margin-bottom: 10px; }
        .t-noel-email-body { font-size: 13px; color: var(--ink-2); line-height: 1.75; font-style: italic; font-weight: 300; }
        .t-noel-footer { padding: 16px 28px; border-top: 1px solid var(--border-w); background: rgba(245,200,66,.04); font-family: var(--mono); font-size: 10px; color: var(--gold); letter-spacing: .06em; display: flex; gap: 24px; flex-wrap: wrap; }

        /* FINAL CTA */
        .t-final { padding: 120px 52px; text-align: center; position: relative; z-index: 1; overflow: hidden; }
        .t-final::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 60% at 50% 0%, rgba(0,212,255,.07) 0%, transparent 65%); pointer-events: none; }
        .t-final-inner { max-width: 720px; margin: 0 auto; position: relative; }
        .t-final-h { font-family: var(--serif); font-size: clamp(60px, 7vw, 100px); letter-spacing: .04em; line-height: .92; color: #fff; margin-bottom: 24px; }
        .t-final-h .tc { color: var(--cyan); }
        .t-final-p { font-size: 18px; color: var(--ink-3); line-height: 1.72; font-weight: 300; margin-bottom: 48px; }
        .t-final-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .t-trust-strip { margin-top: 48px; display: flex; justify-content: center; gap: 28px; flex-wrap: wrap; }
        .t-trust-item { font-family: var(--mono); font-size: 9px; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); display: flex; align-items: center; gap: 6px; }
        .t-trust-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--cyan); }

        /* FOOTER */
        .t-footer { padding: 28px 52px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1; flex-wrap: wrap; gap: 12px; }
        .t-footer-logo { font-family: var(--serif); font-size: 18px; letter-spacing: .06em; color: var(--ink-3); }
        .t-footer-logo .tc { color: var(--cyan); }
        .t-footer-links { display: flex; gap: 20px; flex-wrap: wrap; }
        .t-footer-link { font-family: var(--mono); font-size: 9px; color: var(--ink-3); letter-spacing: .1em; text-decoration: none; text-transform: uppercase; transition: color .15s; }
        .t-footer-link:hover { color: var(--cyan); }

        /* HEARTBEAT ICON */
        .t-hb-icon { display: inline-flex; align-items: center; vertical-align: middle; margin-right: 8px; }
        @keyframes t-hb-beat { 0%,100%{transform:scale(1)} 14%{transform:scale(1.18)} 28%{transform:scale(1)} 42%{transform:scale(1.12)} 56%{transform:scale(1)} }
        @keyframes t-hb-line { 0%{stroke-dashoffset:320;opacity:0} 10%{opacity:1} 60%{stroke-dashoffset:0;opacity:1} 80%{opacity:.4} 100%{stroke-dashoffset:-320;opacity:0} }
        .t-hb-heart { animation: t-hb-beat 1.6s ease-in-out infinite; transform-origin: 50px 50px; }
        .t-hb-pulse { stroke-dasharray:320; stroke-dashoffset:320; animation: t-hb-line 1.6s ease-in-out infinite; }

        /* RESPONSIVE */
        @media(max-width:960px) {
          .t-nav { padding: 0 20px; }
          .t-nav-links { display: none; }
          .t-hero { grid-template-columns: 1fr; }
          .t-hero-left { padding: 56px 20px 32px; }
          .t-hero-right { padding: 0 20px 56px; }
          .t-section { padding: 72px 20px; }
          .t-crisis-grid, .t-deals { grid-template-columns: 1fr; }
          .t-layer { grid-template-columns: 60px 1fr; }
          .t-layer-rev { display: none; }
          .t-fin-body { grid-template-columns: 1fr; }
          .t-noel-body { grid-template-columns: 1fr; }
          .t-final { padding: 80px 20px; }
          .t-footer { padding: 20px; flex-direction: column; gap: 12px; text-align: center; }
        }
      `}</style>

      <div className="t-wrap">
        <div className="t-stars" />

        {/* NAV */}
        <nav className="t-nav">
          <a className="t-nav-logo" href="/">
            <div className="t-nav-eye"><div className="t-nav-iris" /></div>
            EyeD <span className="t-nav-sub">ID LAB</span>
          </a>
          <div className="t-nav-links">
            <a href="#problem" className="t-nav-link">The Problem</a>
            <a href="#product" className="t-nav-link">The Scan</a>
            <a href="#layers" className="t-nav-link">Business Model</a>
            <a href="#deals" className="t-nav-link">Deal Structure</a>
            <a href="#model" className="t-nav-link">Financials</a>
          </div>
          <a href="mailto:partnerships@eyedlab.io" className="t-nav-cta">Get in Touch →</a>
        </nav>

        {/* HERO */}
        <section className="t-hero">
          <div className="t-hero-left">
            <div className="t-kicker">
              <span className="t-hb-icon">
                <svg viewBox="0 0 100 100" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <defs>
                    <clipPath id="thb-clip">
                      <path d="M14 34 C14 23 23 16 33 16 C40 16 46 20 50 26 C54 20 60 16 67 16 C77 16 86 23 86 34 C86 57 50 80 50 80 C50 80 14 57 14 34Z" />
                    </clipPath>
                  </defs>
                  <g className="t-hb-heart">
                    <path d="M50 80 C50 80 14 57 14 34 C14 23 23 16 33 16 C40 16 46 20 50 26 C54 20 60 16 67 16 C77 16 86 23 86 34 C86 57 50 80 50 80Z" fill="none" stroke="#00d4ff" strokeWidth="2.5" />
                  </g>
                  <polyline className="t-hb-pulse" points="18,50 28,50 32,42 36,58 40,38 44,62 48,50 52,50 56,44 60,56 64,50 82,50" fill="none" stroke="#00d4ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#thb-clip)" />
                </svg>
              </span>
              Travel Health Vertical · Global Opportunity
            </div>
            <h1 className="t-h1">
              <span className="ti">One eye scan.</span>
              INSTANT<br />RECORDS.<br /><span className="tc">ANYWHERE.</span>
            </h1>
            <p className="t-p">
              A traveler collapses in Bangkok. The clinic has no records. No medications list. No allergies. They treat blind.{" "}
              <strong>People die from this.</strong> EyeD ID solves it with a smartphone camera — no language barrier, no wallet, no phone required.
            </p>
            <div className="t-btns">
              <a href="#layers" className="btn-t-cyan">See the Business Model ↓</a>
              <a href="#model" className="btn-t-outline">Financial Model →</a>
            </div>
          </div>

          <div className="t-hero-right">
            <div className="t-world-card">
              <div className="t-world-bar">
                <span className="t-world-title">Global Coverage · Live</span>
                <span className="t-world-live"><span className="t-live-dot" />Smartphone · Any Camera</span>
              </div>
              <div className="t-world-map">
                <svg className="t-world-svg" viewBox="0 0 440 240" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="tg-us" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#00d4ff" stopOpacity=".4" />
                      <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="tg-eu" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f5c842" stopOpacity=".4" />
                      <stop offset="100%" stopColor="#f5c842" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="tg-sea" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#00d4ff" stopOpacity=".3" />
                      <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <line x1="0" y1="60" x2="440" y2="60" stroke="rgba(0,212,255,.06)" strokeWidth=".5" />
                  <line x1="0" y1="120" x2="440" y2="120" stroke="rgba(0,212,255,.06)" strokeWidth=".5" />
                  <line x1="0" y1="180" x2="440" y2="180" stroke="rgba(0,212,255,.06)" strokeWidth=".5" />
                  <line x1="110" y1="0" x2="110" y2="240" stroke="rgba(0,212,255,.06)" strokeWidth=".5" />
                  <line x1="220" y1="0" x2="220" y2="240" stroke="rgba(0,212,255,.06)" strokeWidth=".5" />
                  <line x1="330" y1="0" x2="330" y2="240" stroke="rgba(0,212,255,.06)" strokeWidth=".5" />
                  <path d="M40 40 L110 35 L120 55 L115 90 L100 110 L80 115 L55 105 L35 85 Z" fill="rgba(0,212,255,.06)" stroke="rgba(0,212,255,.15)" strokeWidth=".8" />
                  <path d="M75 125 L100 120 L105 145 L100 175 L80 185 L60 170 L58 145 Z" fill="rgba(0,212,255,.04)" stroke="rgba(0,212,255,.1)" strokeWidth=".8" />
                  <path d="M190 30 L230 28 L238 50 L230 65 L215 68 L195 60 Z" fill="rgba(245,200,66,.06)" stroke="rgba(245,200,66,.15)" strokeWidth=".8" />
                  <path d="M195 80 L230 78 L238 110 L230 145 L215 158 L198 148 L188 118 L188 90 Z" fill="rgba(0,212,255,.04)" stroke="rgba(0,212,255,.1)" strokeWidth=".8" />
                  <path d="M248 25 L370 20 L385 55 L370 90 L340 100 L310 95 L280 85 L255 70 L242 50 Z" fill="rgba(0,212,255,.05)" stroke="rgba(0,212,255,.12)" strokeWidth=".8" />
                  <path d="M330 105 L360 100 L370 125 L355 140 L335 138 L322 120 Z" fill="rgba(0,212,255,.06)" stroke="rgba(0,212,255,.15)" strokeWidth=".8" />
                  <path d="M335 155 L385 148 L395 175 L385 195 L355 198 L335 182 Z" fill="rgba(0,212,255,.04)" stroke="rgba(0,212,255,.1)" strokeWidth=".8" />
                  <line className="t-scan-line" x1="0" y1="115" x2="440" y2="115" stroke="rgba(0,212,255,.25)" strokeWidth="1" />
                  <circle cx="78" cy="80" r="16" fill="url(#tg-us)" className="t-map-pulse" />
                  <circle cx="78" cy="80" r="5" fill="#00d4ff" opacity=".9" />
                  <circle cx="78" cy="80" r="8" fill="none" stroke="#00d4ff" strokeWidth="1" opacity=".6" />
                  <text x="78" y="70" textAnchor="middle" fontFamily="DM Mono,monospace" fontSize="7" fill="#00d4ff" letterSpacing="1">ENROLL</text>
                  <circle cx="72" cy="108" r="4" fill="#f5c842" opacity=".85" />
                  <circle cx="72" cy="108" r="7" fill="none" stroke="#f5c842" strokeWidth=".8" opacity=".5" />
                  <circle cx="210" cy="50" r="14" fill="url(#tg-eu)" className="t-map-pulse" style={{ animationDelay: ".8s" }} />
                  <circle cx="210" cy="50" r="4" fill="#f5c842" opacity=".9" />
                  <text x="210" y="42" textAnchor="middle" fontFamily="DM Mono,monospace" fontSize="7" fill="#f5c842" letterSpacing="1">ACCESS</text>
                  <circle cx="340" cy="115" r="18" fill="url(#tg-sea)" className="t-map-pulse" style={{ animationDelay: "1.4s" }} />
                  <circle cx="340" cy="115" r="5" fill="#00d4ff" opacity=".9" />
                  <circle cx="340" cy="115" r="10" fill="none" stroke="#00d4ff" strokeWidth="1" opacity=".5" />
                  <text x="340" y="106" textAnchor="middle" fontFamily="DM Mono,monospace" fontSize="7" fill="#00d4ff" letterSpacing="1">SCAN</text>
                  <line x1="78" y1="80" x2="210" y2="50" stroke="rgba(0,212,255,.15)" strokeWidth=".8" strokeDasharray="4 3" />
                  <line x1="78" y1="80" x2="340" y2="115" stroke="rgba(0,212,255,.15)" strokeWidth=".8" strokeDasharray="4 3" />
                  <line x1="210" y1="50" x2="340" y2="115" stroke="rgba(245,200,66,.12)" strokeWidth=".8" strokeDasharray="4 3" />
                  <rect x="155" y="148" width="20" height="8" rx="4" fill="rgba(46,204,136,.2)" stroke="rgba(46,204,136,.4)" strokeWidth=".8" />
                  <text x="165" y="144" textAnchor="middle" fontFamily="DM Mono,monospace" fontSize="6" fill="#2ecc88">CRUISE</text>
                  <circle cx="20" cy="218" r="4" fill="#00d4ff" />
                  <text x="30" y="221" fontFamily="DM Mono,monospace" fontSize="8" fill="rgba(0,212,255,.7)">Enrolled</text>
                  <circle cx="90" cy="218" r="4" fill="#f5c842" />
                  <text x="100" y="221" fontFamily="DM Mono,monospace" fontSize="8" fill="rgba(245,200,66,.7)">Access point</text>
                  <circle cx="175" cy="218" r="4" fill="#2ecc88" />
                  <text x="185" y="221" fontFamily="DM Mono,monospace" fontSize="8" fill="rgba(46,204,136,.7)">Cruise/hotel</text>
                </svg>
              </div>
              <div className="t-world-stats">
                <div className="t-ws-cell"><div className="t-ws-n">180+</div><div className="t-ws-l">Countries</div></div>
                <div className="t-ws-cell"><div className="t-ws-n">Smartphone</div><div className="t-ws-l">Hardware needed</div></div>
                <div className="t-ws-cell"><div className="t-ws-n">30s</div><div className="t-ws-l">Record retrieval</div></div>
              </div>
              <div className="t-scan-evt">Live scan: Phuket, Thailand · Allergy flag surfaced · Evacuation avoided</div>
            </div>
          </div>
        </section>

        {/* TICKER */}
        <div className="t-ticker">
          <div className="t-ticker-inner">
            {[
              ["Travel Insurance Market", "$23B global market"],
              ["Medical Evacuation", "$50K–$300K per incident"],
              ["Global Travelers", "1.4B international trips / year"],
              ["Royal Caribbean", "6M+ passengers / year"],
              ["Medical Tourism", "$100B+ industry"],
              ["Hardware", "iOS · Android · any smartphone camera"],
              ["Record Access", "30 seconds from eye scan"],
              ["Particle Health", "320M+ US records · pre-travel cache"],
            ].flatMap((item, i) => [
              <span key={`a${i}`} className="t-ti">{item[0]} <span className="tv">{item[1]}</span></span>,
              <span key={`sep${i}`} style={{ color: "rgba(0,212,255,.2)" }}>·</span>,
            ]).concat(
              [
                ["Travel Insurance Market", "$23B global market"],
                ["Medical Evacuation", "$50K–$300K per incident"],
                ["Global Travelers", "1.4B international trips / year"],
                ["Royal Caribbean", "6M+ passengers / year"],
                ["Medical Tourism", "$100B+ industry"],
                ["Hardware", "iOS · Android · any smartphone camera"],
                ["Record Access", "30 seconds from eye scan"],
                ["Particle Health", "320M+ US records · pre-travel cache"],
              ].flatMap((item, i) => [
                <span key={`b${i}`} className="t-ti">{item[0]} <span className="tv">{item[1]}</span></span>,
                <span key={`bsep${i}`} style={{ color: "rgba(0,212,255,.2)" }}>·</span>,
              ])
            )}
          </div>
        </div>

        {/* THE CRISIS */}
        <section className="t-section" id="problem">
          <div className="t-inner">
            <div className="t-eyebrow reveal" {...r()}>The Problem</div>
            <h2 className="t-sh reveal rd1" {...r(1)}>1.4 BILLION<br />INTERNATIONAL<br /><span className="tc">TRIPS / YEAR.</span></h2>
            <p className="t-sp reveal rd2" {...r(2)}>Every one of those travelers is a stranger to every clinic they might visit. No records. No medications list. No allergies. Doctors treat them blind — and sometimes it kills them.</p>
            <div className="t-crisis-grid reveal rd3" {...r(3)}>
              {[
                { icon: "🚁", stat: "$200K", h: "Average medical evacuation cost", p: "Insurers pay $50K–$300K per incident. Many evacuations happen because the local clinic can't safely treat — not because treatment is impossible, but because they don't know the patient's history." },
                { icon: "⚠️", stat: "15–20%", h: "Medical claims involve unknown patient history", p: "Conservative industry estimate. The foreign clinic doesn't know what medications the patient is on, what they're allergic to, or what conditions they have. They make decisions blind." },
                { icon: "💊", stat: "$0", h: "Current solutions for this problem", p: "Paper cards no one carries. Phone apps that require the patient to be conscious. Medical bracelets that list nothing useful. There is no technology-first solution to this. Until now." },
              ].map(({ icon, stat, h, p }) => (
                <div key={stat} className="t-crisis-card">
                  <span className="t-crisis-icon">{icon}</span>
                  <div className="t-crisis-stat">{stat}</div>
                  <div className="t-crisis-h">{h}</div>
                  <p className="t-crisis-p">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THE PRODUCT */}
        <section className="t-section t-section-alt" id="product">
          <div className="t-inner">
            <div className="t-eyebrow reveal" {...r()}>The Product</div>
            <h2 className="t-sh reveal rd1" {...r(1)}>SCAN THE EYE.<br />GET THE <span className="tc">RECORD.</span></h2>
            <p className="t-sp reveal rd2" {...r(2)}>Any smartphone. Any country. Any language. Staff points the camera at the patient's eye. In 30 seconds, their complete medical history appears — translated, flagged, and source-linked to US clinical records.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
              <div className="reveal rd1" {...r(1)}>
                <div className="t-scan-demo">
                  <div className="t-scan-bar">
                    <span className="t-scan-bar-title">EyeD ID — Live Scan</span>
                    <span className="t-scan-bar-status"><span className="t-live-dot" />Verified · 8.2s</span>
                  </div>
                  <div className="t-scan-eye-area">
                    <div className="t-eye-graphic">
                      <div className="t-eye-ring" />
                      <div className="t-eye-ring" />
                      <div className="t-eye-ring" />
                      <div className="t-eye-iris"><div className="t-eye-pupil" /></div>
                    </div>
                  </div>
                  <div className="t-scan-progress"><div className="t-scan-progress-bar" /></div>
                  <div className="t-scan-result">
                    <div className="t-scan-row"><span className="t-scan-label">Patient</span><span className="t-scan-val tc">Robert T. Dawkins · DOB 08/22/1961</span></div>
                    <div className="t-scan-row"><span className="t-scan-label">Blood Type</span><span className="t-scan-val">A+ · Verified</span></div>
                    <div className="t-scan-row"><span className="t-scan-label">Allergies</span><span className="t-scan-val alert">⚠ Penicillin — anaphylaxis (2019)</span></div>
                    <div className="t-scan-row"><span className="t-scan-label">Current Meds</span><span className="t-scan-val">Metformin · Lisinopril · Atorvastatin</span></div>
                    <div className="t-scan-row"><span className="t-scan-label">Conditions</span><span className="t-scan-val">Type 2 Diabetes · Hypertension</span></div>
                    <div className="t-scan-row"><span className="t-scan-label">Emergency Contact</span><span className="t-scan-val ok">✓ Linked · notified</span></div>
                  </div>
                  <div className="t-scan-flag">⚠ Drug interaction: NSAIDs + Lisinopril — review before prescribing additional anti-inflammatories</div>
                  <div className="t-scan-lang">
                    <span className="t-lang-badge">EN</span>
                    <span className="t-lang-badge">TH ภาษาไทย</span>
                    <span className="t-lang-badge">ES Español</span>
                    <span className="t-lang-badge">PT Português</span>
                    <span className="t-lang-badge">ZH 中文</span>
                    <span className="t-lang-badge">+40</span>
                  </div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink-3)", borderTop: "1px solid var(--border-w)", paddingTop: 10, marginTop: 10 }}>
                    Powered by Particle Health · via CommonWell · Carequality · eHealthExchange
                  </div>
                </div>
              </div>
              <div className="reveal rd2" {...r(2)}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
                  <div style={{ background: "var(--space-3)", border: "1px solid var(--border-w)", borderRadius: 8, padding: "22px 20px" }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--cyan)", marginBottom: 10 }}>How it works</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {[
                        "Patient enrolls via MyPulseScan before travel. US records cached as \u2018travel-ready\u2019 in Particle Health network.",
                        "Patient collapses abroad. Hotel medic, clinic, or first responder opens EyeD ID on any smartphone — iPhone or Android.",
                        "Camera scans the patient's iris. Biometric match retrieves complete US medical record in seconds (time varies by network).",
                        "Record displays in local language. Allergies flagged. Drug interactions checked. Emergency contact notified.",
                      ].map((text, i) => (
                        <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                          <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: "var(--cyan)", lineHeight: 1, flexShrink: 0 }}>{i + 1}</div>
                          <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6, fontWeight: 300, paddingTop: 4 }}>{text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: "rgba(46,204,136,.06)", border: "1px solid rgba(46,204,136,.2)", borderRadius: 8, padding: "18px 20px" }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--green)", marginBottom: 8 }}>Hardware answer</div>
                    <div style={{ fontSize: 14, color: "#fff", fontWeight: 600, marginBottom: 6 }}>Smartphone only. No proprietary device.</div>
                    <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.65, fontWeight: 300 }}>Any smartphone — iPhone or Android. No special hardware to distribute, no logistics problem to solve, no clinic installation required. The distribution channel is the App Store.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 LAYERS */}
        <section className="t-section" id="layers">
          <div className="t-inner">
            <div className="t-eyebrow reveal" {...r()}>Business Architecture</div>
            <h2 className="t-sh reveal rd1" {...r(1)}>FOUR LAYERS.<br />ONE <span className="tc">FLYWHEEL.</span></h2>
            <p className="t-sp reveal rd2" {...r(2)}>Enroll patients in the US before they travel. Make the records accessible anywhere in the world. No foreign clinic needs to join the network — they just need a browser and a camera.</p>
            <div className="t-layers reveal rd2" {...r(2)}>
              {[
                { num: "01", tag: "Now · US-side enrollment", h: "Patient Enrollment — Pre-Travel", p: "Patient enrolls via MyPulseScan before their trip. Records flagged \u2018travel-ready\u2019 and cached in Particle Health. The US records are already in the network — no new data infrastructure needed.", targets: "Travel insurance affiliates · Airline apps · State Dept advisories · AAA · Direct enrollment", rev: "$5–10", revl: "per policy / per enrollment", timeline: "↑ Fastest revenue" },
                { num: "02", tag: "Phase 1 · First responder access", h: "Hotel, Resort & Cruise Line Access", p: "Hotel concierge, resort medic, cruise ship doctor scans the eye on any smartphone. Gets blood type, allergies, medications, emergency contact — translated. No clinic relationship needed.", targets: "Marriott · Hilton · All-inclusive resorts · Royal Caribbean · Carnival · Norwegian", rev: "$3/guest", revl: "monthly SaaS to property", timeline: "↑ Massive scale" },
                { num: "03", tag: "Phase 2 · Foreign clinics", h: "Medical Tourism Hub Clinics", p: "Clinics in Cancún, Bangkok, Phuket, San José, Bogotá already treat Americans daily and fly blind. Approach as a free tool that improves their outcomes. Charge the insurer, not the clinic.", targets: "Mexico · Thailand · Costa Rica · Colombia · India medical hubs", rev: "$25", revl: "per access event (insurer pays)", timeline: "→ Long-term defensibility" },
                { num: "04", tag: "Phase 3 · Premium play", h: "Medical Tourism Record Transfer", p: "Patients flying to Mexico, Thailand, or Costa Rica for elective surgery need their full US record at the foreign hospital. A $100B+ industry with zero good record transfer solution.", targets: "Patients Beyond Borders · JCI-accredited hospitals · Medical tourism facilitators", rev: "$150+", revl: "per surgical record transfer", timeline: "→ Premium margin" },
              ].map(({ num, tag, h, p, targets, rev, revl, timeline }) => (
                <div key={num} className="t-layer">
                  <div className="t-layer-num">{num}</div>
                  <div className="t-layer-body">
                    <div className="t-layer-tag">{tag}</div>
                    <div className="t-layer-h">{h}</div>
                    <p className="t-layer-p">{p}</p>
                    <div className="t-layer-targets">Targets: <span>{targets}</span></div>
                  </div>
                  <div className="t-layer-rev">
                    <div className="t-layer-rev-n">{rev}</div>
                    <div className="t-layer-rev-l">{revl}</div>
                    <div className="t-layer-timeline">{timeline}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DEALS */}
        <section className="t-section t-section-alt" id="deals">
          <div className="t-inner">
            <div className="t-eyebrow reveal" {...r()}>Deal Structures</div>
            <h2 className="t-sh reveal rd1" {...r(1)}>HOW TO STRUCTURE<br />THE <span className="tg">PARTNERSHIP.</span></h2>
            <p className="t-sp reveal rd2" {...r(2)}>Three ways to structure the partnership. Each solves a different buyer objection. The right choice depends on how your partner wants to account for it — as product cost, claims savings, or brand differentiation.</p>
            <div className="t-deals reveal rd2" {...r(2)}>
              <div className="t-deal-card">
                <div className="t-deal-top">
                  <div className="t-deal-letter">OPTION A</div>
                  <div className="t-deal-name">Per-Policy License</div>
                  <div className="t-deal-rate">$3–8 / policy</div>
                  <p className="t-deal-desc">Insurer bundles EyeD ID enrollment into every travel policy. &quot;Your policy includes medical record protection.&quot; They raise premiums $10–15 to cover it. Net positive on day one.</p>
                </div>
                <div className="t-deal-bottom">
                  <div className="t-deal-hook">At 2M policies × $5 = <strong style={{ color: "var(--cyan)", fontStyle: "normal" }}>$10M ARR</strong> from one contract.</div>
                  <div className="t-deal-upside">Partner raises premium $10–15 to cover · net positive immediately</div>
                </div>
              </div>
              <div className="t-deal-card featured">
                <div className="t-deal-top">
                  <div className="t-deal-letter">OPTION B</div>
                  <div className="t-deal-name">Claims Savings Rev Share</div>
                  <div className="t-deal-rate">10% of savings</div>
                  <p className="t-deal-desc">"Pay us 10% of what we save you." EyeD ID gets a percentage of documented medical evacuation costs avoided. Aligns incentives perfectly. Best for the pilot phase — data tells the story.</p>
                </div>
                <div className="t-deal-bottom">
                  <div className="t-deal-hook">If EyeD ID prevents 10% of evacuations on 2M policies, that&apos;s <strong style={{ color: "var(--gold)", fontStyle: "normal" }}>$40M+ in savings</strong> — we take $4M.</div>
                  <div className="t-deal-upside">Zero risk to try · escalates naturally · hard to say no</div>
                </div>
              </div>
              <div className="t-deal-card">
                <div className="t-deal-top">
                  <div className="t-deal-letter">OPTION C</div>
                  <div className="t-deal-name">White Label</div>
                  <div className="t-deal-rate">Platform + per-activation</div>
                  <p className="t-deal-desc">&quot;[Partner] MedID powered by EyeD ID Lab.&quot; The insurer owns the customer relationship, we&apos;re the infrastructure. Platform fee plus per-access activation fee. Instant differentiator vs competitors.</p>
                </div>
                <div className="t-deal-bottom">
                  <div className="t-deal-hook">Worth <strong style={{ color: "var(--cyan)", fontStyle: "normal" }}>$20–50M</strong> in contract value at scale. Instant global credibility.</div>
                  <div className="t-deal-upside">Our long-term moat · makes us acquisition-worthy · hardest to replicate</div>
                </div>
              </div>
            </div>

            {/* PILOT PROPOSAL */}
            <div style={{ marginTop: 24, background: "var(--space-3)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }} className="reveal rd3" {...r(3)}>
              <div style={{ background: "var(--cyan)", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontFamily: "var(--cond)", fontSize: 16, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--space)" }}>The 90-Day Pilot — Present This Before Any Enterprise Meeting</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--space)", background: "rgba(3,6,15,.2)", padding: "4px 12px", borderRadius: 2 }}>No Commitment</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "var(--border-w)" }}>
                {[
                  { n: "10K", h: "Enrolled policyholders", p: "Minimum cohort for statistically meaningful evacuation data" },
                  { n: "90", h: "Days of live data", p: "Real emergencies. Real scans. Real evacuation decisions documented and tracked." },
                  { n: "$50K", h: "Pilot fee", p: "Covers implementation. Signals serious intent from both sides. Not a free trial." },
                  { n: "ROI", h: "The deliverable", p: "Branded report: scans accessed, evacuations impacted, documented savings, annualized projection." },
                ].map(({ n, h, p }) => (
                  <div key={n} style={{ background: "var(--space-3)", padding: "22px 20px" }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 36, color: n === "$50K" ? "var(--gold)" : n === "ROI" ? "var(--green)" : "var(--cyan)", lineHeight: 1, marginBottom: 8 }}>{n}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 5 }}>{h}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.55, fontWeight: 300 }}>{p}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "16px 28px", borderTop: "1px solid var(--border-w)", fontFamily: "var(--serif)", fontSize: 16, fontStyle: "italic", color: "var(--ink-2)" }}>
                &ldquo;Design the pilot before pitching the pilot. Your partner will ask what success looks like in 90 days. Have a specific answer.&rdquo;
              </div>
            </div>
          </div>
        </section>

        {/* FINANCIAL MODEL */}
        <section className="t-section" id="model">
          <div className="t-inner">
            <div className="t-eyebrow reveal" {...r()}>Financial Model</div>
            <h2 className="t-sh reveal rd1" {...r(1)} style={{ marginBottom: 48 }}>EVERY NUMBER<br /><span className="tc">ADJUSTABLE.</span></h2>
            <div className="t-fin-shell reveal rd2" {...r(2)}>
              <div className="t-fin-bar">
                <div>
                  <div className="t-fin-bar-title">Travel Vertical P&L Model</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", marginTop: 2 }}>Base case · adjust all inputs below</div>
                </div>
                <div className="t-fin-bar-live"><span className="t-live-dot" />Live</div>
              </div>
              <div className="t-fin-body">
                <div className="t-fin-inputs">
                  <div>
                    <div className="t-fi-label">Partner Type <span className="t-fi-val">{partnerNames[partner]}</span></div>
                    <div className="t-partner-btns">
                      {partnerNames.map((name, i) => (
                        <button key={i} className={`t-pb${partner === i ? " active" : ""}`} onClick={() => applyPreset(i)}>{name.split(" ")[0]}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="t-fi-label">Policies / guests enrolled <span className="t-fi-val">{policies >= 1_000_000 ? `${(policies / 1_000_000).toFixed(1)}M` : `${(policies / 1000).toFixed(0)}K`}</span></div>
                    <input type="range" className="t-range" min="10000" max="5000000" value={policies} step="10000" onChange={(e) => setPolicies(Number(e.target.value))} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-3)", marginTop: 6 }}><span>10K</span><span>1M</span><span>2.5M</span><span>5M</span></div>
                  </div>
                  <div>
                    <div className="t-fi-label">Fee per policy <span className="t-fi-val">${fee.toFixed(2)}</span></div>
                    <input type="range" className="t-range" min="1" max="20" value={fee} step="0.5" onChange={(e) => setFee(Number(e.target.value))} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-3)", marginTop: 6 }}><span>$1</span><span>$5</span><span>$10</span><span>$20</span></div>
                  </div>
                  <div>
                    <div className="t-fi-label">% with emergency event <span className="t-fi-val">{eventPct}%</span></div>
                    <input type="range" className="t-range" min="0.1" max="3" value={eventPct} step="0.1" onChange={(e) => setEventPct(Number(e.target.value))} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-3)", marginTop: 6 }}><span>0.1%</span><span>1%</span><span>2%</span><span>3%</span></div>
                  </div>
                  <div>
                    <div className="t-fi-label">% evacuations prevented <span className="t-fi-val">{preventPct}%</span></div>
                    <input type="range" className="t-range" min="1" max="40" value={preventPct} step="1" onChange={(e) => setPreventPct(Number(e.target.value))} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-3)", marginTop: 6 }}><span>1%</span><span>10%</span><span>25%</span><span>40%</span></div>
                  </div>
                  <div>
                    <div className="t-fi-label">Avg evacuation cost <span className="t-fi-val">{fmt(evacCost)}</span></div>
                    <input type="range" className="t-range" min="30000" max="300000" value={evacCost} step="10000" onChange={(e) => setEvacCost(Number(e.target.value))} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-3)", marginTop: 6 }}><span>$30K</span><span>$100K</span><span>$200K</span><span>$300K</span></div>
                  </div>
                </div>
                <div className="t-fin-outputs">
                  <div className="t-fo-big">
                    <div>
                      <div className="t-fo-big-label">Annual Revenue (EyeD ID)</div>
                      <div className="t-fo-big-sub">Enrollment fees</div>
                    </div>
                    <div>
                      <div className="t-fo-big-val">{fmt(enrollRev)}</div>
                      <div className="t-fo-big-sub2">${fee} × {policies >= 1_000_000 ? `${(policies / 1_000_000).toFixed(1)}M` : `${(policies / 1000).toFixed(0)}K`} policies</div>
                    </div>
                  </div>
                  <div className="t-fo-row"><span className="t-fo-label">📍 Emergency events / year</span><span className="t-fo-val tc">{events.toLocaleString()}</span></div>
                  <div className="t-fo-row"><span className="t-fo-label">🚁 Evacuations prevented</span><span className="t-fo-val tg">{prevented.toLocaleString()}</span></div>
                  <div className="t-fo-row"><span className="t-fo-label">💰 Partner savings (evacuations avoided)</span><span className="t-fo-val tg">{fmt(savings)}</span></div>
                  <div className="t-fo-row"><span className="t-fo-label">📊 ROI for partner (savings vs. fee)</span><span className="t-fo-val gold">{roi}×</span></div>
                  <div className="t-fo-row"><span className="t-fo-label">🎯 Rev share option (10% of savings)</span><span className="t-fo-val tc">{fmt(shareRev)}</span></div>
                  <div style={{ background: "rgba(0,212,255,.06)", border: "1px solid var(--border)", borderRadius: 6, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Total contract value (best option)</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", marginTop: 2 }}>Higher of enrollment fee or rev share</div>
                    </div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 36, color: "var(--cyan)" }}>{fmt(bestRev)}</div>
                  </div>
                </div>
              </div>
              <div className="t-fin-disc">* Emergency event rates based on industry estimates. Evacuation costs are national averages. Prevention rate is conservative. Rev share assumes 10% of documented savings. All figures illustrative for investor/partner evaluation.</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "var(--border-w)", border: "1px solid var(--border-w)", borderRadius: 10, overflow: "hidden", marginTop: 20 }} className="reveal rd3" {...r(3)}>
              {[
                { label: "Travel Insurer (2M policies)", n: "$10M", sub: "$5 × 2M policies/yr", color: "var(--cyan)" },
                { label: "Travel Insurer (5M policies)", n: "$25M", sub: "$5 × 5M policies/yr", color: "var(--gold)" },
                { label: "Royal Caribbean (6M pax)", n: "$18M", sub: "$3 × 6M passengers/yr", color: "var(--green)" },
                { label: "Medical Tourism (direct)", n: "$25M", sub: "$50 × 500K patients/yr", color: "var(--amber)" },
              ].map(({ label, n, sub, color }) => (
                <div key={label} style={{ background: "var(--space-3)", padding: "28px 24px", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color, marginBottom: 10 }}>{label}</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 40, color, lineHeight: 1, marginBottom: 6 }}>{n}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* JOHN NOEL — REMOVED (private) */}
        {false && <section className="t-section t-section-alt" id="noel">
          <div className="t-inner">
            <div className="t-noel-card">
              <div className="t-noel-header">
                <span className="t-noel-header-title">John Noel Brief — Travel Guard Founder</span>
                <span className="t-noel-header-tag">Founder-to-Founder · 20 minutes</span>
              </div>
              <div className="t-noel-body">
                <div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 16 }}>What we know — confirmed</div>
                  <div className="t-noel-timeline">
                    {[
                      { year: "1985", fact: "Founded Travel Guard from his basement in Stevens Point, WI. Built it into the largest travel insurance company in the US." },
                      { year: "1993", fact: "Reacquired Travel Guard from GMF (French firm). Has done this before — a founder who buys back his company is entrepreneurial by nature." },
                      { year: "2006", fact: "Sold to AIG for a significant exit. Stepped down as CEO in 2009 after earn-out period." },
                      { year: "Dec 2024", fact: "AIG sold Travel Guard to Zurich Insurance Group for $600M. John does NOT own it currently — Zurich does. Call John as an introducer and potential partner, not a check-writer." },
                      { year: "Now", fact: "His relationships inside Travel Guard / Zurich remain warm. He is the founder — they take his call. Likely looking for his next venture or advisory role." },
                    ].map(({ year, fact }) => (
                      <div key={year} className="t-noel-event">
                        <div className="t-noel-year">{year}</div>
                        <div className="t-noel-fact-wrap"><div className="t-noel-fact" dangerouslySetInnerHTML={{ __html: fact.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="t-noel-right">
                  <div className="t-noel-strategy">
                    <div className="t-noel-strategy-h">The right framing for the call</div>
                    <p className="t-noel-strategy-p">
                      Don&apos;t pitch him as if he can write the check. He can&apos;t — Zurich owns it now. Pitch him as:<br /><br />
                      1. <strong>Warm intro to Zurich Travel Guard leadership</strong> — his name gets the call returned<br />
                      2. <strong>His credibility as founder</strong> saying &ldquo;this is what I wish I had built when I ran Travel Guard&rdquo;<br />
                      3. <strong>Strategic advisor for 1–2% equity</strong> — his name opens doors globally in travel insurance<br />
                      4. <strong>Explore what he&apos;s building next</strong> — a founder who sold for $600M is likely active
                    </p>
                  </div>
                  <div className="t-noel-email">
                    <div className="t-noel-email-h">The outreach message (under 100 words)</div>
                    <div className="t-noel-email-body">
                      &ldquo;John — I&apos;m building something in the travel health space I think you&apos;ll find interesting. Eye scan → instant patient records in any language, anywhere in the world. 30 seconds.<br /><br />
                      I know Zurich has Travel Guard now. Would love 20 minutes to get your perspective on where the industry is headed, and whether this is a problem you think they&apos;d want to solve.<br /><br />
                      Free for a call this week or next?&rdquo;
                    </div>
                  </div>
                </div>
              </div>
              <div className="t-noel-footer">
                <div>Ask: <strong>20-minute call, no deck attached</strong></div>
                <div>Goal: <strong>Warm intro to Zurich Travel Guard VP</strong></div>
                <div>Secondary: <strong>Advisor conversation (1–2% equity)</strong></div>
                <div>Do NOT lead with: <strong>product features or pricing</strong></div>
              </div>
            </div>
          </div>
        </section>}

        {/* FINAL CTA */}
        <section className="t-final">
          <div className="t-final-inner">
            <div className="t-eyebrow" style={{ justifyContent: "center" }}>Ready to Build This</div>
            <h2 className="t-final-h">ONE CALL.<br /><span className="tc">CHANGES EVERYTHING.</span></h2>
            <p className="t-final-p">The technology exists. The records exist. The market exists. The connection exists. The only question is when — not if.</p>
            <div className="t-final-btns">
              <a href="mailto:partnerships@eyedlab.io" className="btn-t-cyan">partnerships@eyedlab.io →</a>
              <a href="/" className="btn-t-outline">← Back to EyeD ID Lab</a>
            </div>
            <div className="t-trust-strip">
              {["320M+ patient records", "Powered by Particle Health", "HIPAA BAA", "HITRUST Certified", "FHIR R4"].map((t) => (
                <div key={t} className="t-trust-item"><span className="t-trust-dot" />{t}</div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="t-footer">
          <div className="t-footer-logo">EyeD <span className="tc">ID</span> Lab</div>
          <div className="t-footer-links">
            <a href="/" className="t-footer-link">Home</a>
            <a href="/terms" className="t-footer-link">Terms</a>
            <a href="/privacy" className="t-footer-link">Privacy</a>
            <a href="mailto:partnerships@eyedlab.io" className="t-footer-link">partnerships@eyedlab.io</a>
          </div>
        </footer>
      </div>
    </>
  );
}
