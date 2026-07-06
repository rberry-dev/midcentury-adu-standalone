import { Fragment, useEffect, useState, useCallback } from "react";
import { getAdminToken } from "./auth";

type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";
type LeadSource =
  | "discovery_call"
  | "brochure"
  | "financing"
  | "newsletter"
  | "contact";

interface Lead {
  id: number;
  source: LeadSource;
  status: LeadStatus;
  name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  zip: string | null;
  modelInterest: string | null;
  intendedUse: string | null;
  processStage: string | null;
  message: string | null;
  scheduledAt: string | null;
  notes: string | null;
  payload: unknown;
  createdAt: string;
  updatedAt: string;
}

const SOURCE_LABELS: Record<LeadSource, string> = {
  discovery_call: "Discovery Call",
  brochure: "Brochure",
  financing: "Financing",
  newsletter: "Newsletter",
  contact: "Contact",
};

const SOURCE_BADGE: Record<LeadSource, string> = {
  discovery_call: "bg-blue-100 text-blue-800",
  brochure: "bg-amber-100 text-amber-800",
  financing: "bg-emerald-100 text-emerald-800",
  newsletter: "bg-purple-100 text-purple-800",
  contact: "bg-slate-200 text-slate-800",
};

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "won", "lost"];
const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
};

function authHeaders(): HeadersInit {
  const token = getAdminToken() ?? "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function AdminLeads() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (sourceFilter !== "all") params.set("source", sourceFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    try {
      const res = await fetch(`/api/leads?${params.toString()}`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as Lead[];
      setLeads(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [sourceFilter, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateLead(id: number, patch: Partial<Pick<Lead, "status" | "notes">>) {
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const updated = (await res.json()) as Lead;
      setLeads((prev) =>
        prev ? prev.map((l) => (l.id === id ? updated : l)) : prev,
      );
    }
  }

  async function deleteLead(id: number) {
    if (!confirm("Delete this lead permanently?")) return;
    const res = await fetch(`/api/leads/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (res.ok) {
      setLeads((prev) => (prev ? prev.filter((l) => l.id !== id) : prev));
    }
  }

  const counts = leads
    ? leads.reduce(
        (acc, l) => {
          acc.total += 1;
          acc[l.status] = (acc[l.status] ?? 0) + 1;
          return acc;
        },
        { total: 0 } as Record<string, number>,
      )
    : { total: 0 };

  return (
    <div>
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-[32px] font-light text-[var(--hemma-black)]">
            Leads
          </h1>
          <p className="text-[13px] text-[var(--hemma-mid)] font-light mt-1">
            Every form submission across the site lands here. Filter, update
            status, and add notes as you work each lead.
          </p>
        </div>
        <button
          onClick={load}
          className="text-[12px] font-medium text-[var(--hemma-blue)] bg-transparent border border-[var(--hemma-blue)] rounded-full px-4 py-2 cursor-pointer hover:bg-[var(--hemma-blue)] hover:text-white transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
        <div className="bg-white rounded-[6px] border border-[var(--hemma-sand-dark)] p-4">
          <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)]">
            Total
          </div>
          <div className="font-serif text-[28px] text-[var(--hemma-black)] mt-1">
            {counts.total}
          </div>
        </div>
        {STATUSES.map((s) => (
          <div
            key={s}
            className="bg-white rounded-[6px] border border-[var(--hemma-sand-dark)] p-4"
          >
            <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)]">
              {STATUS_LABELS[s]}
            </div>
            <div className="font-serif text-[28px] text-[var(--hemma-black)] mt-1 tabular-nums">
              {counts[s] ?? 0}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[6px] border border-[var(--hemma-sand-dark)] p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)]">
            Source
          </label>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as LeadSource | "all")}
            className="text-[13px] border border-[var(--hemma-sand-dark)] rounded-[4px] px-3 py-1.5 bg-white"
          >
            <option value="all">All</option>
            {(Object.keys(SOURCE_LABELS) as LeadSource[]).map((s) => (
              <option key={s} value={s}>
                {SOURCE_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)]">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "all")}
            className="text-[13px] border border-[var(--hemma-sand-dark)] rounded-[4px] px-3 py-1.5 bg-white"
          >
            <option value="all">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <p className="text-[14px] text-[var(--hemma-mid)]">Loading leads…</p>
      )}
      {error && (
        <p className="text-[14px] text-red-500">Failed to load: {error}</p>
      )}

      {leads && leads.length === 0 && !loading && (
        <div className="bg-white rounded-[6px] border border-[var(--hemma-sand-dark)] p-12 text-center">
          <p className="font-serif text-[20px] font-light text-[var(--hemma-black)] mb-2">
            No leads yet.
          </p>
          <p className="text-[13px] text-[var(--hemma-mid)] font-light">
            New form submissions will appear here.
          </p>
        </div>
      )}

      {leads && leads.length > 0 && (
        <div className="bg-white rounded-[6px] border border-[var(--hemma-sand-dark)] overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-[var(--hemma-light)] text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)]">
              <tr>
                <th className="text-left px-4 py-3">Received</th>
                <th className="text-left px-4 py-3">Source</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Phone</th>
                <th className="text-left px-4 py-3">Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const isExpanded = expandedId === lead.id;
                return (
                  <Fragment key={lead.id}>
                    <tr
                      className="border-t border-[var(--hemma-sand-dark)] hover:bg-[var(--hemma-light)]/50 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                    >
                      <td className="px-4 py-3 text-[var(--hemma-mid)] tabular-nums whitespace-nowrap">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-[10px] font-semibold tracking-[0.06em] uppercase px-2 py-1 rounded-[3px] ${SOURCE_BADGE[lead.source]}`}
                        >
                          {SOURCE_LABELS[lead.source] ?? lead.source}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-[var(--hemma-black)]">
                        {lead.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-[var(--hemma-mid)]">
                        {lead.email}
                      </td>
                      <td className="px-4 py-3 text-[var(--hemma-mid)] tabular-nums">
                        {lead.phone ?? "—"}
                      </td>
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            updateLead(lead.id, {
                              status: e.target.value as LeadStatus,
                            })
                          }
                          className="text-[12px] border border-[var(--hemma-sand-dark)] rounded-[3px] px-2 py-1 bg-white"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--hemma-blue)]">
                        {isExpanded ? "Hide" : "View"}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-[var(--hemma-light)]/40">
                        <td colSpan={7} className="px-4 py-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <DetailField label="Address" value={lead.address} />
                            <DetailField label="Zip" value={lead.zip} />
                            <DetailField
                              label="Scheduled"
                              value={
                                lead.scheduledAt
                                  ? formatDate(lead.scheduledAt)
                                  : null
                              }
                            />
                            <DetailField
                              label="Plan Interest"
                              value={lead.modelInterest}
                            />
                            <DetailField
                              label="Intended Use"
                              value={lead.intendedUse}
                            />
                            <DetailField
                              label="Process Stage"
                              value={lead.processStage}
                            />
                            {lead.message && (
                              <DetailField
                                label="Message"
                                value={lead.message}
                                full
                              />
                            )}
                            <div className="md:col-span-3">
                              <label className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)] mb-1.5">
                                Internal Notes
                              </label>
                              <NotesEditor
                                key={`notes-${lead.id}-${lead.updatedAt}`}
                                initial={lead.notes ?? ""}
                                onSave={(notes) => updateLead(lead.id, { notes })}
                              />
                            </div>
                            <div className="md:col-span-3 flex justify-end pt-2">
                              <button
                                onClick={() => deleteLead(lead.id)}
                                className="text-[12px] text-red-600 bg-transparent border border-red-200 rounded-[3px] px-3 py-1.5 cursor-pointer hover:bg-red-50"
                              >
                                Delete lead
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DetailField({
  label,
  value,
  full,
}: {
  label: string;
  value: string | null;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-3" : ""}>
      <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)] mb-0.5">
        {label}
      </div>
      <div className="text-[13px] text-[var(--hemma-black)] font-light">
        {value && value.length > 0 ? value : "—"}
      </div>
    </div>
  );
}

function NotesEditor({
  initial,
  onSave,
}: {
  initial: string;
  onSave: (notes: string) => void;
}) {
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const dirty = value !== initial;

  async function handleSave() {
    setSaving(true);
    await onSave(value);
    setSaving(false);
  }

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        placeholder="Add internal notes about this lead…"
        className="w-full text-[13px] font-light border border-[var(--hemma-sand-dark)] rounded-[4px] px-3 py-2 bg-white outline-none focus:border-[var(--hemma-blue)]"
      />
      <div className="flex justify-end mt-2">
        <button
          onClick={handleSave}
          disabled={!dirty || saving}
          className="text-[12px] font-medium px-4 py-1.5 rounded-full bg-[var(--hemma-blue)] text-white border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "Saving…" : dirty ? "Save notes" : "Saved"}
        </button>
      </div>
    </div>
  );
}
