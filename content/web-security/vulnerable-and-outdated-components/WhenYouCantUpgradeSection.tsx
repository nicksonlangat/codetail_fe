export function WhenYouCantUpgradeSection() {
  return (
    <section>
      <h2 id="when-you-cant-upgrade-yet" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        When you genuinely can&apos;t upgrade yet
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Sometimes the fixed version is a real migration, not a version bump, or the maintainer
        hasn&apos;t shipped a patch yet at all. &quot;Upgrade immediately&quot; isn&apos;t always
        an available option the moment a CVE drops.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Start by checking whether the vulnerable code path is even reachable through how you
        actually use the library. Plenty of CVEs live in a feature or configuration most consumers
        never touch, if your usage never calls that function or never enables that option, the
        severity to you specifically may be lower than the published score, though this is a
        judgment call worth documenting, not an excuse to stop investigating.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        If it is reachable and the real fix is weeks out, a compensating control buys time: a
        WAF rule blocking the known exploit pattern at the edge, a temporary config change that
        disables the vulnerable feature, or in extreme cases a small patch to the vendored code
        while you wait for an upstream release.
      </p>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted">
          <strong>In practice:</strong> every one of these is a bridge, not a destination. A WAF
          rule blocking today&apos;s known exploit string does nothing about tomorrow&apos;s
          slightly different one. Track the real upgrade as a scheduled, owned piece of work with
          an actual date, not a mitigation you quietly forget about once the immediate pressure is
          gone.
        </p>
      </div>
    </section>
  );
}
