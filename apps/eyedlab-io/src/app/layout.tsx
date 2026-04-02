import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eyedlab.io"),
  title: "EyeD ID Lab — Clinical Data Infrastructure",
  description:
    "Build on 320M+ patient records via one FHIR R4 API. Powered by Particle Health. HITRUST, SOC2, HIPAA compliant.",
  keywords: [
    "clinical data infrastructure",
    "FHIR R4 API",
    "patient health records",
    "Particle Health",
    "health information exchange",
    "HIPAA compliant API",
    "EHR integration",
    "healthcare data API",
    "HITRUST certified",
    "CommonWell Carequality",
    "MyPulseScan",
    "clinical decision support",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://eyedlab.io",
  },
  openGraph: {
    title: "EyeD ID Lab — Clinical Data Infrastructure",
    description:
      "Build on 320M+ patient records via one FHIR R4 API. Powered by Particle Health. HITRUST, SOC2, HIPAA compliant.",
    url: "https://eyedlab.io",
    siteName: "EyeD ID Lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EyeD ID Lab — Clinical Data Infrastructure",
    description:
      "Build on 320M+ patient records via one FHIR R4 API. Powered by Particle Health. HITRUST, SOC2, HIPAA compliant.",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EyeD ID Lab",
  url: "https://eyedlab.io",
  description:
    "Clinical data infrastructure company providing the identity layer for healthcare.",
  contactPoint: [
    {
      "@type": "ContactPoint",
      email: "partnerships@eyedlab.io",
      contactType: "partnerships",
    },
    {
      "@type": "ContactPoint",
      email: "developers@eyedlab.io",
      contactType: "technical support",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is EyeD ID Lab?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "EyeD ID Lab is a clinical data infrastructure company that provides API access to over 320 million patient records aggregated from national and state health information exchange networks — including CommonWell, Carequality, TEFCA, and Surescripts — via a single FHIR R4 API. The platform is powered by Particle Health.",
      },
    },
    {
      "@type": "Question",
      name: "How does EyeD ID Lab access patient health records?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "EyeD ID Lab routes clinical queries simultaneously through CommonWell, Carequality, TEFCA, and Surescripts via Particle Health's underlying network. Patient identity is resolved using Verato MPI, achieving a 90% average national patient match rate. Results are returned as structured FHIR R4 resources or C-CDA documents.",
      },
    },
    {
      "@type": "Question",
      name: "Is EyeD ID Lab HIPAA compliant?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. EyeD ID Lab operates as a HIPAA Business Associate and executes Business Associate Agreements (BAAs) with all covered entity and business associate partners. The platform is HITRUST Certified and SOC 2 Type II audited.",
      },
    },
    {
      "@type": "Question",
      name: "What products does EyeD ID Lab offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "EyeD ID Lab offers two products: MyPulseScan (mypulsescan.com), a point-of-care record retrieval tool for urgent care and primary care clinics, and MyPulseScan Health (mypulsescan.health), an enterprise clinical intelligence platform for PE-backed MSOs and multi-location healthcare networks.",
      },
    },
    {
      "@type": "Question",
      name: "How can I integrate with EyeD ID Lab's API?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Developers and healthcare organizations can request API access by contacting developers@eyedlab.io. EyeD ID Lab provides FHIR R4 and C-CDA delivery, direct write-back to Epic, Athena, eClinicalWorks, and Cerner, and flexible integration options for AI, clinical decision support, care management, and quality reporting use cases.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://eyedlab.io",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Terms of Service",
      item: "https://eyedlab.io/terms",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Privacy Policy",
      item: "https://eyedlab.io/privacy",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-to-main">Skip to main content</a>
        {children}
      </body>

    </html>
  );
}
