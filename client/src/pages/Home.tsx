import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { ValueBand } from "@/components/ValueBand";
import { Intro } from "@/components/Intro";
import { Testimonial } from "@/components/Testimonial";
import { CTASection } from "@/components/CTASection";
import { useContact } from "@/context/ContactContext";
import { useSeo } from "@/lib/seo";
import { useJsonLd, organizationSchema } from "@/lib/jsonld";

export default function Home() {
  const { openContact } = useContact();
  useSeo({
    title: "Midcentury modern. Backyard built.",
    description:
      "Midcentury-modern ADUs for California homeowners. Clean lines, warm woods, and post-and-beam character — built for backyard living.",
    path: "/",
  });
  useJsonLd("organization", organizationSchema());
  return (
    <Layout>
      <Hero />
      <ValueBand />
      <Intro />
      <Testimonial />
      <CTASection onContactOpen={() => openContact()} />
    </Layout>
  );
}
