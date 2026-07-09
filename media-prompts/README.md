# Media Prompts for Google Flow

One file per asset. Images: Nano Banana (Gemini image). Videos: Veo 3.1, max 8 seconds.

Workflow:
1. Open Google Flow, paste the prompt block from a file.
2. Set the aspect ratio and (for video) duration from the file's frontmatter.
3. Export, rename to the `output` filename in the frontmatter, drop into `public/generated/`.
4. The site picks it up automatically (components already reference these filenames, with fallbacks until then).

Shared visual world (keep consistent across every generation): hand-painted animation still in a Studio Ghibli-inspired painterly style, visible brushwork, teal-green sea palette, warm amber lamp glow as the only hot accent, soft volumetric painted clouds. This matches the existing lighthouse footage on the site.
