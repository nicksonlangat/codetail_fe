import { RequirementsSection } from "./RequirementsSection";
import { CoreDesignSection } from "./CoreDesignSection";
import { ScalingSection } from "./ScalingSection";
import { ProductionSection } from "./ProductionSection";

export const toc = [
  { id: "requirements", title: "Requirements and Capacity Estimation" },
  { id: "core-design", title: "Core Design" },
  { id: "scaling", title: "Scaling the Read and Write Paths" },
  { id: "production", title: "Production: Analytics, Resilience, and What We Left Out" },
];

export default function DesignARealSystemArticle() {
  return (
    <>
      <RequirementsSection />
      <CoreDesignSection />
      <ScalingSection />
      <ProductionSection />
    </>
  );
}
