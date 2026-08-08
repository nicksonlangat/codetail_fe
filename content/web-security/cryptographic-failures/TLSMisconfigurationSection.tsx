import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TLSMisconfigurationSection() {
  return (
    <section>
      <h2 id="tls-misconfiguration" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        TLS misconfiguration: the one-line fix that undoes everything
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This exact line shows up in real production code more often than any other bug in this
        article, usually written under deadline pressure to make an annoying certificate error go
        away.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Calling an internal service
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`response = requests.get("https://internal-service.local/api/data", verify=False)`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The whole point of TLS is that your client checks the server&apos;s certificate against a
        trusted authority before trusting anything the server sends back.{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">verify=False</code>{" "}
        turns that check off entirely. The connection is still encrypted, technically, but your
        code will now happily talk to anyone who intercepts the connection and presents any
        certificate at all, expired, self-signed, issued for a completely different domain,
        doesn&apos;t matter. A man-in-the-middle attack that TLS exists specifically to prevent
        becomes trivial the moment this line ships.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        It almost always starts the same way: an internal service has a self-signed or expired
        certificate, the request throws{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          SSLCertVerificationError
        </code>
        , and{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">verify=False</code>{" "}
        makes the error disappear in about ten seconds. It usually isn&apos;t removed before the
        code reaches production.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: point verification at the right authority instead of turning it off
        </p>
        <CodeBlock
          variant="fixed"
          code={`response = requests.get(
    "https://internal-service.local/api/data",
    verify="/etc/ssl/certs/internal-ca-bundle.pem",
)`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        If the internal service uses your organization&apos;s own certificate authority, point{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">verify</code>{" "}
        at that authority&apos;s bundle instead of a public one. Verification stays on, it&apos;s
        just checking against the CA that actually issued the certificate. The same instinct
        applies at the infrastructure level: audit which TLS versions and cipher suites your load
        balancer still accepts (TLS 1.0 and 1.1 have known weaknesses and no reason to still be
        enabled), tools like testssl.sh or Qualys SSL Labs will tell you exactly what&apos;s
        exposed.
      </p>
    </section>
  );
}
