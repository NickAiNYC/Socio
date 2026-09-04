import { HeroSection } from "@/components/HeroSection";
import { MetricsBentoGrid } from "@/components/MetricsBentoGrid";
import { ArchitectureSection } from "@/components/ArchitectureSection";

export default function LandingPage() {
  return (
    <div className="w-full bg-[#FAFAFA]">
      <HeroSection />
      <MetricsBentoGrid />
      <ArchitectureSection />
    </div>
  );
}
