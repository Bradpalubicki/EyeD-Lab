import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Health · EyeD ID Lab",
  description:
    "Eye scan → instant patient records anywhere in the world. 30 seconds. Any smartphone. The travel health solution powered by 320M+ US records via Particle Health.",
  alternates: {
    canonical: "https://eyedlab.io/travel",
  },
  openGraph: {
    title: "Travel Health · EyeD ID Lab",
    description:
      "Eye scan → instant patient records in any language, anywhere in the world. 30 seconds. Any smartphone camera.",
    url: "https://eyedlab.io/travel",
    siteName: "EyeD ID Lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Health · EyeD ID Lab",
    description:
      "Eye scan → instant patient records anywhere in the world. 30 seconds. Any smartphone.",
  },
};

export default function TravelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
