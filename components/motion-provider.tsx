"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Site-wide Motion policy. Reduced-motion handling must happen here
 * (transforms disabled, opacity kept) instead of branching `initial`
 * per component: a client-side branch renders different markup than
 * the server did and the hydration mismatch takes down the page.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
