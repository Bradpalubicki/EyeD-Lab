import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://eyedlab.io",
      lastModified: new Date("2026-04-02"),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: "https://eyedlab.io/terms",
      lastModified: new Date("2026-04-02"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://eyedlab.io/privacy",
      lastModified: new Date("2026-04-02"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
