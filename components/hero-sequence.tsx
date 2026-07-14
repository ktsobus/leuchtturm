"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FRAME_COUNT = 120;
const frameSrc = (i: number) =>
  `/frames/frame_${String(i + 1).padStart(3, "0")}.webp`;

/** Draws an image onto the canvas with cover-fit semantics. */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number
) {
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

export function HeroSequence() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
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
      if (reduced) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const images: (HTMLImageElement | null)[] = Array(FRAME_COUNT).fill(null);
      const state = { frame: 0 };
      let lastDrawn = -1;

      const nearestLoaded = (i: number) => {
        if (images[i]?.complete) return i;
        for (let d = 1; d < FRAME_COUNT; d++) {
          if (images[i - d]?.complete) return i - d;
          if (images[i + d]?.complete) return i + d;
        }
        return -1;
      };

      const render = (force = false) => {
        const idx = nearestLoaded(
          Math.round(gsap.utils.clamp(0, FRAME_COUNT - 1, state.frame))
        );
        if (idx < 0 || (idx === lastDrawn && !force)) return;
        lastDrawn = idx;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
          canvas.width = w * dpr;
          canvas.height = h * dpr;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        drawCover(ctx, images[idx]!, w, h);
      };

      const load = (i: number) => {
        if (images[i]) return;
        const img = new Image();
        img.src = frameSrc(i);
        img.onload = () => {
          if (Math.round(state.frame) === i || lastDrawn < 0) render(true);
        };
        images[i] = img;
      };
      // Coarse pass first for instant scrubbing, then fill in the rest.
      for (let i = 0; i < FRAME_COUNT; i += 8) load(i);
      for (let i = 0; i < FRAME_COUNT; i++) load(i);

      const onResize = () => render(true);
      window.addEventListener("resize", onResize);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });
      tl.to(
        state,
        {
          frame: FRAME_COUNT - 1,
          ease: "none",
          duration: 1,
          onUpdate: () => render(),
        },
        0
      );
      // The overlay copy hands the stage to the film as scrubbing begins.
      tl.to(
        textRef.current,
        { autoAlpha: 0, y: -50, ease: "none", duration: 0.16 },
        0
      );

      return () => window.removeEventListener("resize", onResize);
    },
    { scope: wrapRef, dependencies: [reduced], revertOnUpdate: true }
  );

  return (
    <div ref={wrapRef} className={reduced ? "relative" : "relative h-[400vh]"}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {reduced ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={frameSrc(0)}
            alt="Aerial view of a hand-painted lighthouse island in a teal sea"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="Hand-painted lighthouse island film, played frame by frame as you scroll"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-ink/40" />
        <div
          ref={textRef}
          className="absolute inset-x-0 bottom-0 px-6 pb-16 md:px-12 lg:px-20 lg:pb-24"
        >
          <div className="max-w-[1400px] mx-auto">
            <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-medium tracking-[0.03em] leading-[0.95] text-balance">
              Worlds built frame by frame.
            </h1>
            <p className="mt-6 max-w-md text-base md:text-lg text-fog-dim leading-relaxed">
              Leuchtturm Media is a one-person studio crafting hand-painted
              animated films.
            </p>
            <a
              href="#work"
              className="mt-8 inline-flex items-center gap-3 bg-beam px-7 py-4 text-sm font-medium uppercase tracking-wide text-ink transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              View work
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
