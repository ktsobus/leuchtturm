"use client";

import { useState } from "react";

type Props = {
  src: string;
  fallbackSeed: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  localFallback?: string;
};

/**
 * Prefers a locally generated asset (public/generated/...); until the user
 * renders it in Google Flow, falls back to a seeded Picsum placeholder, and
 * if the network blocks that too, to a still from the lighthouse footage.
 */
export function FallbackImage({
  src,
  fallbackSeed,
  alt,
  width,
  height,
  className,
  localFallback = "/stills/still_2_5.webp",
}: Props) {
  const sources = [
    src,
    `https://picsum.photos/seed/${fallbackSeed}/${width}/${height}`,
    localFallback,
  ];
  const [level, setLevel] = useState(0);
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={sources[level]}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      onError={() => setLevel((l) => Math.min(l + 1, sources.length - 1))}
      className={className}
    />
  );
}
