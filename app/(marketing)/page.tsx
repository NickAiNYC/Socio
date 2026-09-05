import { HeroSection } from "@/components/HeroSection";
import { MetricsBentoGrid } from "@/components/MetricsBentoGrid";
import { ConstructionOS } from "@/components/ConstructionOS";
import { ArchitectureSection } from "@/components/ArchitectureSection";
import { CompliancePreview } from "@/components/CompliancePreview";

export default function LandingPage() {
  return (
    <div className="w-full bg-[#FAFAFA]">
      <HeroSection />
      <MetricsBentoGrid />
      <ConstructionOS />
      <ArchitectureSection />
      <CompliancePreview />
    </div>
  );
}
