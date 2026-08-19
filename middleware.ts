import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.hostname !== "zuckerhaltig.de") return NextResponse.next();

  const url = request.nextUrl.clone();
  url.protocol = "https:";
  url.hostname = "www.zuckerhaltig.de";
  if (url.pathname === "/") url.pathname = "/de";
  return NextResponse.redirect(`https://www.zuckerhaltig.de${url.pathname}${url.search}`, 308);
}
