"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ShapeDividerProps = {
  variant: "wave" | "perforation";
};

// Hand-drawn wave silhouettes, back to front. Irregular crest widths and
// asymmetric control points on purpose — no segment repeats or mirrors.
const WAVE_LAYERS = [
  {
    d: "M0,84 C46,64 108,58 176,70 C232,80 260,96 322,90 C398,83 448,52 520,58 C568,62 590,78 648,82 C716,87 764,60 836,54 C902,49 948,72 1008,80 C1052,86 1094,74 1150,64 C1216,52 1300,60 1368,74 C1398,80 1420,86 1440,84 L1440,200 L0,200 Z",
    fill: "var(--ink-2)",
    opacity: 0.45,
    fromY: 16,
    toY: -6,
  },
  {
    d: "M0,118 C58,100 122,92 190,102 C248,110 300,128 372,120 C430,113 470,90 540,88 C610,86 660,110 730,116 C788,121 850,100 918,94 C980,89 1030,108 1096,116 C1160,124 1240,104 1310,98 C1360,94 1410,104 1440,110 L1440,200 L0,200 Z",
    fill: "var(--ink-2)",
    opacity: 0.8,
    fromY: 10,
    toY: -3,
  },
  {
    d: "M0,152 C50,138 110,132 168,140 C210,146 238,158 296,156 C370,153 420,126 492,124 C540,123 570,136 628,142 C684,148 730,134 800,128 C844,124 872,132 924,140 C980,149 1040,142 1104,134 C1160,127 1220,138 1284,146 C1340,153 1400,150 1440,146 L1440,200 L0,200 Z",
    fill: "var(--ink)",
    opacity: 1,
    fromY: 5,
    toY: 0,
  },
];

export function ShapeDivider({ variant }: ShapeDividerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const patternId = useId();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;
      const layers =
        rootRef.current.querySelectorAll<HTMLElement>("[data-parallax]");
      layers.forEach((el) => {
        gsap.fromTo(
          el,
          {
            xPercent: Number(el.dataset.fromX ?? 0),
            yPercent: Number(el.dataset.fromY ?? 0),
          },
          {
            xPercent: Number(el.dataset.toX ?? 0),
            yPercent: Number(el.dataset.toY ?? 0),
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: rootRef, dependencies: [reduced], revertOnUpdate: true }
  );

  if (variant === "wave") {
    return (
      <div
        ref={rootRef}
        aria-hidden="true"
        className="pointer-events-none relative z-10 -mt-[120px] h-[140px] select-none overflow-hidden md:-mt-[150px] md:h-[180px]"
      >
        {WAVE_LAYERS.map((layer, i) => (
          <svg
            key={i}
            data-parallax=""
            data-from-y={layer.fromY}
            data-to-y={layer.toY}
            className="absolute inset-x-0 bottom-0 h-[135%] w-full"
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
            style={{ opacity: layer.opacity }}
          >
            <path d={layer.d} fill={layer.fill} />
          </svg>
        ))}
      </div>
    );
  }

  // Constant height, no overlap: FilmStrip below is ScrollTrigger-pinned
  // and its pin math depends on this block never shifting layout.
  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none relative h-16 select-none overflow-hidden border-y border-line md:h-20"
    >
      <div
        data-parallax=""
        data-from-x="-8"
        data-to-x="0"
        className="absolute inset-y-0 left-0 w-[130%]"
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 1456 80"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id={patternId}
              patternUnits="userSpaceOnUse"
              width="56"
              height="80"
            >
              <rect width="56" height="80" fill="var(--ink-2)" />
              <rect x="18" y="26" width="20" height="28" fill="var(--ink)" />
              <rect
                x="55"
                width="1"
                height="80"
                fill="rgba(233,237,240,0.10)"
              />
            </pattern>
          </defs>
          <rect width="1456" height="80" fill={`url(#${patternId})`} />
        </svg>
      </div>
    </div>
  );
}
