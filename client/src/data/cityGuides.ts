export interface CityGuide {
  slug: string;
  name: string;
  county: string;
  region: "la-county" | "orange-county";
  heroBlurb: string;
  localFlavor: string;
  permitNote: string;
  recommendedLayouts: string[]; // configurator layout ids, in order
  layoutNote: string; // 1–2 sentence reasoning for the picks
}

export interface LayoutSummary {
  id: string;
  name: string;
  tagline: string;
  bedsBaths: string;
  sqft: string;
}

// Lightweight summaries (kept in sync with src/data/configurator.ts).
// Used by city pages to render recommended-layout cards without importing the
// full configurator option tree.
export const LAYOUT_SUMMARIES: Record<string, LayoutSummary> = {
  koja: { id: "koja", name: "KOJA", tagline: "The Studio", bedsBaths: "Studio · 1 bath", sqft: "400 sq ft" },
  fristad: { id: "fristad", name: "FRISTAD", tagline: "The Sanctuary", bedsBaths: "1 bed · 1 bath", sqft: "550 sq ft" },
  torp: { id: "torp", name: "TORP", tagline: "The Pair", bedsBaths: "2 bed · 1 bath", sqft: "700 sq ft" },
  sprang: { id: "sprang", name: "SPRÅNG", tagline: "The Launchpad", bedsBaths: "1 bed + den · 1 bath", sqft: "700 sq ft" },
  avkast: { id: "avkast", name: "AVKAST", tagline: "The Dividend", bedsBaths: "2 bed · 2 bath", sqft: "900 sq ft" },
  gard: { id: "gard", name: "GÅRD", tagline: "The Family", bedsBaths: "3 bed · 2 bath", sqft: "1,100 sq ft" },
  loge: { id: "loge", name: "LOGE", tagline: "The Carriage Unit", bedsBaths: "1 bed · 1 bath · 2 stories", sqft: "1,100 sq ft" },
  hojd: { id: "hojd", name: "HÖJD", tagline: "The Legacy", bedsBaths: "1 bed · 2 bath · 2 stories", sqft: "1,200 sq ft" },
};

export interface CityRegion {
  id: CityGuide["region"];
  label: string;
  description: string;
}

export const CITY_REGIONS: CityRegion[] = [
  {
    id: "la-county",
    label: "Los Angeles County",
    description: "Where most of our builds happen — from Pasadena bungalows to Westside flag lots.",
  },
  {
    id: "orange-county",
    label: "Orange County",
    description: "Family-sized lots, mature landscaping, and steady ADU demand from Anaheim to Newport.",
  },
];

