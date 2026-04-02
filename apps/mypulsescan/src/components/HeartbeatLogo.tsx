'use client'

export default function HeartbeatLogo({ size = 80 }: { size?: number }) {
  return (
    <div style={{ display: 'inline-block', width: size, height: size }}>
      <style>{`
        @keyframes heartbeat {
          0%   { transform: scale(1); }
          14%  { transform: scale(1.18); }
          28%  { transform: scale(1); }
          42%  { transform: scale(1.12); }
          56%  { transform: scale(1); }
          100% { transform: scale(1); }
        }
        @keyframes pulse-line {
          0%   { stroke-dashoffset: 320; opacity: 0; }
          10%  { opacity: 1; }
          60%  { stroke-dashoffset: 0; opacity: 1; }
          80%  { opacity: 0.4; }
          100% { stroke-dashoffset: -320; opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(13,107,110,0.4)); }
          28%       { filter: drop-shadow(0 0 14px rgba(13,107,110,0.9)); }
          42%       { filter: drop-shadow(0 0 10px rgba(13,107,110,0.7)); }
        }
        .hb-heart {
          animation: heartbeat 1.6s ease-in-out infinite, pulse-glow 1.6s ease-in-out infinite;
          transform-origin: center;
        }
        .hb-pulse {
          stroke-dasharray: 320;
          stroke-dashoffset: 320;
          animation: pulse-line 1.6s ease-in-out infinite;
        }
      `}</style>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="MyPulseScan heartbeat logo"
      >
        {/* Heart shape */}
        <g className="hb-heart">
          <path
            d="M50 82 C50 82 12 58 12 34 C12 22 22 14 33 14 C40 14 46 18 50 24 C54 18 60 14 67 14 C78 14 88 22 88 34 C88 58 50 82 50 82Z"
            fill="var(--teal, #0D6B6E)"
            opacity="0.15"
          />
          <path
            d="M50 80 C50 80 14 57 14 34 C14 23 23 16 33 16 C40 16 46 20 50 26 C54 20 60 16 67 16 C77 16 86 23 86 34 C86 57 50 80 50 80Z"
            fill="none"
            stroke="var(--teal, #0D6B6E)"
            strokeWidth="2.5"
          />
        </g>

        {/* ECG pulse line through the heart */}
        <polyline
          className="hb-pulse"
          points="18,50 28,50 32,42 36,58 40,38 44,62 48,50 52,50 56,44 60,56 64,50 82,50"
          fill="none"
          stroke="var(--teal, #0D6B6E)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          clipPath="url(#heart-clip)"
        />

        {/* Clip to heart area */}
        <defs>
          <clipPath id="heart-clip">
            <path d="M14 34 C14 23 23 16 33 16 C40 16 46 20 50 26 C54 20 60 16 67 16 C77 16 86 23 86 34 C86 57 50 80 50 80 C50 80 14 57 14 34Z" />
          </clipPath>
        </defs>
      </svg>
    </div>
  )
}
