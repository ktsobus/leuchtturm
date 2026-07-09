import { Nav } from "@/components/nav";
import { HeroSequence } from "@/components/hero-sequence";
import { Manifesto } from "@/components/manifesto";
import { WorkGrid } from "@/components/work-grid";
import { FilmStrip } from "@/components/film-strip";
import { Capabilities } from "@/components/capabilities";
import { About } from "@/components/about";
import { Marquee } from "@/components/marquee";
import { CtaFooter } from "@/components/cta-footer";

export default function Home() {
  return (
    <main id="top">
      <Nav />
      <HeroSequence />
      <Manifesto />
      <WorkGrid />
      <FilmStrip />
      <Capabilities />
      <About />
      <Marquee />
      <CtaFooter />
    </main>
  );
}
