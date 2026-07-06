export interface ConfiguratorOption {
  id: string;
  label: string;
  sublabel?: string;
  description?: string;
  bullets?: string[];
  priceDelta?: number;
  swatchColor?: string;
  imageUrl?: string;
}

export interface ConfiguratorGroup {
  id: string;
  shortKey: string;
  title: string;
  description?: string;
  type: "single" | "multi";
  defaultId?: string;
  options: ConfiguratorOption[];
}

export interface ConfiguratorSection {
  id: string;
  title: string;
  groups: ConfiguratorGroup[];
}

export interface LayoutPricing {
  basePrice: number;
  previewImage: string;
}

export const LAYOUT_PRICING: Record<string, LayoutPricing> = {
  palm: {
    basePrice: 189000,
    previewImage: "/midcentury-adu/elevations/palm.png",
  },
  grove: {
    basePrice: 229000,
    previewImage: "/midcentury-adu/elevations/grove.png",
  },
  mesa: {
    basePrice: 259000,
    previewImage: "/midcentury-adu/elevations/mesa.png",
  },
  haven: {
    basePrice: 289000,
    previewImage: "/midcentury-adu/elevations/haven.png",
  },
  canyon: {
    basePrice: 369000,
    previewImage: "/midcentury-adu/elevations/canyon.png",
  },
  ranch: {
    basePrice: 419000,
    previewImage: "/midcentury-adu/elevations/ranch.png",
  },
  loft: {
    basePrice: 429000,
    previewImage: "/midcentury-adu/elevations/loft.png",
  },
  ridge: {
    basePrice: 469000,
    previewImage: "/midcentury-adu/elevations/ridge.png",
  },
};

