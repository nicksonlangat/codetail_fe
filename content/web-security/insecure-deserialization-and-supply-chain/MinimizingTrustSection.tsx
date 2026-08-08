import { CodeBlock } from "@/components/blog/interactive/code-block";

export function MinimizingTrustSection() {
  return (
    <section>
      <h2 id="minimizing-what-you-trust" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Reducing what a compromised dependency can actually reach
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Package managers let a dependency run arbitrary code the moment it&apos;s installed, not
        just when your app calls into it.{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">postinstall</code>{" "}
        and{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">preinstall</code>{" "}
        scripts execute automatically during{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">npm install</code>,
        which is how several real supply-chain attacks worked: the victim never imported or called
        the malicious code, running the install was already enough.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The most common thing a malicious install script goes looking for is CI secrets, because
        CI is where install scripts run automatically, unattended, with whatever credentials that
        pipeline happens to have lying around in its environment.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A pipeline where the test job can see every production secret
        </p>
        <CodeBlock
          variant="vulnerable"
          language="YAML"
          code={`jobs:
  test:
    steps:
      - run: npm ci   # a malicious postinstall script here can read everything below
      - run: npm test
        env:
          AWS_DEPLOY_KEY: \${{ secrets.AWS_DEPLOY_KEY }}
          NPM_PUBLISH_TOKEN: \${{ secrets.NPM_PUBLISH_TOKEN }}`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        There&apos;s no reason a test run needs a production deploy key or a publish token
        available in its environment at all. If a dependency installed for testing turns out to be
        malicious, this configuration hands it both anyway.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: secrets scoped to the one job that actually needs them
        </p>
        <CodeBlock
          variant="fixed"
          language="YAML"
          code={`jobs:
  test:
    steps:
      - run: npm ci
      - run: npm test   # no deploy secrets exist in this job's environment at all

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - run: npm run deploy
        env:
          AWS_DEPLOY_KEY: \${{ secrets.AWS_DEPLOY_KEY }}`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The same install of the same compromised package now has nothing to steal from the job it
        actually runs in. Combine that with keeping the dependency tree itself smaller, fewer
        packages means fewer maintainer accounts you&apos;re implicitly trusting, and reviewing
        anything with a lifecycle script before it&apos;s added, and a supply-chain compromise
        stops being a straight line from &quot;one dependency&quot; to &quot;full production
        access.&quot;
      </p>
    </section>
  );
}
