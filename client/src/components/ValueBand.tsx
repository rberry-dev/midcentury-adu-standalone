import React from "react";

export function ValueBand() {
  return (
    <div className="bg-[var(--hemma-amber)] py-5 px-6 md:px-12 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-16 text-center">
      <span className="text-[11px] md:text-[13px] font-semibold tracking-[0.1em] uppercase text-[var(--hemma-black)]">Midcentury Modern · California Built</span>
      <span className="hidden md:inline-block text-[18px] text-black/20">•</span>
      <span className="text-[11px] md:text-[13px] font-semibold tracking-[0.1em] uppercase text-[var(--hemma-black)]">Structure + Finishes + Move-In Ready</span>
      <span className="hidden md:inline-block text-[18px] text-black/20">•</span>
      <span className="text-[11px] md:text-[13px] font-semibold tracking-[0.1em] uppercase text-[var(--hemma-black)]">Post-and-Beam · Walnut · Glass</span>
    </div>
  );
}
