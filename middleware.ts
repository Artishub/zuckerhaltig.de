import { type NextRequest, NextResponse } from "next/server";
import { isNoindexUrl } from "@/lib/noindex-urls";


export function middleware(request: NextRequest) {
  if (request.nextUrl.hostname === "zuckerhaltig.de") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = "www.zuckerhaltig.de";
    if (url.pathname === "/") url.pathname = "/de";
    return NextResponse.redirect(`https://www.zuckerhaltig.de${url.pathname}${url.search}`, 308);
  }

  const response = NextResponse.next();
  if (isNoindexUrl(request.nextUrl.pathname, request.nextUrl.search)) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }
  return response;
}
