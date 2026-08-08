import { CodeBlock } from "@/components/blog/interactive/code-block";

export function AlertingOnSignalSection() {
  return (
    <section>
      <h2 id="alerting-on-the-right-signal" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Having logs isn&apos;t the same thing as having detection
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Every fix in this article so far produces logs. Logs sitting in storage, queried for the
        first time after someone else tells you something went wrong, aren&apos;t monitoring.
        Monitoring means something is actively watching for a specific pattern and telling a human
        before the damage is done, not after.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The patterns worth alerting on are usually more specific than &quot;an error occurred.&quot;
        A few that map directly onto attacks covered elsewhere in this series:
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Detection rules, expressed as intent rather than any one tool&apos;s syntax
        </p>
        <CodeBlock
          code={`ALERT IF failed_logins(account=X, window=10m) > 5
  # one account, many attempts: brute force

ALERT IF failed_logins(source_ip=Y, window=10m) > 20 across distinct accounts
  # many accounts, one source: credential stuffing

ALERT IF admin_action performed AND (hour outside 06:00-22:00 OR new_device = true)
  # a privileged action at an unusual time, from somewhere new

ALERT IF GET /users/{id}(actor=Z, window=1h) > 200 distinct ids
  # one account reading far more records than a real user ever would`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        None of these require anything exotic, they&apos;re counts and thresholds over the
        structured events from the first section of this article. What they require is deciding,
        ahead of time, which specific patterns actually matter, instead of hoping someone
        eventually reads the raw log stream and happens to notice something wrong in it.
      </p>
    </section>
  );
}
