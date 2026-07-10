"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DepthScene, type DepthSceneHandle } from "./depth-scene";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SCENE_A = {
  image: "/generated/work-skytrain.webp",
  depth: "/generated/work-skytrain-depth.webp",
};
const SCENE_B = {
  image: "/generated/work-observatory.webp",
  depth: "/generated/work-observatory-depth.webp",
};

/**
 * Pinned split panel. Every still in the studio is painted with a
 * matching depth pass; scrolling sweeps a beam through that depth
 * field and develops the picture, then crossfades to a second world.
 */
export function DepthShowcase() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<DepthSceneHandle>(null);
  const captionARef = useRef<HTMLParagraphElement>(null);
  const captionBRef = useRef<HTMLParagraphElement>(null);
  // null until the preference is known: GSAP must not pin (it re-parents
  // the wrapper into a pin-spacer) before we know the tree will keep this
  // shape, or React crashes removing the moved node on the swap.
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useGSAP(
    () => {
      if (reduced !== false) return;
      const handle = sceneRef.current;
      if (!handle) return;
      const u = handle.uniforms;
      // handle.render is reassigned once the canvas effect runs (this
      // layout effect fires first), so resolve it at call time
      const render = () => handle.render();

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.5}`,
          pin: true,
          // Exact scrub, same as the film strip: Lenis smooths the
          // scroll itself, so nothing lags at the pin boundaries.
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // scene A: beam sweeps from the horizon toward the viewer
      tl.to(u, { scanA: 1.15, duration: 0.4, onUpdate: render }, 0);
      // slow vertical dolly across the whole pin (works without a mouse)
      tl.fromTo(
        u,
        { driftY: 0.014 },
        { driftY: -0.014, duration: 1, onUpdate: render },
        0
      );
      // crossfade to scene B, captions swap
      tl.to(u, { mix: 1, duration: 0.12, onUpdate: render }, 0.5);
      tl.to(captionARef.current, { autoAlpha: 0, duration: 0.08 }, 0.5);
      tl.fromTo(
        captionBRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.08 },
        0.56
      );
      // scene B: second sweep
      tl.to(u, { scanB: 1.15, duration: 0.36, onUpdate: render }, 0.6);
    },
    { scope: wrapRef, dependencies: [reduced], revertOnUpdate: true }
  );

  const copy = (
    <div className="max-w-md">
      <h2 className="text-4xl font-medium tracking-tighter md:text-5xl text-balance">
        Flat frames, deep worlds.
      </h2>
      <p className="mt-6 text-base leading-relaxed text-fog-dim md:text-lg">
        Every still is painted twice: once in color, once as a depth pass.
        That second layer lets the camera lean into a finished frame long
        after the paint has dried.
      </p>
    </div>
  );

  if (reduced) {
    return (
      <section id="depth" className="py-32 md:py-44">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-5">{copy}</div>
          <div className="md:col-span-7">
            <div className="aspect-video overflow-hidden bg-ink-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SCENE_A.image}
                alt="Night train crossing a sea viaduct, hand-painted animation still"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-fog-dim">
              Viaduct Nord, depth pass
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div ref={wrapRef}>
      <section
        id="depth"
        className="flex h-[100dvh] items-center overflow-hidden"
      >
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-12 md:gap-12 md:px-12">
          <div className="md:col-span-5">{copy}</div>
          <div className="md:col-span-7">
            <div className="relative aspect-video overflow-hidden bg-ink-2">
              <DepthScene
                ref={sceneRef}
                sceneA={SCENE_A}
                sceneB={SCENE_B}
                imageAspect={2000 / 1116}
                label="Painted still with a live depth scan sweeping through it"
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <div className="relative mt-4 h-5">
              <p
                ref={captionARef}
                className="absolute font-mono text-xs uppercase tracking-[0.2em] text-fog-dim"
              >
                01 Viaduct Nord, depth pass
              </p>
              <p
                ref={captionBRef}
                className="absolute font-mono text-xs uppercase tracking-[0.2em] text-fog-dim opacity-0"
              >
                02 The Quiet Dome, depth pass
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
