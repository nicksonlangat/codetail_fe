import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PatchCadenceSection() {
  return (
    <section>
      <h2 id="patch-cadence" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Small upgrades often beat one terrifying upgrade a year
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A team that upgrades dependencies once a year, in one enormous pull request, isn&apos;t
        being cautious. It&apos;s deferring the pain and letting it compound. Twelve months of
        skipped versions means twelve months of accumulated breaking changes arriving all at once,
        which makes the PR bigger and scarier, which makes it more likely to get pushed off again.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The alternative is smaller and more boring: patch and minor version bumps arrive
        continuously, in small pull requests your CI can actually verify one at a time.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A weekly automated update job
        </p>
        <CodeBlock
          language="YAML"
          code={`# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Each PR is small enough to actually review, small enough for CI to catch a real
        regression, and small enough that merging it doesn&apos;t feel like a risk worth
        postponing. By the time a real CVE lands in something you depend on, you&apos;re already
        close to the latest version instead of three major releases behind it, and the emergency
        patch is a normal-sized change instead of the year&apos;s biggest migration.
      </p>
    </section>
  );
}
