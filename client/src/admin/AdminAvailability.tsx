import { useEffect, useState, useCallback } from "react";
import { getAdminToken } from "./auth";

interface AvailabilityWindow {
  id: number;
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
  createdAt: string;
}

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

function fmtTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function timeOptions(): { value: number; label: string }[] {
  const out: { value: number; label: string }[] = [];
  for (let m = 0; m < 24 * 60; m += 30) {
    out.push({ value: m, label: fmtTime(m) });
  }
  return out;
}

const TIME_OPTS = timeOptions();

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAdminToken() ?? ""}`,
  };
}

export function AdminAvailability() {
  const [windows, setWindows] = useState<AvailabilityWindow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newDay, setNewDay] = useState<number>(1);
  const [newStart, setNewStart] = useState<number>(9 * 60);
  const [newEnd, setNewEnd] = useState<number>(17 * 60);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/availability/windows");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as AvailabilityWindow[];
      setWindows(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addWindow() {
    if (newEnd - newStart < 30) {
      setError("End time must be at least 30 minutes after start.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/availability/windows", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          dayOfWeek: newDay,
          startMinute: newStart,
          endMinute: newEnd,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add window");
    } finally {
      setSaving(false);
    }
  }

  async function deleteWindow(id: number) {
    if (!confirm("Remove this availability window?")) return;
    const res = await fetch(`/api/availability/windows/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (res.ok) {
      setWindows((prev) => (prev ? prev.filter((w) => w.id !== id) : prev));
    }
  }

  const byDay = new Map<number, AvailabilityWindow[]>();
  for (const d of DAYS) byDay.set(d.value, []);
  if (windows) {
    for (const w of windows) {
      byDay.get(w.dayOfWeek)?.push(w);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[32px] font-light text-[var(--hemma-black)]">
          Availability
        </h1>
        <p className="text-[13px] text-[var(--hemma-mid)] font-light mt-1 max-w-2xl">
          Set the days and times you're available for discovery calls. Calls
          are 30 minutes with a 30-minute buffer on either side. Same-day
          booking is disabled. All times are Pacific (Los Angeles).
        </p>
      </div>

      <div className="bg-white rounded-[6px] border border-[var(--hemma-sand-dark)] p-5 mb-8">
        <h2 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-black)] mb-4">
          Add Availability Window
        </h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)] mb-1">
              Day
            </label>
            <select
              value={newDay}
              onChange={(e) => setNewDay(Number(e.target.value))}
              className="text-[13px] border border-[var(--hemma-sand-dark)] rounded-[4px] px-3 py-2 bg-white"
            >
              {DAYS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)] mb-1">
              From
            </label>
            <select
              value={newStart}
              onChange={(e) => setNewStart(Number(e.target.value))}
              className="text-[13px] border border-[var(--hemma-sand-dark)] rounded-[4px] px-3 py-2 bg-white"
            >
              {TIME_OPTS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)] mb-1">
              To
            </label>
            <select
              value={newEnd}
              onChange={(e) => setNewEnd(Number(e.target.value))}
              className="text-[13px] border border-[var(--hemma-sand-dark)] rounded-[4px] px-3 py-2 bg-white"
            >
              {TIME_OPTS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
              <option value={24 * 60}>12:00 AM (next day)</option>
            </select>
          </div>
          <button
            onClick={addWindow}
            disabled={saving}
            className="text-[13px] font-medium px-5 py-2 rounded-full bg-[var(--hemma-blue)] text-white border-none cursor-pointer disabled:opacity-50"
          >
            {saving ? "Adding…" : "Add window"}
          </button>
        </div>
        {error && (
          <p className="text-[12px] text-red-500 mt-3">{error}</p>
        )}
      </div>

      {loading && (
        <p className="text-[14px] text-[var(--hemma-mid)]">Loading…</p>
      )}

      {windows && (
        <div className="bg-white rounded-[6px] border border-[var(--hemma-sand-dark)] overflow-hidden">
          {DAYS.map((d) => {
            const dayWindows = byDay.get(d.value) ?? [];
            const isWeekend = d.value === 0 || d.value === 6;
            return (
              <div
                key={d.value}
                className="flex items-start gap-6 px-5 py-4 border-b border-[var(--hemma-sand-dark)] last:border-b-0"
              >
                <div className="w-32 shrink-0">
                  <div className="text-[14px] font-medium text-[var(--hemma-black)]">
                    {d.label}
                  </div>
                  {isWeekend && dayWindows.length === 0 && (
                    <div className="text-[11px] text-[var(--hemma-mid)] font-light">
                      Weekend
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-wrap gap-2">
                  {dayWindows.length === 0 && (
                    <span className="text-[12px] text-[var(--hemma-mid)] font-light italic">
                      Unavailable
                    </span>
                  )}
                  {dayWindows.map((w) => (
                    <div
                      key={w.id}
                      className="inline-flex items-center gap-2 bg-[var(--hemma-light)] rounded-full pl-3 pr-1 py-1"
                    >
                      <span className="text-[12px] font-medium text-[var(--hemma-black)] tabular-nums">
                        {fmtTime(w.startMinute)} – {fmtTime(w.endMinute)}
                      </span>
                      <button
                        onClick={() => deleteWindow(w.id)}
                        aria-label="Remove window"
                        className="w-5 h-5 rounded-full bg-[var(--hemma-sand-dark)] text-[var(--hemma-black)] text-[10px] leading-none border-none cursor-pointer hover:bg-red-500 hover:text-white transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
