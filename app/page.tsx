import { Nav } from "@/components/nav";
import { HeroSequence } from "@/components/hero-sequence";
import { Manifesto } from "@/components/manifesto";
import { WorkGrid } from "@/components/work-grid";
import { FilmStrip } from "@/components/film-strip";
import { Capabilities } from "@/components/capabilities";
import { DepthShowcase } from "@/components/depth-showcase";
import { About } from "@/components/about";
import { Marquee } from "@/components/marquee";
import { CtaFooter } from "@/components/cta-footer";
import { ShapeDivider } from "@/components/shape-divider";

export default function Home() {
  return (
    <main id="top">
      <Nav />
      <HeroSequence />
      <ShapeDivider variant="wave" />
      <Manifesto />
      <WorkGrid />
      <ShapeDivider variant="perforation" />
      <FilmStrip />
      <Capabilities />
      <DepthShowcase />
      <About />
      <Marquee />
      <CtaFooter />
    </main>
  );
}
