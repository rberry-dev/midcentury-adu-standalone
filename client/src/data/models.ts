import { useMemo } from "react";
import { useListModels, type Model as ApiModel } from "@/lib/api";

export interface IncludedItem {
  name: string;
  url: string;
}

export interface BadgeStyle {
  background: string;
  color: string;
}

export interface Model {
  id: string;
  name: string;
  sf: number;
  type: string;
  badge: string;
  badgeStyle: BadgeStyle;
  scenario: string;
  tagline: string;
  beds: number | string;
  baths: number;
  stories: number;
  price: string;
  furnishingPrice: string;
  desc: string;
  includes: IncludedItem[];
  dbId: number;
  images: ApiModel["images"];
}

function formatUsd(cents: number): string {
  const dollars = Math.round(cents / 100);
  return `$${dollars.toLocaleString("en-US")}`;
}

function parseBeds(value: string): number | string {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && String(numeric) === value.trim()) {
    return numeric;
  }
  return value;
}

export function adaptModel(api: ApiModel): Model {
  return {
    id: api.slug,
    dbId: api.id,
    name: api.name,
    sf: api.sf,
    type: api.type,
    badge: api.badge,
    badgeStyle: { background: api.badgeBg, color: api.badgeColor },
    scenario: api.scenario,
    tagline: api.tagline,
    beds: parseBeds(api.beds),
    baths: api.baths,
    stories: api.stories,
    price: formatUsd(api.priceCents),
    furnishingPrice: formatUsd(api.furnishingPriceCents),
    desc: api.description,
    includes: api.products.map((p) => ({ name: p.name, url: p.url })),
    images: api.images,
  };
}

/**
 * Fetches floor-plan models from the API and adapts them into the UI shape
 * used throughout the site. Returns `models: []` while loading.
 */
export function useModels(): { models: Model[]; isLoading: boolean; error: unknown } {
  const { data, isLoading, error } = useListModels();
  const models = useMemo(
    () => (data ?? []).filter((m) => m.isPublished).map(adaptModel),
    [data],
  );
  return { models, isLoading, error };
}
