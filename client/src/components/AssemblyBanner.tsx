import React from "react";

export function AssemblyBanner() {
  return (
    <section id="design-pillars" className="bg-[var(--hemma-light)] text-[var(--hemma-black)] border-y border-black/5">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/10">

        <div className="px-6 py-10 md:p-16 lg:p-24 flex flex-col justify-center hover:bg-black/[0.02] transition-colors">
          <div className="w-11 h-11 rounded-full border border-[var(--hemma-amber)] flex items-center justify-center text-[var(--hemma-amber)] mb-6 md:mb-8">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-light mb-3 md:mb-4 text-[var(--hemma-black)]">Honest Materials</h3>
          <p className="text-[14px] md:text-[15px] font-light leading-[1.7] text-[var(--hemma-mid)]">
            Walnut, concrete, steel, and glass — used truthfully, without veneer. What you see is what holds the building up.
          </p>
        </div>

        <div className="px-6 py-10 md:p-16 lg:p-24 flex flex-col justify-center hover:bg-black/[0.02] transition-colors">
          <div className="w-11 h-11 rounded-full border border-[var(--hemma-amber)] flex items-center justify-center text-[var(--hemma-amber)] mb-6 md:mb-8">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-light mb-3 md:mb-4 text-[var(--hemma-black)]">Connected to Outdoors</h3>
          <p className="text-[14px] md:text-[15px] font-light leading-[1.7] text-[var(--hemma-mid)]">
            Clerestory windows, sliding glass walls, and deep roof overhangs make the California garden part of every room.
          </p>
        </div>

        <div className="px-6 py-10 md:p-16 lg:p-24 flex flex-col justify-center hover:bg-black/[0.02] transition-colors">
          <div className="w-11 h-11 rounded-full border border-[var(--hemma-amber)] flex items-center justify-center text-[var(--hemma-amber)] mb-6 md:mb-8">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-light mb-3 md:mb-4 text-[var(--hemma-black)]">Permit-Ready Plans</h3>
          <p className="text-[14px] md:text-[15px] font-light leading-[1.7] text-[var(--hemma-mid)]">
            Pre-engineered to California Title 24, CRC structural, and ADU-specific zoning requirements. We handle every permit from start to final occupancy.
          </p>
        </div>

      </div>
    </section>
  );
}
