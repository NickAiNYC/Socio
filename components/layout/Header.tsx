"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-hairline bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-ink">
            Socio.
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-ink ${
                pathname === "/" ? "text-ink" : "text-ink-soft"
              }`}
            >
              Studio
            </Link>
            <Link
              href="/craft"
              className={`text-sm font-medium transition-colors hover:text-ink ${
                pathname === "/craft" || pathname?.startsWith("/craft/") ? "text-ink" : "text-ink-soft"
              }`}
            >
              Craftsman Network
            </Link>
            <Link
              href="/contractors/join"
              className={`text-sm font-medium transition-colors hover:text-ink ${
                pathname?.startsWith("/contractors/") ? "text-ink" : "text-ink-soft"
              }`}
            >
              For Tradesmen
            </Link>
            <Link
              href="/variance"
              className={`text-sm font-medium transition-colors hover:text-ink ${
                pathname?.startsWith("/variance") ? "text-ink" : "text-ink-soft"
              }`}
            >
              Enterprise Scope / DOB
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/craft/estimate"
            className="rounded-md bg-accent text-accent-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
          >
            Get an Estimate
          </Link>
        </div>
      </div>
    </header>
  );
}
