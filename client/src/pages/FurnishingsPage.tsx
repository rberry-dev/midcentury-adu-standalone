import { Layout } from "@/components/Layout";
import { useSeo } from "@/lib/seo";
import { useJsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { AssemblyBanner } from "@/components/AssemblyBanner";
import { CTASection } from "@/components/CTASection";
import { useContact } from "@/context/ContactContext";
import { PageIntro } from "@/components/PageIntro";
import { motion } from "framer-motion";

const MATERIALS = [
  {
    category: "Structure",
    items: [
      { name: "Post-and-Beam Framing", detail: "Douglas fir or engineered lumber, exposed in select ceiling conditions" },
      { name: "Panelized Wall System", detail: "Pre-engineered for faster site assembly and consistent quality" },
      { name: "Concrete Foundation", detail: "Poured-in-place with seismic hold-downs per CRC requirements" },
    ]
  },
  {
    category: "Exterior",
    items: [
      { name: "Cedar Siding", detail: "Clear vertical grain, pre-primed for natural stain or solid finish" },
      { name: "Smooth Stucco", detail: "Three-coat system with elastomeric finish coat" },
      { name: "Board-and-Batten", detail: "Engineered wood composite for low maintenance and longevity" },
      { name: "Standing-Seam Metal Roof", detail: "Dark bronze or silver, 24-gauge Galvalume steel" },
    ]
  },
  {
    category: "Glazing",
    items: [
      { name: "Floor-to-Ceiling Windows", detail: "Dual-pane low-e, aluminum frames with thermal break" },
      { name: "Sliding Glass Doors", detail: "Multi-panel pocket or bypass configuration per floor plan" },
      { name: "Clerestory Windows", detail: "Included on select plans for high-set natural light and ventilation" },
    ]
  },
  {
    category: "Interior Finishes",
    items: [
      { name: "Concrete Flooring", detail: "Polished and sealed, warm grey palette" },
      { name: "Hardwood Flooring", detail: "White oak, natural finish" },
      { name: "Plywood Ceiling", detail: "Baltic birch or Douglas fir, sealed and lightly sanded" },
      { name: "Kitchen Package", detail: "Flat-front cabinetry, quartz countertops, integrated appliances" },
    ]
  },
];

export default function FurnishingsPage() {
  useSeo({
    title: "Materials & Finishes — Honest materials, midcentury craft",
    description:
      "Explore the materials that make every Midcentury ADU — post-and-beam framing, cedar cladding, floor-to-ceiling glazing, and warm interior palettes.",
    path: "/materials",
  });
  useJsonLd("breadcrumbs", breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Materials", path: "/materials" },
  ]));
  const { openContact } = useContact();
  return (
    <Layout>
      <PageIntro
        eyebrow="Materials & Finishes"
        title={<>Honest materials.<br /><em className="text-[var(--hemma-amber)]">Nothing hidden.</em></>}
        subtitle="Every Midcentury ADU uses materials that are expressed truthfully — structure, skin, and finish working together as a coherent whole."
      />

      <section className="py-16 md:py-24 px-6 md:px-12 bg-[var(--hemma-white)]">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {MATERIALS.map((group, gi) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: gi * 0.1 }}
              >
                <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--hemma-blue)] mb-6 flex items-center gap-3">
                  <span className="w-6 h-px bg-[var(--hemma-blue)]" />
                  {group.category}
                </h3>
                <ul className="flex flex-col gap-5">
                  {group.items.map((item) => (
                    <li key={item.name} className="border-b border-black/8 pb-5 last:border-0 last:pb-0">
                      <strong className="block text-[15px] font-medium text-[var(--hemma-black)] mb-1">{item.name}</strong>
                      <p className="text-[13px] font-light text-[var(--hemma-mid)] leading-[1.6]">{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AssemblyBanner />
      <CTASection onContactOpen={() => openContact()} />
    </Layout>
  );
}