export const CONFIG_SECTIONS: ConfiguratorSection[] = [
  {
    id: "exterior",
    title: "Exterior options",
    groups: [
      {
        id: "layout",
        shortKey: "l",
        title: "Choose your floor plan",
        description:
          "Eight midcentury modern floor plans. Pick the one that fits your lot and life.",
        type: "single",
        defaultId: "grove",
        options: [
          {
            id: "palm",
            label: "PALM",
            sublabel: "Studio · 1 bath · 400 sq ft",
          },
          {
            id: "grove",
            label: "GROVE",
            sublabel: "1 bed, 1 bath · 550 sq ft",
          },
          {
            id: "mesa",
            label: "MESA",
            sublabel: "2 bed, 1 bath · 700 sq ft",
          },
          {
            id: "haven",
            label: "HAVEN",
            sublabel: "1 bed + den, 1 bath · 700 sq ft",
          },
          {
            id: "canyon",
            label: "CANYON",
            sublabel: "2 bed, 2 bath · 900 sq ft",
          },
          {
            id: "ranch",
            label: "RANCH",
            sublabel: "3 bed, 2 bath · 1,100 sq ft",
          },
          {
            id: "loft",
            label: "LOFT",
            sublabel: "Carriage · 1 bed, 1 bath · 1,100 sq ft · 2 stories",
          },
          {
            id: "ridge",
            label: "RIDGE",
            sublabel: "2-story · 1 bed, 2 bath · 1,200 sq ft",
          },
        ],
      },
      {
        id: "cladding-color",
        shortKey: "cc",
        title: "Choose your cladding color",
        description:
          "Vertical 7\" fiber cement panels with V-groove — durable, weather-, fire-, and rot-resistant.",
        type: "single",
        defaultId: "bone-white",
        options: [
          {
            id: "bone-white",
            label: "Bone white",
            description: "A warm and simple white. Classic.",
            swatchColor: "#F1ECE3",
            imageUrl: "/configurator/cladding-bone-white.png",
          },
          {
            id: "fog-grey",
            label: "Fog grey",
            description: "A soft, muted grey that reads neutral in any light.",
            swatchColor: "#A9ADAE",
            imageUrl: "/configurator/cladding-fog-grey.png",
          },
          {
            id: "forest-green",
            label: "Forest green",
            description: "A deep, restful green that disappears into landscaping.",
            swatchColor: "#3E4F3F",
            imageUrl: "/configurator/cladding-forest-green.png",
          },
          {
            id: "charred-black",
            label: "Charred black",
            description: "Inspired by charred wood traditions — bold and timeless.",
            swatchColor: "#1C1C1A",
            imageUrl: "/configurator/cladding-charred-black.png",
          },
          {
            id: "cedar-stain",
            label: "Cedar stain",
            description: "A warm wood-tone finish. Pairs with natural materials.",
            swatchColor: "#8C5A36",
            imageUrl: "/configurator/cladding-cedar-stain.png",
          },
          {
            id: "custom",
            label: "Custom color",
            description: "Specified later with our design team.",
            priceDelta: 3000,
            swatchColor: "#FFFFFF",
          },
        ],
      },
      {
        id: "roof-color",
        shortKey: "rc",
        title: "Choose your roof color",
        type: "single",
        defaultId: "silver",
        options: [
          {
            id: "silver",
            label: "Silver",
            description: "A light, contemporary metal finish that reflects sun.",
            swatchColor: "#BFC2C4",
            imageUrl: "/configurator/roof-silver.png",
          },
          {
            id: "dark-bronze",
            label: "Dark bronze",
            description: "Extremely versatile, deep and muted.",
            priceDelta: 2500,
            swatchColor: "#3A2E22",
            imageUrl: "/configurator/roof-dark-bronze.png",
          },
        ],
      },
      {
        id: "front-opening",
        shortKey: "fo",
        title: "Choose your front window or doors",
        type: "single",
        defaultId: "casement-front",
        options: [
          {
            id: "casement-front",
            label: "Casement window",
            sublabel: "3' × 5'",
          },
          {
            id: "double-doors-front",
            label: "Double doors",
            sublabel: "3' × 6'8\" glass doors",
            priceDelta: 11000,
          },
        ],
      },
      {
        id: "living-opening",
        shortKey: "lo",
        title: "Choose your living room window or doors",
        type: "single",
        defaultId: "casement-living",
        options: [
          {
            id: "casement-living",
            label: "Casement window",
            sublabel: "3' × 5'",
          },
          {
            id: "double-doors-living",
            label: "Double doors",
            sublabel: "3' × 6'8\" glass doors",
            priceDelta: 11000,
          },
        ],
      },
      {
        id: "solar",
        shortKey: "s",
        title: "Add solar panels",
        type: "single",
        defaultId: "no-solar",
        options: [
          {
            id: "no-solar",
            label: "No solar",
            sublabel: "Power with the grid",
          },
          {
            id: "solar-array",
            label: "Solar array",
            sublabel: "Go net zero¹",
            priceDelta: 10200,
          },
        ],
      },
      {
        id: "battery",
        shortKey: "b",
        title: "Optional energy upgrades",
        description: "Available with the solar array.",
        type: "single",
        defaultId: "no-battery",
        options: [
          {
            id: "no-battery",
            label: "No battery",
          },
          {
            id: "powerwall",
            label: "Tesla Powerwall 3",
            sublabel: "Whole-home battery backup",
            priceDelta: 12500,
          },
        ],
      },
    ],
  },
  {
    id: "interior",
    title: "Interior options",
    groups: [
      {
        id: "floor-color",
        shortKey: "fc",
        title: "Choose your floor color",
        type: "single",
        defaultId: "natural-oak",
        options: [
          {
            id: "natural-oak",
            label: "Natural oak",
            description:
              "Waterproof stone composite flooring with a warm, honest character and visible grain.",
            swatchColor: "#D9B98A",
            imageUrl: "/configurator/floor-natural-oak.png",
          },
          {
            id: "dark-oak",
            label: "Dark stained oak",
            description: "A deeper, more dramatic floor that grounds open layouts.",
            priceDelta: 1000,
            swatchColor: "#5A3A22",
            imageUrl: "/configurator/floor-dark-oak.png",
          },
        ],
      },
      {
        id: "kitchen-finish",
        shortKey: "kf",
        title: "Choose your kitchen cabinet finish",
        description:
          "Custom base cabinetry with solid surface countertop and matching backsplash on the cooktop wall, plus built-in pantry with electrical outlets.",
        type: "single",
        defaultId: "bone-white-kitchen",
        options: [
          {
            id: "bone-white-kitchen",
            label: "Bone white",
            description: "Clean and unobtrusive. Emphasizes depth.",
            swatchColor: "#F1ECE3",
            imageUrl: "/configurator/kitchen-bone-white.png",
          },
          {
            id: "natural-oak-kitchen",
            label: "Natural oak",
            description: "Warmer and more textured. Pairs with the natural oak floor.",
            priceDelta: 5000,
            swatchColor: "#D9B98A",
            imageUrl: "/configurator/kitchen-natural-oak.png",
          },
        ],
      },
      {
        id: "bedroom-storage",
        shortKey: "bs",
        title: "Choose storage for the bedroom",
        description: "Customize storage in the bedroom, located next to the entry area.",
        type: "single",
        defaultId: "standard-wardrobe",
        options: [
          {
            id: "standard-wardrobe",
            label: "Standard wardrobe",
            sublabel: "Single-bay reach-in wardrobe",
          },
          {
            id: "full-wardrobe",
            label: "Full-width wardrobe",
            sublabel: "Spans the entire wall",
            priceDelta: 1750,
          },
        ],
      },
    ],
  },
  {
    id: "upgrades",
    title: "Optional upgrades",
    groups: [
      {
        id: "extras",
        shortKey: "u",
        title: "Peace of mind. Quality of life.",
        description: "Additional ways to enhance your ADU.",
        type: "multi",
        options: [
          {
            id: "quartz",
            label: "Quartz countertops",
            sublabel: "Durable surfaces throughout",
            priceDelta: 5000,
          },
          {
            id: "accessibility",
            label: "Bathroom accessibility kit",
            sublabel: "Enhance safety and ease of use",
            priceDelta: 0,
          },
          {
            id: "blinds",
            label: "Roller blinds",
            sublabel: "More privacy without losing light",
            priceDelta: 1750,
          },
          {
            id: "ev-charger",
            label: "EV charger pre-wire",
            sublabel: "240V-ready exterior outlet",
            priceDelta: 1200,
          },
        ],
      },
    ],
  },
];