export const CITY_GUIDES: CityGuide[] = [
  // LA County
  {
    slug: "los-angeles",
    name: "Los Angeles",
    county: "Los Angeles County",
    region: "la-county",
    heroBlurb:
      "The largest ADU market in the country — and the city that wrote the playbook the rest of California is following.",
    localFlavor:
      "City of Los Angeles processes more ADU permits than any other municipality in California. Lots vary wildly — Mid-City bungalow lots sit alongside Valley ranch parcels and Eastside hillside parcels — but the city's permit pathway is now one of the most predictable in the state. We've built ADUs in nearly every City of LA council district.",
    permitNote:
      "Most City of LA detached ADU permits clear in 8–14 weeks once plans are submitted. Add 4–6 weeks for hillside or Coastal Zone review.",
    recommendedLayouts: ["fristad", "avkast", "gard"],
    layoutNote:
      "LA lots vary too much for a single answer, but the FRISTAD 1-bed and AVKAST 2-bed cover the majority of City of LA projects. GÅRD comes up on the larger Valley parcels.",
  },
  {
    slug: "long-beach",
    name: "Long Beach",
    county: "Los Angeles County",
    region: "la-county",
    heroBlurb: "Generous lot widths and a city that genuinely encourages backyard housing.",
    localFlavor:
      "Long Beach has its own permit office (separate from LA County) and has been an early adopter of streamlined ADU review. The mid-century neighborhoods around Belmont Heights and Bixby Knolls have lot widths that make a 2-bedroom ADU easy to site without losing the main yard.",
    permitNote:
      "Long Beach typically issues detached ADU permits in 6–10 weeks. The city's online portal is one of the better ones we work with.",
    recommendedLayouts: ["torp", "avkast", "gard"],
    layoutNote:
      "The wider mid-century lots in Belmont Heights and Bixby Knolls handle a TORP or AVKAST without crowding the main yard. GÅRD works well for multi-generational projects on the deeper parcels.",
  },
  {
    slug: "pasadena",
    name: "Pasadena",
    county: "Los Angeles County",
    region: "la-county",
    heroBlurb: "Deep craftsman lots, mature trees, and homeowners who care about how the ADU sits next to the main house.",
    localFlavor:
      "Pasadena's older neighborhoods — Bungalow Heaven, Madison Heights, the Lower Arroyo — were laid out before single-car garages, which means deep rear yards perfect for a backyard ADU. Historic district overlays add a design-review step but rarely block a project. Architectural fit matters more here than in most cities.",
    permitNote:
      "Pasadena permits typically take 10–14 weeks. Historic-district properties add a design-review meeting (usually one round).",
    recommendedLayouts: ["fristad", "gard", "hojd"],
    layoutNote:
      "Pasadena's deep craftsman lots have room for a GÅRD or two-story HÖJD without dominating the main house. FRISTAD is the most common pick for guest-house and home-office use.",
  },
  {
    slug: "santa-monica",
    name: "Santa Monica",
    county: "Los Angeles County",
    region: "la-county",
    heroBlurb: "Small lots, high land values — the case for a compact, well-built ADU is strongest here.",
    localFlavor:
      "Santa Monica lots tend to be tight (often 50' wide), so the KOJA studio and FRISTAD 1-bedroom are our most common picks here. The city is in the Coastal Zone, so anything on a parcel west of Lincoln gets an additional Coastal Commission review — we handle the paperwork.",
    permitNote:
      "Standard Santa Monica permits run 10–14 weeks. Coastal Zone review adds 6–10 weeks but is highly predictable.",
    recommendedLayouts: ["koja", "fristad", "sprang"],
    layoutNote:
      "Tight 50-foot lots make compact units the right answer. KOJA is our most-built Santa Monica unit; FRISTAD and SPRÅNG show up on the slightly deeper parcels north of Wilshire.",
  },
  {
    slug: "burbank",
    name: "Burbank",
    county: "Los Angeles County",
    region: "la-county",
    heroBlurb: "Wide flat lots, walkable neighborhoods, and steady demand from multi-generational families.",
    localFlavor:
      "Burbank lots are flat, gridded, and easy to build on. The city's permit process is relatively straightforward and the inspectors we work with are reasonable. We see a lot of multi-generational projects here — parents in the main house, adult kids in the ADU, or vice versa.",
    permitNote:
      "Burbank typically issues detached ADU permits in 8–12 weeks.",
    recommendedLayouts: ["avkast", "gard", "torp"],
    layoutNote:
      "Burbank's flat, gridded lots and steady multi-generational demand make AVKAST and GÅRD the workhorses here. TORP is the cost-conscious 2-bed alternative.",
  },
  {
    slug: "glendale",
    name: "Glendale",
    county: "Los Angeles County",
    region: "la-county",
    heroBlurb: "Hillside lots in the north, flat valley lots in the south — two very different ADU conversations.",
    localFlavor:
      "Glendale's flat southern neighborhoods (Adams Hill, Tropico) are easy ADU territory. The northern hillside neighborhoods are workable but the site work — grading, retaining walls, foundation engineering — adds cost and weeks. We'll tell you upfront which category your lot falls into.",
    permitNote:
      "Flat-lot Glendale permits typically run 10–12 weeks. Hillside permits add 4–8 weeks for additional engineering and review.",
    recommendedLayouts: ["fristad", "torp", "loge"],
    layoutNote:
      "Flat-lot Glendale projects run the gamut from FRISTAD to TORP. On hillside lots with an existing detached garage footprint, the LOGE carriage unit is often the most efficient way to add a unit.",
  },
  {
    slug: "culver-city",
    name: "Culver City",
    county: "Los Angeles County",
    region: "la-county",
    heroBlurb: "Tight lots, design-conscious homeowners, and an unusually fast permit office.",
    localFlavor:
      "Culver City has been one of the most ADU-friendly municipalities in greater LA. Lots are small (typical 5,000–7,500 sq ft) so we usually pair an ADU with thoughtful landscaping to preserve outdoor space. The city's design sensibility aligns well with our cleaner exterior options.",
    permitNote:
      "Culver City detached ADU permits often clear in 6–10 weeks — among the fastest we work with.",
    recommendedLayouts: ["koja", "fristad", "sprang"],
    layoutNote:
      "Small Culver City lots favor the KOJA studio and FRISTAD 1-bed. SPRÅNG comes up when a homeowner wants a flexible work-from-home setup without going to two stories.",
  },
  {
    slug: "beverly-hills",
    name: "Beverly Hills",
    county: "Los Angeles County",
    region: "la-county",
    heroBlurb: "Large lots, strict design review, and a process that rewards going in prepared.",
    localFlavor:
      "Beverly Hills allows ADUs but maintains stricter design review than most LA County cities. Lot sizes are generous, which gives us more siting flexibility. We've found the city's process works smoothly when our exterior selections are made conservatively — Bone White or Fog Grey cladding with the standard roof.",
    permitNote:
      "Beverly Hills permits typically take 14–20 weeks including design review.",
    recommendedLayouts: ["gard", "hojd", "avkast"],
    layoutNote:
      "Generous Beverly Hills lots and a homeowner base that expects a finished, full-program unit make GÅRD and HÖJD the most common picks. AVKAST is the right answer for guest or staff housing.",
  },

  {
    slug: "torrance",
    name: "Torrance",
    county: "Los Angeles County",
    region: "la-county",
    heroBlurb: "Wide South Bay lots, mid-century ranches, and a permit office that moves at a steady pace.",
    localFlavor:
      "Torrance's older neighborhoods (Old Torrance, Hollywood Riviera) have the kind of generous post-war lots that make a 2-bedroom ADU an easy fit. The city's permit process is straightforward and inspectors are familiar with detached ADUs.",
    permitNote: "Torrance typically issues detached ADU permits in 10–14 weeks.",
    recommendedLayouts: ["avkast", "gard", "torp"],
    layoutNote:
      "South Bay lots in Torrance comfortably take an AVKAST or GÅRD without crowding the main yard. TORP is the cost-conscious 2-bed pick for rental projects.",
  },
  {
    slug: "manhattan-beach",
    name: "Manhattan Beach",
    county: "Los Angeles County",
    region: "la-county",
    heroBlurb: "Tight beach-town lots, high land values, and homeowners who expect a polished, fully-finished build.",
    localFlavor:
      "Manhattan Beach lots tend to be small (often 30' wide on the Sand Section, 50' east of Sepulveda). The city has its own design review and pays attention to roof lines and neighbor sight lines. Land values make even a compact ADU pencil out quickly.",
    permitNote: "Manhattan Beach permits typically run 12–16 weeks including design review.",
    recommendedLayouts: ["koja", "fristad", "sprang"],
    layoutNote:
      "Sand Section lots only fit the KOJA studio or FRISTAD 1-bed. East of Sepulveda the lots open up enough that SPRÅNG becomes a real option.",
  },
  {
    slug: "el-segundo",
    name: "El Segundo",
    county: "Los Angeles County",
    region: "la-county",
    heroBlurb: "Small-town feel, walkable grid, and one of the friendlier South Bay permit offices.",
    localFlavor:
      "El Segundo's compact grid of mid-century lots is well-suited to a backyard ADU. The city's small-town permit office is easy to work with and the inspectors take pride in turning ADU plans around quickly.",
    permitNote: "El Segundo typically issues detached ADU permits in 8–12 weeks.",
    recommendedLayouts: ["fristad", "torp", "avkast"],
    layoutNote:
      "Most El Segundo lots fit a FRISTAD or TORP comfortably. AVKAST works on the slightly deeper parcels north of Grand Avenue.",
  },
  {
    slug: "inglewood",
    name: "Inglewood",
    county: "Los Angeles County",
    region: "la-county",
    heroBlurb: "Strong rental demand, generous lots, and a city that's been steadily streamlining ADU permits.",
    localFlavor:
      "Inglewood has invested heavily in housing capacity around the SoFi/Forum corridor. The mid-century lots in Morningside Park and Fairview Heights have the depth that makes a 2-bed ADU easy to site. Rental demand here is among the strongest in LA County.",
    permitNote: "Inglewood typically issues detached ADU permits in 8–12 weeks.",
    recommendedLayouts: ["avkast", "torp", "gard"],
    layoutNote:
      "Strong rental demand makes AVKAST the most common Inglewood pick. TORP works for the cost-conscious projects, GÅRD for the multi-generational ones.",
  },
  {
    slug: "gardena",
    name: "Gardena",
    county: "Los Angeles County",
    region: "la-county",
    heroBlurb: "Flat, gridded mid-century lots and one of the more predictable South Bay permit offices.",
    localFlavor:
      "Gardena's flat lots and steady multi-generational demand make it consistent ADU territory. The city's permit process is straightforward and the inspectors are reasonable. We see a healthy mix of family-housing and rental projects here.",
    permitNote: "Gardena typically issues detached ADU permits in 8–12 weeks.",
    recommendedLayouts: ["torp", "avkast", "gard"],
    layoutNote:
      "Gardena's flat parcels handle TORP, AVKAST, or GÅRD without difficulty. The right answer usually comes down to whether the goal is family housing or rental income.",
  },
  {
    slug: "lakewood",
    name: "Lakewood",
    county: "Los Angeles County",
    region: "la-county",
    heroBlurb: "Classic post-war ranch lots, walkable streets, and steady multi-generational demand.",
    localFlavor:
      "Lakewood was built as one of the country's first planned post-war suburbs, and the original tract lots are remarkably consistent — flat, rectangular, and the right size for a backyard ADU. The city's permit office is familiar with ADU work.",
    permitNote: "Lakewood typically issues detached ADU permits in 8–12 weeks.",
    recommendedLayouts: ["fristad", "torp", "avkast"],
    layoutNote:
      "Lakewood's uniform tract lots make a FRISTAD or TORP an easy fit. AVKAST works when the homeowner wants a true 2-bed unit for family or rental.",
  },
  {
    slug: "bellflower",
    name: "Bellflower",
    county: "Los Angeles County",
    region: "la-county",
    heroBlurb: "Affordable land, deep lots, and one of the more permit-friendly South-East LA cities.",
    localFlavor:
      "Bellflower's lot sizes and land costs make ADU economics work better here than in most of LA County. The city has been steadily improving its permit process and we've had good experiences with the planning counter.",
    permitNote: "Bellflower typically issues detached ADU permits in 8–12 weeks.",
    recommendedLayouts: ["torp", "avkast", "gard"],
    layoutNote:
      "Bellflower's deeper lots and reasonable land costs make TORP and AVKAST the workhorses. GÅRD comes up on the larger parcels for multi-generational projects.",
  },

  // Orange County
  {
    slug: "anaheim",
    name: "Anaheim",
    county: "Orange County",
    region: "orange-county",
    heroBlurb: "OC's largest ADU market by volume — and one of the most predictable permit offices in the region.",
    localFlavor:
      "Anaheim's older neighborhoods (Anaheim Colony, West Anaheim) have the lot depth that makes a backyard ADU easy. The city's permit counter is well-organized and the staff is used to ADU applications. Our Spanish-language project coordinators do a meaningful share of their work in Anaheim.",
    permitNote: "Anaheim typically issues detached ADU permits in 8–12 weeks.",
    recommendedLayouts: ["torp", "gard", "avkast"],
    layoutNote:
      "Anaheim's older neighborhoods have the lot depth to handle a 3-bed GÅRD comfortably. TORP and AVKAST are the most common picks for rental and multi-generational use.",
  },
  {
    slug: "irvine",
    name: "Irvine",
    county: "Orange County",
    region: "orange-county",
    heroBlurb: "Newer subdivisions, HOA realities, and a city that needs ADUs more than its zoning suggests.",
    localFlavor:
      "Irvine is the trickiest OC city we work in — most parcels are inside HOAs that have to follow state law (per Civil Code 4751) but often add layers of architectural review. We pre-qualify Irvine projects carefully before quoting. When the project moves, the city itself is straightforward.",
    permitNote: "Irvine city permits run 10–14 weeks. HOA review is a separate process and varies by community.",
    recommendedLayouts: ["fristad", "avkast", "hojd"],
    layoutNote:
      "Irvine HOAs respond best to compact, conservative footprints — FRISTAD and AVKAST clear architectural review most easily. HÖJD works on the larger lots in the older Northwood and Turtle Rock tracts.",
  },
  {
    slug: "huntington-beach",
    name: "Huntington Beach",
    county: "Orange County",
    region: "orange-county",
    heroBlurb: "Wide flat lots, beach-town design sensibility, and growing demand from multi-generational families.",
    localFlavor:
      "HB has a healthy ADU pipeline. The flat coastal lots are easy to build on and the city's permit office moves at a reasonable pace. We see a lot of carriage-style LOGE projects here — main-house garage replaced by a 2-story unit with parking below.",
    permitNote: "Huntington Beach permits typically run 10–12 weeks.",
    recommendedLayouts: ["loge", "avkast", "gard"],
    layoutNote:
      "LOGE is unusually popular in HB — the carriage-unit format works for homeowners who want to keep a covered parking footprint while adding a unit above. AVKAST and GÅRD cover the standard backyard builds.",
  },
  {
    slug: "newport-beach",
    name: "Newport Beach",
    county: "Orange County",
    region: "orange-county",
    heroBlurb: "High-value parcels, Coastal Zone review on most lots, and homeowners who expect a polished build.",
    localFlavor:
      "Most Newport Beach parcels fall inside the Coastal Zone, which means an extra layer of state review on top of the city's process. Lot values are high enough that an ADU often pays itself back faster here than anywhere else we work — both in rental income and in resale uplift.",
    permitNote:
      "Newport Beach permits typically run 12–16 weeks plus 6–10 weeks for Coastal Commission review.",
    recommendedLayouts: ["fristad", "avkast", "hojd"],
    layoutNote:
      "Newport homeowners almost always finish the unit to main-house standards, so AVKAST and HÖJD are the most common picks. FRISTAD shows up as a guest house on the Bay Island and Balboa Peninsula parcels.",
  },
  {
    slug: "costa-mesa",
    name: "Costa Mesa",
    county: "Orange County",
    region: "orange-county",
    heroBlurb: "Mid-size lots, design-savvy homeowners, and a permit office that's gotten faster every year.",
    localFlavor:
      "Costa Mesa's Eastside neighborhoods have the kind of older bungalow lots that make a backyard ADU an obvious move. The Mesa Verde tracts have wider parcels but tighter HOA-adjacent rules. The city's permit process has improved substantially since 2022.",
    permitNote: "Costa Mesa typically issues detached ADU permits in 8–12 weeks.",
    recommendedLayouts: ["fristad", "torp", "avkast"],
    layoutNote:
      "Eastside Costa Mesa lots fit FRISTAD or TORP comfortably. AVKAST is the right call when the homeowner wants a true 2-bed rental rather than a guest-house footprint.",
  },
  {
    slug: "westminster",
    name: "Westminster",
    county: "Orange County",
    region: "orange-county",
    heroBlurb: "Strong multi-generational demand, deep lots, and one of OC's more affordable ADU markets.",
    localFlavor:
      "Westminster has one of the strongest multi-generational ADU markets in Orange County, anchored by the Vietnamese-American community in Little Saigon. Lots are deep, land costs are reasonable, and the city's permit process is straightforward. Our Vietnamese-language project coordinators work heavily here.",
    permitNote: "Westminster typically issues detached ADU permits in 8–12 weeks.",
    recommendedLayouts: ["gard", "avkast", "hojd"],
    layoutNote:
      "Multi-generational demand drives a lot of GÅRD and HÖJD work in Westminster. AVKAST is the common pick when the goal is a true rental unit.",
  },
];

