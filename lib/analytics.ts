// Google Analytics events (gtag loads in components/cookie-consent.tsx after consent). Safe to call when analytics is blocked.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | "swap_select"
  | "swap_frequency"
  | "swap_link"
  | "header_search_select"
  | "header_search_submit"
  | "compare_share";

export function trackEvent(name: AnalyticsEvent, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}
