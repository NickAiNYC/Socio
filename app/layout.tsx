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
  title: "Socio · Infrastructure & Precision Front-Office for Local Trades",
  description:
    "Socio pairs master-level independent craftsmen across Brooklyn and Queens with institutional-grade estimates, standardized scopes, and board-ready alteration compliance.",
};

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#FAFAFA] text-zinc-900 selection:bg-black selection:text-white font-sans antialiased flex min-h-screen flex-col">
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
