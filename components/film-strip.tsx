"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STILLS = [
  { src: "/stills/still_0_5.webp", caption: "The island, from the clouds" },
  { src: "/stills/still_2_5.webp", caption: "Falling toward the lantern" },
  { src: "/stills/still_4_5.webp", caption: "The lamp, up close" },
  { src: "/stills/still_6_5.webp", caption: "Past the keeper's house" },
  { src: "/stills/still_8_5.webp", caption: "Down along the pier" },
  { src: "/stills/still_9_8.webp", caption: "Out to open water" },
];

export function FilmStrip() {
  const wrapRef = useRef<HTMLElement>(null);
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
      if (reduced || !wrapRef.current || !trackRef.current) return;
      const distance = () =>
        trackRef.current!.scrollWidth - window.innerWidth;
      gsap.to(trackRef.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: wrapRef, dependencies: [reduced], revertOnUpdate: true }
  );

  if (reduced) {
    // Static fallback: a plain horizontal strip the user can swipe natively.
    return (
      <section className="overflow-x-auto py-24">
        <div className="flex gap-6 px-6">
          {STILLS.map((s) => (
            <figure key={s.src} className="w-[70vw] shrink-0 md:w-[40vw]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                alt={s.caption}
                className="w-full object-cover"
              />
              <figcaption className="mt-3 text-sm text-fog-dim">
                {s.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={wrapRef} className="relative overflow-hidden">
      <div ref={trackRef} className="flex h-[100dvh] items-center gap-8 pl-6 md:gap-12 md:pl-12">
        <div className="w-[80vw] shrink-0 md:w-[36vw]">
          <h2 className="text-4xl font-medium tracking-tighter leading-[1.05] md:text-5xl">
            One island. Ten seconds. Two hundred forty frames.
          </h2>
          <p className="mt-6 max-w-sm text-fog-dim leading-relaxed">
            The full descent from cloud to pier, cut into the moments we
            painted it from.
          </p>
        </div>
        {STILLS.map((s) => (
          <figure key={s.src} className="w-[78vw] shrink-0 md:w-[52vw]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.src}
              alt={s.caption}
              className="aspect-video w-full object-cover"
              loading="lazy"
            />
            <figcaption className="mt-3 text-sm text-fog-dim">
              {s.caption}
            </figcaption>
          </figure>
        ))}
        <div className="w-[10vw] shrink-0" />
      </div>
    </section>
  );
}
