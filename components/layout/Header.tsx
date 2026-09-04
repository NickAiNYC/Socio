"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-4 z-50 max-w-5xl mx-auto px-4 w-full">
      <div className="bg-white/80 backdrop-blur-md border border-zinc-200/80 shadow-xs rounded-full px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold tracking-tight text-zinc-900 text-lg">
            socio<span className="text-zinc-400">.nyc</span>
          </Link>
          <span className="hidden sm:inline-block text-[11px] font-mono uppercase bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full border border-zinc-200">
            Brooklyn Hub
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600">
          <Link 
            href="/craft" 
            className={`transition-colors ${pathname?.startsWith("/craft") ? "text-zinc-950" : "hover:text-zinc-950"}`}
          >
            Craftsman Network
          </Link>
          <Link 
            href="/contractors/join" 
            className={`transition-colors ${pathname?.startsWith("/contractors") ? "text-zinc-950" : "hover:text-zinc-950"}`}
          >
            For Tradesmen
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/craft/estimate"
            className="text-xs font-medium bg-zinc-900 text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition-colors flex items-center gap-1"
          >
            Get an Estimate
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
