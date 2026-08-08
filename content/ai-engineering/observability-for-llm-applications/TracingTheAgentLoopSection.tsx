import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TracingTheAgentLoopSection() {
  return (
    <section>
      <h2 id="tracing-a-request-through-an-agent-loop" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The final answer being wrong tells you nothing about which step broke
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A single request from Agents and Tool Use might trigger several model calls, a retrieval
        step, and two or three tool calls before producing one answer. Logging just the initial
        question and the final response tells you the outcome was wrong. It tells you nothing
        about which of those intermediate steps is where it actually went wrong.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A trace as a tree of spans, not a single log line
        </p>
        <CodeBlock
          code={`trace: request_abc123
├── span: retrieve_context (312ms, 5 chunks returned)
├── span: model_call_1 (890ms, decided to call get_invoice)
├── span: tool_call get_invoice(id=4471) (140ms, returned invoice)
├── span: model_call_2 (760ms, final answer)
└── total: 2.1s`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        With this, a wrong answer is a debugging session, not a guess: check whether retrieval
        returned the right chunks, whether the model&apos;s tool call had the right arguments,
        whether the tool actually returned what it should have. Each of those is checkable
        independently instead of re-running the whole request and hoping the same thing happens
        twice.
      </p>
    </section>
  );
}
