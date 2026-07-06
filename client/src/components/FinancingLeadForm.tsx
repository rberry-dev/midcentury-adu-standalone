import { useCallback, useState } from "react";
import { useLocation } from "wouter";
import lifestyleImg from "@/assets/generated_images/financing_lifestyle.webp";
import { capitalizeName, formatPhone } from "@/lib/format";
import { submitLead, markConversionPending } from "@/lib/leads";
import { Turnstile } from "@/components/Turnstile";

interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  comments: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
}

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  comments: "",
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.firstName.trim()) errors.firstName = "Required";
  if (!form.lastName.trim()) errors.lastName = "Required";
  if (!form.email.trim()) {
    errors.email = "Required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email";
  }
  if (!form.address.trim()) errors.address = "Required";
  return errors;
}

const inputClass = (hasError?: boolean) =>
  `w-full px-4 py-3 rounded-[3px] border text-[14px] font-light bg-[var(--hemma-white)] text-[var(--hemma-black)] placeholder-[var(--hemma-mid)] outline-none transition-colors focus:border-[var(--hemma-blue)] ${
    hasError ? "border-red-400" : "border-[var(--hemma-sand-dark)]"
  }`;

const labelClass =
  "block text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-black)] mb-1.5";

export function FinancingLeadForm() {
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    let next = value;
    if (name === "firstName" || name === "lastName" || name === "address") next = capitalizeName(value);
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
    const fullName = `${form.firstName} ${form.lastName}`.trim();
    const result = await submitLead({
      source: "financing",
      name: fullName,
      email: form.email,
      phone: form.phone || undefined,
      address: form.address,
      message: form.comments || undefined,
      turnstileToken,
    });
    setSubmitting(false);
    if (!result.ok) {
      setBotError(result.error ?? "Something went wrong. Please try again.");
      return;
    }
    markConversionPending("financing");
    const qs = new URLSearchParams({ source: "financing" });
    if (fullName) qs.set("name", fullName);
    setLocation(`/thank-you?${qs.toString()}`);
  }

  return (
    <section className="py-10 md:py-14 lg:py-16 px-6 md:px-12 bg-[var(--hemma-light)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[var(--hemma-blue)] mb-3">
            Pre-Qualify
          </p>
          <h2 className="font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] font-light leading-[1.1] tracking-tight text-[var(--hemma-black)] mb-3">
            Financing your <em className="text-[var(--hemma-blue)]">ADU</em>.
          </h2>
          <p className="text-[14px] md:text-[15px] font-light leading-[1.7] text-[var(--hemma-mid)] max-w-[560px] mx-auto">
            Tell us a little about your property and we'll match you with a
            California ADU lender. No commitment — just a personalized look at
            what you'd qualify for.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          <div className="rounded-[6px] overflow-hidden bg-[var(--hemma-sand)] min-h-[320px] lg:min-h-0">
            <img
              src={lifestyleImg}
              alt="Homeowners reviewing plans for their backyard ADU"
              width={1280}
              height={896}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-[var(--hemma-white)] rounded-[6px] shadow-lg p-6 sm:p-8 md:p-10">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      First Name{" "}
                      <span className="text-[var(--hemma-blue)]">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className={inputClass(!!errors.firstName)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Last Name{" "}
                      <span className="text-[var(--hemma-blue)]">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      className={inputClass(!!errors.lastName)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
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
                    <label className={labelClass}>
                      Email{" "}
                      <span className="text-[var(--hemma-blue)]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className={inputClass(!!errors.email)}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Where is your ADU going?{" "}
                    <span className="text-[var(--hemma-blue)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Property address"
                    className={inputClass(!!errors.address)}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Additional Comments{" "}
                    <span className="font-light text-[var(--hemma-mid)] tracking-normal normal-case ml-1">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    name="comments"
                    value={form.comments}
                    onChange={handleChange}
                    rows={3}
                    className={`${inputClass()} resize-none`}
                  />
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
                  className="w-full inline-flex items-center justify-center gap-2 bg-[var(--hemma-blue)] text-white px-6 py-3.5 rounded-full font-medium text-[14px] hover:bg-[#003f7a] transition-colors border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                      Submitting…
                    </>
                  ) : (
                    "Submit your information"
                  )}
                </button>

                <p className="text-[11px] font-light leading-[1.6] text-[var(--hemma-mid)] text-center pt-1">
                  By submitting your information, you consent to receive
                  communication from Midcentury ADU via email and/or text. You can opt
                  out anytime.
                </p>
              </form>
          </div>
        </div>
      </div>
    </section>
  );
}
