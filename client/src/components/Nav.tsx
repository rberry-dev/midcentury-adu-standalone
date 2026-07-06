import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";

interface NavProps {
  onContactOpen: () => void;
}

const NAV_LINKS = [
  { href: "/floor-plans", label: "Floor Plans" },
  { href: "/configure", label: "Design Yours" },
  { href: "/materials", label: "Materials" },
  { href: "/process", label: "Process" },
  { href: "/financing", label: "Financing" },
  { href: "/faq", label: "FAQ" },
];

export function Nav({ onContactOpen }: NavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location === href || location.startsWith(href + "/");

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Utility bar */}
      <div className="bg-[var(--hemma-light)] border-b border-black/5">
        <div className="flex items-center justify-between gap-3 px-6 md:px-12 h-9">
          <button
            onClick={onContactOpen}
            className="flex items-center gap-1.5 text-[11px] md:text-[12px] font-medium text-[var(--hemma-mid)] hover:text-[var(--hemma-black)] transition-colors bg-transparent border-none cursor-pointer p-0 truncate min-w-0"
          >
            <span className="hidden md:inline truncate">California homeowners — get a free 20-minute consultation</span>
            <span className="hidden sm:inline md:hidden truncate">Free 20-min consultation</span>
            <span className="sm:hidden truncate">Free consultation</span>
            <span aria-hidden="true" className="text-[var(--hemma-amber)] flex-shrink-0">→</span>
          </button>
          <a
            href="tel:+13105554366"
            aria-label="Call Midcentury ADU at (310) 555-MCEN"
            className="flex items-center gap-1.5 text-[11px] md:text-[12px] font-medium text-[var(--hemma-mid)] hover:text-[var(--hemma-black)] transition-colors no-underline flex-shrink-0"
          >
            <Phone size={12} strokeWidth={2} />
            <span>(310) 555-MCEN</span>
          </a>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-[var(--hemma-white)] border-b border-black/5 px-6 md:px-12 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between h-[64px]">
          <Link href="/" className="flex items-baseline gap-2 no-underline text-[var(--hemma-black)]">
            <span className="font-serif text-[22px] tracking-tight leading-none">MIDCENTURY</span>
            <span className="font-sans text-[11px] font-medium tracking-wide text-[var(--hemma-mid)]">ADU</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] font-medium tracking-wide transition-colors no-underline ${
                  isActive(link.href)
                    ? "text-[var(--hemma-black)]"
                    : "text-[var(--hemma-mid)] hover:text-[var(--hemma-black)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button onClick={onContactOpen} className="btn-primary ml-4 py-2.5 px-5 text-[13px]">Get Started</button>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button onClick={onContactOpen} className="btn-primary py-2 px-4 text-[12px] whitespace-nowrap">Get Started</button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-transparent border-none cursor-pointer text-[var(--hemma-black)]"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-nav-menu" className="md:hidden -mx-6 px-6 py-5 flex flex-col gap-5 bg-[var(--hemma-white)] border-t border-black/5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-[15px] font-medium text-left transition-colors no-underline ${
                  isActive(link.href)
                    ? "text-[var(--hemma-black)]"
                    : "text-[var(--hemma-mid)] hover:text-[var(--hemma-black)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button onClick={() => { setMobileMenuOpen(false); onContactOpen(); }} className="btn-primary text-left w-full">Get Started</button>
          </div>
        )}
      </nav>
    </header>
  );
}
