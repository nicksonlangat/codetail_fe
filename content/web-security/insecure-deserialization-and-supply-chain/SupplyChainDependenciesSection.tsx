import { CodeBlock } from "@/components/blog/interactive/code-block";

export function SupplyChainDependenciesSection() {
  return (
    <section>
      <h2 id="supply-chain-dependencies" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Every install command is part of your attack surface
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A dependency isn&apos;t reviewed code you happen not to have written. For almost every
        project, it&apos;s code nobody on the team has ever read, running with the same privileges
        as the code they did write. Real incidents have come from exactly this gap: a popular
        npm package&apos;s maintainer account gets compromised, or a maintainer deliberately ships
        a sabotaged version, and a malicious update goes out under a name and reputation
        developers already trusted.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A dependency range that auto-upgrades to whatever gets published
        </p>
        <CodeBlock
          variant="vulnerable"
          language="JSON"
          code={`{
  "dependencies": {
    "some-popular-package": "^4.17.0"
  }
}`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">^4.17.0</code>{" "}
        means any 4.x release is accepted automatically, no review, no diff, no human decision.
        If a compromised or malicious 4.17.1 goes out an hour after the real maintainer&apos;s
        account was taken over, the next{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">npm install</code>{" "}
        anywhere on the team, or worse, in CI, pulls it in without anyone noticing anything
        changed.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: exact versions, a committed lockfile, and CI that respects it
        </p>
        <CodeBlock
          variant="fixed"
          language="Bash"
          code={`# CI installs exactly what the lockfile says, nothing newer, nothing different
npm ci

# Python equivalent: fail the build if an installed package doesn't match a pinned hash
pip install --require-hashes -r requirements.txt`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">npm ci</code>{" "}
        installs exactly what&apos;s in{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">package-lock.json</code>,
        no version resolution, no surprises. An upgrade becomes a deliberate act: someone runs the
        update, a diff shows up in the lockfile, and it goes through review like any other code
        change. Pair that with automated scanning as a required CI gate, not a dashboard nobody
        checks,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">npm audit</code>,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">pip-audit</code>,
        or Dependabot, so a known vulnerability in something already installed fails the build
        instead of sitting there unnoticed.
      </p>
    </section>
  );
}
