import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { useSeo } from "@/lib/seo";
import { useContact } from "@/context/ContactContext";
import {
  CONFIG_SECTIONS,
  LAYOUT_PRICING,
  computePrice,
  decodeStateFromParams,
  encodeStateToParams,
  findOption,
  formatPrice,
  getDefaultConfig,
  type ConfigState,
  type ConfiguratorGroup,
  type ConfiguratorOption,
} from "@/data/configurator";

export default function ConfigurePage() {
  useSeo({
    title: "Design your ADU — configure layout, finishes, and upgrades",
    description:
      "Customize every detail of your ADU — layout, cladding, roof, windows, solar, finishes, and upgrades. See your price update as you go.",
    path: "/configure",
  });

  const { openContact } = useContact();

  const [state, setState] = useState<ConfigState>(() => {
    if (typeof window === "undefined") return getDefaultConfig();
    const params = new URLSearchParams(window.location.search);
    return decodeStateFromParams(params);
  });

  // Sync state -> URL (replaceState so back button isn't polluted)
  useEffect(() => {
    const params = encodeStateToParams(state);
    const qs = params.toString();
    const url = qs
      ? `${window.location.pathname}?${qs}`
      : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [state]);

  const price = useMemo(() => computePrice(state), [state]);

  const layoutId = state.single["layout"] ?? "fristad";
  const previewImage =
    LAYOUT_PRICING[layoutId]?.previewImage ?? LAYOUT_PRICING["fristad"].previewImage;

  function selectSingle(groupId: string, optionId: string) {
    setState((s) => ({ ...s, single: { ...s.single, [groupId]: optionId } }));
  }

  function toggleMulti(groupId: string, optionId: string) {
    setState((s) => {
      const current = s.multi[groupId] ?? [];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...s, multi: { ...s.multi, [groupId]: next } };
    });
  }

  const [linkCopied, setLinkCopied] = useState(false);
  function copyLink() {
    void navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch(() => {
        /* noop */
      });
  }

  function resetConfig() {
    setState(getDefaultConfig());
  }

  return (
    <Layout>
      <section className="bg-[var(--hemma-white)] pt-12 md:pt-16 pb-6 px-6 md:px-12">
        <div className="max-w-[1280px] mx-auto">
          <Link
            href="/floor-plans"
            className="inline-block text-[13px] font-semibold tracking-[0.16em] uppercase text-[var(--hemma-mid)] hover:text-[var(--hemma-black)] mb-4 no-underline"
          >
            ← Back to floor plans
          </Link>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="font-serif font-light text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] text-[var(--hemma-black)] tracking-tight">
                Design your ADU.
              </h1>
              <p className="mt-3 text-[15px] md:text-[16px] font-light leading-[1.6] text-[var(--hemma-mid)] max-w-[560px]">
                Make it yours. From layout to cladding and solar to finishes,
                every detail is up to you.
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[var(--hemma-mid)]">
                Your configuration
              </p>
              <p className="mt-1 font-serif text-[28px] md:text-[34px] font-light text-[var(--hemma-black)] leading-none">
                {formatPrice(price.total)}
                <span className="text-[13px] tracking-normal text-[var(--hemma-mid)] font-sans font-light ml-2">
                  plus installation
                </span>
              </p>
              <p className="mt-1 text-[12px] font-light text-[var(--hemma-mid)]">
                Financing options available.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--hemma-white)] px-6 md:px-12 pb-32">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] gap-10 lg:gap-14">
          {/* Sticky preview */}
          <div className="lg:sticky lg:top-[120px] lg:self-start">
            <div className="aspect-[4/3] rounded-[10px] overflow-hidden bg-[var(--hemma-light)]">
              <img
                src={previewImage}
                alt="ADU configuration preview"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[var(--hemma-mid)] text-center">
              Preview updates with your layout
            </p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-12">
            {CONFIG_SECTIONS.map((section, sIdx) => (
              <div key={section.id}>
                {sIdx > 0 && (
                  <div className="mb-10 border-t border-black/10" />
                )}
                <h2 className="font-serif text-[22px] md:text-[26px] font-light text-[var(--hemma-black)] mb-6">
                  {section.title}
                </h2>
                <div className="flex flex-col gap-10">
                  {section.groups.map((group) => (
                    <GroupBlock
                      key={group.id}
                      group={group}
                      state={state}
                      onSelectSingle={selectSingle}
                      onToggleMulti={toggleMulti}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Price breakdown */}
            <div>
              <div className="border-t border-black/10 mb-8" />
              <h2 className="font-serif text-[22px] md:text-[26px] font-light text-[var(--hemma-black)] mb-6">
                Price breakdown
              </h2>
              <div className="rounded-[10px] bg-[var(--hemma-light)] p-6 md:p-8">
                <div className="flex justify-between items-baseline pb-3 border-b border-black/10">
                  <span className="text-[14px] text-[var(--hemma-black)] font-medium">
                    {price.baseLabel} (base)
                  </span>
                  <span className="text-[14px] text-[var(--hemma-black)] tabular-nums">
                    {formatPrice(price.basePrice)}
                  </span>
                </div>
                {price.upgrades.length > 0 ? (
                  <div className="py-3 border-b border-black/10 flex flex-col gap-2">
                    {price.upgrades.map((u, i) => (
                      <div
                        key={`${u.groupId}-${i}`}
                        className="flex justify-between items-baseline text-[13px] text-[var(--hemma-mid)]"
                      >
                        <span>{u.optionLabel}</span>
                        <span className="tabular-nums">
                          {u.delta === 0 ? "Free" : `+${formatPrice(u.delta)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-3 border-b border-black/10 text-[13px] text-[var(--hemma-mid)] italic">
                    No upgrades selected.
                  </p>
                )}
                <div className="pt-4 flex justify-between items-baseline">
                  <span className="text-[14px] font-semibold uppercase tracking-[0.1em] text-[var(--hemma-black)]">
                    Unit as configured
                  </span>
                  <span className="font-serif text-[24px] font-light text-[var(--hemma-black)] tabular-nums">
                    {formatPrice(price.total)}
                  </span>
                </div>
                <p className="mt-1 text-right text-[11px] text-[var(--hemma-mid)]">
                  plus installation
                </p>
              </div>
            </div>

            {/* Save / talk / continue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-[10px] border border-black/10 p-6">
                <h3 className="font-serif text-[18px] font-light text-[var(--hemma-black)] mb-1">
                  Need a break?
                </h3>
                <p className="text-[13px] text-[var(--hemma-mid)] font-light leading-[1.6] mb-4">
                  Save your configuration link and come back at any time.
                </p>
                <button
                  type="button"
                  onClick={copyLink}
                  className="w-full text-[13px] font-semibold tracking-[0.1em] uppercase border border-[var(--hemma-black)] rounded-full py-2.5 hover:bg-[var(--hemma-black)] hover:text-white transition-colors"
                >
                  {linkCopied ? "Link copied" : "Copy configuration link"}
                </button>
              </div>
              <div className="rounded-[10px] border border-black/10 p-6">
                <h3 className="font-serif text-[18px] font-light text-[var(--hemma-black)] mb-1">
                  Have questions?
                </h3>
                <p className="text-[13px] text-[var(--hemma-mid)] font-light leading-[1.6] mb-4">
                  Talk to one of our experts to get answers or support.
                </p>
                <button
                  type="button"
                  onClick={() => openContact()}
                  className="w-full text-[13px] font-semibold tracking-[0.1em] uppercase border border-[var(--hemma-black)] rounded-full py-2.5 hover:bg-[var(--hemma-black)] hover:text-white transition-colors"
                >
                  Talk to us
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={resetConfig}
                className="text-[12px] font-semibold tracking-[0.16em] uppercase text-[var(--hemma-mid)] hover:text-[var(--hemma-black)]"
              >
                Reset configuration
              </button>
              <button
                type="button"
                onClick={() => openContact()}
                className="btn-primary w-full sm:w-auto"
              >
                Continue →
              </button>
            </div>

            <p className="text-[11px] text-[var(--hemma-mid)] font-light leading-[1.6]">
              ¹ Net zero may change for build sites with significant shading.
            </p>
          </div>
        </div>
      </section>

      {/* Mobile sticky price bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-black/10 px-5 py-3 flex items-center justify-between shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--hemma-mid)]">
            Your configuration
          </p>
          <p className="font-serif text-[20px] font-light text-[var(--hemma-black)] leading-none">
            {formatPrice(price.total)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => openContact()}
          className="btn-primary py-2 px-5 text-[13px]"
        >
          Continue
        </button>
      </div>
    </Layout>
  );
}

interface GroupBlockProps {
  group: ConfiguratorGroup;
  state: ConfigState;
  onSelectSingle: (groupId: string, optionId: string) => void;
  onToggleMulti: (groupId: string, optionId: string) => void;
}

function GroupBlock({ group, state, onSelectSingle, onToggleMulti }: GroupBlockProps) {
  const isMulti = group.type === "multi";
  const selectedSingle = state.single[group.id];
  const selectedMulti = state.multi[group.id] ?? [];

  return (
    <div>
      <h3 className="font-serif text-[18px] md:text-[20px] font-light text-[var(--hemma-black)]">
        {group.title}
      </h3>
      {group.description && (
        <p className="mt-1 text-[13px] text-[var(--hemma-mid)] font-light leading-[1.6]">
          {group.description}
        </p>
      )}
      <div
        className={`mt-4 grid gap-3 ${
          group.options.length > 3
            ? "grid-cols-2 sm:grid-cols-3"
            : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {group.options.map((opt) => {
          const isSelected = isMulti
            ? selectedMulti.includes(opt.id)
            : selectedSingle === opt.id;
          return (
            <OptionCard
              key={opt.id}
              option={opt}
              selected={isSelected}
              onClick={() =>
                isMulti
                  ? onToggleMulti(group.id, opt.id)
                  : onSelectSingle(group.id, opt.id)
              }
            />
          );
        })}
      </div>
      {!isMulti && (
        <SelectedDescription group={group} optionId={selectedSingle} />
      )}
    </div>
  );
}

interface OptionCardProps {
  option: ConfiguratorOption;
  selected: boolean;
  onClick: () => void;
}

function OptionCard({ option, selected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`text-left rounded-[8px] border-2 p-4 transition-colors ${
        selected
          ? "border-[var(--hemma-black)] bg-white"
          : "border-black/10 bg-white hover:border-black/30"
      }`}
    >
      {option.imageUrl ? (
        <div className="w-full aspect-[4/3] rounded-[4px] mb-3 overflow-hidden border border-black/5 bg-[var(--hemma-light)]">
          <img
            src={option.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      ) : option.swatchColor ? (
        <div
          className="w-full aspect-[4/3] rounded-[4px] mb-3 border border-dashed border-black/15 flex items-center justify-center"
          style={{ background: option.swatchColor }}
          aria-hidden="true"
        >
          <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--hemma-mid)] mix-blend-difference">
            Custom
          </span>
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-[var(--hemma-black)] leading-[1.3]">
            {option.label}
          </p>
          {option.sublabel && (
            <p className="mt-0.5 text-[12px] text-[var(--hemma-mid)] font-light leading-[1.4]">
              {option.sublabel}
            </p>
          )}
          {option.bullets && option.bullets.length > 0 && (
            <ul className="mt-2 text-[11.5px] text-[var(--hemma-mid)] font-light leading-[1.5] list-disc pl-4 space-y-0.5">
              {option.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </div>
        {(option.priceDelta ?? 0) > 0 && (
          <span className="shrink-0 text-[11px] font-semibold tracking-[0.06em] uppercase text-[var(--hemma-blue)] tabular-nums">
            +${option.priceDelta!.toLocaleString("en-US")}
          </span>
        )}
        {option.priceDelta === 0 && (
          <span className="shrink-0 text-[11px] font-semibold tracking-[0.06em] uppercase text-[var(--hemma-mid)]">
            Free
          </span>
        )}
      </div>
    </button>
  );
}

function SelectedDescription({
  group,
  optionId,
}: {
  group: ConfiguratorGroup;
  optionId: string | undefined;
}) {
  if (!optionId) return null;
  const opt = findOption(group, optionId);
  if (!opt?.description) return null;
  return (
    <p className="mt-3 text-[12.5px] text-[var(--hemma-mid)] font-light leading-[1.6]">
      <span className="font-medium text-[var(--hemma-black)]">{opt.label}.</span>{" "}
      {opt.description}
    </p>
  );
}
