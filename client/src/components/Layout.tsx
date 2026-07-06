import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { useContact } from "@/context/ContactContext";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { openContact } = useContact();
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="w-full bg-[var(--hemma-white)] font-sans text-[var(--hemma-black)] selection:bg-[var(--hemma-blue)] selection:text-white">
      <Nav onContactOpen={() => openContact()} />
      <main className="pt-[100px]">{children}</main>
      <Footer />
    </div>
  );
}
