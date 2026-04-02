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
  metadataBase: new URL('https://mypulsescan.health'),
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
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'MyPulseScan',
              url: 'https://mypulsescan.health',
              logo: 'https://mypulsescan.health/logo.png',
              description:
                'Clinical intelligence platform for multi-location practices, PE-backed MSOs, and enterprise health networks.',
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'pilot@mypulsescan.health',
                contactType: 'sales',
              },
              sameAs: ['https://mypulsescan.com'],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'MyPulseScan Health',
              url: 'https://mypulsescan.health',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://mypulsescan.health/?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is MyPulseScan Health?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'MyPulseScan Health is a clinical intelligence platform for multi-location medical practices, PE-backed MSOs, and enterprise health networks. It aggregates patient health records from CommonWell, Carequality, TEFCA, and Surescripts at the point of care.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How does MyPulseScan pricing work for MSOs?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'MyPulseScan uses usage-based pricing: $299/location/month base rate covering the first 200 record pulls, plus $0.50 per pull over 200. For 50+ location platforms, a revenue-share model is available at $299/location/month plus 10% of net new RPM billing generated.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What is the 30-day pilot program?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'The MyPulseScan 30-day pilot is free for one location. It includes full platform access, a day-30 ROI summary report, records retrieved and interactions flagged, RPM-eligible patient identification, and a rollout recommendation.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Which EMR systems does MyPulseScan integrate with?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'MyPulseScan integrates with Epic, Athena, eClinicalWorks, and Cerner via Redox middleware. Patient records are pushed directly into the chart — zero re-entry required.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How much RPM revenue can a multi-location practice generate with MyPulseScan?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'A network of 100 locations with 200 patients each, 40% chronic, can generate approximately $684,000/month in RPM billing revenue via CPT codes 99453, 99454, and 99457 — with MyPulseScan receiving 10% and the network keeping 90%.',
                  },
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  )
}
