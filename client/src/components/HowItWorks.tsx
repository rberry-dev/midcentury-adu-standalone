import React from "react";
import { motion } from "framer-motion";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Consultation",
      desc: "Meet with a Midcentury ADU specialist. We assess your property, walk you through every floor plan, and help you find the design that fits your backyard and budget."
    },
    {
      num: "02",
      title: "Design Approval",
      desc: "Review your selected floor plan, exterior cladding, glazing package, and interior palette. Approve the design and sign off before a single nail is driven."
    },
    {
      num: "03",
      title: "Build",
      desc: "We manage permitting, site prep, and construction — post-and-beam framing, glazing installation, and all finishes. One team, one contract, zero surprises."
    },
    {
      num: "04",
      title: "Move-In Ready",
      desc: "We hand you the keys to a finished, permitted, code-compliant home. Every system inspected and signed off — ready to occupy from day one."
    }
  ];

  return (
    <section id="how" className="bg-[var(--hemma-light)] text-[var(--hemma-black)] py-16 md:py-20 lg:py-24 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 sm:gap-10 lg:gap-12 relative">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className={`relative py-8 sm:py-0 ${idx < steps.length - 1 ? "border-b border-black/10 sm:border-b-0" : ""}`}
            >
              <div className="font-serif text-[48px] sm:text-[52px] font-light text-[var(--hemma-amber)] leading-none mb-5">
                {step.num}
              </div>
              <h4 className="text-[15px] font-semibold tracking-[0.02em] mb-3 text-[var(--hemma-black)]">
                {step.title}
              </h4>
              <p className="text-[13px] font-light leading-[1.7] text-[var(--hemma-mid)]">
                {step.desc}
              </p>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-[26px] right-[-30px] text-black/20 text-2xl">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
