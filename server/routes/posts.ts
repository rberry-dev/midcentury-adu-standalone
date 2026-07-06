import {
  Router,
  type IRouter,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { eq, desc, and, type SQL } from "drizzle-orm";
import { db, postsTable } from "../db";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

const wrap =
  (fn: (req: Request, res: Response) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res).catch(next);

const VALID_CATEGORIES = new Set([
  "adu-basics",
  "financing-permits",
  "regulations",
  "inside-midcentury-adu",
  "homeowner-stories",
]);

function str(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length === 0 ? null : t;
}

function parsePostBody(body: Record<string, unknown>) {
  const slug = str(body.slug);
  const title = str(body.title);
  const category = str(body.category);
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return { error: "Invalid or missing slug (lowercase, dashes, digits only)" } as const;
  }
  if (!title) return { error: "Missing title" } as const;
  if (!category || !VALID_CATEGORIES.has(category)) {
    return { error: "Invalid or missing category" } as const;
  }
  let publishedAt: Date | null = null;
  if (body.publishedAt) {
    const d = new Date(String(body.publishedAt));
    if (!Number.isNaN(d.getTime())) publishedAt = d;
  }
  const isPublished = body.isPublished === true;
  return {
    ok: true as const,
    values: {
      slug,
      title,
      excerpt: str(body.excerpt) ?? "",
      body: typeof body.body === "string" ? body.body : "",
      category,
      heroImageUrl: str(body.heroImageUrl),
      isPublished,
      publishedAt: isPublished ? publishedAt ?? new Date() : publishedAt,
    },
  };
}

// Public list — only published posts
router.get(
  "/posts",
  wrap(async (req, res) => {
    const category = str(req.query.category);
    const conditions: SQL[] = [eq(postsTable.isPublished, true)];
    if (category) {
      if (!VALID_CATEGORIES.has(category)) {
        res.status(400).json({ error: "Invalid category" });
        return;
      }
      conditions.push(eq(postsTable.category, category));
    }
    const where = conditions.length > 1 ? and(...conditions) : conditions[0];
    const rows = await db
      .select()
      .from(postsTable)
      .where(where)
      .orderBy(desc(postsTable.publishedAt));
    res.json(rows);
  }),
);

// Public single — by slug, only if published
router.get(
  "/posts/by-slug/:slug",
  wrap(async (req, res) => {
    const slug = String(req.params.slug);
    const [row] = await db
      .select()
      .from(postsTable)
      .where(and(eq(postsTable.slug, slug), eq(postsTable.isPublished, true)))
      .limit(1);
    if (!row) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(row);
  }),
);

// Admin list — all posts (drafts + published)
router.get(
  "/admin/posts",
  requireAdmin,
  wrap(async (_req, res) => {
    const rows = await db
      .select()
      .from(postsTable)
      .orderBy(desc(postsTable.updatedAt));
    res.json(rows);
  }),
);

router.get(
  "/admin/posts/:id",
  requireAdmin,
  wrap(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [row] = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, id))
      .limit(1);
    if (!row) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(row);
  }),
);

router.post(
  "/admin/posts",
  requireAdmin,
  wrap(async (req, res) => {
    const parsed = parsePostBody(req.body ?? {});
    if ("error" in parsed) {
      res.status(400).json({ error: parsed.error });
      return;
    }
    try {
      const [created] = await db.insert(postsTable).values(parsed.values).returning();
      res.status(201).json(created);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("posts_slug_unique") || msg.includes("duplicate key")) {
        res.status(409).json({ error: "A post with that slug already exists" });
        return;
      }
      throw err;
    }
  }),
);

router.patch(
  "/admin/posts/:id",
  requireAdmin,
  wrap(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const parsed = parsePostBody(req.body ?? {});
    if ("error" in parsed) {
      res.status(400).json({ error: parsed.error });
      return;
    }
    const [updated] = await db
      .update(postsTable)
      .set({ ...parsed.values, updatedAt: new Date() })
      .where(eq(postsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(updated);
  }),
);

router.delete(
  "/admin/posts/:id",
  requireAdmin,
  wrap(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db.delete(postsTable).where(eq(postsTable.id, id));
    res.status(204).send();
  }),
);

export default router;
