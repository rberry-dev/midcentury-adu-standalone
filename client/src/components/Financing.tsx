import { useState, useMemo } from "react";
import { useModels } from "@/data/models";

function calcAmortizing(principal: number, annualRatePct: number, termYears: number): number {
  if (principal <= 0) return 0;
  if (annualRatePct === 0) return principal / (termYears * 12);
  const r = annualRatePct / 100 / 12;
  const n = termYears * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function calcInterestOnly(principal: number, annualRatePct: number): number {
  if (principal <= 0) return 0;
  return principal * (annualRatePct / 100 / 12);
}

function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

type PaymentMode = "amortizing" | "interest-only";

interface FinancingProps {
  onContactOpen: () => void;
}

const sliderClass =
  "w-full h-[3px] appearance-none bg-[var(--hemma-sand-dark)] rounded-full outline-none accent-[var(--hemma-blue)] cursor-pointer hemma-slider";

export function Financing({ onContactOpen }: FinancingProps) {
  const { models } = useModels();
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [ratePct, setRatePct] = useState<number>(8.5);
  const [termYears, setTermYears] = useState<number>(20);
  const [downPct, setDownPct] = useState<number>(10);
  const [mode, setMode] = useState<PaymentMode>("amortizing");

  const selectedModel = models.find((m) => m.id === (selectedModelId ?? models[0]?.id)) ?? models[0];
  const totalPrice = selectedModel ? parseInt(selectedModel.price.replace(/[^0-9]/g, ""), 10) : 0;
  const downPayment = Math.round(totalPrice * (downPct / 100));
  const loanAmount = totalPrice - downPayment;

  const monthly = useMemo(() => {
    return mode === "interest-only"
      ? calcInterestOnly(loanAmount, ratePct)
      : calcAmortizing(loanAmount, ratePct, termYears);
  }, [loanAmount, ratePct, termYears, mode]);

  const amortizingMonthly = useMemo(
    () => calcAmortizing(loanAmount, ratePct, termYears),
    [loanAmount, ratePct, termYears]
  );

  const annualInterest = Math.round(loanAmount * (ratePct / 100));

  return (
    <section id="financing" className="py-10 md:py-14 lg:py-16 px-6 md:px-12 bg-[var(--hemma-sand)]">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-8 lg:gap-12 items-start">

        <div className="lg:sticky lg:top-24">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[var(--hemma-blue)] mb-4">
            Financing
          </p>
          <h3 className="font-serif text-[clamp(1.75rem,3vw,2.25rem)] font-light leading-[1.1] tracking-tight mb-5">
            Backyard equity,<br />
            <em className="text-[var(--hemma-black)]">put to work.</em>
          </h3>
          <p className="text-[14px] md:text-[15px] font-light leading-[1.7] text-[var(--hemma-mid)] mb-6">
            Most Midcentury ADU homeowners finance their build using a HELOC, cash-out refi, or renovation loan against the equity already in their primary residence. Slide to estimate — we'll connect you with California ADU lenders during your consultation.
          </p>
          <button
            onClick={onContactOpen}
            className="inline-flex items-center gap-2 bg-[var(--hemma-blue)] text-white px-5 py-3 rounded-full font-medium text-[13px] hover:bg-[#4a5d43] transition-colors border-none cursor-pointer"
          >
            Get financing info →
          </button>
        </div>

        <div className="bg-[var(--hemma-white)] rounded-[6px] shadow-lg overflow-hidden p-6 sm:p-8">
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--hemma-mid)] mb-3">
            Estimated Monthly Payment
          </p>

          <div className="flex items-end gap-2 mb-1">
            <span className="font-serif text-[44px] sm:text-[56px] font-light text-[var(--hemma-black)] leading-none transition-all">
              {fmt(monthly)}
            </span>
            <span className="text-[var(--hemma-mid)] text-[16px] sm:text-[18px] font-light mb-2">/mo</span>
          </div>

          <p className="text-[12px] font-light text-[var(--hemma-mid)] leading-[1.6] mb-5">
            {mode === "interest-only"
              ? <>Interest-only payment on a <strong className="font-medium text-[var(--hemma-black)]">{selectedModel?.name}</strong> ({fmt(totalPrice)}) with {fmt(downPayment)} down, at {ratePct}% APR. Converts to {fmt(amortizingMonthly)}/mo principal + interest after the draw period.</>
              : <>Principal + interest payment on a <strong className="font-medium text-[var(--hemma-black)]">{selectedModel?.name}</strong> ({fmt(totalPrice)}) with {fmt(downPayment)} down, at {ratePct}% APR over a {termYears}-year term. Illustrative, not a quote.</>}
          </p>

          <div className="flex bg-[var(--hemma-sand)] rounded-full p-0.5 gap-0.5 mb-6 w-fit">
            <button
              onClick={() => setMode("amortizing")}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.04em] transition-colors border-none cursor-pointer ${
                mode === "amortizing"
                  ? "bg-[var(--hemma-blue)] text-white"
                  : "text-[var(--hemma-mid)] bg-transparent hover:text-[var(--hemma-black)]"
              }`}
            >
              Principal + Interest
            </button>
            <button
              onClick={() => setMode("interest-only")}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.04em] transition-colors border-none cursor-pointer ${
                mode === "interest-only"
                  ? "bg-[var(--hemma-blue)] text-white"
                  : "text-[var(--hemma-mid)] bg-transparent hover:text-[var(--hemma-black)]"
              }`}
            >
              Interest Only
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--hemma-mid)]">
              Model
            </span>
            <span className="text-[12px] font-medium text-[var(--hemma-black)]">
              {selectedModel?.name} · {selectedModel ? fmt(totalPrice) : ""}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-7">
            {models.map((m) => {
              const active = m.id === selectedModel?.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedModelId(m.id)}
                  className={`px-3 py-1.5 rounded-[3px] text-[11px] font-semibold tracking-[0.06em] uppercase transition-colors border cursor-pointer ${
                    active
                      ? "bg-[var(--hemma-blue)] text-white border-[var(--hemma-blue)]"
                      : "bg-transparent text-[var(--hemma-mid)] border-[var(--hemma-sand-dark)] hover:border-[var(--hemma-blue)] hover:text-[var(--hemma-black)]"
                  }`}
                >
                  {m.name}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-5 mb-7">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--hemma-mid)]">
                  Down Payment
                </label>
                <span className="text-[12px] font-medium text-[var(--hemma-black)]">
                  {downPct}% · {fmt(downPayment)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                step={1}
                value={downPct}
                onChange={(e) => setDownPct(Number(e.target.value))}
                className={sliderClass}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--hemma-mid)]">
                  Interest Rate
                </label>
                <span className="text-[12px] font-medium text-[var(--hemma-black)]">
                  {ratePct.toFixed(2)}%
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={10}
                step={0.25}
                value={ratePct}
                onChange={(e) => setRatePct(Number(e.target.value))}
                className={sliderClass}
              />
            </div>

            <div className={mode === "interest-only" ? "opacity-40" : ""}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--hemma-mid)]">
                  Loan Term
                </label>
                <span className="text-[12px] font-medium text-[var(--hemma-black)]">
                  {termYears} years
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                step={5}
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value))}
                disabled={mode === "interest-only"}
                className={`${sliderClass} ${mode === "interest-only" ? "cursor-not-allowed" : ""}`}
              />
            </div>
          </div>

          <div className="border-t border-[var(--hemma-sand)] pt-5 flex items-center justify-around gap-3 flex-wrap">
            <div className="text-center">
              <span className="block font-serif text-xl text-[var(--hemma-black)]">{fmt(loanAmount)}</span>
              <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)] mt-1">
                Financed
              </span>
            </div>
            <div className="text-center">
              <span className={`block font-serif text-xl ${mode === "interest-only" ? "text-[var(--hemma-mid)]" : "text-[var(--hemma-black)]"}`}>
                {mode === "interest-only" ? "N/A" : `${termYears} yr`}
              </span>
              <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)] mt-1">
                Term
              </span>
            </div>
            <div className="text-center">
              <span className="block font-serif text-xl text-[var(--hemma-black)]">{fmt(annualInterest)}</span>
              <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)] mt-1">
                Annual Interest
              </span>
            </div>
          </div>

          <p className="text-[10px] font-light text-[var(--hemma-mid)] leading-[1.6] pt-5">
            Estimates are illustrative only. Consult a licensed lender for actual terms.
          </p>
        </div>

      </div>
    </section>
  );
}
