import React, { useState } from "react";
import { useModels, type Model, type IncludedItem } from "@/data/models";

export function Furnishings() {
  const { models } = useModels();
  const [activeModelId, setActiveModelId] = useState<string | null>(null);
  const effectiveId = activeModelId ?? models[0]?.id ?? null;
  const activeData: Model | undefined = models.find((m) => m.id === effectiveId);

  return (
    <section id="furnishings" className="py-12 md:py-20 lg:py-24 px-6 md:px-12 bg-[var(--hemma-white)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="bg-[var(--hemma-sand)] rounded-[4px] aspect-[4/3] overflow-hidden relative shadow-inner">
            <img
              src="/interior-living.webp"
              alt="Midcentury ADU interior — move-in ready"
              width={1280}
              height={896}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase opacity-80 mb-1">Fully Assembled</p>
              <p className="font-serif text-xl font-light">Every Midcentury ADU.</p>
            </div>
          </div>

          <div>
            <div className="relative mb-8">
              <div className="flex overflow-x-auto gap-1 border-b border-[var(--hemma-sand-dark)] pb-px scrollbar-none" style={{ WebkitOverflowScrolling: "touch" }}>
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveModelId(m.id)}
                    className={`flex-shrink-0 px-3 py-2 text-[12px] font-medium transition-colors cursor-pointer border-none bg-transparent relative ${
                      activeModelId === m.id
                        ? "text-[var(--hemma-blue)]"
                        : "text-[var(--hemma-mid)] hover:text-[var(--hemma-black)]"
                    }`}
                  >
                    {m.name}
                    {activeModelId === m.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--hemma-blue)]" />
                    )}
                  </button>
                ))}
              </div>
              <div className="pointer-events-none absolute top-0 right-0 bottom-px w-8 bg-gradient-to-l from-[var(--hemma-white)] to-transparent md:hidden" />
            </div>

            {activeData && (
              <div className="bg-[var(--hemma-light)] rounded-[4px] overflow-hidden">
                <div
                  className="px-5 md:px-8 py-4 md:py-5 flex items-center justify-between gap-3"
                  style={{ background: activeData.badgeStyle.background }}
                >
                  <div>
                    <span className="font-serif text-lg font-light" style={{ color: activeData.badgeStyle.color }}>
                      {activeData.name}
                    </span>
                    <span className="block text-[11px] font-semibold tracking-[0.1em] uppercase mt-1" style={{ color: activeData.badgeStyle.color, opacity: 0.6 }}>
                      {activeData.sf} SF Package
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl font-light" style={{ color: activeData.badgeStyle.color }}>
                      {activeData.furnishingPrice}
                    </span>
                    <span className="block text-[11px] mt-0.5" style={{ color: activeData.badgeStyle.color, opacity: 0.6 }}>
                      est. retail
                    </span>
                  </div>
                </div>

                <div className="p-5 md:p-8">
                  <ul className="flex flex-col gap-3 mb-6">
                    {activeData.includes.map((item: IncludedItem, i: number) => (
                      <li key={i} className="flex gap-3 items-start text-[13px]">
                        <span className="text-[var(--hemma-blue)] font-bold mt-0.5 flex-shrink-0">→</span>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${item.name} (opens in new tab)`}
                          className="text-[var(--hemma-blue)] no-underline hover:underline inline-flex items-center gap-1 group font-medium"
                        >
                          {item.name}
                          <span className="text-[10px] opacity-50 group-hover:translate-x-0.5 transition-transform">↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t border-[var(--hemma-sand-dark)] text-[11px] font-light text-[var(--hemma-mid)]">
                    All finishes, fixtures, and materials installed by ADU Homes Inc.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
