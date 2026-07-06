import { useEffect, useMemo } from "react";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import type { Model } from "@/data/models";
import type { FAQCategory } from "@/data/faqs";

const ORG_PHONE = "+1-310-555-4366";
const ORG_EMAIL = "hello@aduhomesinc.com";
const CSLB_LICENSE = "1234567";

const ORG_ID = `${SITE_URL}/#organization`;
const BUSINESS_ID = `${SITE_URL}/#business`;

type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

export function useJsonLd(id: string, data: JsonLdValue | null): void {
  const json = useMemo(
    () => (data === null ? null : JSON.stringify(data)),
    [data],
  );
  useEffect(() => {
    if (!json) return;
    const elementId = `jsonld-${id}`;
    let el = document.head.querySelector<HTMLScriptElement>(`#${elementId}`);
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = elementId;
      document.head.appendChild(el);
    }
    el.textContent = json;
    return () => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, [id, json]);
}

export function organizationSchema(): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "ADU Homes Inc.",
        alternateName: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/opengraph.jpg`,
        email: ORG_EMAIL,
        telephone: ORG_PHONE,
        identifier: `CSLB License #${CSLB_LICENSE}`,
        sameAs: [],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: ORG_PHONE,
          email: ORG_EMAIL,
          contactType: "sales",
          areaServed: ["US-CA"],
          availableLanguage: ["English"],
        },
      },
      {
        "@type": "GeneralContractor",
        "@id": BUSINESS_ID,
        name: SITE_NAME,
        parentOrganization: { "@id": ORG_ID },
        url: SITE_URL,
        image: `${SITE_URL}/opengraph.jpg`,
        priceRange: "$$$",
        telephone: ORG_PHONE,
        email: ORG_EMAIL,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Los Angeles",
          addressRegion: "CA",
          addressCountry: "US",
        },
        areaServed: [
          { "@type": "AdministrativeArea", name: "Los Angeles County, CA" },
          { "@type": "AdministrativeArea", name: "Orange County, CA" },
        ],
        knowsAbout: [
          "Accessory Dwelling Units",
          "ADU Construction",
          "California ADU Permitting",
          "Midcentury Modern Architecture",
          "Title 24 Compliance",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}

function priceToNumber(price: string): number {
  const n = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function absoluteImageUrl(url: string | undefined): string {
  if (!url) return `${SITE_URL}/opengraph.jpg`;
  if (/^https?:\/\//.test(url)) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function productSchema(model: Model): JsonLdValue {
  const heroImage = model.images.find((i) => i.kind === "hero") ?? model.images[0];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/floor-plans#${model.id}`,
    name: `Midcentury ADU ${model.name}`,
    description: model.desc,
    image: absoluteImageUrl(heroImage?.url),
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "Accessory Dwelling Unit",
    additionalProperty: [
      { "@type": "PropertyValue", name: "Square Feet", value: model.sf },
      { "@type": "PropertyValue", name: "Bedrooms", value: String(model.beds) },
      { "@type": "PropertyValue", name: "Bathrooms", value: model.baths },
      { "@type": "PropertyValue", name: "Stories", value: model.stories },
      { "@type": "PropertyValue", name: "Type", value: model.type },
    ],
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: priceToNumber(model.price),
      availability: "https://schema.org/InStock",
      areaServed: [
        { "@type": "AdministrativeArea", name: "Los Angeles County, CA" },
        { "@type": "AdministrativeArea", name: "Orange County, CA" },
      ],
      seller: { "@id": ORG_ID },
    },
  };
}

export function floorPlansItemListSchema(models: Model[]): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Midcentury ADU Floor Plans",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: models.length,
    itemListElement: models.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: productSchema(m),
    })),
  };
}

interface ArticleInput {
  slug: string;
  title: string;
  excerpt: string;
  heroImageUrl?: string | null;
  publishedAt?: string | null;
  updatedAt: string;
  category: string;
}

export function articleSchema(post: ArticleInput): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    headline: post.title,
    description: post.excerpt,
    image: absoluteImageUrl(post.heroImageUrl ?? undefined),
    datePublished: post.publishedAt ?? post.updatedAt,
    dateModified: post.updatedAt,
    articleSection: post.category,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

export function faqSchema(categories: FAQCategory[]): JsonLdValue {
  const all = categories.flatMap((c) => c.faqs);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: all.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}
