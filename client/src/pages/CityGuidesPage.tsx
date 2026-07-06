import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { useSeo } from "@/lib/seo";
import { CTASection } from "@/components/CTASection";
import { useContact } from "@/context/ContactContext";
import {
  CITY_GUIDES,
  CITY_REGIONS,
  getCitiesByRegion,
} from "@/data/cityGuides";

export default function CityGuidesPage() {
  const { openContact } = useContact();

  useSeo({
    title: "California ADU City Guides",
    description:
      "What it takes to build an ADU in your city — from Los Angeles and Pasadena to Anaheim and Irvine. Permit timelines, lot considerations, and what California state law guarantees you.",
    path: "/city-guides",
  });

  return (
    <Layout>
      <section className="pt-24 md:pt-32 pb-16 md:pb-20 px-6 md:px-12 bg-[var(--hemma-white)]">
        <div className="max-w-[960px] mx-auto text-center">
          <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--hemma-blue)] mb-5">
            City Guides
          </p>
          <h1 className="font-serif font-light text-[clamp(2.4rem,5.5vw,4rem)] leading-[1.05] tracking-tight text-[var(--hemma-black)] mb-6">
            What it takes to build an ADU in your city.
          </h1>
          <p className="text-[16px] md:text-[18px] font-light leading-[1.65] text-[var(--hemma-mid)] max-w-[640px] mx-auto">
            We've built ADUs in {CITY_GUIDES.length} California cities. Pick yours
            below for a plain-English read on permit timelines, lot character,
            and what state law guarantees you regardless of local rules.
          </p>
        </div>
      </section>

      <section className="pb-20 md:pb-28 px-6 md:px-12 bg-[var(--hemma-light)]">
        <div className="max-w-[1200px] mx-auto pt-16 md:pt-20 space-y-16 md:space-y-20">
          {CITY_REGIONS.map((region) => {
            const cities = getCitiesByRegion(region.id);
            if (cities.length === 0) return null;
            return (
              <div key={region.id}>
                <div className="mb-8 md:mb-10 max-w-[680px]">
                  <h2 className="font-serif font-light text-[clamp(1.6rem,3.5vw,2.25rem)] leading-[1.15] text-[var(--hemma-black)] mb-3">
                    {region.label}
                  </h2>
                  <p className="text-[15px] font-light leading-[1.6] text-[var(--hemma-mid)]">
                    {region.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {cities.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/city-guides/${city.slug}`}
                      className="group block bg-[var(--hemma-white)] hover:bg-[var(--hemma-black)] rounded-[10px] px-6 py-5 md:px-7 md:py-6 border border-black/5 hover:border-[var(--hemma-black)] transition-colors no-underline"
                    >
                      <span className="text-[15px] md:text-[16px] font-light text-[var(--hemma-black)] group-hover:text-white transition-colors">
                        {city.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="mt-12 md:mt-16 rounded-[10px] bg-[var(--hemma-white)] border border-black/5 px-7 py-8 md:px-10 md:py-10 text-center max-w-[720px] mx-auto">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--hemma-blue)] mb-3">
              Don't see your city?
            </p>
            <h3 className="font-serif text-[clamp(1.4rem,3vw,1.75rem)] font-light leading-[1.2] text-[var(--hemma-black)] mb-3">
              We probably still build there.
            </h3>
            <p className="text-[14px] md:text-[15px] font-light leading-[1.6] text-[var(--hemma-mid)] mb-6 max-w-[460px] mx-auto">
              The cities above are where we have the most volume — but we
              regularly build elsewhere in California. Tell us your address and
              we'll let you know what's possible.
            </p>
            <button
              type="button"
              onClick={() => openContact()}
              className="btn-primary"
            >
              Ask about your city
            </button>
          </div>
        </div>
      </section>

      <CTASection onContactOpen={() => openContact()} />
    </Layout>
  );
}
