import { Link, useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { useSeo } from "@/lib/seo";
import { useJsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { CTASection } from "@/components/CTASection";
import { useContact } from "@/context/ContactContext";
import {
  getCityGuide,
  STATE_LAW_GUARANTEES,
  LAYOUT_SUMMARIES,
} from "@/data/cityGuides";

export default function CityGuidePage() {
  const [, params] = useRoute<{ slug: string }>("/city-guides/:slug");
  const slug = params?.slug ?? "";
  const city = getCityGuide(slug);
  const { openContact } = useContact();

  useSeo({
    title: city ? `Building an ADU in ${city.name}` : "City guide not found",
    description: city
      ? `${city.heroBlurb} Permit timelines, lot character, and what California state law guarantees you in ${city.name}.`
      : "City guide not found.",
    path: `/city-guides/${slug}`,
    noindex: !city,
  });
  useJsonLd(
    "breadcrumbs",
    city
      ? breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "City Guides", path: "/city-guides" },
          { name: city.name, path: `/city-guides/${city.slug}` },
        ])
      : null,
  );

  if (!city) {
    return (
      <Layout>
        <div className="pt-32 pb-24 px-6 max-w-[720px] mx-auto text-center">
          <h1 className="font-serif text-[36px] font-light text-[var(--hemma-black)] mb-4">
            City guide not found
          </h1>
          <p className="text-[15px] font-light text-[var(--hemma-mid)] mb-6">
            We may not yet have a guide for that city. Tell us your address and
            we'll let you know what's possible.
          </p>
          <Link
            href="/city-guides"
            className="inline-block text-[14px] font-medium text-[var(--hemma-blue)] underline underline-offset-2"
          >
            ← Back to all city guides
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-6 md:px-12 bg-[var(--hemma-white)]">
        <div className="max-w-[820px] mx-auto">
          <Link
            href="/city-guides"
            className="inline-block text-[12px] font-semibold tracking-[0.16em] uppercase text-[var(--hemma-mid)] hover:text-[var(--hemma-black)] mb-6 no-underline"
          >
            ← All city guides
          </Link>
          <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--hemma-blue)] mb-4">
            {city.county}
          </p>
          <h1 className="font-serif font-light text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.05] tracking-tight text-[var(--hemma-black)] mb-5">
            Building an ADU in {city.name}.
          </h1>
          <p className="text-[17px] md:text-[19px] font-light leading-[1.6] text-[var(--hemma-mid)]">
            {city.heroBlurb}
          </p>
        </div>
      </section>

      {/* Local context */}
      <section className="pb-12 md:pb-16 px-6 md:px-12 bg-[var(--hemma-white)]">
        <div className="max-w-[760px] mx-auto">
          <div className="rounded-[10px] bg-[var(--hemma-light)] p-7 md:p-9">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[var(--hemma-blue)] mb-3">
              What {city.name} is like to build in
            </p>
            <p className="text-[16px] md:text-[17px] font-light leading-[1.7] text-[var(--hemma-black)]">
              {city.localFlavor}
            </p>
          </div>

          <div className="mt-6 md:mt-8 border-l-2 border-[var(--hemma-amber)] pl-5 md:pl-6 py-1">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[var(--hemma-mid)] mb-2">
              Permit timeline
            </p>
            <p className="text-[15px] md:text-[16px] font-light leading-[1.6] text-[var(--hemma-black)]">
              {city.permitNote}
            </p>
          </div>
        </div>
      </section>

      {/* State law guarantees */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-[var(--hemma-light)]">
        <div className="max-w-[960px] mx-auto">
          <div className="text-center mb-10 md:mb-14 max-w-[640px] mx-auto">
            <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--hemma-blue)] mb-4">
              California state law
            </p>
            <h2 className="font-serif font-light text-[clamp(1.8rem,4vw,2.5rem)] leading-[1.15] text-[var(--hemma-black)] mb-4">
              What you're guaranteed — anywhere in California.
            </h2>
            <p className="text-[15px] md:text-[16px] font-light leading-[1.65] text-[var(--hemma-mid)]">
              These five rights apply in {city.name} regardless of what local
              zoning otherwise says. They're the floor — cities can be more
              permissive, but never less.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {STATE_LAW_GUARANTEES.map((g) => (
              <div
                key={g.title}
                className="bg-[var(--hemma-white)] rounded-[10px] p-6 md:p-7 border border-black/5"
              >
                <h3 className="font-serif text-[19px] md:text-[20px] font-light text-[var(--hemma-black)] mb-2 leading-tight">
                  {g.title}
                </h3>
                <p className="text-[14px] font-light leading-[1.6] text-[var(--hemma-mid)]">
                  {g.body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-[12px] font-light leading-[1.6] text-[var(--hemma-mid)] text-center max-w-[640px] mx-auto italic">
            Sources: AB 68 (2019), AB 881 (2019), SB 13 (2019), and California
            Civil Code §4751. Not legal advice — your specific lot may have
            additional considerations we can review with you.
          </p>
        </div>
      </section>

      {/* Recommended layouts */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-[var(--hemma-white)]">
        <div className="max-w-[960px] mx-auto">
          <div className="mb-10 md:mb-12 max-w-[640px]">
            <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--hemma-blue)] mb-4">
              Layouts that work in {city.name}
            </p>
            <h2 className="font-serif font-light text-[clamp(1.7rem,3.8vw,2.25rem)] leading-[1.15] text-[var(--hemma-black)] mb-4">
              What we'd build on a typical {city.name} lot.
            </h2>
            <p className="text-[15px] md:text-[16px] font-light leading-[1.65] text-[var(--hemma-mid)]">
              {city.layoutNote}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
            {city.recommendedLayouts
              .map((id) => LAYOUT_SUMMARIES[id])
              .filter((l): l is NonNullable<typeof l> => Boolean(l))
              .map((layout, idx) => (
                <Link
                  key={layout.id}
                  href={`/configure?l=${layout.id}`}
                  className="group block bg-[var(--hemma-light)] rounded-[10px] p-6 md:p-7 border border-black/5 hover:border-black/15 transition-all hover:-translate-y-0.5 no-underline"
                >
                  <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--hemma-mid)] mb-2">
                    {idx === 0 ? "Most common" : `Pick ${idx + 1}`}
                  </p>
                  <h3 className="font-serif text-[24px] md:text-[26px] font-light text-[var(--hemma-black)] leading-tight mb-1">
                    {layout.name}
                  </h3>
                  <p className="text-[13px] font-light italic text-[var(--hemma-mid)] mb-4">
                    {layout.tagline}
                  </p>
                  <div className="space-y-1 text-[13px] font-light text-[var(--hemma-black)]">
                    <p>{layout.bedsBaths}</p>
                    <p className="text-[var(--hemma-mid)]">{layout.sqft}</p>
                  </div>
                  <p className="mt-5 text-[12px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-blue)] group-hover:text-[var(--hemma-black)] transition-colors">
                    Configure this →
                  </p>
                </Link>
              ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/floor-plans"
              className="inline-block text-[13px] font-medium text-[var(--hemma-mid)] hover:text-[var(--hemma-black)] underline underline-offset-2"
            >
              See all 8 floor plans
            </Link>
          </div>
        </div>
      </section>

      {/* Inline CTA */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-[var(--hemma-white)]">
        <div className="max-w-[760px] mx-auto rounded-[10px] bg-[var(--hemma-black)] text-white px-8 py-10 md:px-12 md:py-14 text-center">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--hemma-amber)] mb-3">
            Ready to see your ADU?
          </p>
          <h3 className="font-serif text-[clamp(1.6rem,3.5vw,2rem)] font-light leading-[1.2] mb-4">
            Design yours in 5 minutes — or get a free 20-minute call about your{" "}
            {city.name} lot.
          </h3>
          <p className="text-[14px] md:text-[15px] font-light leading-[1.6] text-white/70 mb-7 max-w-[480px] mx-auto">
            We'll tell you what's buildable on your specific parcel before you
            spend a dollar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/configure"
              className="bg-[var(--hemma-amber)] text-[var(--hemma-black)] px-7 py-3.5 rounded-full font-sans text-[13px] font-medium tracking-wide transition-all hover:bg-[#d0911a] no-underline inline-block"
            >
              Design Your ADU →
            </Link>
            <button
              type="button"
              onClick={() => openContact()}
              className="text-white px-7 py-3.5 rounded-full font-sans text-[13px] font-medium tracking-wide transition-all border border-white/30 bg-white/10 hover:bg-white/20"
            >
              Free Consultation
            </button>
          </div>
        </div>
      </section>

      <CTASection onContactOpen={() => openContact()} />
    </Layout>
  );
}
