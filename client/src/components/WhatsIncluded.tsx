import { motion } from "framer-motion";

interface WhatsIncludedProps {
  onContactOpen: () => void;
}

const INCLUDED = [
  "Dedicated Project Manager",
  "Complete structure — foundation through finishes",
  "Post-and-beam or panelized framing system",
  "Exterior cladding: cedar, stucco, or board-and-batten",
  "Floor-to-ceiling glazing and sliding glass doors",
  "All permitting and city fees",
  "Pre-engineered, Title 24-compliant floor plans",
  "Standard utility connections",
  "Final cleanup and move-in walkthrough",
];

const NOT_INCLUDED = [
  "Utility trenching beyond 50 ft from main",
  "Craning beyond 100 ft from the street",
  "Tree removal or structure demolition",
  "Severe slope or specialty soil engineering",
  "Sewer line replacement",
  "Property tax reassessment",
  "Interior furnishings or decor",
  "Landscape design beyond site restoration",
];

export function WhatsIncluded({ onContactOpen }: WhatsIncludedProps) {
  return (
    <section className="bg-[var(--hemma-white)] py-16 md:py-24 lg:py-28 px-6 md:px-12">
      <div className="max-w-[1100px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.1] tracking-tight text-[var(--hemma-black)] mb-12 md:mb-16 max-w-[880px]"
        >
          What&apos;s included <em className="text-[var(--hemma-amber)]">in the base price?</em>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-7 h-7 rounded-full bg-[var(--hemma-blue)] text-white flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <h3 className="font-serif text-2xl md:text-[28px] font-light text-[var(--hemma-black)]">Includes</h3>
            </div>
            <ul className="flex flex-col gap-4">
              {INCLUDED.map((item, i) => (
                <li key={i} className="flex gap-3 text-[15px] md:text-[16px] font-light leading-[1.6] text-[var(--hemma-black)]">
                  <span className="text-[var(--hemma-blue)] mt-2 flex-shrink-0">
                    <span className="block w-1.5 h-1.5 rounded-full bg-current" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-7 h-7 rounded-full border border-black/15 text-[var(--hemma-mid)] flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </span>
              <h3 className="font-serif text-2xl md:text-[28px] font-light text-[var(--hemma-black)]">Doesn&apos;t Include</h3>
            </div>
            <ul className="flex flex-col gap-4">
              {NOT_INCLUDED.map((item, i) => (
                <li key={i} className="flex gap-3 text-[15px] md:text-[16px] font-light leading-[1.6] text-[var(--hemma-mid)]">
                  <span className="mt-2 flex-shrink-0">
                    <span className="block w-1.5 h-1.5 rounded-full bg-[var(--hemma-mid)]/50" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="flex justify-center pt-2">
          <button
            onClick={onContactOpen}
            className="inline-flex items-center gap-2 border border-[var(--hemma-amber)] text-[var(--hemma-amber)] hover:bg-[var(--hemma-amber)] hover:text-[var(--hemma-black)] transition-colors rounded-full px-8 py-3 text-[14px] font-medium tracking-wide bg-transparent cursor-pointer"
          >
            Get in contact
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <p className="text-center text-[12px] text-[var(--hemma-mid)] mt-6 max-w-[640px] mx-auto leading-[1.6]">
          Site-specific exclusions are identified and priced during your free site assessment so there are no surprises after you sign.
        </p>
      </div>
    </section>
  );
}
