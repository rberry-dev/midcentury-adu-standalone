import { Layout } from "@/components/Layout";
import { useSeo } from "@/lib/seo";
import { useJsonLd, faqSchema, breadcrumbSchema } from "@/lib/jsonld";
import { FAQ_CATEGORIES } from "@/data/faqs";
import { FAQ } from "@/components/FAQ";
import { CTASection } from "@/components/CTASection";
import { useContact } from "@/context/ContactContext";
import { PageIntro } from "@/components/PageIntro";

export default function FAQPage() {
  useSeo({
    title: "FAQ — California ADU questions answered",
    description:
      "Common questions about California ADUs, Midcentury ADU pricing, timelines, permits, financing, and what's included with every move-in-ready unit.",
    path: "/faq",
  });
  useJsonLd("faq", faqSchema(FAQ_CATEGORIES));
  useJsonLd(
    "breadcrumbs",
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "FAQ", path: "/faq" },
    ]),
  );
  const { openContact } = useContact();
  return (
    <Layout>
      <PageIntro
        eyebrow="Frequently Asked"
        title={<>Everything you need.<br /><em className="text-[var(--hemma-amber)]">Before you call.</em></>}
        subtitle="The most common questions we hear about Midcentury ADU — what's included, how long it takes, what it costs, and what makes our build different. Still curious? Schedule a free consultation."
      />
      <FAQ />
      <CTASection onContactOpen={() => openContact()} />
    </Layout>
  );
}
