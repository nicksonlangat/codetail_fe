import { WhyQueuesSection } from "./WhyQueuesSection";
import { QueueVsStreamSection } from "./QueueVsStreamSection";
import { PatternsSection } from "./PatternsSection";
import { ChoosingSection } from "./ChoosingSection";

export const toc = [
  { id: "why-queues", title: "The Coupling Problem" },
  { id: "queue-vs-stream", title: "Queue vs Stream" },
  { id: "patterns", title: "Delivery Guarantees and Patterns" },
  { id: "choosing", title: "Choosing a Messaging System" },
];

export default function MessageQueuesAndEventStreamsArticle() {
  return (
    <>
      <WhyQueuesSection />
      <QueueVsStreamSection />
      <PatternsSection />
      <ChoosingSection />
    </>
  );
}
