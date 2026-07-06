interface Review {
  quote: string;
  name: string;
  initial: string;
  bg: string;
}

const REVIEWS: Review[] = [
  {
    quote: "The post-and-beam detailing is exactly what we were hoping for. It looks like it belongs here.",
    name: "Patricia K., Pasadena",
    initial: "P",
    bg: "#C8B89A",
  },
  {
    quote: "We had a fantastic experience working with the team on our new ADU.",
    name: "Marcus & Elena R., Long Beach",
    initial: "M",
    bg: "#9AB0A0",
  },
  {
    quote: "Communication from start to finish was great — and the whole build was done in under six months.",
    name: "Daniel T., Irvine",
    initial: "D",
    bg: "#C8B8A0",
  },
  {
    quote: "Can't say enough good things about this company and their crew.",
    name: "Sofia & James L., Glendale",
    initial: "S",
    bg: "#B8C8B0",
  },
  {
    quote: "Walked into a finished home on move-in day. Not a single detail missed.",
    name: "Aisha M., Costa Mesa",
    initial: "A",
    bg: "#D0B8C8",
  },
];

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex-shrink-0 w-[320px] md:w-[360px] bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5 md:p-6 mx-3">
      <p className="text-[14px] md:text-[15px] leading-[1.55] text-[var(--hemma-charcoal)] mb-4 line-clamp-3">
        &ldquo;{review.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white/90 flex-shrink-0"
          style={{ background: review.bg }}
          aria-hidden="true"
        >
          {review.initial}
        </div>
        <div className="flex gap-0.5 text-[var(--hemma-amber)] text-[13px]" aria-label="5 out of 5 stars">
          ★ ★ ★ ★ ★
        </div>
        <span className="ml-auto text-[11px] text-[var(--hemma-mid)] truncate">
          {review.name}
        </span>
      </div>
    </div>
  );
}

export function Testimonial() {
  const loop = [...REVIEWS, ...REVIEWS];
  return (
    <section className="bg-[var(--hemma-cream)] py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid md:grid-cols-[260px_1fr] gap-8 md:gap-12 items-center">
        <div className="md:pr-4">
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--hemma-blue)] mb-3">
            Reviews
          </p>
          <h3 className="font-serif text-[clamp(1.5rem,3vw,2rem)] font-light leading-[1.2] text-[var(--hemma-charcoal)]">
            What people are saying about <em className="text-[var(--hemma-amber)]">Midcentury ADU</em>
          </h3>
        </div>
        <div
          className="relative testimonial-marquee overflow-hidden min-w-0"
          role="region"
          aria-label="Customer reviews"
        >
          <div className="flex testimonial-track">
            {loop.map((r, i) => (
              <ReviewCard key={i} review={r} />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[var(--hemma-cream)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[var(--hemma-cream)] to-transparent" />
        </div>
      </div>
    </section>
  );
}
