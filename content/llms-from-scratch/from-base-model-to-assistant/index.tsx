import { WhyRawModelDoesntChatSection } from "./WhyRawModelDoesntChatSection";
import { SupervisedFineTuningSection } from "./SupervisedFineTuningSection";
import { RLHFSection } from "./RLHFSection";
import { DPOSection } from "./DPOSection";

export const toc = [
  { id: "why-a-raw-model-doesnt-chat", title: "Why a raw pretrained model doesn't chat" },
  { id: "supervised-fine-tuning", title: "Supervised fine-tuning: teaching the format" },
  { id: "rlhf", title: "RLHF: learning from human preference rankings" },
  { id: "dpo", title: "DPO: getting RLHF's result without the reinforcement learning" },
];

export default function FromBaseModelToAssistantArticle() {
  return (
    <>
      <WhyRawModelDoesntChatSection />
      <SupervisedFineTuningSection />
      <RLHFSection />
      <DPOSection />
    </>
  );
}
