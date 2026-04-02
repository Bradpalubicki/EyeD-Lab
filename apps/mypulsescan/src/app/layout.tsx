import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MyPulseScan — Patient Health Record Intelligence for Clinics',
  description: 'Give every patient the care they deserve. MyPulseScan connects your clinic to 320M+ US patient records in 30 seconds — no forms, no faxing. Built for urgent care, primary care, and insurance-based practices.',
  metadataBase: new URL('https://mypulsescan.com'),
  openGraph: {
    title: 'MyPulseScan — Patient Health Record Intelligence',
    description: 'Connect your clinic to 320M+ US patient records in 30 seconds. Medicare-billable RPM included.',
    url: 'https://mypulsescan.com',
    siteName: 'MyPulseScan',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  keywords: ['urgent care EHR', 'patient record retrieval', 'FHIR integration', 'RPM billing', 'CommonWell health', 'Carequality', 'TEFCA'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
