import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { getAdminToken } from "./auth";
import { BLOG_CATEGORIES, categoryLabel, formatPostDate } from "@/data/blog";

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

export function AdminPostsList() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [, navigate] = useLocation();

  async function load() {
    setError(null);
    try {
      const res = await fetch("/api/admin/posts", { headers: authHeaders() });
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      setPosts(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createPost() {
    setBusy(true);
    setError(null);
    try {
      const slug = `untitled-${Date.now()}`;
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          slug,
          title: "Untitled post",
          category: BLOG_CATEGORIES[0].slug,
          excerpt: "",
          body: "",
          isPublished: false,
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Failed (${res.status})`);
      }
      const created: Post = await res.json();
      navigate(`/admin/posts/${created.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create");
    } finally {
      setBusy(false);
    }
  }

  async function deletePost(id: number) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok && res.status !== 204) throw new Error(`Failed (${res.status})`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    }
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-serif text-[32px] font-light text-[var(--hemma-black)]">
            Insights Posts
          </h1>
          <p className="text-[13px] text-[var(--hemma-mid)] font-light mt-1">
            Drafts stay private. Published posts appear at /blog.
          </p>
        </div>
        <button
          type="button"
          onClick={createPost}
          disabled={busy}
          className="bg-[var(--hemma-blue)] text-white text-[13px] font-medium px-4 py-2 rounded-[3px] hover:bg-[#003f7a] transition-colors border-none cursor-pointer disabled:opacity-50"
        >
          {busy ? "Creating…" : "+ New post"}
        </button>
      </div>

      {error && (
        <p className="text-[13px] text-red-500 mb-4">{error}</p>
      )}

      {!posts && !error && (
        <p className="text-[14px] text-[var(--hemma-mid)]">Loading posts…</p>
      )}

      {posts && posts.length === 0 && (
        <div className="bg-white rounded-[6px] border border-[var(--hemma-sand-dark)] p-10 text-center">
          <p className="text-[14px] text-[var(--hemma-mid)]">
            No posts yet. Click "New post" to create your first draft.
          </p>
        </div>
      )}

      {posts && posts.length > 0 && (
        <div className="bg-white rounded-[6px] border border-[var(--hemma-sand-dark)] overflow-hidden">
          <table className="w-full text-[14px]">
            <thead className="bg-[var(--hemma-light)] text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)]">
              <tr>
                <th className="text-left px-5 py-3">Title</th>
                <th className="text-left px-5 py-3">Category</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Updated</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-[var(--hemma-sand-dark)]">
                  <td className="px-5 py-3">
                    <div className="font-medium text-[var(--hemma-black)]">
                      {p.title}
                    </div>
                    <div className="font-mono text-[11px] text-[var(--hemma-mid)] mt-0.5">
                      /blog/{p.slug}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[var(--hemma-mid)]">
                    {categoryLabel(p.category)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-[10px] font-semibold tracking-[0.1em] uppercase px-2 py-1 rounded-[3px] ${
                        p.isPublished
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {p.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-[var(--hemma-mid)]">
                    {formatPostDate(p.updatedAt)}
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/posts/${p.id}`}
                      className="text-[var(--hemma-blue)] font-medium no-underline mr-4"
                    >
                      Edit →
                    </Link>
                    <button
                      type="button"
                      onClick={() => deletePost(p.id)}
                      className="text-[12px] text-red-500 bg-transparent border-none cursor-pointer p-0"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
