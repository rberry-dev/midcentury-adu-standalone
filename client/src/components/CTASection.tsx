import React, { useState } from "react";
import { motion } from "framer-motion";
import { BrochureModal } from "./BrochureModal";

interface CTASectionProps {
  onContactOpen: () => void;
}

export function CTASection({ onContactOpen }: CTASectionProps) {
  const [brochureOpen, setBrochureOpen] = useState(false);

  return (
    <section
      id="cta"
      className="bg-[var(--hemma-white)] py-16 md:py-24 lg:py-32 px-6 md:px-12 text-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-[700px] mx-auto"
      >
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--hemma-blue)] mb-5">
          Ready to Build?
        </div>
        <h2 className="font-serif text-[clamp(1.875rem,5vw,4rem)] font-light leading-[1.1] tracking-tight mb-5 text-[var(--hemma-black)]">
          Your backyard is ready for its next chapter.
        </h2>
        <p className="text-[15px] md:text-[16px] font-light leading-[1.7] text-[var(--hemma-mid)] mb-8 md:mb-10 max-w-[500px] mx-auto">
          Start with a free site assessment. Our ADU experts will evaluate your property, check local zoning, and walk you through floor plans and financing options.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button onClick={onContactOpen} className="w-full sm:w-auto btn-primary">
            Schedule a Free Consultation
          </button>
          <button
            onClick={() => setBrochureOpen(true)}
            className="w-full sm:w-auto btn-outline"
          >
            Download the Brochure
          </button>
        </div>
      </motion.div>

      <BrochureModal open={brochureOpen} onClose={() => setBrochureOpen(false)} />
    </section>
  );
}
