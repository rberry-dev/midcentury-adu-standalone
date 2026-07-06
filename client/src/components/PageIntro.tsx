import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageIntroProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
}

export function PageIntro({ eyebrow, title, subtitle }: PageIntroProps) {
  return (
    <section className="bg-[var(--hemma-white)] pt-12 md:pt-20 pb-8 md:pb-12 px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1280px] mx-auto"
      >
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--hemma-blue)] mb-5">
          {eyebrow}
        </div>
        <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[1.05] tracking-tight text-[var(--hemma-black)] mb-6 max-w-[900px]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[16px] md:text-[18px] font-light leading-[1.65] text-[var(--hemma-mid)] max-w-[640px]">
            {subtitle}
          </p>
        )}
      </motion.div>
    </section>
  );
}
