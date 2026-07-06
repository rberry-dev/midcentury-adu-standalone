import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { clearAdminToken } from "./auth";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const navItems: { href: string; label: string; match: (p: string) => boolean }[] = [
    {
      href: "/admin",
      label: "Floor Plans",
      match: (p) => p === "/admin" || p.startsWith("/admin/models"),
    },
    {
      href: "/admin/leads",
      label: "Leads",
      match: (p) => p.startsWith("/admin/leads"),
    },
    {
      href: "/admin/posts",
      label: "Posts",
      match: (p) => p.startsWith("/admin/posts"),
    },
    {
      href: "/admin/availability",
      label: "Availability",
      match: (p) => p.startsWith("/admin/availability"),
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--hemma-light)]">
      <header className="bg-white border-b border-[var(--hemma-sand-dark)]">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin">
              <a className="flex items-baseline gap-2">
                <span className="font-serif text-[20px] tracking-tight text-[var(--hemma-black)]">
                  MIDCENTURY
                </span>
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--hemma-blue)]">
                  Admin
                </span>
              </a>
            </Link>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const active = item.match(location);
                return (
                  <Link key={item.href} href={item.href}>
                    <a
                      className={`text-[12px] font-medium px-3 py-1.5 rounded-[3px] no-underline transition-colors ${
                        active
                          ? "bg-[var(--hemma-blue)] text-white"
                          : "text-[var(--hemma-mid)] hover:text-[var(--hemma-black)] hover:bg-[var(--hemma-light)]"
                      }`}
                    >
                      {item.label}
                    </a>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-[12px]">
            <Link href="/">
              <a className="text-[var(--hemma-mid)] hover:text-[var(--hemma-black)]">
                View site →
              </a>
            </Link>
            <button
              onClick={() => clearAdminToken()}
              className="text-[var(--hemma-mid)] hover:text-[var(--hemma-black)] bg-transparent border-none cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-[1200px] mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
