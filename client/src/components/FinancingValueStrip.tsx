const ITEMS = [
  {
    eyebrow: "Equity-Backed",
    body: "Use your existing home equity through a HELOC or cash-out refi — no separate construction loan to chase down.",
  },
  {
    eyebrow: "One Point of Contact",
    body: "We coordinate with vetted California ADU lenders so you're not juggling paperwork between teams.",
  },
  {
    eyebrow: "Pre-Qualified Rates",
    body: "Get matched with lenders already familiar with prefab ADU appraisals, timelines, and California permitting.",
  },
];

export function FinancingValueStrip() {
  return (
    <section className="py-12 md:py-16 px-6 md:px-12 bg-[var(--hemma-white)] border-t border-[var(--hemma-sand)]">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {ITEMS.map((item) => (
          <div key={item.eyebrow}>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--hemma-blue)] mb-3">
              {item.eyebrow}
            </p>
            <p className="text-[15px] md:text-[16px] font-light leading-[1.6] text-[var(--hemma-black)]">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
