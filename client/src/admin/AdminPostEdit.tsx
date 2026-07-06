import { useEffect, useRef, useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useLocation } from "wouter";
import { getAdminToken } from "./auth";
import { uploadFile } from "./uploadFile";
import { BLOG_CATEGORIES } from "@/data/blog";

interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  heroImageUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

function authHeaders(): HeadersInit {
  const token = getAdminToken() ?? "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export function AdminPostEdit({ id }: { id: number }) {
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  // Form state mirrors the post but lets us edit before save.
  const [form, setForm] = useState({
    slug: "",
    title: "",
    category: BLOG_CATEGORIES[0].slug,
    excerpt: "",
    body: "",
    heroImageUrl: "" as string,
    isPublished: false,
  });

  async function load() {
    setError(null);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { headers: authHeaders() });
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      const p: Post = await res.json();
      setPost(p);
      setForm({
        slug: p.slug,
        title: p.title,
        category: p.category,
        excerpt: p.excerpt,
        body: p.body,
        heroImageUrl: p.heroImageUrl ?? "",
        isPublished: p.isPublished,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({
          ...form,
          heroImageUrl: form.heroImageUrl.trim() || null,
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Failed (${res.status})`);
      }
      const updated: Post = await res.json();
      setPost(updated);
      setMsg("Saved.");
      setTimeout(() => setMsg(null), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setBusy(false);
    }
  }

  async function onImagePick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { publicUrl } = await uploadFile(file);
      update("heroImageUrl", publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  if (!post && !error) {
    return <p className="text-[14px] text-[var(--hemma-mid)]">Loading…</p>;
  }
  if (error && !post) {
    return (
      <p className="text-[14px] text-red-500">
        {error}{" "}
        <Link href="/admin/posts" className="underline">
          Back
        </Link>
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/posts"
          className="text-[12px] text-[var(--hemma-mid)] hover:text-[var(--hemma-black)] no-underline"
        >
          ← All posts
        </Link>
        <div className="flex items-end justify-between mt-2">
          <div>
            <h1 className="font-serif text-[28px] font-light text-[var(--hemma-black)]">
              {post?.title || "Untitled post"}
            </h1>
            <p className="text-[13px] text-[var(--hemma-mid)] font-light">
              <span className="font-mono">/blog/{post?.slug}</span>
              {" · "}
              <span
                className={
                  post?.isPublished
                    ? "text-emerald-700 font-medium"
                    : "text-slate-600"
                }
              >
                {post?.isPublished ? "Published" : "Draft"}
              </span>
            </p>
          </div>
          {post?.isPublished && (
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-[var(--hemma-blue)] no-underline font-medium"
            >
              View live →
            </a>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          <Field label="Title">
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              required
              className="w-full bg-white border border-[var(--hemma-sand-dark)] rounded-[3px] px-3 py-2 text-[14px]"
            />
          </Field>

          <Field
            label="Slug"
            hint="URL: /blog/your-slug · lowercase letters, digits, dashes only"
          >
            <input
              type="text"
              value={form.slug}
              onChange={(e) =>
                update(
                  "slug",
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]+/g, "-")
                    .replace(/-+/g, "-")
                    .replace(/^-|-$/g, ""),
                )
              }
              pattern="[a-z0-9-]+"
              required
              className="w-full bg-white border border-[var(--hemma-sand-dark)] rounded-[3px] px-3 py-2 text-[14px] font-mono"
            />
          </Field>

          <Field label="Excerpt" hint="One sentence shown under the headline on the index.">
            <textarea
              value={form.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              rows={2}
              className="w-full bg-white border border-[var(--hemma-sand-dark)] rounded-[3px] px-3 py-2 text-[14px] resize-y"
            />
          </Field>

          <Field
            label="Body"
            hint="Markdown lite: blank lines = paragraphs · ## Heading · ### Subheading · **bold** · [text](url) · - bullet · > quote"
          >
            <textarea
              value={form.body}
              onChange={(e) => update("body", e.target.value)}
              rows={20}
              className="w-full bg-white border border-[var(--hemma-sand-dark)] rounded-[3px] px-3 py-2 text-[14px] font-mono leading-[1.6] resize-y"
            />
          </Field>
        </div>

        <aside className="space-y-5">
          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="w-full bg-white border border-[var(--hemma-sand-dark)] rounded-[3px] px-3 py-2 text-[14px]"
            >
              {BLOG_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Hero image" hint="16:9 looks best. JPG or PNG.">
            {form.heroImageUrl && (
              <div className="aspect-[16/9] bg-[var(--hemma-light)] rounded-[3px] overflow-hidden mb-2 border border-[var(--hemma-sand-dark)]">
                <img
                  src={form.heroImageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                onChange={onImagePick}
                className="text-[12px]"
              />
              {uploading && (
                <span className="text-[11px] text-[var(--hemma-mid)]">
                  Uploading…
                </span>
              )}
            </div>
            <input
              type="text"
              value={form.heroImageUrl}
              onChange={(e) => update("heroImageUrl", e.target.value)}
              placeholder="…or paste an image URL"
              className="w-full mt-2 bg-white border border-[var(--hemma-sand-dark)] rounded-[3px] px-3 py-2 text-[12px] font-mono"
            />
          </Field>

          <Field label="Status">
            <label className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => update("isPublished", e.target.checked)}
              />
              Published (visible at /blog)
            </label>
          </Field>

          <div className="pt-2 border-t border-[var(--hemma-sand-dark)]">
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-[var(--hemma-blue)] text-white text-[13px] font-medium px-4 py-2.5 rounded-[3px] hover:bg-[#003f7a] transition-colors border-none cursor-pointer disabled:opacity-50"
            >
              {busy ? "Saving…" : "Save changes"}
            </button>
            {msg && (
              <p className="text-[12px] text-emerald-700 mt-2">{msg}</p>
            )}
            {error && (
              <p className="text-[12px] text-red-500 mt-2">{error}</p>
            )}
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)] mb-1.5">
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-[11px] text-[var(--hemma-mid)] mt-1">{hint}</p>
      )}
    </div>
  );
}
