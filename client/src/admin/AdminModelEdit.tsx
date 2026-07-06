import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from "react";
import { Link, useLocation } from "wouter";
import {
  useGetModel,
  getGetModelQueryKey,
  getListModelsQueryKey,
  updateModel,
  addModelImage,
  deleteModelImage,
  addIncludedProduct,
  deleteIncludedProduct,
  useQueryClient,
  type Model,
  type ModelImageKind,
} from "@/lib/api";
import { uploadFile } from "./uploadFile";

interface Props {
  id: number;
}

const KIND_OPTIONS: ModelImageKind[] = ["hero", "gallery", "floorplan"];

export function AdminModelEdit({ id }: Props) {
  const qc = useQueryClient();
  const [, navigate] = useLocation();
  const { data: model, isLoading, error, refetch } = useGetModel(id);

  if (isLoading) return <p className="text-[14px] text-[var(--hemma-mid)]">Loading…</p>;
  if (error || !model) return (
    <p className="text-[14px] text-red-500">
      Couldn't load model. <Link href="/admin"><a className="underline">Back to list</a></Link>
    </p>
  );

  function invalidate() {
    qc.invalidateQueries({ queryKey: getGetModelQueryKey(id) });
    qc.invalidateQueries({ queryKey: getListModelsQueryKey() });
    refetch();
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin"><a className="text-[12px] text-[var(--hemma-mid)] hover:text-[var(--hemma-black)]">← All models</a></Link>
        <div className="flex items-end justify-between mt-2">
          <div>
            <h1 className="font-serif text-[32px] font-light text-[var(--hemma-black)]">{model.name}</h1>
            <p className="text-[13px] text-[var(--hemma-mid)] font-light">
              <span className="font-mono">{model.slug}</span> · {model.sf} SF · {model.type}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DetailsForm model={model} onSaved={invalidate} />
        <ImagesPanel model={model} onChanged={invalidate} />
      </div>

      <div className="mt-10">
        <ProductsPanel model={model} onChanged={invalidate} />
      </div>
    </div>
  );
}

// ---------- Details ----------

function DetailsForm({ model, onSaved }: { model: Model; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: model.name,
    slug: model.slug,
    type: model.type,
    sf: model.sf,
    badge: model.badge,
    badgeBg: model.badgeBg,
    badgeColor: model.badgeColor,
    scenario: model.scenario,
    tagline: model.tagline,
    beds: model.beds,
    baths: model.baths,
    stories: model.stories,
    priceDollars: Math.round(model.priceCents / 100),
    furnishingDollars: Math.round(model.furnishingPriceCents / 100),
    description: model.description,
    sortOrder: model.sortOrder,
    isPublished: model.isPublished,
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await updateModel(model.id, {
        name: form.name,
        slug: form.slug,
        type: form.type,
        sf: Number(form.sf),
        badge: form.badge,
        badgeBg: form.badgeBg,
        badgeColor: form.badgeColor,
        scenario: form.scenario,
        tagline: form.tagline,
        beds: form.beds,
        baths: Number(form.baths),
        stories: Number(form.stories),
        priceCents: Math.round(Number(form.priceDollars) * 100),
        furnishingPriceCents: Math.round(Number(form.furnishingDollars) * 100),
        description: form.description,
        sortOrder: Number(form.sortOrder),
        isPublished: form.isPublished,
      });
      setMsg("Saved.");
      onSaved();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="bg-white rounded-[6px] border border-[var(--hemma-sand-dark)] p-6">
      <h2 className="font-serif text-[20px] font-light text-[var(--hemma-black)] mb-5">Details</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
        <Field label="Name"><Text value={form.name} onChange={(v) => setForm({ ...form, name: v })} /></Field>
        <Field label="Slug"><Text value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} /></Field>
        <Field label="Type"><Text value={form.type} onChange={(v) => setForm({ ...form, type: v })} /></Field>
        <Field label="Square feet"><Text value={String(form.sf)} onChange={(v) => setForm({ ...form, sf: Number(v) })} /></Field>
        <Field label="Beds (number or text)"><Text value={String(form.beds)} onChange={(v) => setForm({ ...form, beds: v })} /></Field>
        <Field label="Baths"><Text value={String(form.baths)} onChange={(v) => setForm({ ...form, baths: Number(v) })} /></Field>
        <Field label="Stories"><Text value={String(form.stories)} onChange={(v) => setForm({ ...form, stories: Number(v) })} /></Field>
        <Field label="Sort order"><Text value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: Number(v) })} /></Field>
        <Field label="Price (USD)"><Text value={String(form.priceDollars)} onChange={(v) => setForm({ ...form, priceDollars: Number(v) })} /></Field>
        <Field label="Furnishing (USD)"><Text value={String(form.furnishingDollars)} onChange={(v) => setForm({ ...form, furnishingDollars: Number(v) })} /></Field>
        <Field label="Badge text"><Text value={form.badge} onChange={(v) => setForm({ ...form, badge: v })} /></Field>
        <Field label="Scenario"><Text value={form.scenario} onChange={(v) => setForm({ ...form, scenario: v })} /></Field>
        <Field label="Badge background">
          <input type="color" value={form.badgeBg} onChange={(e) => setForm({ ...form, badgeBg: e.target.value })} className="h-10 w-full rounded border border-[var(--hemma-sand-dark)]" />
        </Field>
        <Field label="Badge text color">
          <input type="color" value={form.badgeColor} onChange={(e) => setForm({ ...form, badgeColor: e.target.value })} className="h-10 w-full rounded border border-[var(--hemma-sand-dark)]" />
        </Field>
        <Field label="Tagline" full><Text value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} /></Field>
        <Field label="Description" full>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className={textBase} />
        </Field>
        <Field label="" full>
          <label className="flex items-center gap-2 text-[13px]">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            Published (visible on the live site)
          </label>
        </Field>
        <div className="col-span-2 flex items-center justify-between mt-2">
          <span className="text-[12px] text-[var(--hemma-mid)]">{msg}</span>
          <button type="submit" disabled={busy} className="btn-primary disabled:opacity-50">{busy ? "Saving…" : "Save details"}</button>
        </div>
      </form>
    </section>
  );
}

