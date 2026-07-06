declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export type LeadSource =
  | "discovery_call"
  | "brochure"
  | "financing"
  | "newsletter"
  | "contact";

const VALUE_BY_SOURCE: Record<LeadSource, number> = {
  discovery_call: 100,
  financing: 60,
  brochure: 25,
  contact: 40,
  newsletter: 5,
};

export function trackLead(source: LeadSource, extra?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const value = VALUE_BY_SOURCE[source] ?? 10;
  const payload = {
    event: "lead_submit",
    lead_source: source,
    value,
    currency: "USD",
    ...extra,
  };
  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push(payload);
  } catch {
    /* no-op */
  }
  try {
    window.gtag?.("event", "generate_lead", {
      lead_source: source,
      value,
      currency: "USD",
      ...extra,
    });
  } catch {
    /* no-op */
  }
  try {
    window.fbq?.("track", "Lead", {
      content_category: source,
      value,
      currency: "USD",
      ...extra,
    });
  } catch {
    /* no-op */
  }
}
