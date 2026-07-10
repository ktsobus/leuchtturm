# Leuchtturm Media

Scroll-driven cinematic portfolio. The 10-second lighthouse film plays frame by frame as you scroll the hero (GSAP ScrollTrigger scrub over a canvas image sequence), followed by an editorial manifesto, an asymmetric work grid, a pinned horizontal film strip, capability rows, an about split, a velocity-reactive marquee, and a full-bleed contact close.

Stack: Next.js (App Router) + Tailwind v4 + GSAP ScrollTrigger + Motion. Dark theme locked, Geist type, single beam-amber accent, sharp corners.

## Run

```bash
npm install
npm run dev
```

## Frame extraction (already done, documented for re-runs)

Source video: `public/leuchtturm.mp4` (1280x720, 24fps, 10s).

```bash
# 120 scrub frames at 12fps for the hero canvas sequence
ffmpeg -i public/leuchtturm.mp4 -vf "fps=12" -c:v libwebp -quality 75 public/frames/frame_%03d.webp

# high-quality stills for section imagery
for t in 0.5 2.5 4.5 6.5 8.5 9.8; do
  ffmpeg -ss $t -i public/leuchtturm.mp4 -frames:v 1 -c:v libwebp -quality 90 "public/stills/still_${t/./_}.webp"
done
```

## Generated media (Google Flow)

Every non-footage image and the contact-section video loop have a prompt file in `media-prompts/` (one file per asset, Nano Banana for images, Veo 3.1 for video). Render them in Google Flow and drop the outputs into `public/generated/` using the `output` filename from each file's frontmatter. Until then the site falls back to seeded Picsum placeholders, then to footage stills, so nothing ever renders broken.

Raw Flow renders live in `media-prompts/renders/`; the web-ready WebP versions are converted with ffmpeg (`-vf "scale=2000:-2" -quality 82`). Two artworks also ship a grayscale depth pass (`work-*-depth.webp`, white = near) that drives the WebGL depth-scan section (`components/depth-scene.tsx`).

## Accessibility

All pinning, scrubbing and marquee motion collapses to static layouts under `prefers-reduced-motion`. The hero then shows a plain still with the full headline and call to action.
