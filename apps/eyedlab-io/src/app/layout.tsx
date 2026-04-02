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
    "The identity layer for healthcare. EyeD ID Lab aggregates, verifies, and delivers patient health records at the point of care across every major US health network.",
  alternates: {
    canonical: "https://eyedlab.io",
  },
  openGraph: {
    title: "EyeD ID Lab — Clinical Data Infrastructure",
    description:
      "The identity layer for healthcare. EyeD ID Lab aggregates, verifies, and delivers patient health records at the point of care across every major US health network.",
    url: "https://eyedlab.io",
    siteName: "EyeD ID Lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EyeD ID Lab — Clinical Data Infrastructure",
    description:
      "The identity layer for healthcare. EyeD ID Lab aggregates, verifies, and delivers patient health records at the point of care across every major US health network.",
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
      </head>
      <body>{children}</body>
    </html>
  );
}
