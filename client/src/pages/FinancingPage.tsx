import { Layout } from "@/components/Layout";
import { useSeo } from "@/lib/seo";
import { useJsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { Financing } from "@/components/Financing";
import { FinancingLeadForm } from "@/components/FinancingLeadForm";
import { FinancingValueStrip } from "@/components/FinancingValueStrip";
import { WhatsIncluded } from "@/components/WhatsIncluded";
import { CTASection } from "@/components/CTASection";
import { useContact } from "@/context/ContactContext";
import { PageIntro } from "@/components/PageIntro";

export default function FinancingPage() {
  useSeo({
    title: "Financing — Estimate your monthly ADU payment",
    description:
      "Estimate your monthly ADU payment with our California ADU financing calculator. Pre-qualify with a licensed lending partner — no commitment, just a personalized rate.",
    path: "/financing",
  });
  useJsonLd("breadcrumbs", breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Financing", path: "/financing" },
  ]));
  const { openContact } = useContact();
  return (
    <Layout>
      <PageIntro
        eyebrow="Plan Your Investment"
        title={<>Estimate your<br /><em className="text-[var(--hemma-amber)]">monthly payment.</em></>}
        subtitle="Pick a floor plan, set your rate and term, and see what your ADU might cost per month — with a principal-and-interest or interest-only option."
      />
      <Financing onContactOpen={() => openContact()} />
      <FinancingLeadForm />
      <FinancingValueStrip />
      <WhatsIncluded onContactOpen={() => openContact()} />
      <CTASection onContactOpen={() => openContact()} />
    </Layout>
  );
}
