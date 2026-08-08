import { Topbar } from "@/components/layout/topbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/marketing/hero";
import { ChallengePreview } from "@/components/marketing/challenge-preview";
import { Features } from "@/components/marketing/features";
import { Pricing } from "@/components/marketing/pricing";
import { FinalCta } from "@/components/marketing/final-cta";

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Topbar />
      <Hero />
      <ChallengePreview />
      <Features />
      <Pricing />
      <FinalCta />
      <Footer />
    </div>
  );
}
