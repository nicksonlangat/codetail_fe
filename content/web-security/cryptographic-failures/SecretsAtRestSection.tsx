import { CodeBlock } from "@/components/blog/interactive/code-block";

export function SecretsAtRestSection() {
  return (
    <section>
      <h2 id="secrets-at-rest" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Secrets at rest: in your database, and in your git history
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A SaaS app that stores a customer&apos;s Stripe key or Slack token to call their API on
        their behalf has to keep that key somewhere. Where, and how, decides what a database
        breach actually costs you.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A table storing a customer&apos;s third-party API key as plain text
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`class Integration(Base):
    __tablename__ = "integrations"
    id = Column(Integer, primary_key=True)
    provider = Column(String)
    api_key = Column(String)  # plain text`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        If this table is ever exfiltrated, a misconfigured backup left on a public bucket, a SQL
        injection that reaches this far, an insider with read access they shouldn&apos;t have,
        every customer&apos;s API key is immediately usable by whoever has the dump. The database
        being &quot;secure&quot; was the only thing standing between a breach and every one of
        your customers&apos; connected accounts.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: encrypt the field with a key that isn&apos;t in the database
        </p>
        <CodeBlock
          variant="fixed"
          code={`fernet = Fernet(os.environ["FIELD_ENCRYPTION_KEY"])

def store_api_key(integration, raw_key):
    integration.api_key = fernet.encrypt(raw_key.encode())

def get_api_key(integration):
    return fernet.decrypt(integration.api_key).decode()`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A dump of this table now contains ciphertext, useless without the encryption key, which
        should live in a KMS or secrets manager, not in the same place as the data it protects.
        That&apos;s the part worth repeating: encrypting a column does nothing if the key sits
        right next to it in the same config or the same database.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        The same mistake, in git instead of a database
      </h3>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A .env file, tracked in the repo
        </p>
        <CodeBlock
          variant="vulnerable"
          language="Bash"
          code={`STRIPE_SECRET_KEY=sk_live_51H8x...
DATABASE_URL=postgres://admin:hunter2@prod-db.internal:5432/app`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Deleting this file in a later commit doesn&apos;t remove it from git history, anyone with
        clone access can still check out the commit that added it. A repo that goes public later,
        gets forked, or is shared with a contractor for one unrelated task exposes every secret
        that ever touched it. The fix is boring on purpose:{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">.env</code>{" "}
        in{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">.gitignore</code>{" "}
        from the first commit, secrets loaded from the environment or a secrets manager, never
        typed into a file that a{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">git add .</code>{" "}
        could pick up.
      </p>
    </section>
  );
}
