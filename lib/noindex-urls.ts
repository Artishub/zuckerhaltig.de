// Filter and comparison URLs have no numbers of their own; keep them out of the index but let Google follow links.
export function isNoindexUrl(pathname: string, search: string) {
  if (pathname === "/de/getraenke/vergleich" || pathname.startsWith("/de/getraenke/vergleich/")) return true;
  return pathname === "/de/getraenke" && search.length > 1;
}
