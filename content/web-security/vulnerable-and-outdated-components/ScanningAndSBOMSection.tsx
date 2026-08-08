import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ScanningAndSBOMSection() {
  return (
    <section>
      <h2 id="dependency-scanning-and-sboms" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Knowing what you&apos;re running, before you need to know
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        When a new CVE like Log4Shell breaks, the first question every team asks is &quot;do we
        have this anywhere.&quot; Answering that by manually asking every team, for every service,
        is how a bad afternoon turns into a bad week. The answer should already be sitting in a
        file.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A software bill of materials is exactly that file: a generated, machine-readable list of
        every component in a built artifact, direct and transitive, usually in CycloneDX or SPDX
        format.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          One entry from an SBOM, generated at build time
        </p>
        <CodeBlock
          language="JSON"
          code={`{
  "name": "log4j-core",
  "version": "2.14.1",
  "purl": "pkg:maven/org.apache.logging.log4j/log4j-core@2.14.1"
}`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        With this generated for every service on every build, answering &quot;do we have this
        anywhere&quot; becomes a search across a set of files you already have, not a fire drill
        across every team you have.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Automated scanning is the same idea running continuously instead of on demand:{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">npm audit</code>,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">pip-audit</code>,
        Snyk, or Trivy for container images, checking every dependency against a known-vulnerability
        database on every build. Wire it in as a required check that fails the build on a
        high-severity match, not a dashboard that produces a report nobody opens.
      </p>
    </section>
  );
}
