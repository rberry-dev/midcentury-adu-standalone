import {
  Router,
  type IRouter,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { eq, desc, and, type SQL } from "drizzle-orm";
import { db, leadsTable } from "../db";
import { requireAdmin } from "../middlewares/requireAdmin";
import { validateDiscoverySlot } from "./availability";
import { verifyTurnstile } from "../lib/turnstile";
import { sendLeadEmails } from "../lib/email";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const wrap =
  (fn: (req: Request, res: Response) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res).catch(next);

const VALID_SOURCES = new Set([
  "discovery_call",
  "brochure",
  "financing",
  "newsletter",
  "contact",
]);
const VALID_STATUSES = new Set([
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
]);

function str(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length === 0 ? null : t;
}

router.post(
  "/leads",
  wrap(async (req, res) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const source = str(body.source);
    const email = str(body.email);

    if (!source || !VALID_SOURCES.has(source)) {
      res.status(400).json({ error: "Invalid or missing source" });
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: "Invalid or missing email" });
      return;
    }

    const ip =
      (req.headers["cf-connecting-ip"] as string | undefined) ??
      (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ??
      req.ip;
    const ts = await verifyTurnstile(str(body.turnstileToken), ip);
    if (!ts.ok) {
      res.status(403).json({ error: ts.error ?? "Bot-check failed." });
      return;
    }

    let scheduledAt: Date | null = null;
    if (body.scheduledAt) {
      const d = new Date(String(body.scheduledAt));
      if (!Number.isNaN(d.getTime())) scheduledAt = d;
    }

    if (source === "discovery_call") {
      if (!scheduledAt) {
        res.status(400).json({ error: "Discovery calls require a scheduled time" });
        return;
      }
      const check = await validateDiscoverySlot(scheduledAt);
      if (!check.ok) {
        res.status(409).json({ error: check.reason });
        return;
      }
    }

    const [created] = await db
      .insert(leadsTable)
      .values({
        source,
        email,
        name: str(body.name),
        phone: str(body.phone),
        address: str(body.address),
        zip: str(body.zip),
        modelInterest: str(body.modelInterest),
        intendedUse: str(body.intendedUse),
        processStage: str(body.processStage),
        message: str(body.message),
        scheduledAt,
        payload: body,
      })
      .returning();

    void sendLeadEmails({
      id: created.id,
      source: created.source,
      email: created.email,
      name: created.name,
      phone: created.phone,
      address: created.address,
      zip: created.zip,
      modelInterest: created.modelInterest,
      intendedUse: created.intendedUse,
      processStage: created.processStage,
      message: created.message,
      scheduledAt: created.scheduledAt,
    }).catch((err) => {
      logger.error({ err, leadId: created.id }, "sendLeadEmails threw");
    });

    res.status(201).json({ id: created.id, ok: true });
  }),
);

router.get(
  "/leads",
  requireAdmin,
  wrap(async (req, res) => {
    const conds: SQL[] = [];
    const source = typeof req.query.source === "string" ? req.query.source : null;
    const status = typeof req.query.status === "string" ? req.query.status : null;
    if (source && VALID_SOURCES.has(source)) {
      conds.push(eq(leadsTable.source, source));
    }
    if (status && VALID_STATUSES.has(status)) {
      conds.push(eq(leadsTable.status, status));
    }
    const rows = await db
      .select()
      .from(leadsTable)
      .where(conds.length ? and(...conds) : undefined)
      .orderBy(desc(leadsTable.createdAt))
      .limit(500);
    res.json(rows);
  }),
);

router.patch(
  "/leads/:id",
  requireAdmin,
  wrap(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const body = (req.body ?? {}) as Record<string, unknown>;
    const patch: Record<string, unknown> = { updatedAt: new Date() };
    if (body.status !== undefined) {
      const s = str(body.status);
      if (!s || !VALID_STATUSES.has(s)) {
        res.status(400).json({ error: "Invalid status" });
        return;
      }
      patch.status = s;
    }
    if (body.notes !== undefined) {
      patch.notes = typeof body.notes === "string" ? body.notes : null;
    }
    const [updated] = await db
      .update(leadsTable)
      .set(patch)
      .where(eq(leadsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }
    res.json(updated);
  }),
);

router.delete(
  "/leads/:id",
  requireAdmin,
  wrap(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db.delete(leadsTable).where(eq(leadsTable.id, id));
    res.status(204).send();
  }),
);

export default router;
