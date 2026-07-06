export type LeadSource =
  | "discovery_call"
  | "brochure"
  | "financing"
  | "newsletter"
  | "contact";

export interface LeadPayload {
  source: LeadSource;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  zip?: string;
  modelInterest?: string;
  intendedUse?: string;
  processStage?: string;
  message?: string;
  scheduledAt?: string;
  turnstileToken?: string;
  [key: string]: unknown;
}

export interface SubmitLeadResult {
  ok: boolean;
  status: number;
  error?: string;
}

export async function submitLead(
  payload: LeadPayload,
): Promise<SubmitLeadResult> {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}) as { error?: string });
      console.warn("[leads] submit failed", res.status, body?.error);
      return {
        ok: false,
        status: res.status,
        error:
          body?.error ??
          (res.status === 403
            ? "Bot-check failed. Please try again."
            : "Something went wrong. Please try again."),
      };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    console.warn("[leads] submit error", err);
    return {
      ok: false,
      status: 0,
      error: "Network error. Please try again.",
    };
  }
}

const CONVERSION_FLAG_KEY = "hemma_conv_flag";

export function markConversionPending(source: string): void {
  try {
    sessionStorage.setItem(
      CONVERSION_FLAG_KEY,
      JSON.stringify({ source, ts: Date.now() }),
    );
  } catch {
    /* no-op */
  }
}

export function consumeConversionFlag(expectedSource: string): boolean {
  try {
    const raw = sessionStorage.getItem(CONVERSION_FLAG_KEY);
    if (!raw) return false;
    sessionStorage.removeItem(CONVERSION_FLAG_KEY);
    const parsed = JSON.parse(raw) as { source?: string; ts?: number };
    if (!parsed?.source || parsed.source !== expectedSource) return false;
    if (typeof parsed.ts !== "number" || Date.now() - parsed.ts > 5 * 60_000) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
