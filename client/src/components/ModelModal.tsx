import React, { useEffect } from "react";
import { type Model } from "@/data/models";
import { floorPlanSvgs } from "@/data/floorPlanSvgs";
import { configuratorLayoutForModel } from "@/data/configurator";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModelModalProps {
  model: Model | null;
  onClose: () => void;
  onContactOpen: (modelId?: string) => void;
}

export function ModelModal({ model, onClose, onContactOpen }: ModelModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (model) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [model, onClose]);

  if (!model) return null;

  const SvgComponent = floorPlanSvgs[model.id];
  const hero = model.images.find((img) => img.kind === "hero");
  const floorplan = model.images.find((img) => img.kind === "floorplan");
  const gallery = model.images.filter((img) => img.kind === "gallery");

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          className="relative bg-[var(--hemma-white)] rounded-[8px] w-full max-w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        >
          <div className="sticky top-0 bg-[var(--hemma-white)]/90 backdrop-blur-md border-b border-black/5 p-4 md:p-6 md:px-10 flex items-center justify-between z-20 gap-3">
            <div className="min-w-0">
              <h2 className="font-serif text-[22px] md:text-[32px] font-light leading-none text-[var(--hemma-black)] truncate">{model.name}</h2>
              <p className="text-[13px] italic text-[var(--hemma-blue)] mt-1">{model.tagline}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 flex-shrink-0 text-[var(--hemma-mid)] hover:text-[var(--hemma-black)] transition-colors bg-transparent border-none cursor-pointer"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          <div className="p-4 md:p-10 flex-1">
            <div className="bg-[var(--hemma-light)] rounded-[4px] mb-6 md:mb-8 flex items-center justify-center aspect-[4/3] md:aspect-video relative overflow-hidden">
              <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-[3px] shadow-sm z-10">
                <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--hemma-blue)] block">{model.badge}</span>
              </div>
              <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-[3px] shadow-sm text-center z-10">
                <span className="font-serif text-xl text-[var(--hemma-black)]">{model.price}</span>
              </div>
              {hero ? (
                <img
                  src={hero.url}
                  alt={hero.alt ?? `${model.name} exterior`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full max-w-[500px] p-4 md:p-12">
                  {SvgComponent && <SvgComponent />}
                </div>
              )}
            </div>

            {floorplan && (
              <a
                href={floorplan.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-[4px] mb-6 md:mb-8 overflow-hidden"
              >
                <img
                  src={floorplan.url}
                  alt={floorplan.alt ?? `${model.name} floor plan`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-contain"
                />
              </a>
            )}

            {gallery.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 md:mb-8">
                {gallery.map((g) => (
                  <a
                    key={g.id}
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-[var(--hemma-light)] rounded-[4px] aspect-[4/3] overflow-hidden"
                  >
                    <img src={g.url} alt={g.alt ?? `${model.name} gallery image`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-[var(--hemma-light)] rounded-[4px] p-4 text-center">
                <span className="font-serif text-2xl text-[var(--hemma-blue)] block">{model.beds}</span>
                <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[var(--hemma-mid)] mt-1 block">Beds</span>
              </div>
              <div className="bg-[var(--hemma-light)] rounded-[4px] p-4 text-center">
                <span className="font-serif text-2xl text-[var(--hemma-blue)] block">{model.baths}</span>
                <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[var(--hemma-mid)] mt-1 block">Baths</span>
              </div>
              <div className="bg-[var(--hemma-light)] rounded-[4px] p-4 text-center">
                <span className="font-serif text-2xl text-[var(--hemma-blue)] block">{model.sf}</span>
                <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[var(--hemma-mid)] mt-1 block">Sq Ft</span>
              </div>
              <div className="bg-[var(--hemma-light)] rounded-[4px] p-4 text-center">
                <span className="font-serif text-2xl text-[var(--hemma-blue)] block">{model.stories}</span>
                <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[var(--hemma-mid)] mt-1 block">Stories</span>
              </div>
            </div>


            <p className="text-[14px] font-light leading-[1.7] text-[var(--hemma-mid)] mb-10">
              {model.desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onContactOpen(model.id)}
                className="flex-1 bg-[var(--hemma-blue)] text-white px-6 py-3.5 rounded-full font-medium text-[14px] hover:bg-[#4a5d43] transition-colors border-none cursor-pointer"
              >
                Schedule a Call
              </button>
              <a
                href={`/configure?l=${configuratorLayoutForModel(model.id)}`}
                onClick={onClose}
                className="flex-1 bg-transparent border-2 border-[var(--hemma-sand-dark)] text-[var(--hemma-black)] px-6 py-3.5 rounded-full font-medium text-[14px] hover:border-[var(--hemma-black)] transition-colors cursor-pointer no-underline text-center inline-flex items-center justify-center"
              >
                Design Yours →
              </a>
              <a
                href="/financing"
                onClick={onClose}
                className="flex-1 bg-transparent border-2 border-[var(--hemma-sand-dark)] text-[var(--hemma-black)] px-6 py-3.5 rounded-full font-medium text-[14px] hover:border-[var(--hemma-black)] transition-colors cursor-pointer no-underline text-center inline-flex items-center justify-center"
              >
                Get Financing Info
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
