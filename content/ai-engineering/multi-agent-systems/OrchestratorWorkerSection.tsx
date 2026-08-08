import { CodeBlock } from "@/components/blog/interactive/code-block";

export function OrchestratorWorkerSection() {
  return (
    <section>
      <h2 id="orchestrator-worker-pattern" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        One orchestrator, several narrow specialists
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The pattern that shows up most often in practice looks less like a team of peers and more
        like a manager with a small set of specialists it can delegate to. One orchestrator agent
        plans and decides who handles what. Each worker has a narrow toolset and a system prompt
        written for exactly one job, and reports back a result rather than continuing the
        conversation itself.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Workers exposed to the orchestrator as if they were tools
        </p>
        <CodeBlock
          code={`orchestrator_tools = [
    {"type": "function", "function": {"name": "research_agent", "description": "..."}},
    {"type": "function", "function": {"name": "billing_agent", "description": "..."}},
]

def research_agent(query):
    return run_agent_loop(system="You research and summarize.", tools=[web_search], input=query)

def billing_agent(query):
    return run_agent_loop(system="You look up billing records.", tools=[get_invoice], input=query)`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        From the orchestrator&apos;s perspective, each worker is just another tool call, the
        same mechanism from Structured Output and Tool Calling, decide, call, get a result back.
        The worker underneath happens to be its own full agent loop instead of a plain function,
        but that&apos;s an implementation detail the orchestrator doesn&apos;t need to know about.
      </p>
    </section>
  );
}
