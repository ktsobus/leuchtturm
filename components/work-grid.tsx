"use client";

import { motion, useReducedMotion } from "motion/react";
import { FallbackImage } from "./fallback-image";

type Project = {
  title: string;
  kind: string;
  src: string;
  seed: string;
  width: number;
  height: number;
  localFallback?: string;
  /* masonry placement */
  className: string;
};

const PROJECTS: Project[] = [
  {
    title: "The Keeper's Island",
    kind: "Short film, 2026",
    src: "/stills/still_0_5.webp",
    seed: "leuchtturm-island",
    width: 1280,
    height: 720,
    className: "md:col-span-7",
  },
  {
    title: "Harbor of Ebbe",
    kind: "Short film, 2025",
    src: "/generated/work-harbor.webp",
    seed: "leuchtturm-harbor-dusk",
    width: 1200,
    height: 800,
    localFallback: "/stills/still_6_5.webp",
    className: "md:col-span-5 md:mt-24",
  },
  {
    title: "Viaduct Nord",
    kind: "Music video, 2025",
    src: "/generated/work-skytrain.webp",
    seed: "leuchtturm-night-train",
    width: 800,
    height: 1000,
    localFallback: "/stills/still_8_5.webp",
    className: "md:col-span-4 md:mt-8",
  },
  {
    title: "The Quiet Dome",
    kind: "Title sequence, 2024",
    src: "/generated/work-observatory.webp",
    seed: "leuchtturm-observatory",
    width: 1200,
    height: 800,
    localFallback: "/stills/still_9_8.webp",
    className: "md:col-span-8 md:mt-32",
  },
  {
    title: "Lantern Market",
    kind: "Short film, 2024",
    src: "/generated/work-market.webp",
    seed: "leuchtturm-cave-market",
    width: 800,
    height: 1000,
    localFallback: "/stills/still_4_5.webp",
    className: "md:col-span-5 md:col-start-4 md:-mt-10",
  },
];

export function WorkGrid() {
  const reduce = useReducedMotion();
  return (
    <section id="work" className="py-32 md:py-44">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <p className="text-[11px] uppercase tracking-[0.2em] text-fog-dim">
          Selected work
        </p>
        <h2 className="mt-4 text-4xl font-medium tracking-tighter md:text-5xl">
          Five worlds, so far.
        </h2>
        <div className="mt-16 grid grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-8">
          {PROJECTS.map((p, i) => (
            <motion.figure
              key={p.title}
              className={`group ${p.className}`}
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.7,
                delay: (i % 2) * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="overflow-hidden bg-ink-2">
                <FallbackImage
                  src={p.src}
                  fallbackSeed={p.seed}
                  alt={`${p.title}, hand-painted animation still`}
                  width={p.width}
                  height={p.height}
                  localFallback={p.localFallback}
                  className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                <span className="text-lg tracking-tight">{p.title}</span>
                <span className="text-sm text-fog-dim">{p.kind}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
