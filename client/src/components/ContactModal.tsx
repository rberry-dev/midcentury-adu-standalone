import React, { useCallback, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { capitalizeName, formatPhone } from "@/lib/format";
import { submitLead, markConversionPending } from "@/lib/leads";
import { Turnstile } from "@/components/Turnstile";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  preselectedModel?: string;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  zip: string;
  aduSize: string;
  aduUse: string;
  aduUseOther: string;
  processStage: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  address?: string;
  zip?: string;
}

const ADU_SIZES = [
  { value: "studio", label: "Studio", sub: "KOJA · 400 SF" },
  { value: "1bd", label: "1 Bedroom", sub: "FRISTAD / SPRÅNG · 550–700 SF" },
  { value: "2bd", label: "2 Bedroom", sub: "TORP / AVKAST / LOGE · 700–1,100 SF" },
  { value: "3bd", label: "3 Bedroom", sub: "GÅRD · 1,100 SF" },
  { value: "unsure", label: "Not Sure", sub: "We'll help you decide" },
];

const ADU_USES = [
  "For a parent or older family member",
  "For a younger family member",
  "For rental income",
  "For home office / guests",
  "Other",
];

const PROCESS_STAGES = [
  "Just starting my research",
  "I have an idea of what I want",
  "I am ready to get started",
];

const MODEL_SIZE_MAP: Record<string, string> = {
  koja: "studio",
  fristad: "1bd", "språng": "1bd",
  torp: "2bd", avkast: "2bd", loge: "2bd",
  "gård": "3bd",
  "höjd": "2bd",
};

const initialForm: FormState = {
  name: "", email: "", phone: "", address: "", zip: "",
  aduSize: "", aduUse: "", aduUseOther: "", processStage: "", message: "",
};

interface Slot {
  start: string; // ISO UTC
  date: string;  // LA-local YYYY-MM-DD
}
interface SlotsResponse {
  slotMinutes: number;
  bufferMinutes: number;
  timezone: string;
  slots: Slot[];
}

function formatSlotTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
  });
}

/** Convert a calendar-grid Date back to its YYYY-MM-DD key. Both `parseLADateString`
 *  and the calendar grid build Dates with `new Date(y, m, d)` (local midnight), so
 *  reading local components round-trips losslessly regardless of browser timezone. */
function toLADateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseLADateString(s: string): Date {
  // "YYYY-MM-DD" → Date at local midnight. We treat the LA-tz date label
  // as a calendar label (Y-M-D), not an instant — the actual booking is the
  // slot's `start` ISO, which carries the correct UTC instant.
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Please enter a valid email.";
  }
  if (!form.address.trim()) errors.address = "Property address is required.";
  if (!form.zip.trim()) errors.zip = "Zip code is required.";
  return errors;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function CalendarPicker({ selected, onSelect, availableDates }: { selected: Date | null; onSelect: (d: Date) => void; availableDates: Date[] }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const firstAvailable = availableDates[0] ?? today;
  const lastAvailable = availableDates[availableDates.length - 1] ?? today;
  const [viewMonth, setViewMonth] = useState(firstAvailable.getMonth());
  const [viewYear, setViewYear] = useState(firstAvailable.getFullYear());
  useEffect(() => {
    if (availableDates.length > 0) {
      setViewMonth(availableDates[0].getMonth());
      setViewYear(availableDates[0].getFullYear());
    }
  }, [availableDates]);
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const availableSet = useMemo(() => new Set(availableDates.map(d => d.toDateString())), [availableDates]);
  const canGoPrev = viewYear > firstAvailable.getFullYear() || (viewYear === firstAvailable.getFullYear() && viewMonth > firstAvailable.getMonth());
  const canGoNext = viewYear < lastAvailable.getFullYear() || (viewYear === lastAvailable.getFullYear() && viewMonth < lastAvailable.getMonth());
  function prevMonth() { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1); } else setViewMonth(m => m-1); }
  function nextMonth() { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1); } else setViewMonth(m => m+1); }
  const cells: (number | null)[] = [...Array(startOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} disabled={!canGoPrev} className="p-1.5 rounded-[3px] hover:bg-[var(--hemma-sand)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-none cursor-pointer">
          <ChevronLeft size={16} className="text-[var(--hemma-black)]" />
        </button>
        <span className="text-[13px] font-semibold text-[var(--hemma-black)]">{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} disabled={!canGoNext} className="p-1.5 rounded-[3px] hover:bg-[var(--hemma-sand)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-none cursor-pointer">
          <ChevronRight size={16} className="text-[var(--hemma-black)]" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAY_NAMES.map(d => <div key={d} className="text-center text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--hemma-mid)] py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const date = new Date(viewYear, viewMonth, day);
          const isAvailable = availableSet.has(date.toDateString());
          const isSelected = selected && isSameDay(date, selected);
          const isToday = isSameDay(date, today);
          return (
            <button key={day} onClick={() => isAvailable && onSelect(date)} disabled={!isAvailable}
              className={`aspect-square rounded-[4px] text-[13px] font-medium transition-all border-none cursor-pointer ${isSelected ? "bg-[var(--hemma-blue)] text-white" : isAvailable ? "hover:bg-[var(--hemma-sand)] text-[var(--hemma-black)] bg-transparent" : "text-[var(--hemma-sand-dark)] bg-transparent cursor-default"} ${isToday && !isSelected ? "ring-1 ring-[var(--hemma-blue)]" : ""}`}>
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RadioGroup({ name, options, value, onChange }: {
  name: string;
  options: { value: string; label: string; sub?: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map(opt => (
        <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-[4px] border cursor-pointer transition-colors ${value === opt.value ? "border-[var(--hemma-blue)] bg-blue-50" : "border-[var(--hemma-sand-dark)] hover:border-[var(--hemma-blue)]/50 bg-transparent"}`}>
          <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${value === opt.value ? "border-[var(--hemma-blue)]" : "border-[var(--hemma-sand-dark)]"}`}>
            {value === opt.value && <div className="w-2 h-2 rounded-full bg-[var(--hemma-blue)]" />}
          </div>
          <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={() => onChange(opt.value)} className="sr-only" />
          <div>
            <span className="text-[14px] font-medium text-[var(--hemma-black)] block">{opt.label}</span>
            {opt.sub && <span className="text-[11px] text-[var(--hemma-mid)] font-light">{opt.sub}</span>}
          </div>
        </label>
      ))}
    </div>
  );
}

const inputClass = (hasError?: boolean) =>
  `w-full px-4 py-3 rounded-[3px] border text-[14px] font-light bg-[var(--hemma-light)] text-[var(--hemma-black)] placeholder-[var(--hemma-mid)] outline-none transition-colors focus:border-[var(--hemma-blue)] ${hasError ? "border-red-400" : "border-transparent"}`;

export function ContactModal({ open, onClose, preselectedModel }: ContactModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [, setLocation] = useLocation();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const handleVerify = useCallback((t: string) => setTurnstileToken(t), []);
  const handleExpire = useCallback(() => setTurnstileToken(null), []);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlotIso, setSelectedSlotIso] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [slotsByDate, setSlotsByDate] = useState<Map<string, Slot[]>>(new Map());
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchSlots = async () => {
    setSlotsLoading(true);
    setSlotsError(null);
    try {
      const res = await fetch("/api/availability/slots?days=21");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as SlotsResponse;
      const grouped = new Map<string, Slot[]>();
      for (const s of data.slots) {
        const arr = grouped.get(s.date) ?? [];
        arr.push(s);
        grouped.set(s.date, arr);
      }
      setSlotsByDate(grouped);
    } catch (e) {
      setSlotsError(e instanceof Error ? e.message : "Failed to load times");
    } finally {
      setSlotsLoading(false);
    }
  };

  useEffect(() => {
    if (open && step === 2 && slotsByDate.size === 0 && !slotsLoading) {
      fetchSlots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step]);

  const availableDates = useMemo(
    () =>
      Array.from(slotsByDate.keys())
        .sort()
        .map((s) => parseLADateString(s)),
    [slotsByDate],
  );

  const slotsForSelectedDate: Slot[] = useMemo(() => {
    if (!selectedDate) return [];
    return slotsByDate.get(toLADateKey(selectedDate)) ?? [];
  }, [selectedDate, slotsByDate]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) { document.addEventListener("keydown", handleEsc); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", handleEsc); document.body.style.overflow = ""; };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setStep(1);
      const mappedSize = preselectedModel ? (MODEL_SIZE_MAP[preselectedModel] ?? "") : "";
      setForm({ ...initialForm, aduSize: mappedSize });
      setErrors({});
      setSelectedDate(null);
      setSelectedSlotIso(null);
      setSubmitting(false);
      setSlotsByDate(new Map());
      setSlotsError(null);
      setSubmitError(null);
    }
  }, [open, preselectedModel]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    let next = value;
    if (name === "name" || name === "address") next = capitalizeName(value);
    else if (name === "phone") next = formatPhone(value);
    setForm(prev => ({ ...prev, [name]: next }));
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  function handleStep1Submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStep(2);
  }

  async function handleConfirm() {
    if (!selectedSlotIso) return;
    if (!turnstileToken) {
      setSubmitError("Please complete the bot-check below.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "discovery_call",
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          address: form.address,
          zip: form.zip,
          modelInterest: form.aduSize || undefined,
          intendedUse:
            form.aduUse === "Other"
              ? form.aduUseOther || "Other"
              : form.aduUse || undefined,
          processStage: form.processStage || undefined,
          message: form.message || undefined,
          scheduledAt: selectedSlotIso,
          turnstileToken,
        }),
      });
      if (res.status === 409) {
        const err = await res.json().catch(() => ({}));
        setSubmitError(
          err.error ?? "That time was just taken. Please pick another.",
        );
        setSelectedSlotIso(null);
        await fetchSlots();
        return;
      }
      if (!res.ok) {
        setSubmitError("Something went wrong. Please try again.");
        return;
      }
      markConversionPending("discovery_call");
      onClose();
      const qs = new URLSearchParams({ source: "discovery_call" });
      if (form.name) qs.set("name", form.name);
      if (selectedSlotIso) qs.set("scheduledAt", selectedSlotIso);
      setLocation(`/thank-you?${qs.toString()}`);
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const aduSizeLabel = ADU_SIZES.find(s => s.value === form.aduSize)?.label ?? "";
  const stepLabels = ["Your Info", "Pick a Time"];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-12">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-[var(--hemma-white)] rounded-[8px] w-full max-w-[640px] max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
          >
            <div className="sticky top-0 bg-[var(--hemma-white)]/95 backdrop-blur-md border-b border-black/5 px-6 md:px-10 py-5 z-20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--hemma-blue)] mb-1">Free · 20-Minute Phone Call</div>
                  <h2 className="font-serif text-[22px] md:text-[26px] font-light leading-none text-[var(--hemma-black)]">Schedule a Discovery Call</h2>
                </div>
                <button onClick={onClose} className="p-2 flex-shrink-0 text-[var(--hemma-mid)] hover:text-[var(--hemma-black)] transition-colors bg-transparent border-none cursor-pointer" aria-label="Close">
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                  {stepLabels.map((label, i) => {
                    const num = i + 1 as 1 | 2;
                    const active = step === num;
                    const done = step > num;
                    return (
                      <React.Fragment key={num}>
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${done || active ? "bg-[var(--hemma-blue)] text-white" : "bg-[var(--hemma-sand)] text-[var(--hemma-mid)]"}`}>
                            {done ? "✓" : num}
                          </div>
                          <span className={`text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors ${active ? "text-[var(--hemma-black)]" : "text-[var(--hemma-mid)]"}`}>{label}</span>
                        </div>
                        {i < 1 && <div className="flex-1 h-px bg-[var(--hemma-sand-dark)]" />}
                      </React.Fragment>
                    );
                  })}
                </div>
            </div>

            <div className="px-6 md:px-10 py-8 flex-1">
              <AnimatePresence mode="wait">

                {step === 1 && (
                  <motion.form key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                    onSubmit={handleStep1Submit} noValidate className="space-y-7">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-black)] mb-1.5">Full Name <span className="text-[var(--hemma-blue)]">*</span></label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" className={inputClass(!!errors.name)} />
                        {errors.name && <p className="text-[12px] text-red-500 mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-black)] mb-1.5">Email <span className="text-[var(--hemma-blue)]">*</span></label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" className={inputClass(!!errors.email)} />
                        {errors.email && <p className="text-[12px] text-red-500 mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-black)] mb-1.5">Phone</label>
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="(310) 555-0100" className={inputClass()} />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-black)] mb-1.5">Zip Code <span className="text-[var(--hemma-blue)]">*</span></label>
                        <input type="text" name="zip" value={form.zip} onChange={handleChange} placeholder="90210" maxLength={10} className={inputClass(!!errors.zip)} />
                        {errors.zip && <p className="text-[12px] text-red-500 mt-1">{errors.zip}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-black)] mb-1.5">Property Address <span className="text-[var(--hemma-blue)]">*</span></label>
                      <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="123 Oak Street, Los Angeles, CA" className={inputClass(!!errors.address)} />
                      {errors.address && <p className="text-[12px] text-red-500 mt-1">{errors.address}</p>}
                      <p className="text-[11px] text-[var(--hemma-mid)] mt-1.5 font-light">We'll use this to check local zoning and permitting on the call.</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-black)] mb-3">What plan are you interested in?</p>
                      <RadioGroup
                        name="aduSize"
                        options={ADU_SIZES}
                        value={form.aduSize}
                        onChange={v => setForm(prev => ({ ...prev, aduSize: v }))}
                      />
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-black)] mb-3">How will you use your ADU?</p>
                      <RadioGroup
                        name="aduUse"
                        options={ADU_USES.map(u => ({ value: u, label: u }))}
                        value={form.aduUse}
                        onChange={v => setForm(prev => ({ ...prev, aduUse: v, aduUseOther: v !== "Other" ? "" : prev.aduUseOther }))}
                      />
                      {form.aduUse === "Other" && (
                        <input type="text" name="aduUseOther" value={form.aduUseOther} onChange={handleChange}
                          placeholder="Tell us more…"
                          className="mt-2 w-full px-4 py-3 rounded-[3px] border border-[var(--hemma-blue)] text-[14px] font-light bg-[var(--hemma-light)] text-[var(--hemma-black)] placeholder-[var(--hemma-mid)] outline-none" />
                      )}
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-black)] mb-3">Where are you in the process?</p>
                      <RadioGroup
                        name="processStage"
                        options={PROCESS_STAGES.map(s => ({ value: s, label: s }))}
                        value={form.processStage}
                        onChange={v => setForm(prev => ({ ...prev, processStage: v }))}
                      />
                    </div>

                    <button type="submit" className="w-full btn-primary">Choose a Date & Time →</button>
                    <p className="text-[11px] text-[var(--hemma-mid)] text-center leading-[1.6]">No spam. No commitment. A free 20-minute call with an ADU specialist.</p>
                  </motion.form>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-6">
                    <p className="text-[14px] font-light leading-[1.7] text-[var(--hemma-mid)]">Pick a day and time for your discovery call. Calls are typically 20 minutes and done by phone.</p>
                    <div className="bg-[var(--hemma-light)] rounded-[6px] p-5">
                      {slotsLoading && (
                        <p className="text-[13px] text-[var(--hemma-mid)] text-center py-8">Loading available times…</p>
                      )}
                      {!slotsLoading && slotsError && (
                        <div className="text-center py-8">
                          <p className="text-[13px] text-red-500 mb-3">Couldn't load available times.</p>
                          <button onClick={fetchSlots} className="text-[12px] font-medium text-[var(--hemma-blue)] underline bg-transparent border-none cursor-pointer">Try again</button>
                        </div>
                      )}
                      {!slotsLoading && !slotsError && availableDates.length === 0 && (
                        <p className="text-[13px] text-[var(--hemma-mid)] text-center py-8 leading-[1.6]">No times currently available. Please email us at <a href="mailto:hello@aduhomesinc.com" className="text-[var(--hemma-blue)]">hello@aduhomesinc.com</a> and we'll get back to you within one business day.</p>
                      )}
                      {!slotsLoading && !slotsError && availableDates.length > 0 && (
                        <CalendarPicker selected={selectedDate} availableDates={availableDates} onSelect={d => { setSelectedDate(d); setSelectedSlotIso(null); setSubmitError(null); }} />
                      )}
                    </div>
                    <AnimatePresence>
                      {selectedDate && slotsForSelectedDate.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18 }}>
                          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-black)] mb-3">Available times — {formatDate(selectedDate)}</p>
                          <div className="grid grid-cols-4 gap-2">
                            {slotsForSelectedDate.map(slot => {
                              const label = formatSlotTime(slot.start);
                              const active = selectedSlotIso === slot.start;
                              return (
                                <button key={slot.start} onClick={() => { setSelectedSlotIso(slot.start); setSubmitError(null); }}
                                  className={`py-2.5 rounded-[4px] text-[13px] font-medium transition-colors border cursor-pointer ${active ? "bg-[var(--hemma-blue)] text-white border-[var(--hemma-blue)]" : "bg-[var(--hemma-white)] text-[var(--hemma-black)] border-[var(--hemma-sand-dark)] hover:border-[var(--hemma-blue)]"}`}>
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {selectedSlotIso && (
                      <div className="flex justify-center">
                        <Turnstile onVerify={handleVerify} onExpire={handleExpire} size="flexible" />
                      </div>
                    )}
                    {submitError && (
                      <p className="text-[12px] text-red-500 text-center">{submitError}</p>
                    )}
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setStep(1)} className="px-5 py-3 rounded-full border border-[var(--hemma-sand-dark)] text-[var(--hemma-black)] text-[14px] font-medium hover:border-[var(--hemma-black)] transition-colors bg-transparent cursor-pointer flex items-center gap-2">
                        <ChevronLeft size={16} /> Back
                      </button>
                      <button onClick={handleConfirm} disabled={!selectedSlotIso || submitting}
                        className="flex-1 btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {submitting ? (
                          <><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Confirming…</>
                        ) : `Confirm ${selectedSlotIso ? `· ${formatSlotTime(selectedSlotIso)}` : "Call"}`}
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
