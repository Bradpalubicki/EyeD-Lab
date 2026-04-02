import type { Metadata } from 'next'
import BillingClient from './BillingClient'

export const metadata: Metadata = {
  title: 'Medicare RPM Billing: CPT 99453 99454 99457 | MyPulseScan',
  description:
    'CPT codes 99453, 99454, and 99457 turn patient record retrieval into recurring Medicare revenue. Real examples for urgent care and primary care practices.',
  alternates: {
    canonical: 'https://mypulsescan.com/billing',
  },
  openGraph: {
    title: 'Medicare RPM Billing: CPT 99453 99454 99457 | MyPulseScan',
    description:
      'CPT codes 99453, 99454, and 99457 turn patient record retrieval into recurring Medicare revenue. Real examples for urgent care and primary care.',
    url: 'https://mypulsescan.com/billing',
    siteName: 'MyPulseScan',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MyPulseScan Medicare Billing — CPT Codes for Patient Record Retrieval',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medicare RPM Billing: CPT 99453 99454 99457 | MyPulseScan',
    description:
      'See how CPT 99453, 99454, and 99457 turn patient record retrieval into recurring Medicare revenue.',
    images: ['/og-image.jpg'],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://mypulsescan.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Medicare Billing',
      item: 'https://mypulsescan.com/billing',
    },
  ],
}

export default function BillingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BillingClient />
    </>
  )
}
