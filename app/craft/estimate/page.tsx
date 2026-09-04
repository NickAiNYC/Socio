import CraftIntakeForm from "@/components/craft/CraftIntakeForm";

export default function EstimatePage() {
  return (
    <div className="w-full bg-canvas min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-ink mb-4">
          Request an Estimate
        </h1>
        <p className="text-ink-soft font-sans">
          Provide details about your project to receive a transparent, itemized proposal and arrange an on-site walkthrough with a master craftsman.
        </p>
      </div>
      <CraftIntakeForm />
    </div>
  );
}
