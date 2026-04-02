import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MyPulseScan.health — Clinical Intelligence at Scale for MSOs & PE-Backed Platforms',
  description:
    'Built for multi-location practices, PE-backed MSOs, and enterprise health networks. Turn patient data into revenue with per-location pricing, RPM billing automation, and 30-day pilots.',
  metadataBase: new URL('https://mypulsescan.health'),
  openGraph: {
    title: 'MyPulseScan.health — Clinical Intelligence at Scale',
    description:
      'Per-location pricing. 30-day pilot. $1,140/enrolled patient/year in RPM revenue. Built for chains, MSOs, and PE-backed platforms.',
    url: 'https://mypulsescan.health',
    siteName: 'MyPulseScan.health',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyPulseScan.health — Clinical Intelligence at Scale',
    description: 'Per-location pricing. 30-day pilot. Built for MSOs and PE-backed platforms.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
