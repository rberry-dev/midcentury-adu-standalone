import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { X, FileText } from "lucide-react";
import { capitalizeName, formatPhone } from "@/lib/format";
import { submitLead, markConversionPending } from "@/lib/leads";
import { Turnstile } from "@/components/Turnstile";

interface BrochureModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  zip: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  zip?: string;
}

const initialForm: FormState = { name: "", email: "", phone: "", zip: "" };

const BROCHURE_URL = `${import.meta.env.BASE_URL}hemma-brochure.pdf`;
const BROCHURE_FILENAME = "Midcentury-ADU-2026-Brochure.pdf";

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Please enter a valid email.";
  }
  if (!form.zip.trim()) errors.zip = "Zip code is required.";
  return errors;
}

const inputClass = (hasError?: boolean) =>
  `w-full px-4 py-3 rounded-[3px] border text-[14px] font-light bg-[var(--hemma-light)] text-[var(--hemma-black)] placeholder-[var(--hemma-mid)] outline-none transition-colors focus:border-[var(--hemma-blue)] ${
    hasError ? "border-red-400" : "border-transparent"
  }`;

function triggerDownload() {
  const a = document.createElement("a");
  a.href = BROCHURE_URL;
  a.download = BROCHURE_FILENAME;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function BrochureModal({ open, onClose }: BrochureModalProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [botError, setBotError] = useState<string | null>(null);
  const handleVerify = useCallback((t: string) => {
    setTurnstileToken(t);
    setBotError(null);
  }, []);
  const handleExpire = useCallback(() => setTurnstileToken(null), []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setErrors({});
      setSubmitting(false);
      setTurnstileToken(null);
      setBotError(null);
    }
  }, [open]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    let next = value;
    if (name === "name") next = capitalizeName(value);
    else if (name === "phone") next = formatPhone(value);
    setForm((prev) => ({ ...prev, [name]: next }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!turnstileToken) {
      setBotError("Please complete the bot-check below.");
      return;
    }
    setSubmitting(true);
    const result = await submitLead({
      source: "brochure",
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      zip: form.zip,
      turnstileToken,
    });
    setSubmitting(false);
    if (!result.ok) {
      setBotError(result.error ?? "Something went wrong. Please try again.");
      return;
    }
    triggerDownload();
    markConversionPending("brochure");
    onClose();
    const qs = new URLSearchParams({ source: "brochure" });
    if (form.name) qs.set("name", form.name);
    setLocation(`/thank-you?${qs.toString()}`);
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-[var(--hemma-white)] rounded-[8px] w-full max-w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-[var(--hemma-white)]/95 backdrop-blur-md border-b border-black/5 px-6 md:px-10 py-5 z-20">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--hemma-blue)] mb-1">
                    Free · Instant Download
                  </div>
                  <h2 className="font-serif text-[22px] md:text-[26px] font-light leading-none text-[var(--hemma-black)]">
                    The Midcentury ADU 2026 Brochure
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 flex-shrink-0 text-[var(--hemma-mid)] hover:text-[var(--hemma-black)] transition-colors bg-transparent border-none cursor-pointer"
                  aria-label="Close"
                >
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="px-6 md:px-10 py-8">
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div className="flex items-start gap-4 p-4 rounded-[6px] bg-[var(--hemma-light)]">
                      <div className="w-10 h-10 rounded-[4px] bg-[var(--hemma-blue)] text-white flex items-center justify-center flex-shrink-0">
                        <FileText size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[var(--hemma-black)] leading-tight mb-1">
                          Eight floor plans, pricing, and the Midcentury ADU build process.
                        </p>
                        <p className="text-[12px] text-[var(--hemma-mid)] font-light leading-[1.5]">
                          Tell us a bit about you and we'll send the PDF straight to your downloads.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-black)] mb-1.5">
                          Full Name <span className="text-[var(--hemma-blue)]">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Jane Smith"
                          className={inputClass(!!errors.name)}
                        />
                        {errors.name && (
                          <p className="text-[12px] text-red-500 mt-1">{errors.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-black)] mb-1.5">
                          Email <span className="text-[var(--hemma-blue)]">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="jane@example.com"
                          className={inputClass(!!errors.email)}
                        />
                        {errors.email && (
                          <p className="text-[12px] text-red-500 mt-1">{errors.email}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-black)] mb-1.5">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="(310) 555-0100"
                          className={inputClass()}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-black)] mb-1.5">
                          Zip Code <span className="text-[var(--hemma-blue)]">*</span>
                        </label>
                        <input
                          type="text"
                          name="zip"
                          value={form.zip}
                          onChange={handleChange}
                          placeholder="90210"
                          maxLength={10}
                          className={inputClass(!!errors.zip)}
                        />
                        {errors.zip && (
                          <p className="text-[12px] text-red-500 mt-1">{errors.zip}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Turnstile onVerify={handleVerify} onExpire={handleExpire} size="flexible" />
                      {botError && (
                        <p className="text-[12px] text-red-500 mt-1.5">{botError}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            />
                          </svg>
                          Preparing your brochure…
                        </>
                      ) : (
                        <>
                          <FileText size={16} strokeWidth={2} />
                          Download the Brochure
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-[var(--hemma-mid)] text-center leading-[1.6]">
                      No spam. We'll only use your info to follow up about your ADU project.
                    </p>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
