export default function SiteBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-hairline bg-canvas/90 px-6 py-4 backdrop-blur-md">
      <a href="#top" className="flex items-baseline gap-1 font-display text-lg text-ink no-underline">
        <span>Socio</span>
        <span className="inline-block h-[0.42em] w-[0.42em] -translate-y-[0.05em] rounded-full bg-accent" />
      </a>
      <div className="flex items-center gap-6">
        <span className="hidden font-mono text-xs uppercase tracking-wide text-ink-soft sm:inline">
          NYC · Public DOB Records
        </span>
        <a
          href="#close"
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink shadow-e1 hover:shadow-e2"
        >
          Reactivate a Bid
        </a>
      </div>
    </header>
  );
}
