"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * 404 scene. The page is a dark stretch of coast: the same composition
 * is rendered twice — a barely visible latent layer underneath and a
 * fully lit layer on top. The lit layer is masked by two radial
 * gradients (cursor searchlight + traveling lighthouse beam spot), so
 * content emerges from the dark wherever light passes. Reduced motion
 * drops the mask entirely and shows the lit scene statically.
 */

/* Two mask layers, union (default mask-composite: add).
   --sx/--sy: cursor searchlight. --bx: beam spot along the horizon. */
const MASK = [
  "radial-gradient(circle 300px at var(--sx) var(--sy), black 35%, transparent 100%)",
  "radial-gradient(ellipse var(--bw, 30rem) 18rem at var(--bx) 58%, black 30%, transparent 100%)",
].join(", ");

const CTA_CLASS =
  "mt-10 inline-flex items-center gap-3 bg-beam px-8 py-5 text-sm font-medium uppercase tracking-wide text-ink transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]";

function SceneCopy({ latent }: { latent?: boolean }) {
  return (
    <div
      aria-hidden={latent || undefined}
      className={`relative z-10 flex h-full flex-col items-center justify-center px-6 text-center ${
        latent ? "pointer-events-none select-none opacity-[0.06]" : ""
      }`}
    >
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-beam">
        Signal lost — 53.8°N 8.1°E
      </p>
      {latent ? (
        <span className="mt-4 text-[24vw] font-medium leading-[0.85] tracking-tighter md:text-[18vw]">
          404
        </span>
      ) : (
        <h1 className="mt-4 text-[24vw] font-medium leading-[0.85] tracking-tighter md:text-[18vw]">
          404
          <span className="sr-only"> — page not found</span>
        </h1>
      )}
      <p className="mt-8 max-w-md text-base text-fog-dim md:text-lg">
        The beam swept this stretch of coast. Nothing lives at this
        address.
      </p>
      {latent ? (
        <span className={CTA_CLASS}>Back to the light</span>
      ) : (
        <Link href="/" className={CTA_CLASS}>
          Back to the light
        </Link>
      )}
    </div>
  );
}

export function NotFoundScene() {
  const litRef = useRef<HTMLDivElement>(null);
  const wedgeRef = useRef<HTMLDivElement>(null);
  const lampRef = useRef<SVGCircleElement>(null);
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const lit = litRef.current;
    if (!lit) return;

    /* One normalized value drives both the beam mask spot and the
       wedge rotation so the light and the lamp stay in sync. */
    const beam = { t: 0.35 };
    const applyBeam = () => {
      lit.style.setProperty(
        "--bx",
        `${gsap.utils.interpolate(80, 6, beam.t)}%`
      );
      if (wedgeRef.current) {
        wedgeRef.current.style.transform = `rotate(${gsap.utils.interpolate(
          1.5,
          11,
          beam.t
        )}deg)`;
      }
    };
    applyBeam();
    const sweep = gsap.to(beam, {
      t: 1,
      duration: 9,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      onUpdate: applyBeam,
    });
    const pulse = lampRef.current
      ? gsap.to(lampRef.current, {
          opacity: 0.25,
          duration: 1.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      : null;

    /* Cursor searchlight, lerped so the lamp feels heavy. Touch
       devices keep the default centered spot plus a wider sweeping
       beam so the reveal works without a cursor. */
    if (!window.matchMedia("(pointer: fine)").matches) {
      lit.style.setProperty("--bw", "44rem");
      return () => {
        sweep.kill();
        pulse?.kill();
      };
    }
    const pos = {
      x: innerWidth / 2,
      y: innerHeight * 0.45,
      tx: innerWidth / 2,
      ty: innerHeight * 0.45,
    };
    const onPointer = (e: PointerEvent) => {
      pos.tx = e.clientX;
      pos.ty = e.clientY;
    };
    const tick = () => {
      const dx = pos.tx - pos.x;
      const dy = pos.ty - pos.y;
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return;
      pos.x += dx * 0.07;
      pos.y += dy * 0.07;
      lit.style.setProperty("--sx", `${pos.x}px`);
      lit.style.setProperty("--sy", `${pos.y}px`);
    };
    window.addEventListener("pointermove", onPointer);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      gsap.ticker.remove(tick);
      sweep.kill();
      pulse?.kill();
    };
  }, [reduced]);

  return (
    <div
      className="relative h-svh overflow-hidden bg-ink"
      style={{ "--sx": "50%", "--sy": "45%", "--bx": "70%" } as React.CSSProperties}
    >
      {/* Escape hatch: always faintly visible, above the dark. */}
      <header className="absolute left-6 top-5 z-30 md:left-12">
        <Link
          href="/"
          className="text-sm font-medium tracking-tight text-fog-dim transition-colors hover:text-fog"
        >
          Leuchtturm<span className="text-beam">.</span>
        </Link>
      </header>

      {/* Latent layer: the scene, barely there. */}
      <div className="absolute inset-0">
        <SceneCopy latent />
      </div>
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-[58%] h-px bg-line opacity-40"
      />

      {/* Fog: two blurred blobs drifting slowly (CSS keyframes defined
          inline via Tailwind arbitrary animation would need globals.css;
          use the site grain + these static soft blobs — motion comes
          from the beam passing over them). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[2%] top-[48%] h-40 w-72 rounded-none opacity-30 blur-3xl"
        style={{ background: "rgba(150,161,171,0.12)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[10%] top-[54%] h-32 w-96 opacity-25 blur-3xl"
        style={{ background: "rgba(150,161,171,0.10)" }}
      />

      {/* Lighthouse silhouette, dimly visible. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[42%] right-[6%] z-20 w-16 md:w-20"
      >
        <svg viewBox="0 0 60 150" className="w-full" role="presentation">
          {/* tower */}
          <path
            d="M22 150 L26 52 H34 L38 150 Z"
            fill="#10141a"
            stroke="rgba(233,237,240,0.18)"
            strokeWidth="1"
          />
          {/* gallery + lamp room */}
          <rect x="20" y="44" width="20" height="8" fill="#10141a" stroke="rgba(233,237,240,0.18)" strokeWidth="1" />
          <rect x="24" y="30" width="12" height="14" fill="#10141a" stroke="rgba(233,237,240,0.18)" strokeWidth="1" />
          <path d="M22 30 L30 20 L38 30 Z" fill="#10141a" stroke="rgba(233,237,240,0.18)" strokeWidth="1" />
          {/* lamp */}
          <circle ref={lampRef} cx="30" cy="37" r="3.5" fill="#e0a848" />
        </svg>
      </div>

      {/* Beam wedge from the lamp toward the horizon. */}
      <div
        ref={wedgeRef}
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] top-[46%] z-10 h-[22vh] w-[110vw] origin-right -translate-y-1/2"
        style={{
          transform: "rotate(4deg)",
          background:
            "linear-gradient(to left, rgba(224,168,72,0.20), rgba(224,168,72,0) 72%)",
          clipPath: "polygon(100% 44%, 0 0, 0 100%, 100% 56%)",
        }}
      />

      {/* Lit reveal layer, masked by searchlight + beam spot. */}
      <div
        ref={litRef}
        className="absolute inset-0"
        style={
          reduced
            ? undefined
            : ({ WebkitMaskImage: MASK, maskImage: MASK } as React.CSSProperties)
        }
      >
        {/* warm ambience inside the light */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 45% at 50% 50%, rgba(224,168,72,0.10), transparent 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-[58%] h-px"
          style={{ background: "rgba(224,168,72,0.35)" }}
        />
        <SceneCopy />
      </div>
    </div>
  );
}
