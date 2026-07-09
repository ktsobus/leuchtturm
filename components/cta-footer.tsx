"use client";

import { useState, useEffect } from "react";

export function CtaFooter() {
  const [reduced, setReduced] = useState(true);
  const [videoOk, setVideoOk] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <footer className="relative min-h-[100dvh] overflow-hidden">
      {!reduced && videoOk ? (
        /* Veo-generated night beam loop; see media-prompts/vid-cta-loop.md */
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          src="/generated/cta-loop.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/stills/still_9_8.webp"
          onError={() => setVideoOk(false)}
        />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/stills/still_9_8.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/60 to-ink" />
      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-between px-6 pt-32 md:px-12">
        <div>
          <h2 className="max-w-3xl text-5xl font-medium tracking-tighter leading-[0.95] md:text-7xl">
            Have a world in mind?
          </h2>
          <a
            href="mailto:hello@leuchtturm.media"
            className="mt-10 inline-flex items-center gap-3 bg-beam px-8 py-5 text-sm font-medium uppercase tracking-wide text-ink transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Get in touch
          </a>
        </div>
        <div className="flex flex-col justify-between gap-4 border-t border-line py-8 text-sm text-fog-dim sm:flex-row">
          <span>Leuchtturm Media</span>
          <a
            href="mailto:hello@leuchtturm.media"
            className="transition-colors hover:text-fog"
          >
            hello@leuchtturm.media
          </a>
          <span>2026</span>
        </div>
      </div>
    </footer>
  );
}
