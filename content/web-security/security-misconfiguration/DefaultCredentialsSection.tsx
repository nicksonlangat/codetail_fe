import { CodeBlock } from "@/components/blog/interactive/code-block";

export function DefaultCredentialsSection() {
  return (
    <section>
      <h2 id="default-credentials" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Default credentials: someone is already scanning for these
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A seed script that creates a demo admin account for local development, or an internal
        service that ships with no password because &quot;it&apos;s only for internal use,&quot;
        is completely reasonable until the thing it&apos;s attached to becomes reachable from the
        open internet.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A Redis instance, configured the way the default config file ships
        </p>
        <CodeBlock
          variant="vulnerable"
          language="Bash"
          code={`bind 0.0.0.0
# requirepass is commented out by default`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Redis with no password, bound to every network interface, is one port scan away from
        anyone on the internet, not a targeted attacker, an automated scanner running against
        every IPv4 address, finding it. Services like Shodan exist specifically to index exposed
        infrastructure like this, and unauthenticated Redis, MongoDB, and Elasticsearch instances
        are a permanent fixture on that list, discovered in minutes of going live, not months.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: authentication required, and bound to a private network
        </p>
        <CodeBlock
          variant="fixed"
          language="Bash"
          code={`bind 127.0.0.1 10.0.4.12
requirepass a-real-generated-password`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The same story plays out at the application layer: a demo account seeded as{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">admin / admin123</code>{" "}
        for local testing, meant to be deleted before launch, that survives because the cleanup
        step was a manual note in a README instead of something the deploy process enforced.
      </p>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted">
          <strong>In practice:</strong> don&apos;t ship a default credential at all, even a
          temporary one. Force a real password on first run, generate one randomly and print it
          once, or require setup through a flow that can&apos;t be skipped. A default that has to
          be manually remembered and manually removed will eventually reach production, on some
          deploy, by some team, no exception.
        </p>
      </div>
    </section>
  );
}
