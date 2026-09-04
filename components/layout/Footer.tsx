import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-neutral-900">
              Socio.
            </Link>
            <p className="mt-4 text-sm text-neutral-500 max-w-sm">
              Technology and front-office infrastructure for Brooklyn trades and merchants.
            </p>
          </div>
          <div>
            <h3 className="font-sans text-sm font-semibold text-neutral-900">Network</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/craft" className="text-sm text-neutral-500 hover:text-neutral-900">
                  For Homeowners
                </Link>
              </li>
              <li>
                <Link href="/contractors/join" className="text-sm text-neutral-500 hover:text-neutral-900">
                  For Contractors
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-sm font-semibold text-neutral-900">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="mailto:hello@socio.nyc" className="text-sm text-neutral-500 hover:text-neutral-900">
                  hello@socio.nyc
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-neutral-100 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-xs text-neutral-400">
            &copy; {new Date().getFullYear()} Socio NYC. All rights reserved.
          </p>
          <div className="text-xs text-neutral-400 max-w-2xl text-left md:text-right">
            <strong>Legal Notice:</strong> Socio acts solely as an administrative coordination, estimating, and technology desk. 
            Socio is not a licensed home improvement general contractor under NYC Admin Code § 20-387. 
            All homeowner agreements and warranties are contracted directly with the licensed, insured craftsman performing the work.
          </div>
        </div>
      </div>
    </footer>
  );
}
