import { useEffect, useMemo } from "react";
import { Link, useSearch } from "wouter";
import { CheckCircle, Calendar, Phone, Mail } from "lucide-react";
import { Layout } from "@/components/Layout";
import { trackLead, type LeadSource } from "@/lib/analytics";
import { consumeConversionFlag } from "@/lib/leads";
import { useSeo } from "@/lib/seo";

const VALID_SOURCES: ReadonlySet<LeadSource> = new Set([
  "discovery_call",
  "brochure",
  "financing",
  "newsletter",
  "contact",
]);

function parseSource(s: string | null): LeadSource {
  if (s && (VALID_SOURCES as Set<string>).has(s)) {
    return s as LeadSource;
  }
  return "contact";
}

function formatScheduled(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

interface SourceCopy {
  eyebrow: string;
  title: string;
  body: string;
  next: string;
}

const COPY: Record<LeadSource, SourceCopy> = {
  discovery_call: {
    eyebrow: "Your call is booked",
    title: "We'll talk soon.",
    body: "A confirmation with the calendar invite is on its way to your inbox. We'll call you at the number you provided. If you need to reschedule, just reply to that email.",
    next: "While you wait, take a closer look at our floor plans.",
  },
  financing: {
    eyebrow: "Pre-qualification received",
    title: "Your financing request is in.",
    body: "One of our California ADU lending partners will reach out within one business day with personalized rate and payment options. Watch your inbox — we sent a confirmation there too.",
    next: "Curious how the build process works? Take a look.",
  },
  brochure: {
    eyebrow: "Your brochure is downloading",
    title: "Enjoy the read.",
    body: "Your download should start automatically — if it doesn't, check your email; we sent a copy there too. The brochure walks through every floor plan, finish, and the all-in pricing.",
    next: "Ready to talk? Schedule a 30-minute discovery call.",
  },
  contact: {
    eyebrow: "Message received",
    title: "Thanks for reaching out.",
    body: "We got your message and will get back to you within one business day. A confirmation has been sent to your inbox.",
    next: "While you wait, browse our floor plans and finishes.",
  },
  newsletter: {
    eyebrow: "You're on the list",
    title: "Welcome to Midcentury ADU.",
    body: "Expect one short email a month — new floor plans, finished projects, and California ADU news. No spam, unsubscribe anytime.",
    next: "Take a look at what we're building.",
  },
};

export default function ThankYouPage() {
  const search = useSearch();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const source = parseSource(params.get("source"));
  const name = params.get("name");
  const scheduledLabel = formatScheduled(params.get("scheduledAt"));
  const copy = COPY[source];

  useSeo({
    title: "Thank you",
    description: "Your request has been received. We'll be in touch shortly.",
    path: "/thank-you",
    noindex: true,
  });

  useEffect(() => {
    if (consumeConversionFlag(source)) {
      trackLead(source, scheduledLabel ? { scheduled: true } : undefined);
    }
  }, [source, scheduledLabel]);

  return (
    <Layout>
      <section className="px-6 md:px-12 pt-20 md:pt-28 pb-16 md:pb-24 bg-[var(--hemma-light)] min-h-[60vh]">
        <div className="max-w-[680px] mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--hemma-blue)]/10 mb-6">
            <CheckCircle size={32} className="text-[var(--hemma-blue)]" strokeWidth={1.5} />
          </div>
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[var(--hemma-blue)] mb-3">
            {copy.eyebrow}
          </p>
          <h1 className="font-serif text-[clamp(2rem,5vw,3.25rem)] font-light leading-[1.1] tracking-tight text-[var(--hemma-black)] mb-5">
            {name ? <>Thanks, <em className="text-[var(--hemma-blue)]">{name.split(" ")[0]}</em>.</> : copy.title}
          </h1>
          <p className="text-[15px] md:text-[16px] font-light leading-[1.7] text-[var(--hemma-mid)] max-w-[520px] mx-auto mb-8">
            {copy.body}
          </p>

          {scheduledLabel && source === "discovery_call" && (
            <div className="inline-flex items-center gap-3 px-5 py-4 bg-[var(--hemma-white)] border border-[var(--hemma-sand-dark)] rounded-[6px] mb-10">
              <Calendar size={20} className="text-[var(--hemma-blue)] shrink-0" strokeWidth={1.5} />
              <div className="text-left">
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)]">
                  Your call
                </p>
                <p className="text-[14px] font-medium text-[var(--hemma-black)] mt-0.5">
                  {scheduledLabel}
                </p>
              </div>
            </div>
          )}

          <div className="border-t border-black/10 pt-10 mt-2">
            <p className="text-[13px] font-light text-[var(--hemma-mid)] mb-5">{copy.next}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {source === "brochure" || source === "financing" || source === "newsletter" ? (
                <Link href="/floor-plans" className="btn-primary">
                  Browse floor plans
                </Link>
              ) : null}
              {source === "discovery_call" ? (
                <Link href="/floor-plans" className="btn-primary">
                  Browse floor plans
                </Link>
              ) : null}
              {source === "contact" ? (
                <Link href="/floor-plans" className="btn-primary">
                  Browse floor plans
                </Link>
              ) : null}
              <Link
                href="/process"
                className="px-6 py-3 rounded-full border border-[var(--hemma-sand-dark)] text-[var(--hemma-black)] text-[14px] font-medium hover:border-[var(--hemma-black)] transition-colors no-underline"
              >
                See our process
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-[13px] text-[var(--hemma-mid)]">
              <a
                href="mailto:hello@aduhomesinc.com"
                className="inline-flex items-center gap-2 hover:text-[var(--hemma-blue)] transition-colors no-underline"
              >
                <Mail size={14} strokeWidth={1.5} /> hello@aduhomesinc.com
              </a>
              <a
                href="tel:+18888888888"
                className="inline-flex items-center gap-2 hover:text-[var(--hemma-blue)] transition-colors no-underline"
              >
                <Phone size={14} strokeWidth={1.5} /> Call us
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
