import React from "react";
import { motion } from "framer-motion";

export function Intro() {
  return (
    <section className="py-16 md:py-32 px-6 md:px-12 bg-[var(--hemma-white)]">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--hemma-blue)] mb-5 md:mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-[var(--hemma-blue)]"></span>
            Philosophy
          </div>
          <h2 className="font-serif text-[clamp(1.9rem,5vw,3.5rem)] font-light leading-[1.15] tracking-tight">
            Architecture that respects <em className="text-[var(--hemma-blue)]">the land it sits on.</em>
          </h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <p className="text-[15px] md:text-[16px] font-light leading-[1.8] text-[var(--hemma-mid)] mb-8 md:mb-10">
            Midcentury modern was born from a belief that good design should be accessible, honest about its materials, and connected to the outdoors. We've applied that same philosophy to the California backyard — thoughtful structures that feel rooted, not dropped.
          </p>
          
          <div className="flex flex-col gap-5 md:gap-6">
            <div className="flex items-start gap-4 md:gap-5">
              <div className="w-10 h-10 shrink-0 bg-[var(--hemma-sand)] rounded-[3px] flex items-center justify-center text-[var(--hemma-blue)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div>
                <strong className="block text-sm font-semibold mb-1 text-[var(--hemma-black)]">Post-and-Beam Construction</strong>
                <p className="text-sm font-light text-[var(--hemma-mid)] leading-relaxed">Exposed structural members, clean overhangs, and honest joinery — the hallmarks of mid-century craftsmanship, engineered to California code.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 md:gap-5">
              <div className="w-10 h-10 shrink-0 bg-[var(--hemma-sand)] rounded-[3px] flex items-center justify-center text-[var(--hemma-blue)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              </div>
              <div>
                <strong className="block text-sm font-semibold mb-1 text-[var(--hemma-black)]">Indoor-Outdoor Flow</strong>
                <p className="text-sm font-light text-[var(--hemma-mid)] leading-relaxed">Floor-to-ceiling glazing, sliding glass walls, and deep overhangs dissolve the boundary between your ADU and its garden setting.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 md:gap-5">
              <div className="w-10 h-10 shrink-0 bg-[var(--hemma-amber)] rounded-[3px] flex items-center justify-center text-[var(--hemma-black)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>
              </div>
              <div>
                <strong className="block text-sm font-semibold mb-1 text-[var(--hemma-black)]">Solar-Ready Rooflines</strong>
                <p className="text-sm font-light text-[var(--hemma-mid)] leading-relaxed">Flat and low-pitched roofs with integrated conduit make solar addition seamless — engineered for California's Title 24 energy requirements from day one.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
