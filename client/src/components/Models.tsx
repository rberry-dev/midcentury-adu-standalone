import React, { useState } from "react";
import { useModels, type Model } from "@/data/models";
import { ModelCard } from "./ModelCard";
import { ModelModal } from "./ModelModal";
import { motion } from "framer-motion";

const FILTERS = [
  { label: "All Models", value: "all" },
  { label: "Studio", value: "studio" },
  { label: "1 Bedroom", value: "1bd" },
  { label: "2 Bedroom", value: "2bd" },
  { label: "3 Bedroom", value: "3bd" },
  { label: "Carriage", value: "carriage" },
  { label: "2-Story", value: "2story" },
];

interface ModelsProps {
  onContactOpen: (modelId?: string) => void;
}

export function Models({ onContactOpen }: ModelsProps) {
  const [filter, setFilter] = useState("all");
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const { models } = useModels();

  const filteredModels = filter === "all" ? models : models.filter((m) => m.type === filter);

  return (
    <section id="models" className="py-12 md:py-20 lg:py-24 px-6 md:px-12 bg-[var(--hemma-light)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="relative mb-10 md:mb-12 md:flex md:justify-end -mx-6 md:mx-0 px-6 md:px-0">
          <div
            className="flex md:flex-wrap gap-2 overflow-x-auto md:overflow-visible scrollbar-none pb-1 md:pb-0"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                aria-pressed={filter === f.value}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-[12px] font-medium tracking-[0.04em] transition-colors border-1.5 cursor-pointer ${
                  filter === f.value
                    ? "bg-[var(--hemma-blue)] text-white border-[var(--hemma-blue)]"
                    : "bg-transparent text-[var(--hemma-black)] border-[var(--hemma-sand-dark)] hover:border-[var(--hemma-black)]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--hemma-light)] to-transparent md:hidden" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {filteredModels.map((model) => (
            <motion.div
              key={model.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <ModelCard model={model} onClick={() => setSelectedModel(model)} />
            </motion.div>
          ))}
        </div>
      </div>

      <ModelModal
        model={selectedModel}
        onClose={() => setSelectedModel(null)}
        onContactOpen={(modelId) => {
          setSelectedModel(null);
          onContactOpen(modelId);
        }}
      />
    </section>
  );
}
