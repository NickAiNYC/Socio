import { HeroSection } from '@/components/HeroSection';
import { TheProblem } from '@/components/TheProblem';
import { SocioProjectObject } from '@/components/SocioProjectObject';
import { ConstructionOS } from '@/components/ConstructionOS';
import { TwoSidedNetwork } from '@/components/TwoSidedNetwork';
import { CompliancePreview } from '@/components/CompliancePreview';
import { HyperlocalMoat } from '@/components/HyperlocalMoat';
import { TransactionLifecycle } from '@/components/TransactionLifecycle';
import { DataMoat } from '@/components/DataMoat';
import { TrustVerification } from '@/components/TrustVerification';
import { ArchitectureSection } from '@/components/ArchitectureSection';
import { SystemCTA } from '@/components/SystemCTA';

export default function LandingPage() {
  return (
    <div className="w-full bg-[#FAFAFA]">
      {/* 01. Category Hero & Two-Sided Doorways */}
      <HeroSection />

      {/* 02. The Problem: Fragmentation vs. Structured Transaction */}
      <TheProblem />

      {/* 03. The Primary Digital Object: The Socio Project */}
      <SocioProjectObject />

      {/* 04. The Four Infrastructure Layers of Socio */}
      <ConstructionOS />

      {/* 05. The Two-Sided Network: Better Outcomes for Both Sides */}
      <TwoSidedNetwork />

      {/* 06. NYC Compliance Layer: The Project Arrives Ready to Move */}
      <CompliancePreview />

      {/* 07. Hyperlocal Density Moat: Brooklyn & Queens Corridors */}
      <HyperlocalMoat />

      {/* 08. The 10-Step Deterministic Transaction Protocol */}
      <TransactionLifecycle />

      {/* 09. The Compounding Data Moat: Expected → Bid → Execution → Actual */}
      <DataMoat />

      {/* 10. The Trust & Verification Layer */}
      <TrustVerification />

      {/* 11. GSAP Scroll-Pinned Architecture Blueprint */}
      <ArchitectureSection />

      {/* 12. Final Two-Sided Transaction CTA */}
      <SystemCTA />
    </div>
  );
}
