"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WORDS = ["Hand-painted", "Frame by frame", "Sea to sky", "Story first"];

export function Marquee() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
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
      if (reduced || !trackRef.current) return;
      const tween = gsap.to(trackRef.current, {
        xPercent: -50,
        repeat: -1,
        ease: "none",
        duration: 28,
      });
      // Scroll velocity nudges the belt speed, then it settles back.
      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(
            -2,
            4,
            1 + Math.abs(self.getVelocity()) / 1200
          );
          gsap.to(tween, { timeScale: boost, duration: 0.4, overwrite: true });
        },
      });
      return () => st.kill();
    },
    { scope: wrapRef, dependencies: [reduced], revertOnUpdate: true }
  );

  return (
    <div ref={wrapRef} className="overflow-hidden border-y border-line py-10">
      <div ref={trackRef} className="flex w-max whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex" aria-hidden={copy === 1}>
            {WORDS.map((w) => (
              <span
                key={`${copy}-${w}`}
                className="px-10 text-5xl font-medium tracking-tighter text-fog-dim/50 md:px-16 md:text-7xl"
              >
                {w}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
