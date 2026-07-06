import { Link, useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { useSeo } from "@/lib/seo";
import { useJsonLd, articleSchema, breadcrumbSchema } from "@/lib/jsonld";
import { useGetPostBySlug } from "@/lib/api";
import { categoryLabel, formatPostDate } from "@/data/blog";
import { MarkdownLite } from "@/components/MarkdownLite";
import { CTASection } from "@/components/CTASection";
import { useContact } from "@/context/ContactContext";

export default function BlogPostPage() {
  const [, params] = useRoute<{ slug: string }>("/blog/:slug");
  const slug = params?.slug ?? "";
  const { data: post, isLoading, error } = useGetPostBySlug(slug);
  const { openContact } = useContact();

  useSeo({
    title: post?.title ?? "Insights",
    description:
      post?.excerpt ||
      "Stories, guides, and California ADU updates from the Midcentury ADU team.",
    path: `/blog/${slug}`,
    image: post?.heroImageUrl ?? undefined,
  });
  useJsonLd("breadcrumbs", post
    ? breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Insights", path: "/blog" },
        { name: post.title, path: `/blog/${post.slug}` },
      ])
    : null);
  useJsonLd("article", post ? articleSchema(post) : null);

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-32 pb-24 px-6 max-w-[720px] mx-auto text-center">
          <p className="text-[14px] text-[var(--hemma-mid)]">Loading…</p>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="pt-32 pb-24 px-6 max-w-[720px] mx-auto text-center">
          <h1 className="font-serif text-[36px] font-light text-[var(--hemma-black)] mb-4">
            Post not found
          </h1>
          <p className="text-[15px] font-light text-[var(--hemma-mid)] mb-6">
            The post you're looking for might have moved or been unpublished.
          </p>
          <Link
            href="/blog"
            className="inline-block text-[14px] font-medium text-[var(--hemma-blue)] underline underline-offset-2"
          >
            ← Back to insights
          </Link>
        </div>
      </Layout>
    );
  }

  const dateText =
    formatPostDate(post.publishedAt) || formatPostDate(post.updatedAt);

  return (
    <Layout>
      <article className="pt-24 md:pt-32 bg-[var(--hemma-white)]">
        <header className="px-6 md:px-12 pb-10 md:pb-14">
          <div className="max-w-[760px] mx-auto text-center">
            <Link
              href="/blog"
              className="inline-block text-[13px] font-semibold tracking-[0.16em] uppercase text-[var(--hemma-mid)] hover:text-[var(--hemma-black)] mb-6 no-underline"
            >
              ← Insights
            </Link>
            <p className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[var(--hemma-blue)] mb-4">
              {categoryLabel(post.category)}
            </p>
            <h1 className="font-serif font-light text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] text-[var(--hemma-black)] tracking-tight">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-5 text-[17px] md:text-[18px] font-light leading-[1.6] text-[var(--hemma-mid)]">
                {post.excerpt}
              </p>
            )}
            {dateText && (
              <p className="mt-6 text-[11px] tracking-[0.18em] uppercase text-[var(--hemma-mid)]">
                {dateText}
              </p>
            )}
          </div>
        </header>

        {post.heroImageUrl && (
          <div className="px-6 md:px-12 mb-12 md:mb-16">
            <div className="max-w-[1100px] mx-auto aspect-[16/9] rounded-[8px] overflow-hidden bg-[var(--hemma-light)]">
              <img
                src={post.heroImageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="px-6 md:px-12 pb-20 md:pb-28">
          <div className="max-w-[680px] mx-auto">
            {post.body ? (
              <MarkdownLite source={post.body} />
            ) : (
              <p className="text-[15px] font-light text-[var(--hemma-mid)] italic">
                (This post doesn't have a body yet.)
              </p>
            )}

            <div className="mt-14 md:mt-16 rounded-[10px] bg-[var(--hemma-light)] px-7 py-8 md:px-10 md:py-10 text-center">
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--hemma-blue)] mb-3">
                Thinking about an ADU?
              </p>
              <h3 className="font-serif text-[clamp(1.4rem,3vw,1.75rem)] font-light leading-[1.2] text-[var(--hemma-black)] mb-3">
                Find out what's possible at your address.
              </h3>
              <p className="text-[14px] md:text-[15px] font-light leading-[1.6] text-[var(--hemma-mid)] mb-6 max-w-[420px] mx-auto">
                A free 20-minute consultation with our team. No pressure, no
                obligation — just a clear answer.
              </p>
              <button
                type="button"
                onClick={() => openContact()}
                className="btn-primary"
              >
                Get Started
              </button>
            </div>

            <div className="mt-12 pt-8 border-t border-black/10 text-center">
              <Link
                href="/blog"
                className="inline-block text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--hemma-blue)] hover:text-[var(--hemma-black)] no-underline"
              >
                ← More insights
              </Link>
            </div>
          </div>
        </div>
      </article>

      <CTASection onContactOpen={() => openContact()} />
    </Layout>
  );
}
