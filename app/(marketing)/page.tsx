import { HeroSection } from '@/components/HeroSection';
import { WhatSocioDoes } from '@/components/WhatSocioDoes';
import { CoreOutcomes } from '@/components/CoreOutcomes';
import { ProductShowcase } from '@/components/ProductShowcase';
import { SocioProjectObject } from '@/components/SocioProjectObject';
import { HowItWorksSimple } from '@/components/HowItWorksSimple';
import { TwoSidedNetwork } from '@/components/TwoSidedNetwork';
import { CompliancePreview } from '@/components/CompliancePreview';
import { ConstructionOS } from '@/components/ConstructionOS';
import { FaqSection } from '@/components/FaqSection';
import { SystemCTA } from '@/components/SystemCTA';

export default function LandingPage() {
  return (
    <main className="w-full bg-[#FAFAFA]">
      {/* 01. Minimal Editorial Hero with Example Project Artifact & NYC Trust Strip */}
      <HeroSection />

      {/* 02. What Socio Does: The 5 Core Services */}
      <WhatSocioDoes />

      {/* 03. The Three Core Outcomes: Structure, Match, Control with Visual Artifacts */}
      <CoreOutcomes />

      {/* 04. Interactive Product Showcase: Tabs across Project, Scope, Contractors, Docs, Milestones, Payments */}
      <ProductShowcase />

      {/* 05. The Socio Project: The Central Digital Primitive & Runtime Inspector */}
      <SocioProjectObject />

      {/* 06. How It Works: The Simple 5-Step Journey (Describe → Structure → Match → Build → Record) */}
      <HowItWorksSimple />

      {/* 07. Two-Sided Alignment: For Owners (Readiness) vs. For Contractors (Opportunities) */}
      <TwoSidedNetwork />

      {/* 08. Built for NYC: Building Realities, Board Compliance Dossier & Local Density Corridors */}
      <CompliancePreview />

      {/* 09. The Construction OS: System Behind the Service & Empirical Feedback Moat */}
      <ConstructionOS />

      {/* 10. Frequently Asked Questions: Clean Accordion */}
      <FaqSection />

      {/* 11. Final Minimal Call to Action */}
      <SystemCTA />
    </main>
  );
}
