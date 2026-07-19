import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.hostname !== "zuckerhaltig.de") return NextResponse.next();

  const url = request.nextUrl.clone();
  url.hostname = "www.zuckerhaltig.de";
  return NextResponse.redirect(url, 308);
}