export function getCityGuide(slug: string): CityGuide | undefined {
  return CITY_GUIDES.find((c) => c.slug === slug);
}

export function getCitiesByRegion(regionId: CityGuide["region"]): CityGuide[] {
  return CITY_GUIDES.filter((c) => c.region === regionId);
}

// Universal California ADU rights, per AB 68 / AB 881 / SB 13 / Civil Code 4751.
// Used on every city guide page — these apply statewide regardless of the
// specific municipality.
export const STATE_LAW_GUARANTEES: { title: string; body: string }[] = [
  {
    title: "Up to 1,200 sq ft, guaranteed",
    body: "California state law guarantees you the right to build a detached ADU of at least 1,200 sq ft on most single-family lots, regardless of what local zoning otherwise allows.",
  },
  {
    title: "4-foot setbacks",
    body: "Cities cannot require more than 4 feet from the side or rear property lines for a detached ADU.",
  },
  {
    title: "60-day permit decision",
    body: "Once a complete ADU application is submitted, the city must approve or deny it within 60 days. We design our submittals to meet that bar.",
  },
  {
    title: "No extra parking near transit",
    body: "If your property is within ½ mile walking distance of public transit, the city cannot require any additional off-street parking for the ADU.",
  },
  {
    title: "HOAs cannot prohibit ADUs",
    body: "California Civil Code 4751 prevents homeowners associations from prohibiting ADUs on single-family lots — though reasonable design rules still apply.",
  },
];
