import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PasswordResetSection() {
  return (
    <section>
      <h2 id="password-reset" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Password reset: authentication&apos;s back door
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The login form gets the scrutiny. The &quot;forgot your password&quot; flow next to it,
        which grants full account access to whoever proves control of an email address, usually
        gets less. Two specific bugs show up here often enough to name them.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Reset tokens that are only pretending to be random
      </h3>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A token that looks random because it&apos;s hashed
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`def generate_reset_token(user):
    raw = f"{user.id}-{int(time.time())}"
    return hashlib.md5(raw.encode()).hexdigest()`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This produces a string that looks exactly like every other hash, and it&apos;s completely
        determined by two things an attacker can pin down: the user&apos;s ID, often sequential or
        leaked through an unrelated IDOR, and the timestamp of the request, narrowable to a small
        window from something as simple as when the reset email arrived. Brute-forcing every
        second in a five-minute window offline takes nothing on modern hardware. The token was
        never a secret, it was a hash of two numbers the attacker already had or could guess.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: a token with nothing to derive
        </p>
        <CodeBlock
          variant="fixed"
          code={`def generate_reset_token(user):
    token = secrets.token_urlsafe(32)
    store_reset_token(user.id, token, expires_in_minutes=15, single_use=True)
    return token`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">secrets.token_urlsafe</code>{" "}
        isn&apos;t derived from anything guessable, it&apos;s generated from the OS&apos;s
        cryptographic random source. Storing it server-side means it can expire, and get
        invalidated the moment it&apos;s used once, so a token that leaked but was never used
        stops being useful after fifteen minutes instead of forever.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Trusting the Host header to build the reset link
      </h3>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          The email your app sends
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    user = get_user_by_email(request.form["email"])
    token = generate_reset_token(user)
    reset_link = f"https://{request.headers['Host']}/reset?token={token}"
    send_email(user.email, f"Reset your password: {reset_link}")`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A browser sets the{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Host</code>{" "}
        header to match the address bar, but nothing requires that. A raw HTTP request can set{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Host</code>{" "}
        to anything, and if your app or the infrastructure in front of it doesn&apos;t check it
        against an allowlist, an attacker submits the victim&apos;s real email address to{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">/forgot-password</code>{" "}
        with{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Host: evil.example</code>.
        The token is real, the email comes from your legitimate sending address, and the link
        inside it points to a page the attacker controls. The victim reads a completely genuine
        email and clicks a completely poisoned link.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: the host comes from your config, never from the request
        </p>
        <CodeBlock
          variant="fixed"
          code={`ALLOWED_HOST = "app.example"  # from config, not from the request

@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    user = get_user_by_email(request.form["email"])
    token = generate_reset_token(user)
    reset_link = f"https://{ALLOWED_HOST}/reset?token={token}"
    send_email(user.email, f"Reset your password: {reset_link}")`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Anywhere a request header feeds into a link, a redirect, or anything else you&apos;re
        asking a user to trust, treat that header the way you&apos;d treat a form field: it came
        from the client, and the client can put whatever it wants there.
      </p>
    </section>
  );
}
