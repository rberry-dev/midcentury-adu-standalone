import { Layout } from "@/components/Layout";
import { useSeo } from "@/lib/seo";
import { useJsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { HowItWorks } from "@/components/HowItWorks";
import { CTASection } from "@/components/CTASection";
import { useContact } from "@/context/ContactContext";
import { PageIntro } from "@/components/PageIntro";

export default function ProcessPage() {
  useSeo({
    title: "Our Process — From discovery call to move-in ready ADU",
    description:
      "How Midcentury ADU delivers a finished ADU in California — discovery call, site survey, permits, foundation, build, and move-in. Every step explained.",
    path: "/process",
  });
  useJsonLd("breadcrumbs", breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Process", path: "/process" },
  ]));
  const { openContact } = useContact();
  return (
    <Layout>
      <PageIntro
        eyebrow="How It Works"
        title={<>From first call.<br /><em className="text-[var(--hemma-amber)]">To front door key.</em></>}
        subtitle="Four steps. One team. One contract. ADU Homes manages permitting, construction, and every finish detail — from permit to move-in."
      />
      <HowItWorks />
      <CTASection onContactOpen={() => openContact()} />
    </Layout>
  );
}
