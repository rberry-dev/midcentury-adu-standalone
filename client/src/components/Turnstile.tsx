import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "flexible" | "compact" | "invisible";
          appearance?: "always" | "execute" | "interaction-only";
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptLoading: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptLoading) return scriptLoading;
  scriptLoading = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src^="${SCRIPT_SRC.split("?")[0]}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject());
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject();
    document.head.appendChild(s);
  });
  return scriptLoading;
}

// Cloudflare's "always passes, visible" test sitekey — safe to use in
// development. See https://developers.cloudflare.com/turnstile/troubleshooting/testing/
const TURNSTILE_DEV_SITE_KEY = "1x00000000000000000000AA";

function isProductionHost(): boolean {
  if (typeof window === "undefined") return true;
  const h = window.location.hostname;
  // Treat anything that looks like a Replit dev preview or localhost as
  // non-production so we fall back to the always-pass test sitekey.
  if (h === "localhost" || h === "127.0.0.1") return false;
  if (h.endsWith(".replit.dev") || h.endsWith(".repl.co")) return false;
  return true;
}

const CONFIGURED_KEY =
  (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) ?? "";

export const TURNSTILE_SITE_KEY: string = isProductionHost()
  ? CONFIGURED_KEY
  : TURNSTILE_DEV_SITE_KEY;

export interface TurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  size?: "normal" | "flexible" | "compact";
  className?: string;
}

export function Turnstile({
  onVerify,
  onExpire,
  onError,
  size = "flexible",
  className,
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let cancelled = false;
    loadScript().then(() => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        size,
        theme: "light",
        callback: (token) => onVerify(token),
        "expired-callback": () => onExpire?.(),
        "error-callback": () => onError?.(),
      });
    });
    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [onVerify, onExpire, onError, size]);

  if (!TURNSTILE_SITE_KEY) {
    return (
      <p className="text-[11px] text-amber-600 leading-[1.5]">
        Bot protection is not configured. (Missing VITE_TURNSTILE_SITE_KEY.)
      </p>
    );
  }

  return <div ref={containerRef} className={className} />;
}
