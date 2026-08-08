import { CodeBlock } from "@/components/blog/interactive/code-block";

export function FewShotSection() {
  return (
    <section>
      <h2 id="few-shot-examples" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Some things are easier to demonstrate than describe
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Try defining &quot;neutral&quot; sentiment in prose so precisely that it never overlaps
        with &quot;mildly positive.&quot; It&apos;s a genuinely hard sentence to write. It&apos;s
        a trivial thing to show.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Three examples doing the work a definition can&apos;t
        </p>
        <CodeBlock
          code={`Classify the sentiment of each message as positive, negative, or neutral.
Respond with only the label.

Message: "This is exactly what I needed, thank you!"
Label: positive

Message: "It arrived broken and support never responded."
Label: negative

Message: "It's fine, does what it says."
Label: neutral

Message: "{user_message}"
Label:`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Each pair teaches two things at once: the exact output format (a single lowercase word,
        nothing else) and where the boundary actually sits between categories that are genuinely
        hard to define with a rule. Few-shot examples work best exactly where instructions
        struggle, tasks that are more about matching a pattern than following a rule: a specific
        output format, a house style, a boundary case that&apos;s easier to point at than to
        state.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        It isn&apos;t free. Every example is tokens, on every single call, for the life of that
        prompt. Two or three well-chosen examples covering the actual edge cases you care about
        beat ten redundant ones covering the same easy case six different ways.
      </p>
    </section>
  );
}
