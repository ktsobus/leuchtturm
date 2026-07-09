"use client";

import { useState } from "react";
import { FallbackImage } from "./fallback-image";

const ROWS = [
  {
    title: "World building",
    desc: "Maps, color scripts and elevation studies that make a place feel lived in before a single shot exists.",
    src: "/generated/cap-worlds.webp",
    seed: "leuchtturm-worldbuilding",
    localFallback: "/stills/still_0_5.webp",
  },
  {
    title: "Animation & motion",
    desc: "Frame-by-frame gouache animation, from wave studies to full sequences, timed by hand.",
    src: "/generated/cap-motion.webp",
    seed: "leuchtturm-animation",
    localFallback: "/stills/still_2_5.webp",
  },
  {
    title: "Story & direction",
    desc: "Boards, camera grammar and pacing that carry a viewer from wide sky to stone pier.",
    src: "/generated/cap-story.webp",
    seed: "leuchtturm-storyboards",
    localFallback: "/stills/still_8_5.webp",
  },
];

export function Capabilities() {
  const [active, setActive] = useState(0);

  return (
    <section className="border-y border-line py-32 md:py-44">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-6 md:px-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="text-4xl font-medium tracking-tighter md:text-5xl">
            What the studio does
          </h2>
          <ul className="mt-12">
            {ROWS.map((row, i) => (
              <li key={row.title} className="border-t border-line last:border-b">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`block w-full py-8 text-left transition-colors ${
                    active === i ? "text-fog" : "text-fog-dim"
                  }`}
                >
                  <span className="text-3xl font-medium tracking-tighter md:text-4xl">
                    {row.title}
                  </span>
                  <span className="mt-3 block max-w-lg text-base leading-relaxed text-fog-dim">
                    {row.desc}
                  </span>
                </button>
                {/* Mobile: show the row's image inline, since there is no hover */}
                <div className="pb-8 lg:hidden">
                  <FallbackImage
                    src={row.src}
                    fallbackSeed={row.seed}
                    alt={`${row.title} production art`}
                    width={1200}
                    height={675}
                    localFallback={row.localFallback}
                    className="aspect-video w-full object-cover"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative hidden lg:col-span-5 lg:block">
          <div className="sticky top-28 aspect-video overflow-hidden bg-ink-2">
            {ROWS.map((row, i) => (
              <div
                key={row.title}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  active === i ? "opacity-100" : "opacity-0"
                }`}
              >
                <FallbackImage
                  src={row.src}
                  fallbackSeed={row.seed}
                  alt={`${row.title} production art`}
                  width={1200}
                  height={675}
                  localFallback={row.localFallback}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
