export function LoggingPromptsSafelySection() {
  return (
    <section>
      <h2 id="logging-prompts-and-completions-safely" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A trace is a second copy of everything the model ever saw
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The Security Logging and Monitoring article in the Web Security series covers this exact
        problem for ordinary application logs: logs get shipped to a third-party aggregator,
        retained for years, and read by more people than the production database ever is. A full
        prompt and completion trace has the same property, and a new source of leakage that
        ordinary request logging doesn&apos;t: the content isn&apos;t just what a user typed, it&apos;s
        whatever a RAG retrieval step pulled in from your document store, which can carry sensitive
        content into a log purely because it was part of the context, not because anyone chose to
        log it.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The same discipline applies: decide explicitly what gets logged in full, what gets
        redacted, and what gets logged only as a hash or a reference rather than raw content. A
        full trace is genuinely valuable for debugging, that&apos;s the entire point of the last
        section, and valuable enough that it shouldn&apos;t be treated as free to keep around
        forever without the same access controls as anything else holding user data.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        A retention window matched to how long debugging realistically takes, not the default the
        logging platform ships with, is worth setting deliberately here the same way it&apos;s
        worth setting for any other log stream.
      </p>
    </section>
  );
}
