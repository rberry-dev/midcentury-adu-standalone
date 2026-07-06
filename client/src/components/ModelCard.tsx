import React from "react";
import { type Model } from "@/data/models";
import { floorPlanSvgs } from "@/data/floorPlanSvgs";
import { configuratorLayoutForModel } from "@/data/configurator";

interface ModelCardProps {
  model: Model;
  onClick: () => void;
}

export function ModelCard({ model, onClick }: ModelCardProps) {
  const SvgComponent = floorPlanSvgs[model.id];
  const hero = model.images.find((img) => img.kind === "hero");

  return (
    <div 
      className="bg-[var(--hemma-white)] rounded-[6px] overflow-hidden cursor-pointer relative group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-[var(--hemma-sand)]"
      onClick={onClick}
    >
      <div 
        className="absolute top-5 right-5 z-10 text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1.5 rounded-[2px]"
        style={{ background: model.badgeStyle.background, color: model.badgeStyle.color }}
      >
        {model.badge}
      </div>

      <div className="bg-[var(--hemma-light)] aspect-[16/10] flex items-center justify-center relative overflow-hidden">
        {hero ? (
          <img
            src={hero.url}
            alt={hero.alt ?? `${model.name} exterior`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="p-6 md:p-10 w-full h-full flex items-center justify-center">
            <div className="w-full max-w-[400px] h-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
              {SvgComponent && <SvgComponent />}
            </div>
          </div>
        )}
      </div>

      <div className="p-5 md:p-8">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="font-serif text-2xl text-[var(--hemma-black)]">{model.name}</h3>
          <span className="text-[13px] font-medium tracking-[0.04em] text-[var(--hemma-mid)]">{model.sf} SF</span>
        </div>
        <p className="text-[13px] font-normal italic text-[var(--hemma-blue)] mb-4">{model.tagline}</p>
        <p className="text-[14px] font-light leading-[1.7] text-[var(--hemma-mid)] mb-6 line-clamp-3">
          {model.desc}
        </p>

        <div className="flex border-y border-[var(--hemma-light)] mb-6 rounded-[3px] overflow-hidden divide-x divide-[var(--hemma-light)]">
          <div className="flex-1 py-3 text-center">
            <span className="block font-serif text-xl text-[var(--hemma-black)]">{model.beds}</span>
            <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)] mt-1">Bed</span>
          </div>
          <div className="flex-1 py-3 text-center">
            <span className="block font-serif text-xl text-[var(--hemma-black)]">{model.baths}</span>
            <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)] mt-1">Bath</span>
          </div>
          <div className="flex-1 py-3 text-center">
            <span className="block font-serif text-xl text-[var(--hemma-black)]">{model.sf}</span>
            <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)] mt-1">Sq Ft</span>
          </div>
          <div className="flex-1 py-3 text-center">
            <span className="block font-serif text-xl text-[var(--hemma-black)]">{model.stories}</span>
            <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--hemma-mid)] mt-1">Story</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="font-serif text-[20px] md:text-[22px] text-[var(--hemma-black)]">
            {model.price} <span className="font-sans text-[12px] md:text-[13px] text-[var(--hemma-mid)]">all-in</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/configure?l=${configuratorLayoutForModel(model.id)}`}
              onClick={(e) => e.stopPropagation()}
              className="border border-[var(--hemma-black)] text-[var(--hemma-black)] px-4 py-2.5 rounded-full text-[13px] font-medium transition-colors hover:bg-[var(--hemma-black)] hover:text-white no-underline"
            >
              Design Yours
            </a>
            <button className="bg-[var(--hemma-blue)] text-white px-5 py-2.5 rounded-full text-[13px] font-medium transition-colors hover:bg-[#4a5d43]">
              Explore Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
