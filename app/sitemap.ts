import type { MetadataRoute } from "next";
import { articles } from "@/lib/content/articles";
import { canonicalDrinks, drinks } from "@/lib/data/drinks";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/de",
    "/de/getraenke",
    "/de/marken",
    "/de/kategorien",
    "/de/wissen",
    "/de/faq",
    "/de/ueber",
    "/de/cola-zucker",
    "/de/energy-drinks-zucker",
    "/de/eistee-zucker",
    "/de/vergleiche/coca-cola-vs-pepsi-zucker",
    "/de/vergleiche/red-bull-vs-monster-zucker",
    "/de/vergleiche/fanta-vs-sprite-zucker",
    "/de/rankings/zuckerreichste-getraenke",
    "/de/rankings/zuckerfreie-getraenke",
    "/de/datenschutz",
    "/de/impressum",
    "/de/nutzungsbedingungen",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
    })),
    ...articles.map((article) => ({
      url: `${siteUrl}/de/wissen/${article.slug}`,
      lastModified: new Date(),
    })),
    ...canonicalDrinks(drinks).map((drink) => ({
      url: `${siteUrl}/de/getraenke/${drink.id}`,
      lastModified: new Date(),
    })),
  ];
}