export type ConfigState = {
  // single-select group id -> option id
  single: Record<string, string>;
  // multi-select group id -> array of option ids
  multi: Record<string, string[]>;
};

export function getDefaultConfig(): ConfigState {
  const single: Record<string, string> = {};
  const multi: Record<string, string[]> = {};
  for (const section of CONFIG_SECTIONS) {
    for (const group of section.groups) {
      if (group.type === "single") {
        single[group.id] = group.defaultId ?? group.options[0].id;
      } else {
        multi[group.id] = [];
      }
    }
  }
  return { single, multi };
}

export function findOption(
  group: ConfiguratorGroup,
  optionId: string,
): ConfiguratorOption | undefined {
  return group.options.find((o) => o.id === optionId);
}

export function getAllGroups(): ConfiguratorGroup[] {
  return CONFIG_SECTIONS.flatMap((s) => s.groups);
}

export interface PriceLineItem {
  groupId: string;
  groupTitle: string;
  optionLabel: string;
  delta: number;
}

export interface PriceBreakdown {
  basePrice: number;
  baseLabel: string;
  upgrades: PriceLineItem[];
  total: number;
}

export function computePrice(state: ConfigState): PriceBreakdown {
  const layoutId = state.single["layout"];
  const layoutPricing = LAYOUT_PRICING[layoutId] ?? LAYOUT_PRICING["fristad"];
  const layoutGroup = getAllGroups().find((g) => g.id === "layout")!;
  const layoutOption = findOption(layoutGroup, layoutId);
  const upgrades: PriceLineItem[] = [];

  for (const group of getAllGroups()) {
    if (group.id === "layout") continue;
    if (group.type === "single") {
      const optionId = state.single[group.id];
      const opt = findOption(group, optionId);
      if (opt && (opt.priceDelta ?? 0) > 0) {
        upgrades.push({
          groupId: group.id,
          groupTitle: group.title,
          optionLabel: opt.label,
          delta: opt.priceDelta!,
        });
      }
    } else {
      const ids = state.multi[group.id] ?? [];
      for (const id of ids) {
        const opt = findOption(group, id);
        if (!opt) continue;
        upgrades.push({
          groupId: group.id,
          groupTitle: group.title,
          optionLabel: opt.label,
          delta: opt.priceDelta ?? 0,
        });
      }
    }
  }

  const total =
    layoutPricing.basePrice + upgrades.reduce((sum, u) => sum + u.delta, 0);

  return {
    basePrice: layoutPricing.basePrice,
    baseLabel: layoutOption?.label ?? "Layout",
    upgrades,
    total,
  };
}

export function formatPrice(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

// Map a floor-plan model id (slug from API, may include diacritics)
// to the configurator layout id (ASCII-only slug for clean URLs).
const MODEL_ID_TO_LAYOUT: Record<string, string> = {
  koja: "koja",
  fristad: "fristad",
  torp: "torp",
  "språng": "sprang",
  sprang: "sprang",
  avkast: "avkast",
  "gård": "gard",
  gard: "gard",
  loge: "loge",
  "höjd": "hojd",
  hojd: "hojd",
};

export function configuratorLayoutForModel(modelId: string): string {
  return MODEL_ID_TO_LAYOUT[modelId] ?? "fristad";
}

// Back-compat shim — older callers passed (type, sf).
export function configuratorLayoutForType(_type: string, _sf: number): string {
  return "fristad";
}

// URL state encoding/decoding
export function encodeStateToParams(state: ConfigState): URLSearchParams {
  const params = new URLSearchParams();
  for (const group of getAllGroups()) {
    if (group.type === "single") {
      const id = state.single[group.id];
      if (id && id !== group.defaultId) {
        params.set(group.shortKey, id);
      }
    } else {
      const ids = state.multi[group.id] ?? [];
      if (ids.length > 0) {
        params.set(group.shortKey, ids.join(","));
      }
    }
  }
  return params;
}

export function decodeStateFromParams(params: URLSearchParams): ConfigState {
  const state = getDefaultConfig();
  for (const group of getAllGroups()) {
    const raw = params.get(group.shortKey);
    if (!raw) continue;
    if (group.type === "single") {
      if (group.options.some((o) => o.id === raw)) {
        state.single[group.id] = raw;
      }
    } else {
      const ids = raw.split(",").filter((id) =>
        group.options.some((o) => o.id === id),
      );
      state.multi[group.id] = ids;
    }
  }
  return state;
}
