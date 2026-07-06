import { Link } from "wouter";
import { motion } from "framer-motion";
import { useContact } from "@/context/ContactContext";

export function Hero() {
  const { openContact } = useContact();
  return (
    <section
      className="relative flex flex-col justify-end overflow-hidden bg-[var(--hemma-black)]"
      style={{ height: "calc(100dvh - 100px)" }}
    >
      {/* Full-bleed photo */}
      <img
        src={`${import.meta.env.BASE_URL}hero-midcentury.png`}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        width={1408}
        height={768}
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Subtle gradient — bottom-weighted only */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 md:px-12 pb-14 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-serif text-[clamp(2.8rem,7vw,5.5rem)] font-light leading-[1.05] tracking-tight text-white mb-5">
            Midcentury modern.<br />
            <em className="text-[var(--hemma-amber)]">Backyard built.</em>
          </h1>

          {/* Plain-spoken value strip — three subtle pills separated by amber dots */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 mb-6 text-[10px] md:text-[11px] font-medium tracking-[0.18em] uppercase text-white/75">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/5 border border-white/15">Timeless Design</span>
            <span className="hidden md:inline text-[var(--hemma-amber)]" aria-hidden="true">·</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/5 border border-white/15">Warm Woods</span>
            <span className="hidden md:inline text-[var(--hemma-amber)]" aria-hidden="true">·</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/5 border border-white/15">California Built</span>
          </div>

          <p className="text-[15px] md:text-[17px] font-light text-white/75 max-w-[520px] leading-[1.65] mb-10">
            Midcentury-modern ADUs with clean lines, walnut warmth, and post-and-beam character — purpose-built for California backyards.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/configure"
              className="bg-[var(--hemma-amber)] text-[var(--hemma-black)] px-7 py-3.5 border-none rounded-full font-sans text-[13px] font-medium cursor-pointer tracking-wide transition-all hover:bg-[#d0911a] hover:-translate-y-0.5 shadow-lg no-underline inline-block"
            >
              Design Your ADU →
            </Link>
            <Link
              href="/floor-plans"
              className="bg-[var(--hemma-blue)] text-white px-7 py-3.5 border-none rounded-full font-sans text-[13px] font-medium cursor-pointer tracking-wide transition-all hover:bg-[#003f7a] hover:-translate-y-0.5 shadow-lg no-underline inline-block"
            >
              Explore Floor Plans
            </Link>
            <button
              onClick={() => openContact()}
              className="text-white px-7 py-3.5 rounded-full font-sans text-[13px] font-medium cursor-pointer tracking-wide transition-all border border-white/30 bg-white/10 hover:bg-white/20 hover:-translate-y-0.5 backdrop-blur-sm"
            >
              Request a Consultation
            </button>
          </div>
        </motion.div>

        {/* Minimal stat strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center gap-8 mt-12 pt-8 border-t border-white/15"
        >
          <div>
            <span className="font-serif text-[22px] text-[var(--hemma-amber)] block leading-none mb-1">8</span>
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-white/50">Floor Plans</span>
          </div>
          <div className="w-px h-8 bg-white/15" />
          <div>
            <span className="font-serif text-[22px] text-[var(--hemma-amber)] block leading-none mb-1">400–1,200</span>
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-white/50">Sq Ft</span>
          </div>
          <div className="w-px h-8 bg-white/15" />
          <div>
            <span className="font-serif text-[22px] text-[var(--hemma-amber)] block leading-none mb-1">100%</span>
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-white/50">Permitted</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
