"use client";

import { motion, useReducedMotion } from "motion/react";

const LINES = [
  "Every story starts as a",
  "single light in the dark.",
  "We paint outward from there,",
  "wave by wave, roof by roof,",
  "until the world holds.",
];

export function Manifesto() {
  const reduce = useReducedMotion();
  return (
    <section className="py-32 md:py-44">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <h2 className="max-w-5xl pl-0 text-4xl font-medium tracking-tighter leading-[1.05] md:pl-[12vw] md:text-6xl lg:text-7xl">
          {LINES.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={reduce ? false : { y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {line.includes("light") ? (
                  <>
                    single <em className="not-italic text-beam">light</em> in
                    the dark.
                  </>
                ) : (
                  line
                )}
              </motion.span>
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
