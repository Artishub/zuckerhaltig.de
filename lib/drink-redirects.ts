import { canonicalPackageDrinkId, drinks } from "@/lib/data/drinks";
import { drinkPageHref, drinkRedirectTarget, removedDrinkRedirects } from "@/lib/page-routing";

// Every /de/getraenke/<id> that redirects, resolved once. The middleware answers these directly,
// so the redirect never goes through a page render (which sent the Location header twice on a cache miss).
const targets = new Map<string, string>(Object.entries(removedDrinkRedirects));

for (const drink of drinks) {
  const target = canonicalPackageDrinkId(drink) !== drink.id ? drinkPageHref(drink) : drinkRedirectTarget(drink);
  if (target) targets.set(drink.id, target);
}

export function drinkRedirectFor(pathname: string) {
  const match = /^\/de\/getraenke\/([^/]+)\/?$/.exec(pathname);
  return match ? targets.get(match[1]) ?? null : null;
}
