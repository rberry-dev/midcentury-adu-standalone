import { useCallback, useState } from "react";
import { Link } from "wouter";
import { CheckCircle } from "lucide-react";
import { submitLead } from "@/lib/leads";
import { Turnstile } from "@/components/Turnstile";

function NewsletterBand() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const handleVerify = useCallback((t: string) => setTurnstileToken(t), []);
  const handleExpire = useCallback(() => setTurnstileToken(null), []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!turnstileToken) {
      setError("Please complete the bot-check below.");
      return;
    }
    setError(null);
    setSubmitting(true);
    await submitLead({
      source: "newsletter",
      email: trimmed,
      turnstileToken,
    });
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div className="max-w-[1280px] mx-auto mb-14 md:mb-16 pb-12 md:pb-16 border-b border-black/10">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6 md:gap-12 items-center">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[var(--hemma-blue)] mb-2">
            Stay In The Loop
          </p>
          <h3 className="font-serif text-[clamp(1.4rem,2.4vw,1.875rem)] font-light leading-[1.15] text-[var(--hemma-black)]">
            New floor plans, financing updates,<br className="hidden md:block" />{" "}
            and California ADU news.
          </h3>
        </div>

        {submitted ? (
          <div className="flex items-center gap-3 bg-[var(--hemma-white)] rounded-full px-5 py-3.5 border border-[var(--hemma-sand-dark)]">
            <CheckCircle
              size={20}
              className="text-[var(--hemma-blue)] shrink-0"
              strokeWidth={1.5}
            />
            <span className="text-[14px] font-light text-[var(--hemma-black)]">
              You're on the list. Watch your inbox for the next update.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col sm:flex-row gap-2 bg-[var(--hemma-white)] rounded-full p-1.5 border border-[var(--hemma-sand-dark)] focus-within:border-[var(--hemma-blue)] transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter your email"
                aria-label="Email address"
                className="flex-1 bg-transparent border-none outline-none px-4 py-2.5 text-[14px] font-light text-[var(--hemma-black)] placeholder-[var(--hemma-mid)]"
              />
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 bg-[var(--hemma-blue)] text-white px-5 py-2.5 rounded-full font-medium text-[13px] hover:bg-[#003f7a] transition-colors border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {submitting ? "Subscribing…" : "Subscribe →"}
              </button>
            </div>
            {error && (
              <p className="text-[12px] text-red-500 mt-2 ml-2">{error}</p>
            )}
            <div className="mt-3 ml-2">
              <Turnstile onVerify={handleVerify} onExpire={handleExpire} size="flexible" />
            </div>
            <p className="text-[11px] font-light text-[var(--hemma-mid)] mt-2 ml-2 leading-[1.6]">
              No spam. One short email a month. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[var(--hemma-light)] border-t border-black/5 pt-16 md:pt-20 pb-8 px-6 md:px-12 text-[var(--hemma-mid)]">
      <NewsletterBand />
      <div className="max-w-[1280px] mx-auto mb-12 md:mb-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-8">
          <div className="md:col-span-1">
            <div className="font-serif text-3xl font-light text-[var(--hemma-black)] mb-4">MIDCENTURY ADU</div>
            <p className="text-[13px] font-light leading-[1.7] mb-6 max-w-xs">
              Midcentury-modern accessory dwelling units for California homeowners. Clean lines, warm woods, and timeless design built for backyard living.
            </p>
            <div className="inline-block bg-[var(--hemma-blue)] text-white px-3 py-1.5 rounded-[2px] text-[10px] font-bold tracking-[0.08em]">
              ADU HOMES INC.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:contents">
            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[var(--hemma-black)] mb-5">Products</h4>
              <ul className="flex flex-col gap-3 text-[13px]">
                <li><Link href="/floor-plans" className="hover:text-[var(--hemma-black)] transition-colors no-underline text-[var(--hemma-mid)]">Floor Plans</Link></li>
                <li><Link href="/furnishings" className="hover:text-[var(--hemma-black)] transition-colors no-underline text-[var(--hemma-mid)]">Furnishing Packages</Link></li>
                <li><Link href="/furnishings" className="hover:text-[var(--hemma-black)] transition-colors no-underline text-[var(--hemma-mid)]">Assembly Promise</Link></li>
                <li><Link href="/process" className="hover:text-[var(--hemma-black)] transition-colors no-underline text-[var(--hemma-mid)]">How It Works</Link></li>
                <li><Link href="/financing" className="hover:text-[var(--hemma-black)] transition-colors no-underline text-[var(--hemma-mid)]">Financing Calculator</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[var(--hemma-black)] mb-5">Company</h4>
              <ul className="flex flex-col gap-3 text-[13px]">
                <li><Link href="/" className="hover:text-[var(--hemma-black)] transition-colors no-underline text-[var(--hemma-mid)]">About Midcentury ADU</Link></li>
                <li><a href="#" className="hover:text-[var(--hemma-black)] transition-colors no-underline text-[var(--hemma-mid)]">Careers</a></li>
                <li><a href="#" className="hover:text-[var(--hemma-black)] transition-colors no-underline text-[var(--hemma-mid)]">Press</a></li>
                <li><a href="#" className="hover:text-[var(--hemma-black)] transition-colors no-underline text-[var(--hemma-mid)]">aduhomesinc.com</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[var(--hemma-black)] mb-5">Resources</h4>
              <ul className="flex flex-col gap-3 text-[13px]">
                <li><Link href="/blog" className="hover:text-[var(--hemma-black)] transition-colors no-underline text-[var(--hemma-mid)]">Insights</Link></li>
                <li><Link href="/city-guides" className="hover:text-[var(--hemma-black)] transition-colors no-underline text-[var(--hemma-mid)]">City Guides</Link></li>
                <li><Link href="/financing" className="hover:text-[var(--hemma-black)] transition-colors no-underline text-[var(--hemma-mid)]">ADU Financing Guide</Link></li>
                <li><Link href="/faq" className="hover:text-[var(--hemma-black)] transition-colors no-underline text-[var(--hemma-mid)]">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[var(--hemma-black)] mb-5">Legal</h4>
              <ul className="flex flex-col gap-3 text-[13px]">
                <li><Link href="/privacy" className="hover:text-[var(--hemma-black)] transition-colors no-underline text-[var(--hemma-mid)]">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[var(--hemma-black)] transition-colors no-underline text-[var(--hemma-mid)]">Terms of Service</Link></li>
                <li><Link href="/license" className="hover:text-[var(--hemma-black)] transition-colors no-underline text-[var(--hemma-mid)]">License Info</Link></li>
                <li><Link href="/accessibility" className="hover:text-[var(--hemma-black)] transition-colors no-underline text-[var(--hemma-mid)]">Accessibility</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto border-t border-black/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-[12px] text-center md:text-left">© 2025 ADU Homes Inc. / Midcentury Collection. All rights reserved.</span>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/license" className="text-[10px] font-semibold tracking-[0.1em] uppercase border border-black/15 px-2.5 py-1 rounded-[2px] text-[var(--hemma-mid)] hover:text-[var(--hemma-black)] hover:border-black/30 transition-colors no-underline">CSLB Lic. #1234567</Link>
          <span className="text-[10px] font-semibold tracking-[0.1em] uppercase border border-black/15 px-2.5 py-1 rounded-[2px] text-[var(--hemma-mid)]">LA County Licensed</span>
          <span className="text-[10px] font-semibold tracking-[0.1em] uppercase border border-black/15 px-2.5 py-1 rounded-[2px] text-[var(--hemma-mid)]">OC Licensed</span>
          <span className="text-[10px] font-semibold tracking-[0.1em] uppercase border border-black/15 px-2.5 py-1 rounded-[2px] text-[var(--hemma-mid)]">Solar Ready</span>
        </div>
      </div>
    </footer>
  );
}
