import { WhyEyeballingFailsSection } from "./WhyEyeballingFailsSection";
import { GoldenDatasetsSection } from "./GoldenDatasetsSection";
import { LLMAsJudgeSection } from "./LLMAsJudgeSection";
import { RegressionTestingSection } from "./RegressionTestingSection";

export const toc = [
  { id: "why-eyeballing-a-few-examples-fails", title: "Looking good on one example is weaker evidence than it feels like" },
  { id: "golden-datasets-and-regression-testing", title: "A fixed set of cases, checked the same way every time" },
  { id: "llm-as-judge", title: "For output with no single correct answer, a second model call can grade it" },
  { id: "regression-testing-a-prompt-change", title: "An average score can hide the one case that actually regressed" },
];

export default function EvaluatingAISystemsArticle() {
  return (
    <>
      <WhyEyeballingFailsSection />
      <GoldenDatasetsSection />
      <LLMAsJudgeSection />
      <RegressionTestingSection />
    </>
  );
}
