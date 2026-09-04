import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  style: ["normal", "italic"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Socio · a renovation should start with a real scope",
  description:
    "Socio reads NYC DOB filings so a renovation starts with a real, standardized scope. Free for homeowners. Contractors pay only when a bid closes.",
};

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-neutral-50 font-sans text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col">
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </main>
        <Footer />
      </body>
    </html>
  );
}
