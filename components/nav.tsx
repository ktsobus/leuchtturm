export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/60 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:px-12">
        <a href="#top" className="text-sm font-medium tracking-tight">
          Leuchtturm<span className="text-beam">.</span>
        </a>
        <div className="flex items-center gap-8">
          <a
            href="#work"
            className="hidden text-sm text-fog-dim transition-colors hover:text-fog sm:block"
          >
            Work
          </a>
          <a
            href="#studio"
            className="hidden text-sm text-fog-dim transition-colors hover:text-fog sm:block"
          >
            Studio
          </a>
          <a
            href="mailto:hello@leuchtturm.media"
            className="border border-line px-4 py-2 text-sm transition-colors hover:border-beam hover:text-beam"
          >
            Get in touch
          </a>
        </div>
      </nav>
    </header>
  );
}
