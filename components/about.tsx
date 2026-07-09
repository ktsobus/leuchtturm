"use client";

import { motion, useReducedMotion } from "motion/react";
import { FallbackImage } from "./fallback-image";

export function About() {
  const reduce = useReducedMotion();
  return (
    <section id="studio" className="py-32 md:py-44">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 px-6 md:px-12 lg:grid-cols-2">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md lg:justify-self-end lg:order-2"
        >
          <h2 className="text-4xl font-medium tracking-tighter md:text-5xl">
            Behind the light
          </h2>
          <p className="mt-6 leading-relaxed text-fog-dim">
            Leuchtturm Media is Simon, a director and animator painting films
            the slow way: gouache first, pixels second. Each project begins as
            a stack of thumbnails on one desk and ends as a world you can
            almost live in.
          </p>
          <p className="mt-4 leading-relaxed text-fog-dim">
            Commissions, collaborations and co-productions are all welcome
            aboard.
          </p>
        </motion.div>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:order-1"
        >
          <FallbackImage
            src="/generated/about-desk.webp"
            fallbackSeed="leuchtturm-about-desk"
            localFallback="/stills/still_4_5.webp"
            alt="An animator's desk at night, painting a lighthouse in gouache"
            width={800}
            height={1000}
            className="aspect-[4/5] w-full max-w-xl object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