const textBase = "w-full px-3 py-2 rounded-[3px] border border-[var(--hemma-sand-dark)] text-[14px] bg-[var(--hemma-light)] outline-none focus:border-[var(--hemma-blue)]";
function Text({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={textBase} />;
}
function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      {label && <label className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)] mb-1">{label}</label>}
      {children}
    </div>
  );
}

// ---------- Images ----------

function ImagesPanel({ model, onChanged }: { model: Model; onChanged: () => void }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<ModelImageKind>("gallery");
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onPickFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMsg(null);
    try {
      const { publicUrl } = await uploadFile(file);
      const sortOrder = (model.images[model.images.length - 1]?.sortOrder ?? -1) + 1;
      await addModelImage(model.id, {
        url: publicUrl,
        kind,
        alt: alt || file.name,
        sortOrder,
      });
      setAlt("");
      onChanged();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function onDelete(imageId: number) {
    if (!confirm("Delete this image?")) return;
    try {
      await deleteModelImage(imageId);
      onChanged();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <section className="bg-white rounded-[6px] border border-[var(--hemma-sand-dark)] p-6">
      <h2 className="font-serif text-[20px] font-light text-[var(--hemma-black)] mb-5">Photos & plans</h2>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="col-span-1">
          <label className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)] mb-1">Kind</label>
          <select value={kind} onChange={(e) => setKind(e.target.value as ModelImageKind)} className={textBase}>
            {KIND_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)] mb-1">Alt text (optional)</label>
          <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image" className={textBase} />
        </div>
        <div className="col-span-3">
          <label className="block">
            <input ref={fileInput} type="file" accept="image/*" onChange={onPickFile} disabled={busy} className="hidden" />
            <span className="btn-primary inline-block cursor-pointer text-center disabled:opacity-50">
              {busy ? "Uploading…" : "Upload image"}
            </span>
          </label>
          {msg && <p className="text-[12px] text-red-500 mt-2">{msg}</p>}
        </div>
      </div>

      {model.images.length === 0 ? (
        <p className="text-[13px] text-[var(--hemma-mid)] italic">No images yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3">
          {model.images.map((img) => (
            <li key={img.id} className="border border-[var(--hemma-sand-dark)] rounded-[4px] overflow-hidden flex flex-col">
              <div className="aspect-[4/3] bg-[var(--hemma-light)] flex items-center justify-center">
                <img src={img.url} alt={img.alt ?? ""} className="w-full h-full object-cover" />
              </div>
              <div className="p-2 flex items-center justify-between text-[11px]">
                <span className="text-[var(--hemma-mid)]"><span className="font-semibold uppercase tracking-wider">{img.kind}</span> · #{img.sortOrder}</span>
                <button onClick={() => onDelete(img.id)} className="text-red-500 bg-transparent border-none cursor-pointer">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ---------- Products ----------

function ProductsPanel({ model, onChanged }: { model: Model; onChanged: () => void }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    if (!name || !url) return;
    setBusy(true);
    setMsg(null);
    try {
      const sortOrder = (model.products[model.products.length - 1]?.sortOrder ?? -1) + 1;
      await addIncludedProduct(model.id, {
        name,
        url,
        category: category || null,
        sortOrder,
      });
      setName(""); setUrl(""); setCategory("");
      onChanged();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Add failed");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(pid: number) {
    if (!confirm("Remove this product?")) return;
    try {
      await deleteIncludedProduct(pid);
      onChanged();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <section className="bg-white rounded-[6px] border border-[var(--hemma-sand-dark)] p-6">
      <h2 className="font-serif text-[20px] font-light text-[var(--hemma-black)] mb-5">Included products</h2>

      <form onSubmit={onAdd} className="grid grid-cols-12 gap-3 mb-6">
        <div className="col-span-4"><label className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)] mb-1">Name</label><Text value={name} onChange={setName} /></div>
        <div className="col-span-5"><label className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)] mb-1">URL</label><Text value={url} onChange={setUrl} /></div>
        <div className="col-span-2"><label className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)] mb-1">Category</label><Text value={category} onChange={setCategory} /></div>
        <div className="col-span-1 flex items-end"><button type="submit" disabled={busy || !name || !url} className="btn-primary w-full disabled:opacity-50">Add</button></div>
        {msg && <p className="col-span-12 text-[12px] text-red-500">{msg}</p>}
      </form>

      {model.products.length === 0 ? (
        <p className="text-[13px] text-[var(--hemma-mid)] italic">No products yet.</p>
      ) : (
        <ul className="divide-y divide-[var(--hemma-sand-dark)]">
          {model.products.map((p) => (
            <li key={p.id} className="py-3 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-[var(--hemma-black)] truncate">{p.name}</div>
                <a href={p.url} target="_blank" rel="noreferrer" className="text-[12px] text-[var(--hemma-blue)] truncate block">{p.url}</a>
              </div>
              {p.category && <span className="text-[11px] uppercase tracking-wider text-[var(--hemma-mid)] bg-[var(--hemma-light)] px-2 py-1 rounded">{p.category}</span>}
              <button onClick={() => onDelete(p.id)} className="text-[12px] text-red-500 bg-transparent border-none cursor-pointer">Remove</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
