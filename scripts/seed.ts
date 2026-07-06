/**
 * One-time data migration: copies Midcentury ADU rows out of the old shared
 * (multi-brand) database into this project's own standalone database.
 *
 * Usage:
 *   SOURCE_DATABASE_URL=postgres://...   (the OLD shared monorepo database)
 *   DATABASE_URL=postgres://...          (this project's NEW database)
 *   npx tsx scripts/seed.ts
 *
 * Notes on scope:
 *   - `models`, `model_images`, `included_products`: copied where
 *     models.brand = 'midcentury'.
 *   - `posts`: copied where brand IN ('midcentury', 'shared'), since
 *     "shared" posts were shown on both sites.
 *   - `availability_windows`: copied in full (it was not brand-scoped).
 *   - `leads`: NOT copied automatically. The old `leads` table has no brand
 *     column, so there is no reliable way to tell which leads came from the
 *     Midcentury ADU site vs. the other site. If you need historical leads,
 *     export them manually from the old database (e.g. by `model_interest`
 *     matching a Midcentury model slug) and insert them by hand.
 */
import pg from "pg";

const { Pool } = pg;

const SOURCE_DATABASE_URL = process.env.SOURCE_DATABASE_URL;
const DATABASE_URL = process.env.DATABASE_URL;

if (!SOURCE_DATABASE_URL) {
  console.error("SOURCE_DATABASE_URL is required (the old shared monorepo database).");
  process.exit(1);
}
if (!DATABASE_URL) {
  console.error("DATABASE_URL is required (this project's new database).");
  process.exit(1);
}

const source = new Pool({ connectionString: SOURCE_DATABASE_URL });
const target = new Pool({ connectionString: DATABASE_URL });

async function main() {
  console.log("Reading Midcentury ADU models from source database...");
  const { rows: models } = await source.query(
    `select * from models where brand = 'midcentury' order by id`,
  );
  console.log(`Found ${models.length} models.`);

  const modelIdMap = new Map<number, number>();

  for (const m of models) {
    const insertRes = await target.query(
      `insert into models
        (slug, name, sf, type, badge, badge_bg, badge_color, scenario, tagline,
         beds, baths, stories, price_cents, furnishing_price_cents, description,
         sort_order, is_published, created_at, updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
       returning id`,
      [
        m.slug, m.name, m.sf, m.type, m.badge, m.badge_bg, m.badge_color,
        m.scenario, m.tagline, m.beds, m.baths, m.stories, m.price_cents,
        m.furnishing_price_cents, m.description, m.sort_order, m.is_published,
        m.created_at, m.updated_at,
      ],
    );
    modelIdMap.set(m.id, insertRes.rows[0].id);
  }

  if (models.length > 0) {
    const oldIds = models.map((m) => m.id);

    console.log("Copying model_images...");
    const { rows: images } = await source.query(
      `select * from model_images where model_id = any($1) order by id`,
      [oldIds],
    );
    for (const img of images) {
      const newModelId = modelIdMap.get(img.model_id);
      if (!newModelId) continue;
      await target.query(
        `insert into model_images (model_id, url, alt, kind, sort_order, created_at)
         values ($1,$2,$3,$4,$5,$6)`,
        [newModelId, img.url, img.alt, img.kind, img.sort_order, img.created_at],
      );
    }
    console.log(`Copied ${images.length} model images.`);

    console.log("Copying included_products...");
    const { rows: products } = await source.query(
      `select * from included_products where model_id = any($1) order by id`,
      [oldIds],
    );
    for (const p of products) {
      const newModelId = modelIdMap.get(p.model_id);
      if (!newModelId) continue;
      await target.query(
        `insert into included_products (model_id, name, url, category, sort_order, created_at)
         values ($1,$2,$3,$4,$5,$6)`,
        [newModelId, p.name, p.url, p.category, p.sort_order, p.created_at],
      );
    }
    console.log(`Copied ${products.length} included products.`);
  }

  console.log("Copying posts (brand IN ('midcentury', 'shared'))...");
  const { rows: posts } = await source.query(
    `select * from posts where brand in ('midcentury', 'shared') order by id`,
  );
  for (const p of posts) {
    await target.query(
      `insert into posts
        (slug, title, excerpt, body, category, hero_image_url, is_published,
         published_at, created_at, updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       on conflict (slug) do nothing`,
      [
        p.slug, p.title, p.excerpt, p.body, p.category, p.hero_image_url,
        p.is_published, p.published_at, p.created_at, p.updated_at,
      ],
    );
  }
  console.log(`Copied ${posts.length} posts.`);

  console.log("Copying availability_windows...");
  const { rows: windows } = await source.query(
    `select * from availability_windows order by id`,
  );
  for (const w of windows) {
    await target.query(
      `insert into availability_windows (day_of_week, start_minute, end_minute, created_at)
       values ($1,$2,$3,$4)`,
      [w.day_of_week, w.start_minute, w.end_minute, w.created_at],
    );
  }
  console.log(`Copied ${windows.length} availability windows.`);

  console.log("\nDone. Leads were intentionally skipped — see the comment at the top of this script.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await source.end();
    await target.end();
  });
