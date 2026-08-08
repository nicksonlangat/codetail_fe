import { CodeBlock } from "@/components/blog/interactive/code-block";

export function KeyManagementSection() {
  return (
    <section>
      <h2 id="key-management" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Key management: the part encryption tutorials skip
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Every fix in this article assumed a key exists somewhere safe to encrypt with, sign with,
        or hash with. That assumption is where a lot of otherwise correct cryptography quietly
        falls apart.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          settings.py, committed to the repository
        </p>
        <CodeBlock variant="vulnerable" code={`SECRET_KEY = "dev-secret-please-change"`} />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Placeholder values like this have a habit of outliving the comment telling you to change
        them. If this key signs session cookies or JWTs and it ships unchanged to production,
        anyone who can read the source, which might be more people than you&apos;d guess for a
        &quot;private&quot; repo, can forge a valid, signed token for any user in the system.
        There&apos;s no bug to exploit beyond reading a file that was never supposed to be secret
        in the first place.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: unique per environment, never in source
        </p>
        <CodeBlock variant="fixed" code={`SECRET_KEY = os.environ["SECRET_KEY"]`} />
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        One key doing two jobs is one leak away from two breaches
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        It&apos;s tempting to reuse the same key for signing auth tokens and encrypting sensitive
        database fields, it&apos;s one less secret to manage. It also means a single leak, from
        either purpose, compromises both systems at once. Separate keys per purpose keep a leak
        contained to whatever that one key was actually for.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        A key that never rotates is a leak with no expiration date
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        A static key that&apos;s been in place for three years is still fully valid today if it
        leaked in year one, from an old backup, a former employee&apos;s laptop, a debug log
        nobody scrubbed. Rotating keys on a schedule bounds how long a leak that already happened
        can still be exploited. This is exactly what a real KMS (AWS KMS, GCP KMS, HashiCorp
        Vault) is built to handle: rotation, per-purpose separation, and access auditing, without
        your application code ever needing to know the current key&apos;s actual value.
      </p>
    </section>
  );
}
