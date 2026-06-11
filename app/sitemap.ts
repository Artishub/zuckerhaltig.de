import type { MetadataRoute } from "next";
import { articles } from "@/lib/content/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://zuckerhaltig.de";
  const staticRoutes = [
    "/de",
    "/de/getraenke",
    "/de/marken",
    "/de/kategorien",
    "/de/wissen",
    "/de/faq",
    "/de/datenschutz",
    "/de/impressum",
    "/de/nutzungsbedingungen",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
    })),
    ...articles.map((article) => ({
      url: `${base}/de/wissen/${article.slug}`,
      lastModified: new Date(),
    })),
  ];
}
