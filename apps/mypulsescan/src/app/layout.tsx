import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MyPulseScan — Patient Health Record Intelligence for Clinics',
  description: 'Give every patient the care they deserve. MyPulseScan connects your clinic to 320M+ US patient records in 30 seconds — no forms, no faxing. Built for urgent care, primary care, and insurance-based practices.',
  metadataBase: new URL('https://mypulsescan.com'),
  alternates: {
    canonical: 'https://mypulsescan.com',
  },
  openGraph: {
    title: 'MyPulseScan — Patient Health Record Intelligence',
    description: 'Connect your clinic to 320M+ US patient records in 30 seconds. Medicare-billable RPM included.',
    url: 'https://mypulsescan.com',
    siteName: 'MyPulseScan',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MyPulseScan — Patient Health Record Intelligence for Urgent Care and Primary Care',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyPulseScan — Patient Health Record Intelligence',
    description: 'Connect your clinic to 320M+ US patient records in 30 seconds. Medicare-billable RPM included.',
    images: ['/og-image.jpg'],
  },
  keywords: ['urgent care EHR', 'patient record retrieval', 'FHIR integration', 'RPM billing', 'CommonWell health', 'Carequality', 'TEFCA'],
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MyPulseScan',
  url: 'https://mypulsescan.com',
  logo: 'https://mypulsescan.com/og-image.jpg',
  description: 'MyPulseScan connects clinics to 320M+ US patient records in 30 seconds — no forms, no faxing. Built for urgent care, primary care, and insurance-based practices.',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@mypulsescan.com',
    contactType: 'sales',
  },
  sameAs: ['https://mypulsescan.com'],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'MyPulseScan',
  url: 'https://mypulsescan.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://mypulsescan.com/?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-to-main">Skip to main content</a>
        {children}
      </body>
    </html>
  )
}
