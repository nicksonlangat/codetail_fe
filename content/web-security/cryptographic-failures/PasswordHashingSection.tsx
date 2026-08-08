import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PasswordHashingSection() {
  return (
    <section>
      <h2 id="password-hashing" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Password hashing: fast is exactly the wrong property
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Plenty of breached apps did hash their passwords. The breach report just doesn&apos;t
        usually make the front page distinction between that and hashing them with the right
        function.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A hash function, used the way it&apos;s used for checksums
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        SHA-256 does exactly what it was designed to do: hash large amounts of data quickly and
        deterministically. That&apos;s the right property for verifying a file download and the
        wrong one for a password. A modern GPU computes billions of SHA-256 hashes per second, so
        a stolen dump of hashes gets checked against a cracking dictionary at a rate where most
        real users&apos; passwords fall within hours, salt or no salt. The salt stops attackers
        from precomputing one giant rainbow table for every account at once, it does nothing
        about the speed of cracking any individual hash.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: a hash function designed to be slow
        </p>
        <CodeBlock
          variant="fixed"
          code={`def hash_password(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))

def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode(), hashed)`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        bcrypt (and argon2, its more modern alternative) are deliberately, tunably slow. The{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">rounds</code>{" "}
        parameter is a work factor: checking one password takes a fraction of a second by design,
        which is invisible to a real login request and brutal to an attacker trying billions of
        guesses. Raise the work factor as hardware gets faster, that&apos;s the whole point of
        making it a parameter instead of a fixed algorithm.
      </p>
    </section>
  );
}
