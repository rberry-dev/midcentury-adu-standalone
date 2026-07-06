import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq, asc } from "drizzle-orm";
import { db, modelsTable, modelImagesTable, includedProductsTable } from "../db";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

const wrap =
  (fn: (req: Request, res: Response) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res).catch(next);

async function fetchModelById(id: number) {
  return db.query.modelsTable.findFirst({
    where: eq(modelsTable.id, id),
    with: {
      images: { orderBy: asc(modelImagesTable.sortOrder) },
      products: { orderBy: asc(includedProductsTable.sortOrder) },
    },
  });
}

router.get(
  "/models",
  wrap(async (_req, res) => {
    const rows = await db.query.modelsTable.findMany({
      orderBy: asc(modelsTable.sortOrder),
      with: {
        images: { orderBy: asc(modelImagesTable.sortOrder) },
        products: { orderBy: asc(includedProductsTable.sortOrder) },
      },
    });
    res.json(rows);
  }),
);

router.get(
  "/models/by-slug/:slug",
  wrap(async (req, res) => {
    const slug = String(req.params.slug);
    const row = await db.query.modelsTable.findFirst({
      where: eq(modelsTable.slug, slug),
      with: {
        images: { orderBy: asc(modelImagesTable.sortOrder) },
        products: { orderBy: asc(includedProductsTable.sortOrder) },
      },
    });
    if (!row) {
      res.status(404).json({ error: "Model not found" });
      return;
    }
    res.json(row);
  }),
);

router.get(
  "/models/:id",
  wrap(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const row = await fetchModelById(id);
    if (!row) {
      res.status(404).json({ error: "Model not found" });
      return;
    }
    res.json(row);
  }),
);

router.post(
  "/models",
  requireAdmin,
  wrap(async (req, res) => {
    const [created] = await db.insert(modelsTable).values(req.body).returning();
    const full = await fetchModelById(created.id);
    res.status(201).json(full);
  }),
);

router.patch(
  "/models/:id",
  requireAdmin,
  wrap(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db
      .update(modelsTable)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(modelsTable.id, id));
    const row = await fetchModelById(id);
    if (!row) {
      res.status(404).json({ error: "Model not found" });
      return;
    }
    res.json(row);
  }),
);

router.delete(
  "/models/:id",
  requireAdmin,
  wrap(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db.delete(modelsTable).where(eq(modelsTable.id, id));
    res.status(204).send();
  }),
);

router.post(
  "/models/:id/images",
  requireAdmin,
  wrap(async (req, res) => {
    const modelId = Number(req.params.id);
    if (!Number.isFinite(modelId)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [created] = await db
      .insert(modelImagesTable)
      .values({ ...req.body, modelId })
      .returning();
    res.status(201).json(created);
  }),
);

router.patch(
  "/model-images/:id",
  requireAdmin,
  wrap(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [updated] = await db
      .update(modelImagesTable)
      .set(req.body)
      .where(eq(modelImagesTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Image not found" });
      return;
    }
    res.json(updated);
  }),
);

router.delete(
  "/model-images/:id",
  requireAdmin,
  wrap(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db.delete(modelImagesTable).where(eq(modelImagesTable.id, id));
    res.status(204).send();
  }),
);

router.post(
  "/models/:id/products",
  requireAdmin,
  wrap(async (req, res) => {
    const modelId = Number(req.params.id);
    if (!Number.isFinite(modelId)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [created] = await db
      .insert(includedProductsTable)
      .values({ ...req.body, modelId })
      .returning();
    res.status(201).json(created);
  }),
);

router.patch(
  "/included-products/:id",
  requireAdmin,
  wrap(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [updated] = await db
      .update(includedProductsTable)
      .set(req.body)
      .where(eq(includedProductsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(updated);
  }),
);

router.delete(
  "/included-products/:id",
  requireAdmin,
  wrap(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db.delete(includedProductsTable).where(eq(includedProductsTable.id, id));
    res.status(204).send();
  }),
);

export default router;
