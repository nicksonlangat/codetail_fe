export function TheTrustBoundarySection() {
  return (
    <section>
      <h2 id="why-this-is-the-real-api-surface" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The model decides. Your code still has to check.
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This is the real API surface for building anything past a chatbot. Once a model can
        reliably emit a structured, schema-matched decision, you can wire it into a database, an
        internal service, a browser, whatever your product needs, because the interface between
        &quot;the model decided&quot; and &quot;something happened&quot; is just a function call
        like any other.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Just like any other function call is exactly how it needs to be treated. The arguments in
        a tool call are model output, not verified input, the model can hallucinate a plausible
        but wrong city name, misread the user&apos;s intent, or, once the Guardrails article
        covers prompt injection, be manipulated by text it read into calling something it
        shouldn&apos;t. &quot;The model asked for it&quot; is not authorization, and a tool call&apos;s
        arguments deserve the same treatment any other untrusted input reaching your code does:
        validated types and ranges, an allowlist where one applies, and a real permission check
        against the actual user behind the request, not just against whether the model produced
        well-formed JSON.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        That includes never letting a tool&apos;s arguments get concatenated into a raw SQL query
        or a shell command, the same rule for the same reason as any other untrusted string
        reaching that code, model-generated or not. The model&apos;s job is to decide what should
        happen. Your code&apos;s job is still to decide whether it&apos;s allowed to.
      </p>
    </section>
  );
}
