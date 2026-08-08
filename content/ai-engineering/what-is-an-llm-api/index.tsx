import { RequestResponseShapeSection } from "./RequestResponseShapeSection";
import { TokensSection } from "./TokensSection";
import { ContextWindowSection } from "./ContextWindowSection";
import { WhenTheWindowRunsOutSection } from "./WhenTheWindowRunsOutSection";

export const toc = [
  { id: "request-response-shape", title: "A chat completion is a list of messages in, one message out" },
  { id: "tokens-are-the-unit", title: "Tokens are what you're billed for, and what you're waiting on" },
  { id: "the-context-window-is-the-resource-you-manage", title: "The context window is the one resource you actually manage" },
  { id: "when-the-window-runs-out", title: "What happens when a naive chat loop hits the limit" },
];

export default function WhatIsAnLLMAPIArticle() {
  return (
    <>
      <RequestResponseShapeSection />
      <TokensSection />
      <ContextWindowSection />
      <WhenTheWindowRunsOutSection />
    </>
  );
}
