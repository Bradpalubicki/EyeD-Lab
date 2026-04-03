import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pet Biometric ID · EyeD ID Lab",
  description:
    "Iris scan → pet owner and vet records in seconds. Any smartphone. No chip scanner needed. EyeD ID Lab — the biometric identity layer for 86.9M US pet households.",
  alternates: {
    canonical: "https://eyedlab.io/pet",
  },
  openGraph: {
    title: "Pet Biometric ID · EyeD ID Lab",
    description:
      "One iris scan identifies any enrolled pet — owner contact, vet records, emergency contacts surface instantly. No hardware required.",
    url: "https://eyedlab.io/pet",
    siteName: "EyeD ID Lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pet Biometric ID · EyeD ID Lab",
    description:
      "Iris scan → pet owner and vet records in seconds. Any smartphone. No chip scanner needed.",
  },
};

export default function PetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
