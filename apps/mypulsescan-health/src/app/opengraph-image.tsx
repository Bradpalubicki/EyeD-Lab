import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'MyPulseScan Health — MSO Clinical Intelligence Platform'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px 96px',
          background: '#0a1628',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Teal accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: '#0D6B6E', display: 'flex' }} />

        {/* Logo / brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.5px' }}>
            MyPulseScan<span style={{ color: '#0e8285' }}>.health</span>
          </span>
          <span style={{
            padding: '4px 12px', borderRadius: 6,
            background: 'rgba(13,107,110,0.3)', color: '#5de8c0',
            fontSize: 14, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>Enterprise</span>
        </div>

        {/* Headline */}
        <div style={{
          fontSize: 60,
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1.1,
          marginBottom: 28,
          maxWidth: 900,
        }}>
          Medicare pays $95.
          <br />
          <span style={{ color: '#5de8c0' }}>We charge $6. You keep $89.</span>
        </div>

        {/* Sub */}
        <div style={{
          fontSize: 26,
          color: 'rgba(255,255,255,0.6)',
          maxWidth: 720,
          lineHeight: 1.4,
        }}>
          Clinical intelligence for PE-backed MSOs and multi-location practices.
          30-day pilot. No IT project.
        </div>

        {/* Bottom bar */}
        <div style={{
          position: 'absolute', bottom: 48, left: 96, right: 96,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.4)' }}>mypulsescan.health</span>
          <div style={{ display: 'flex', gap: 16 }}>
            {['MSOs', 'PE-Backed Chains', 'Enterprise Networks'].map(tag => (
              <span key={tag} style={{
                padding: '6px 16px', borderRadius: 20,
                background: 'rgba(13,107,110,0.3)', color: '#5de8c0',
                fontSize: 18, fontWeight: 600,
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
