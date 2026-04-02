import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'MyPulseScan — Patient Health Record Intelligence'
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
          background: '#F8F7F3',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Teal accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: '#0D6B6E', display: 'flex' }} />

        {/* Logo / brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: '#0D6B6E', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.9)', borderRadius: '50%', display: 'flex' }} />
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#0f1117', letterSpacing: '-0.5px' }}>
            MyPulseScan
          </span>
        </div>

        {/* Headline */}
        <div style={{
          fontSize: 64,
          fontWeight: 700,
          color: '#0f1117',
          lineHeight: 1.1,
          marginBottom: 28,
          maxWidth: 860,
        }}>
          Patient health records
          <br />
          <span style={{ color: '#0D6B6E' }}>in 30 seconds.</span>
        </div>

        {/* Sub */}
        <div style={{
          fontSize: 28,
          color: '#3d4152',
          maxWidth: 720,
          lineHeight: 1.4,
        }}>
          320M+ US patient records. No forms, no faxing.
          Medicare-billable RPM included.
        </div>

        {/* Bottom bar */}
        <div style={{
          position: 'absolute', bottom: 48, left: 96, right: 96,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 20, color: '#7c8098' }}>mypulsescan.com</span>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Urgent Care', 'Primary Care', 'Medicare RPM'].map(tag => (
              <span key={tag} style={{
                padding: '6px 16px', borderRadius: 20,
                background: '#e0f4f4', color: '#0D6B6E',
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
