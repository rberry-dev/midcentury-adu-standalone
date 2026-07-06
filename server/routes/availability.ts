import {
  Router,
  type IRouter,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { eq, isNotNull, gte, and, ne } from "drizzle-orm";
import { db, availabilityWindowsTable, leadsTable } from "../db";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

const TZ = "America/Los_Angeles";
export const SLOT_MINUTES = 30;
export const BUFFER_MINUTES = 30;

const wrap =
  (fn: (req: Request, res: Response) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res).catch(next);

/** Get { year, month (1-12), day, dayOfWeek (0=Sun..6=Sat) } in LA tz for a UTC instant. */
function laDateParts(d: Date): {
  year: number;
  month: number;
  day: number;
  dayOfWeek: number;
} {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
  const parts = fmt.formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const dowMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    dayOfWeek: dowMap[get("weekday")] ?? 0,
  };
}

/** UTC Date corresponding to LA local Y/M/D + minutes-from-midnight. Handles PST/PDT. */
function laLocalToUTC(
  year: number,
  month: number,
  day: number,
  minutes: number,
): Date {
  const hour = Math.floor(minutes / 60);
  const min = minutes % 60;
  const guess = new Date(Date.UTC(year, month - 1, day, hour + 8, min));
  const laHour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      hour: "2-digit",
      hour12: false,
    }).format(guess),
  );
  const expected = hour % 24;
  let diff = laHour - expected;
  if (diff > 12) diff -= 24;
  if (diff < -12) diff += 24;
  return new Date(guess.getTime() - diff * 3600_000);
}

router.get(
  "/availability/windows",
  wrap(async (_req, res) => {
    const rows = await db.select().from(availabilityWindowsTable);
    rows.sort((a, b) =>
      a.dayOfWeek !== b.dayOfWeek
        ? a.dayOfWeek - b.dayOfWeek
        : a.startMinute - b.startMinute,
    );
    res.json(rows);
  }),
);

router.post(
  "/availability/windows",
  requireAdmin,
  wrap(async (req, res) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const dayOfWeek = Number(body.dayOfWeek);
    const startMinute = Number(body.startMinute);
    const endMinute = Number(body.endMinute);
    if (
      !Number.isInteger(dayOfWeek) ||
      dayOfWeek < 0 ||
      dayOfWeek > 6 ||
      !Number.isInteger(startMinute) ||
      !Number.isInteger(endMinute) ||
      startMinute < 0 ||
      endMinute > 24 * 60 ||
      endMinute - startMinute < SLOT_MINUTES
    ) {
      res.status(400).json({ error: "Invalid window" });
      return;
    }
    const [created] = await db
      .insert(availabilityWindowsTable)
      .values({ dayOfWeek, startMinute, endMinute })
      .returning();
    res.status(201).json(created);
  }),
);

router.delete(
  "/availability/windows/:id",
  requireAdmin,
  wrap(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db
      .delete(availabilityWindowsTable)
      .where(eq(availabilityWindowsTable.id, id));
    res.status(204).send();
  }),
);

/** Returns sorted list of upcoming booked discovery_call scheduledAt timestamps (>= now). */
async function getBookedSlots(): Promise<Date[]> {
  const now = new Date();
  const rows = await db
    .select({ scheduledAt: leadsTable.scheduledAt })
    .from(leadsTable)
    .where(
      and(
        eq(leadsTable.source, "discovery_call"),
        isNotNull(leadsTable.scheduledAt),
        gte(leadsTable.scheduledAt, now),
        ne(leadsTable.status, "lost"),
      ),
    );
  return rows
    .map((r) => r.scheduledAt as Date)
    .filter(Boolean)
    .sort((a, b) => a.getTime() - b.getTime());
}

/** A candidate slot at start S is unavailable if any booked slot B satisfies
 *  |S - B| < SLOT_MINUTES + BUFFER_MINUTES (i.e. < 60 min apart). */
function isSlotBlocked(slotStart: Date, booked: Date[]): boolean {
  const minGapMs = (SLOT_MINUTES + BUFFER_MINUTES) * 60_000;
  return booked.some(
    (b) => Math.abs(slotStart.getTime() - b.getTime()) < minGapMs,
  );
}

router.get(
  "/availability/slots",
  wrap(async (req, res) => {
    const days = Math.min(
      Math.max(Number(req.query.days) || 21, 1),
      60,
    );
    const windows = await db.select().from(availabilityWindowsTable);
    const booked = await getBookedSlots();

    const now = new Date();
    const today = laDateParts(now);

    const start = new Date(
      laLocalToUTC(today.year, today.month, today.day, 0).getTime() +
        24 * 3600_000,
    );

    const slots: { start: string; date: string }[] = [];

    for (let i = 0; i < days; i++) {
      const dayInstant = new Date(start.getTime() + i * 24 * 3600_000);
      const parts = laDateParts(dayInstant);
      const dayWindows = windows.filter((w) => w.dayOfWeek === parts.dayOfWeek);
      if (dayWindows.length === 0) continue;

      const dateStr = `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;

      for (const w of dayWindows) {
        for (
          let m = w.startMinute;
          m + SLOT_MINUTES <= w.endMinute;
          m += SLOT_MINUTES
        ) {
          const slotStart = laLocalToUTC(parts.year, parts.month, parts.day, m);
          if (slotStart.getTime() <= now.getTime()) continue;
          if (isSlotBlocked(slotStart, booked)) continue;
          slots.push({ start: slotStart.toISOString(), date: dateStr });
        }
      }
    }

    slots.sort((a, b) => a.start.localeCompare(b.start));
    res.json({
      slotMinutes: SLOT_MINUTES,
      bufferMinutes: BUFFER_MINUTES,
      timezone: TZ,
      slots,
    });
  }),
);

/** Validate a candidate slot against current windows + booked. Used by POST /leads. */
export async function validateDiscoverySlot(
  slotStart: Date,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const now = new Date();
  if (slotStart.getTime() <= now.getTime()) {
    return { ok: false, reason: "Slot is in the past" };
  }
  const today = laDateParts(now);
  const tomorrowStart = new Date(
    laLocalToUTC(today.year, today.month, today.day, 0).getTime() +
      24 * 3600_000,
  );
  if (slotStart.getTime() < tomorrowStart.getTime()) {
    return { ok: false, reason: "Same-day scheduling is not allowed" };
  }
  const parts = laDateParts(slotStart);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const partsHM = fmt.formatToParts(slotStart);
  const hh = Number(partsHM.find((p) => p.type === "hour")?.value ?? "0") % 24;
  const mm = Number(partsHM.find((p) => p.type === "minute")?.value ?? "0");
  const minuteOfDay = hh * 60 + mm;
  if (minuteOfDay % SLOT_MINUTES !== 0) {
    return { ok: false, reason: "Slot must align to 30-minute boundary" };
  }
  const windows = await db
    .select()
    .from(availabilityWindowsTable)
    .where(eq(availabilityWindowsTable.dayOfWeek, parts.dayOfWeek));
  const inWindow = windows.some(
    (w) =>
      minuteOfDay >= w.startMinute &&
      minuteOfDay + SLOT_MINUTES <= w.endMinute,
  );
  if (!inWindow) {
    return { ok: false, reason: "Slot is outside available hours" };
  }
  const booked = await getBookedSlots();
  if (isSlotBlocked(slotStart, booked)) {
    return { ok: false, reason: "Slot is no longer available" };
  }
  return { ok: true };
}

export default router;
