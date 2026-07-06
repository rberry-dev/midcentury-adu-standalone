import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { useSeo } from "@/lib/seo";
import { useJsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { useListPosts, type Post } from "@/lib/api";
import { BLOG_CATEGORIES, categoryLabel, formatPostDate } from "@/data/blog";

export default function BlogIndexPage() {
  useSeo({
    title: "Insights — ADU stories, financing, and California permitting",
    description:
      "Stories, guides, and homeowner perspectives from Midcentury ADU — California's move-in-ready midcentury ADU. Permits, financing, design choices, and the people who live in our homes.",
    path: "/blog",
  });
  useJsonLd(
    "breadcrumbs",
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Insights", path: "/blog" },
    ]),
  );

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { data, isLoading, error } = useListPosts(
    activeCategory ? { category: activeCategory } : undefined,
  );

  const posts = useMemo(() => data ?? [], [data]);

  return (
    <Layout>
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-6 md:px-12 bg-[var(--hemma-white)]">
        <div className="max-w-[1280px] mx-auto text-center">
          <h1 className="font-serif font-light text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] text-[var(--hemma-black)] tracking-tight">
            Midcentury ADU Insights
          </h1>
          <p className="mt-5 max-w-[640px] mx-auto text-[15px] md:text-[16px] font-light leading-[1.7] text-[var(--hemma-mid)]">
            Stories, guides, and California ADU updates from the team building
            move-in-ready homes for the backyard.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="px-6 md:px-12 pb-10 bg-[var(--hemma-white)]">
        <div className="max-w-[1280px] mx-auto relative">
          <div className="overflow-x-auto md:overflow-visible scrollbar-none -mx-6 md:mx-0 px-6 md:px-0">
            <div className="flex items-center justify-start md:justify-center gap-2 md:gap-3 min-w-max md:min-w-0">
              <CategoryPill
                active={activeCategory === null}
                onClick={() => setActiveCategory(null)}
              >
                All
              </CategoryPill>
              {BLOG_CATEGORIES.map((cat) => (
                <CategoryPill
                  key={cat.slug}
                  active={activeCategory === cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                >
                  {cat.label}
                </CategoryPill>
              ))}
            </div>
          </div>
          <div className="md:hidden absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[var(--hemma-white)] to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Posts grid */}
      <section className="px-6 md:px-12 pb-24 md:pb-32 bg-[var(--hemma-white)]">
        <div className="max-w-[1280px] mx-auto">
          {isLoading && (
            <p className="text-center text-[14px] text-[var(--hemma-mid)] py-16">
              Loading…
            </p>
          )}
          {error && !isLoading && (
            <p className="text-center text-[14px] text-red-500 py-16">
              We couldn't load insights right now. Please refresh.
            </p>
          )}
          {!isLoading && !error && posts.length === 0 && (
            <div className="text-center py-16">
              <p className="font-serif text-[22px] font-light text-[var(--hemma-black)] mb-2">
                No posts yet in this category.
              </p>
              <p className="text-[14px] font-light text-[var(--hemma-mid)]">
                {activeCategory ? (
                  <button
                    type="button"
                    onClick={() => setActiveCategory(null)}
                    className="text-[var(--hemma-blue)] underline underline-offset-2 bg-transparent border-none cursor-pointer p-0 font-light"
                  >
                    See all posts →
                  </button>
                ) : (
                  "Check back soon for the first stories from Midcentury ADU."
                )}
              </p>
            </div>
          )}
          {!isLoading && !error && posts.length > 0 && (
            <PostsGrid posts={posts} />
          )}
        </div>
      </section>
    </Layout>
  );
}

function CategoryPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 text-[12px] md:text-[13px] font-medium px-4 py-2 rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
        active
          ? "bg-[var(--hemma-black)] text-white border-[var(--hemma-black)]"
          : "bg-transparent text-[var(--hemma-mid)] border-[var(--hemma-sand-dark)] hover:text-[var(--hemma-black)] hover:border-[var(--hemma-black)]"
      }`}
    >
      {children}
    </button>
  );
}

function PostsGrid({ posts }: { posts: Post[] }) {
  // Featured-post layout until 8+ posts
  if (posts.length < 8) {
    const [featured, ...rest] = posts;
    const sideBySide = rest.slice(0, 3);
    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 mb-12 md:mb-16">
          <div className="lg:col-span-2">
            <PostCard post={featured} large />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
            {sideBySide.map((p) => (
              <PostCard key={p.id} post={p} compact />
            ))}
          </div>
        </div>
        {posts.length > 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {posts.slice(4).map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </>
    );
  }
  // Uniform 4-up once we have enough posts
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}

function PostCard({
  post,
  large = false,
  compact = false,
}: {
  post: Post;
  large?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block no-underline text-inherit"
    >
      <article>
        <div
          className={`relative overflow-hidden rounded-[6px] bg-[var(--hemma-light)] ${
            large ? "aspect-[16/10]" : "aspect-[3/2]"
          } mb-4 md:mb-5`}
        >
          {post.heroImageUrl ? (
            <img
              src={post.heroImageUrl}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--hemma-mid)] text-[12px] font-medium tracking-[0.18em] uppercase">
              ADU
            </div>
          )}
        </div>
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--hemma-mid)] mb-2">
          {categoryLabel(post.category)}
        </p>
        <h2
          className={`font-serif font-light text-[var(--hemma-black)] group-hover:text-[var(--hemma-blue)] transition-colors leading-[1.15] ${
            large
              ? "text-[clamp(1.6rem,2.6vw,2.25rem)] mb-3"
              : compact
                ? "text-[18px] md:text-[20px] mb-2"
                : "text-[20px] md:text-[22px] mb-2"
          }`}
        >
          {post.title}
        </h2>
        {post.excerpt && (
          <p
            className={`text-[14px] font-light leading-[1.55] text-[var(--hemma-mid)] ${
              large ? "line-clamp-2 max-w-[560px]" : "line-clamp-1"
            }`}
          >
            {post.excerpt}
          </p>
        )}
        {large && (
          <p className="mt-3 text-[11px] tracking-[0.12em] uppercase text-[var(--hemma-mid)]">
            {formatPostDate(post.publishedAt) || formatPostDate(post.updatedAt)}
          </p>
        )}
      </article>
    </Link>
  );
}
