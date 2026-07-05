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
