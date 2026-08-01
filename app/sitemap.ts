import type { MetadataRoute } from "next";
import { articles } from "@/lib/content/articles";
import { categoryLandingPages } from "@/lib/category-landing-pages";
import { canonicalPackageDrinks, drinks } from "@/lib/data/drinks";
import { featuredBrandPages } from "@/lib/featured-brand-pages";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/de",
    "/de/getraenke",
    "/de/marken",
    "/de/zuckerrechner",
    "/de/kategorien",
    "/de/wissen",
    "/de/faq",
    "/de/ueber",
    "/de/energy-drinks-zucker",
    "/de/eistee-zucker",
    "/de/vergleiche/coca-cola-vs-pepsi-zucker",
    "/de/vergleiche/red-bull-vs-monster-zucker",
    "/de/vergleiche/fanta-vs-sprite-zucker",
    "/de/rankings/zuckerreichste-getraenke",
    "/de/rankings/zuckerfreie-getraenke",
    "/de/rankings/zuckerarme-softdrinks",
    "/de/datenschutz",
    "/de/impressum",
    "/de/nutzungsbedingungen",
  ];

  return [
    ...staticRoutes.map((route) => ({ url: `${siteUrl}${route}` })),
    ...featuredBrandPages.map((brand) => ({ url: `${siteUrl}/de/marken/${brand.id}` })),
    ...categoryLandingPages.map((category) => ({ url: `${siteUrl}/de/kategorien/${category.id}` })),
    ...articles.map((article) => ({
      url: `${siteUrl}/de/wissen/${article.slug}`,
      ...(article.updatedAt ? { lastModified: article.updatedAt } : {}),
    })),
    ...canonicalPackageDrinks(drinks).map((drink) => ({
      url: `${siteUrl}/de/getraenke/${drink.id}`,
    })),
  ];
}
