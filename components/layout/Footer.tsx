import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-12 px-4 mt-20">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-semibold text-zinc-900 hover:text-zinc-700">socio.nyc</Link>
          <span>— Technology & Front-Office Infrastructure</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/craft" className="hover:text-zinc-900 transition-colors">Craftsman Network</Link>
          <Link href="/contractors/join" className="hover:text-zinc-900 transition-colors">Contractors</Link>
          <Link href="/variance" className="hover:text-zinc-900 transition-colors text-zinc-400">Enterprise Scope</Link>
        </div>
      </div>
    </footer>
  );
}
