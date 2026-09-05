import { HeroSection } from '@/components/HeroSection';
import { CoreOutcomes } from '@/components/CoreOutcomes';
import { ProductShowcase } from '@/components/ProductShowcase';
import { HowItWorksSimple } from '@/components/HowItWorksSimple';
import { TwoSidedNetwork } from '@/components/TwoSidedNetwork';
import { CompliancePreview } from '@/components/CompliancePreview';
import { ConstructionOS } from '@/components/ConstructionOS';
import { FaqSection } from '@/components/FaqSection';
import { SystemCTA } from '@/components/SystemCTA';

export default function LandingPage() {
  return (
    <main className="w-full bg-[#FAFAFA]">
      {/* CHAPTER 01: HERO & CORE OUTCOMES (10-Second Value Hook) */}
      <HeroSection />
      <CoreOutcomes />

      {/* CHAPTER 02: THE PRODUCT CONSOLE (Interactive Project Object) */}
      <ProductShowcase />

      {/* CHAPTER 03: HOW IT WORKS (The 5-Step Customer Journey) */}
      <HowItWorksSimple />

      {/* CHAPTER 04: FOR OWNERS & CONTRACTORS (Two-Sided Alignment) */}
      <TwoSidedNetwork />

      {/* CHAPTER 05: BUILT FOR NYC (Compliance Dossier & Local Density Corridors) */}
      <CompliancePreview />

      {/* CHAPTER 06: INFRASTRUCTURE (Construction OS & Empirical Feedback Moat) */}
      <ConstructionOS />

      {/* CHAPTER 07: FAQ & FINAL CONVERSION */}
      <FaqSection />
      <SystemCTA />
    </main>
  );
}
