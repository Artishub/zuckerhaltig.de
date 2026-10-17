import { type NextRequest, NextResponse } from "next/server";
import { drinkRedirectFor } from "@/lib/drink-redirects";
import { apexRedirectTarget, canonicalOrigin, requestHost } from "@/lib/host-redirects";
import { isNoindexUrl } from "@/lib/noindex-urls";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (requestHost(request.headers) === "zuckerhaltig.de") {
    return NextResponse.redirect(apexRedirectTarget(pathname, search), 308);
  }

  // Absolute canonical target: the request URL behind the proxy can carry the internal host and port.
  const drinkTarget = drinkRedirectFor(pathname);
  if (drinkTarget) return NextResponse.redirect(`${canonicalOrigin}${drinkTarget}`, 308);

  const response = NextResponse.next();
  if (isNoindexUrl(pathname, search)) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }
  return response;
}
