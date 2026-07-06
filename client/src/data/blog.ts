export interface BlogCategory {
  slug: string;
  label: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  { slug: "adu-basics", label: "ADU Basics" },
  { slug: "financing-permits", label: "Financing & Permits" },
  { slug: "regulations", label: "Regulations" },
  { slug: "inside-midcentury-adu", label: "Inside Midcentury ADU" },
  { slug: "homeowner-stories", label: "Homeowner Stories" },
];

export const ADMIN_BRANDS = [
  { value: "midcentury", label: "Midcentury ADU" },
  { value: "shared", label: "Shared (both sites)" },
] as const;

const CATEGORY_BY_SLUG: Record<string, string> = Object.fromEntries(
  BLOG_CATEGORIES.map((c) => [c.slug, c.label]),
);

export function categoryLabel(slug: string): string {
  return CATEGORY_BY_SLUG[slug] ?? slug;
}

export function formatPostDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
