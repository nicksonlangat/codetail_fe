import { CodeBlock } from "@/components/blog/interactive/code-block";

export function RolesSection() {
  return (
    <section>
      <h2 id="system-user-assistant-roles" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The role isn&apos;t decorative
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Every message in the list from the last article carries a role, and it&apos;s tempting to
        treat that as bookkeeping, three labels for what&apos;s really just one long string the
        model reads top to bottom. It isn&apos;t. Models are trained to treat{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">system</code>{" "}
        content as higher-authority instruction than{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">user</code>{" "}
        content, not just as the first paragraph of a bigger document.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Persistent behavior in system, the actual request in user
        </p>
        <CodeBlock
          code={`messages = [
    {
        "role": "system",
        "content": (
            "You are a support agent for a SaaS product. Respond in under 3 "
            "sentences. Never discuss pricing, refer those questions to "
            "sales@company.com."
        ),
    },
    {"role": "user", "content": "How do I reset my password?"},
]`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Everything that should hold true across every request, tone, length limit, topics that
        are off-limits, goes in{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">system</code>{" "}
        once. It stays fixed while{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">user</code>{" "}
        changes on every call. Collapse both into one string and you lose that separation
        entirely, along with the model&apos;s tendency to weight the two differently.
      </p>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted">
          <strong>In practice:</strong> never build the system message by concatenating raw user
          input into it. Anything a user typed belongs in the{" "}
          <code className="font-mono text-[12px]">user</code> role, not stitched into the
          instructions you&apos;re trusting the model to follow. Mixing the two is exactly how
          prompt injection gets a foothold, covered in full in the Guardrails article later in
          this series.
        </p>
      </div>
    </section>
  );
}
