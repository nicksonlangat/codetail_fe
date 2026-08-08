import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TokenExpiryAndRotationSection() {
  return (
    <section>
      <h2 id="token-expiry-and-rotation" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Token expiry and rotation
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Authentication doesn&apos;t end at login. A session or token that lives forever is a
        standing invitation, and JWTs make it easy to build one without noticing, because nothing
        forces you to add an expiry.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A token with no expiry claim
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`def issue_token(user):
    return jwt.encode({"user_id": user.id}, SECRET_KEY, algorithm="HS256")`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A JWT is verified by its signature alone. Without an{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">exp</code>{" "}
        claim, this token is valid for as long as the signing key doesn&apos;t change, which in
        practice means forever. If it leaks, a log line that captured a header it shouldn&apos;t
        have, a compromised laptop, a request logged by a debugging proxy, there&apos;s no way to
        invalidate that one token specifically. The only lever is rotating the signing key, which
        logs out every user, not just the one whose token leaked.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: a short-lived access token, backed by a revocable refresh token
        </p>
        <CodeBlock
          variant="fixed"
          code={`def issue_access_token(user):
    payload = {
        "user_id": user.id,
        "exp": datetime.utcnow() + timedelta(minutes=15),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def issue_refresh_token(user):
    token = secrets.token_urlsafe(32)
    store_refresh_token(user.id, token, expires_in_days=30)
    return token`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A leaked access token now has a fifteen-minute shelf life instead of an unlimited one. The
        refresh token does the work of avoiding a re-login every fifteen minutes, and because
        it&apos;s stored server-side rather than just verified by a signature, it actually can be
        revoked on its own, without touching anyone else&apos;s session.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Rotation turns theft into something you can detect
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A refresh token that gets reused indefinitely is still a long-lived secret, just one layer
        removed from the access token. Rotate it on every use, issue a new one and kill the old one
        in the same request, and a stolen refresh token starts behaving strangely the moment
        both the attacker and the legitimate client try to use it: whichever one goes second is
        presenting a token that&apos;s already been retired.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Reuse of a retired refresh token is treated as a compromise signal
        </p>
        <CodeBlock
          variant="fixed"
          code={`def use_refresh_token(token):
    record = get_refresh_token(token)
    if record is None or record.revoked:
        # this exact token was already rotated out once; someone else has a copy
        revoke_token_family(record.family_id)
        abort(401)
    revoke_token(token)
    return issue_refresh_token(record.user, family_id=record.family_id)`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        That reuse check is the actual point of rotating in the first place. It doesn&apos;t just
        shrink the window a stolen token is useful for, it turns theft into an event your system
        can notice and react to, by killing every token descended from the same login instead of
        waiting for someone to report suspicious activity on their account.
      </p>
    </section>
  );
}
