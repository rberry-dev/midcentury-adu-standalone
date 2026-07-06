import { Link } from "wouter";
import { useListModels } from "@/lib/api";

export function AdminModelsList() {
  const { data, isLoading, error } = useListModels();

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-serif text-[32px] font-light text-[var(--hemma-black)]">
            Floor Plan Models
          </h1>
          <p className="text-[13px] text-[var(--hemma-mid)] font-light mt-1">
            Click a model to edit its details, photos, and included products.
          </p>
        </div>
      </div>

      {isLoading && (
        <p className="text-[14px] text-[var(--hemma-mid)]">Loading models…</p>
      )}
      {error && (
        <p className="text-[14px] text-red-500">Failed to load models.</p>
      )}

      {data && (
        <div className="bg-white rounded-[6px] border border-[var(--hemma-sand-dark)] overflow-hidden">
          <table className="w-full text-[14px]">
            <thead className="bg-[var(--hemma-light)] text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)]">
              <tr>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Slug</th>
                <th className="text-left px-5 py-3">Type</th>
                <th className="text-right px-5 py-3">SF</th>
                <th className="text-right px-5 py-3">Price</th>
                <th className="text-right px-5 py-3">Photos</th>
                <th className="text-right px-5 py-3">Products</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {data.map((m) => (
                <tr
                  key={m.id}
                  className="border-t border-[var(--hemma-sand-dark)]"
                >
                  <td className="px-5 py-3 font-medium text-[var(--hemma-black)]">
                    {m.name}
                  </td>
                  <td className="px-5 py-3 font-mono text-[12px] text-[var(--hemma-mid)]">
                    {m.slug}
                  </td>
                  <td className="px-5 py-3 text-[var(--hemma-mid)]">{m.type}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{m.sf}</td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    ${(m.priceCents / 100).toLocaleString("en-US")}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-[var(--hemma-mid)]">
                    {m.images.length}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-[var(--hemma-mid)]">
                    {m.products.length}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/admin/models/${m.id}`}>
                      <a className="text-[var(--hemma-blue)] font-medium">Edit →</a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
