import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { FAQ_CATEGORIES } from "@/data/faqs";

export function FAQ() {
  const [openKey, setOpenKey] = useState<string | null>("0-0");

  const toggle = (key: string) => {
    setOpenKey(openKey === key ? null : key);
  };

  return (
    <section className="py-12 md:py-20 lg:py-24 px-6 md:px-12 bg-[var(--hemma-white)]">
      <div className="max-w-[1080px] mx-auto">
        {FAQ_CATEGORIES.map((category, ci) => (
          <div key={ci} className={ci > 0 ? "mt-16 md:mt-20" : ""}>
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 md:gap-16 items-start">
              <div className="md:sticky md:top-[120px]">
                <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--hemma-blue)] mb-3">
                  {category.eyebrow}
                </div>
                <h2 className="font-serif text-[clamp(1.75rem,3vw,2.25rem)] font-light leading-[1.15] tracking-tight text-[var(--hemma-black)]">
                  {category.title}
                </h2>
              </div>

              <div className="border-t border-black/10">
                {category.faqs.map((faq, fi) => {
                  const key = `${ci}-${fi}`;
                  const isOpen = openKey === key;
                  return (
                    <div key={fi} className="border-b border-black/10">
                      <button
                        onClick={() => toggle(key)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-${key}`}
                        className="w-full flex items-start justify-between gap-6 py-5 md:py-6 text-left bg-transparent border-none cursor-pointer group"
                      >
                        <span className={`font-serif text-[18px] md:text-[20px] font-light leading-[1.4] transition-colors ${
                          isOpen ? "text-[var(--hemma-black)]" : "text-[var(--hemma-black)] group-hover:text-[var(--hemma-blue)]"
                        }`}>
                          {faq.q}
                        </span>
                        <span className={`flex-shrink-0 mt-1 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                          isOpen ? "bg-[var(--hemma-blue)] text-white" : "bg-[var(--hemma-light)] text-[var(--hemma-black)] group-hover:bg-[var(--hemma-sand)]"
                        }`}>
                          {isOpen ? <Minus size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`faq-${key}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="text-[15px] md:text-[16px] font-light leading-[1.75] text-[var(--hemma-mid)] pb-6 md:pb-7 pr-12 max-w-[720px]">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
