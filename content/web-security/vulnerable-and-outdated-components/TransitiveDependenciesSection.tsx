import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TransitiveDependenciesSection() {
  return (
    <section>
      <h2 id="transitive-dependencies" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The vulnerable code was never one you chose to depend on
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Nobody has to compromise anything here. A completely legitimate, widely used library
        simply has a publicly known vulnerability, sitting several layers deeper in your
        dependency tree than anything you actually chose to install.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          What your app actually pulled in, three layers down
        </p>
        <CodeBlock
          variant="vulnerable"
          language="Bash"
          code={`your-app
└── some-web-framework@2.3.0
    └── some-logging-wrapper@1.4.0
        └── log4j-core@2.14.1   # CVE-2021-44228, three levels deep`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That specific version and CVE are real: Log4Shell let a single attacker-controlled string,
        logged anywhere, a request header, a username field, trigger remote code execution,
        because of how that version of Log4j evaluated lookup expressions inside logged messages.
        It became one of the most severe disclosures in years specifically because so many
        applications had it buried this deep, pulled in by a framework or a wrapper library, never
        listed in anyone&apos;s own dependency file, never reviewed by anyone who worked on the
        app itself.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Being three levels down in the tree describes how the dependency got there. It has no
        bearing on what it does once it&apos;s running. That code still executes in your process,
        with your process&apos;s privileges, against your production traffic, regardless of how
        many require statements separate it from your own.
      </p>
    </section>
  );
}
