import { Layout } from "@/components/Layout";
import { useSeo } from "@/lib/seo";
import { useJsonLd, floorPlansItemListSchema, breadcrumbSchema } from "@/lib/jsonld";
import { useModels } from "@/data/models";
import { Models } from "@/components/Models";
import { CTASection } from "@/components/CTASection";
import { useContact } from "@/context/ContactContext";
import { PageIntro } from "@/components/PageIntro";

export default function FloorPlansPage() {
  useSeo({
    title: "Floor Plans — 8 Midcentury Modern ADUs from 400–1,200 sq ft",
    description:
      "Browse all eight Midcentury ADU floor plans — studios, one- and two-bedroom midcentury modern homes from 400 to 1,200 square feet. View layouts, square footage, and pricing.",
    path: "/floor-plans",
  });
  const { models } = useModels();
  useJsonLd(
    "floor-plans-list",
    models.length > 0 ? floorPlansItemListSchema(models) : null,
  );
  useJsonLd(
    "breadcrumbs",
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Floor Plans", path: "/floor-plans" },
    ]),
  );
  const { openContact } = useContact();
  return (
    <Layout>
      <PageIntro
        eyebrow="The Collection"
        title={<>Eight floor plans.<br /><em className="text-[var(--hemma-amber)]">Every life stage.</em></>}
        subtitle="From 400 sq ft studios to 1,200 sq ft two-story carriage homes — every plan built to midcentury modern standards, permitted and move-in ready."
      />
      <Models onContactOpen={openContact} />
      <CTASection onContactOpen={() => openContact()} />
    </Layout>
  );
}
