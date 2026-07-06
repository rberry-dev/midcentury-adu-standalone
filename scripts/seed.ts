/**
 * One-time data seed: populates this project's own database with the
 * Midcentury ADU models, model images, included products, and blog posts.
 *
 * The data below (see `seed-data.ts`) was extracted from the original
 * shared monorepo database when this project was split out into its own
 * standalone codebase, so no connection to the old database is required.
 *
 * Usage:
 *   DATABASE_URL=postgres://...   (this project's own database)
 *   npx tsx scripts/seed.ts
 *
 * Notes on scope:
 *   - `models`, `model_images`, `included_products`: Midcentury-specific data.
 *   - `posts`: includes both Midcentury-specific posts and posts that were
 *     shared with the sibling HEMMA site.
 *   - `availability_windows`: not included here (was not brand-scoped in the
 *     old database and has no fixed content — configure it from /admin).
 *   - `leads`: NOT seeded. The old `leads` table had no brand column, so
 *     there is no reliable way to tell which leads came from this site.
 *
 * Safe to re-run: uses `on conflict (slug) do nothing` for posts and models,
 * and only inserts model_images/included_products for models it just
 * inserted (so re-running after a partial success won't duplicate rows).
 */
import pg from "pg";
import { seedModels, seedModelImages, seedIncludedProducts, seedPosts } from "./seed-data";

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is required (this project's own database).");
  process.exit(1);
}

const db = new Pool({ connectionString: DATABASE_URL });

async function main() {
  console.log(`Seeding ${seedModels.length} models...`);
  const modelIdMap = new Map<number, number>();

  for (const m of seedModels) {
    const existing = await db.query(`select id from models where slug = $1`, [m.slug]);
    if (existing.rows.length > 0) {
      console.log(`  - ${m.slug} already exists, skipping.`);
      modelIdMap.set(m.id, existing.rows[0].id);
      continue;
    }
    const insertRes = await db.query(
      `insert into models
        (slug, name, sf, type, badge, badge_bg, badge_color, scenario, tagline,
         beds, baths, stories, price_cents, furnishing_price_cents, description,
         sort_order, is_published, created_at, updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
       returning id`,
      [
        m.slug, m.name, m.sf, m.type, m.badge, m.badgeBg, m.badgeColor,
        m.scenario, m.tagline, m.beds, m.baths, m.stories, m.priceCents,
        m.furnishingPriceCents, m.description, m.sortOrder, m.isPublished,
        m.createdAt, m.updatedAt,
      ],
    );
    modelIdMap.set(m.id, insertRes.rows[0].id);
    console.log(`  - inserted ${m.slug}`);
  }

  console.log(`Seeding ${seedModelImages.length} model images...`);
  let imagesInserted = 0;
  for (const img of seedModelImages) {
    const newModelId = modelIdMap.get(img.modelId);
    if (!newModelId) continue;
    const existing = await db.query(
      `select id from model_images where model_id = $1 and url = $2`,
      [newModelId, img.url],
    );
    if (existing.rows.length > 0) continue;
    await db.query(
      `insert into model_images (model_id, url, alt, kind, sort_order, created_at)
       values ($1,$2,$3,$4,$5,$6)`,
      [newModelId, img.url, img.alt, img.kind, img.sortOrder, img.createdAt],
    );
    imagesInserted++;
  }
  console.log(`  - inserted ${imagesInserted} model images.`);

  console.log(`Seeding ${seedIncludedProducts.length} included products...`);
  let productsInserted = 0;
  for (const p of seedIncludedProducts) {
    const newModelId = modelIdMap.get(p.modelId);
    if (!newModelId) continue;
    const existing = await db.query(
      `select id from included_products where model_id = $1 and name = $2`,
      [newModelId, p.name],
    );
    if (existing.rows.length > 0) continue;
    await db.query(
      `insert into included_products (model_id, name, url, category, sort_order, created_at)
       values ($1,$2,$3,$4,$5,$6)`,
      [newModelId, p.name, p.url, p.category, p.sortOrder, p.createdAt],
    );
    productsInserted++;
  }
  console.log(`  - inserted ${productsInserted} included products.`);

  console.log(`Seeding ${seedPosts.length} posts...`);
  let postsInserted = 0;
  for (const p of seedPosts) {
    const res = await db.query(
      `insert into posts
        (slug, title, excerpt, body, category, hero_image_url, is_published,
         published_at, created_at, updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       on conflict (slug) do nothing`,
      [
        p.slug, p.title, p.excerpt, p.body, p.category, p.heroImageUrl,
        p.isPublished, p.publishedAt, p.createdAt, p.updatedAt,
      ],
    );
    if (res.rowCount && res.rowCount > 0) postsInserted++;
  }
  console.log(`  - inserted ${postsInserted} posts.`);

  console.log("\nDone.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.end();
  });
