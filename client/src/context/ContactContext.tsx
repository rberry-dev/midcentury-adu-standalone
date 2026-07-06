import { createContext, useContext, useState, ReactNode } from "react";
import { ContactModal } from "@/components/ContactModal";

interface ContactContextValue {
  openContact: (modelId?: string) => void;
}

const ContactContext = createContext<ContactContextValue | null>(null);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState<string | undefined>(undefined);

  const openContact = (modelId?: string) => {
    setModel(modelId);
    setOpen(true);
  };

  return (
    <ContactContext.Provider value={{ openContact }}>
      {children}
      <ContactModal
        open={open}
        onClose={() => setOpen(false)}
        preselectedModel={model}
      />
    </ContactContext.Provider>
  );
}

export function useContact() {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error("useContact must be used within ContactProvider");
  return ctx;
}
