import { useState, type FormEvent } from "react";
import { setAdminToken } from "./auth";

export function AdminLogin() {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: "auth-probe", size: 1, contentType: "text/plain" }),
      });
      if (res.status === 401) {
        setError("That token is incorrect.");
        return;
      }
      if (res.status === 503) {
        setError("Admin is locked: the ADMIN_TOKEN secret hasn't been set on the server yet.");
        return;
      }
      if (!res.ok) {
        setError(`Login check failed (${res.status})`);
        return;
      }
      setAdminToken(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--hemma-light)] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[400px] bg-white rounded-[6px] shadow-md p-8 flex flex-col gap-5"
      >
        <div>
          <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--hemma-blue)] mb-1">
            Midcentury ADU Admin
          </div>
          <h1 className="font-serif text-[28px] font-light leading-tight text-[var(--hemma-black)]">
            Sign in
          </h1>
          <p className="text-[13px] text-[var(--hemma-mid)] font-light mt-1">
            Enter your admin token to manage floor plans, photos, and product lists.
          </p>
        </div>

        <div>
          <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-black)] mb-1.5">
            Admin Token
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoFocus
            className="w-full px-4 py-3 rounded-[3px] border border-[var(--hemma-sand-dark)] text-[14px] bg-[var(--hemma-light)] outline-none focus:border-[var(--hemma-blue)]"
            placeholder="••••••••••••"
          />
        </div>

        {error && (
          <p className="text-[12px] text-red-500 leading-snug">{error}</p>
        )}

        <button
          type="submit"
          disabled={busy || !token}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
