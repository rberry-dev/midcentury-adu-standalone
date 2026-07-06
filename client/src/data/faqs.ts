export interface FAQ {
  q: string;
  a: string;
}

export interface FAQCategory {
  title: string;
  eyebrow: string;
  faqs: FAQ[];
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    eyebrow: "The Midcentury ADU System",
    title: "About Midcentury ADU",
    faqs: [
      {
        q: "What exactly is included with a Midcentury ADU?",
        a: "Every Midcentury ADU includes the complete structure — foundation, post-and-beam or panelized framing, exterior cladding, roof, windows, sliding glass doors, plumbing, electrical, HVAC, and finishes — plus all permitting, site work, and utility connections. We hand you the keys to a turnkey, move-in-ready home."
      },
      {
        q: "How is Midcentury ADU different from other ADU builders?",
        a: "Most ADU builders offer generic box designs with no architectural identity. Midcentury ADU is purpose-built around a specific design language — post-and-beam structure, floor-to-ceiling glazing, warm natural materials, and deep overhangs that connect the interior to the California garden. Every floor plan is designed as architecture, not just square footage."
      },
      {
        q: "Who is ADU Homes Inc.?",
        a: "ADU Homes Inc. is a licensed California general contractor specializing in accessory dwelling units. Midcentury ADU is our collection of architecturally distinct floor plans inspired by California's mid-twentieth century residential tradition."
      },
      {
        q: "Where do you build?",
        a: "We currently serve Los Angeles County and Orange County. Other Southern California regions are added on a case-by-case basis — ask during your consultation."
      }
    ]
  },
  {
    eyebrow: "Floor Plans & Design",
    title: "Plans & Customization",
    faqs: [
      {
        q: "How many floor plans are available?",
        a: "Eight. They range from 400 sq ft studios to 1,200 sq ft two-story carriage homes — covering studios, 1-bedroom, 2-bedroom, 3-bedroom, and detached carriage configurations. Each is designed as a complete architectural composition, not just a room layout."
      },
      {
        q: "Can I customize a floor plan?",
        a: "Our plans are intentionally standardized — that's how we keep quality high and pricing predictable. Within each plan you choose from exterior cladding options (cedar, stucco, board-and-batten), roof treatments, glazing configurations, and interior material palettes. Structural changes are not supported."
      },
      {
        q: "Can I see a model in person?",
        a: "Yes. We host scheduled walkthroughs of completed builds in the LA / OC area. Mention this on your consultation request and we'll coordinate a visit."
      },
      {
        q: "Do the plans meet California energy and building codes?",
        a: "Every plan is engineered to current California Title 24 energy standards, CRC structural requirements, and is solar-ready. We handle Title 24 compliance documentation as part of permitting."
      }
    ]
  },
  {
    eyebrow: "Materials & Finishes",
    title: "Architecture & Materials",
    faqs: [
      {
        q: "What exterior materials are available?",
        a: "Each plan offers three exterior cladding options: natural cedar siding, smooth stucco, and board-and-batten. Roof treatments include standing-seam metal in dark bronze or silver, and flat/low-slope options with integral drainage. All materials are selected for California climate durability and low maintenance."
      },
      {
        q: "What does 'post-and-beam' mean in practice?",
        a: "Post-and-beam construction uses a structural grid of vertical posts and horizontal beams — typically in Douglas fir or engineered lumber — that is exposed as part of the interior design. This gives Midcentury ADU homes their characteristic warm, honest ceiling character and allows for large spans of glazing between structural bays."
      },
      {
        q: "What glazing options are included?",
        a: "Our standard package includes dual-pane low-e aluminum-framed windows and sliding glass doors. Clerestory windows are included on applicable floor plans. All glazing meets California Title 24 energy requirements."
      },
      {
        q: "Are the interior finishes included?",
        a: "Yes. Each plan includes a curated interior palette — concrete or hardwood flooring, painted drywall or plywood ceilings, and kitchen and bath finish packages. You select your palette during the design approval phase."
      }
    ]
  },
  {
    eyebrow: "Process & Timeline",
    title: "How It Works",
    faqs: [
      {
        q: "How long does a Midcentury ADU project take?",
        a: "From signed contract to keys, most projects complete in 5–8 months depending on permitting timelines in your jurisdiction. Permitting alone is typically 6–12 weeks; construction is 12–16 weeks; final inspections and commissioning run in the closing weeks."
      },
      {
        q: "Who handles the permits?",
        a: "ADU Homes Inc. handles every permit — structural, electrical, plumbing, mechanical, energy, and final occupancy. You don't talk to the city; we do."
      },
      {
        q: "Will my yard be a construction site?",
        a: "Yes, during the build phase. We coordinate site protection, dust control, and access so the disruption is contained. Most clients can continue living in their primary residence throughout the project."
      },
      {
        q: "What happens at the final walkthrough?",
        a: "We do a full punch-list walkthrough together, demonstrate every system and appliance, hand over warranty documentation, and give you the keys. The home is permitted, inspected, and move-in ready that day."
      }
    ]
  },
  {
    eyebrow: "Pricing & Financing",
    title: "Cost & Loans",
    faqs: [
      {
        q: "How much does a Midcentury ADU cost?",
        a: "Pricing varies by floor plan, site conditions, and finish package. Studios start in the low $200Ks fully built; larger 2- and 3-bedroom plans run higher. Your consultation includes a written, itemized estimate."
      },
      {
        q: "Are there hidden costs?",
        a: "No. Permits, site work, utility connections, structure, finishes, and final inspection are all included in the contract price. The only common variables are unusual site conditions (severe slope, deep utility runs) which we identify and price during the site assessment."
      },
      {
        q: "How do most people pay for it?",
        a: "Most homeowners use a HELOC, cash-out refinance, or renovation loan against the equity in their primary residence. We connect you with California ADU lenders during consultation."
      },
      {
        q: "Can I rent out my ADU?",
        a: "Yes — California ADU law explicitly permits long-term rentals statewide. Short-term rental rules vary by city. We can outline the rules in your specific jurisdiction during consultation."
      }
    ]
  }
];
