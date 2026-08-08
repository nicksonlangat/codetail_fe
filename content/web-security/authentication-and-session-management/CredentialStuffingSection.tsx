import { CodeBlock } from "@/components/blog/interactive/code-block";

export function CredentialStuffingSection() {
  return (
    <section>
      <h2 id="credential-stuffing" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Credential stuffing: the bug isn&apos;t in your code
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Somewhere, a list of a few hundred million real email and password pairs from some other
        company&apos;s breach is being tried against your login form right now, by automation, not
        a person, on the bet that some fraction of your users reused a password. Nothing in your
        code caused this list to exist. It still has to be your code that stops it from working.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A login endpoint with no rate limiting at all
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`@app.route("/login", methods=["POST"])
def login():
    user = db.query(User).filter_by(email=request.form["email"]).first()
    if user and check_password_hash(user.password_hash, request.form["password"]):
        session["user_id"] = user.id
        return redirect("/dashboard")
    return "Invalid email or password", 401`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This is worth reading twice, because it&apos;s already doing one thing right: the error
        message is identical whether the email doesn&apos;t exist or the password is wrong, so it
        doesn&apos;t hand an attacker a way to enumerate valid accounts one guess at a time. What
        it doesn&apos;t do is limit how many guesses anyone gets, at any speed, from any number of
        source IPs.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That&apos;s the distinction from plain brute force. Brute force hammers one account with
        many passwords, and a simple per-account lockout catches it. Credential stuffing spreads
        one password per account across your entire user base, often from thousands of rotating
        IPs through a botnet, so no single account and no single IP looks unusual. A lockout
        policy built for brute force doesn&apos;t even notice.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: rate limit by account and by source together
        </p>
        <CodeBlock
          variant="fixed"
          code={`limiter = Limiter(
    app,
    key_func=lambda: request.form.get("email", "") or get_remote_address(),
)

@app.route("/login", methods=["POST"])
@limiter.limit("5 per minute")
def login():
    user = db.query(User).filter_by(email=request.form["email"]).first()
    if user and check_password_hash(user.password_hash, request.form["password"]):
        session["user_id"] = user.id
        return redirect("/dashboard")
    return "Invalid email or password", 401`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Rate limiting slows a distributed attack down, it doesn&apos;t stop it, a patient enough
        attacker with enough IPs works around any threshold you pick. The defense that actually
        closes this off is a second factor: a stuffed credential that happens to be correct still
        can&apos;t get past MFA. Failing that, checking new passwords against a known-breach list
        (the Have I Been Pwned API is the common choice) and forcing a reset when there&apos;s a
        match closes the specific hole credential stuffing depends on, before anyone even tries
        to log in with it.
      </p>
    </section>
  );
}
