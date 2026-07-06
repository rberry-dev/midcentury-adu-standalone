const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileResult {
  ok: boolean;
  error?: string;
}

export async function verifyTurnstile(
  token: string | null | undefined,
  remoteip?: string,
): Promise<TurnstileResult> {
  const isProduction = process.env.NODE_ENV === "production";
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // If unconfigured, fail closed in production but allow in development so
    // local work doesn't break.
    if (isProduction) {
      return { ok: false, error: "Bot protection unavailable" };
    }
    return { ok: true };
  }
  if (!token || typeof token !== "string") {
    return { ok: false, error: "Please complete the bot-check challenge." };
  }
  // Outside production, accept Cloudflare's well-known test token issued by
  // the always-pass dev sitekey (1x00000000000000000000AA). The real secret
  // would reject it, so we short-circuit before calling siteverify.
  if (!isProduction && token === "XXXX.DUMMY.TOKEN.XXXX") {
    return { ok: true };
  }
  if (!isProduction) {
    // Dev preview hostnames can't satisfy the real sitekey's allowed-domains
    // list, so treat any non-empty token in dev as valid. Production still
    // performs the real siteverify call below.
    return { ok: true };
  }
  try {
    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", token);
    if (remoteip) body.set("remoteip", remoteip);
    const r = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await r.json()) as { success?: boolean };
    if (!data.success) {
      return { ok: false, error: "Bot-check failed. Please try again." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not verify bot-check. Please retry." };
  }
}
