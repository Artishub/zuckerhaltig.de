import { drinkRedirectFor } from "@/lib/drink-redirects";

export const canonicalOrigin = "https://www.zuckerhaltig.de";

// The public host as sent by the browser or the proxy, without port. nextUrl.hostname can be the internal server name.
export function requestHost(headers: Headers) {
  const host = headers.get("x-forwarded-host") ?? headers.get("host") ?? "";
  return host.split(",")[0].trim().split(":")[0].toLowerCase();
}

// Apex requests go straight to the final www URL, including drink redirects, so every old URL needs one hop only.
export function apexRedirectTarget(pathname: string, search: string) {
  const path = pathname === "/" ? "/de" : pathname;
  const drinkTarget = drinkRedirectFor(path);
  return `${canonicalOrigin}${drinkTarget ?? `${path}${search}`}`;
}
