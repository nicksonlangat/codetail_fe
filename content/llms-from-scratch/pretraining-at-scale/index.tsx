import { WhatsActuallyInAPretrainingDatasetSection } from "./WhatsActuallyInAPretrainingDatasetSection";
import { BatchesTokensAndStepsSection } from "./BatchesTokensAndStepsSection";
import { ComputeBudgetsSection } from "./ComputeBudgetsSection";
import { DeduplicationFilteringAndDataQualitySection } from "./DeduplicationFilteringAndDataQualitySection";

export const toc = [
  { id: "whats-actually-in-a-pretraining-dataset", title: "What's actually in a pretraining dataset" },
  { id: "batches-tokens-and-steps", title: "Batches, tokens, and steps" },
  { id: "compute-budgets", title: "Compute budgets: what a training run costs" },
  { id: "deduplication-filtering-and-data-quality", title: "Deduplication, filtering, and data quality" },
];

export default function PretrainingAtScaleArticle() {
  return (
    <>
      <WhatsActuallyInAPretrainingDatasetSection />
      <BatchesTokensAndStepsSection />
      <ComputeBudgetsSection />
      <DeduplicationFilteringAndDataQualitySection />
    </>
  );
}
