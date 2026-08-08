export function NetworkLevelDefenseSection() {
  return (
    <section>
      <h2 id="network-level-defense" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Don&apos;t make application code the only thing standing in the way
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The allowlist in the last section is real protection, and it&apos;s also hand-written
        validation logic with edge cases in it, which is exactly the category of code this whole
        article is about. Treat it as one layer, not the only one.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The layer underneath it is network-level, not application-level: firewall or security
        group rules that block your application server from reaching internal-only ranges and the
        metadata endpoint at all, regardless of what URL your code is told to fetch. If the
        network path to{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">169.254.169.254</code>{" "}
        or your internal admin API simply doesn&apos;t exist from the box running this feature, a
        bug in the allowlist stops being able to reach anything worth stealing, no matter how
        cleverly it&apos;s exploited.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Some teams go further and run any &quot;fetch a URL the user gave us&quot; feature on a
        dedicated, egress-restricted worker with no route into the rest of the internal network at
        all, separate from the servers that actually hold credentials and talk to internal
        services. A full SSRF exploit against that worker still only reaches the public internet
        it was already allowed to reach. This is the same instinct as least-privilege database
        accounts from the injection article: assume the check you wrote will eventually miss a
        case, and make sure that when it does, there&apos;s a smaller blast radius waiting on the
        other side of it, not the whole network.
      </p>
    </section>
  );
}
