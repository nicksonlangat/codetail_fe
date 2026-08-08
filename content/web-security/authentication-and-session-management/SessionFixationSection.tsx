import { CodeBlock } from "@/components/blog/interactive/code-block";

export function SessionFixationSection() {
  return (
    <section>
      <h2 id="session-fixation" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Session fixation: the ID doesn&apos;t change when you think it does
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Most frameworks hand every visitor a session ID before they&apos;ve logged in at all,
        useful for a shopping cart or a CSRF token that needs to exist pre-authentication. The bug
        shows up when that same ID just gets promoted to &quot;authenticated&quot; after login,
        with nothing about the ID itself ever changing.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A login handler that trusts whatever session ID the request already had
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`@app.route("/login", methods=["POST"])
def login():
    user = authenticate(request.form["email"], request.form["password"])
    if user:
        session["user_id"] = user.id  # same session ID as before login
        return redirect("/dashboard")
    return "Invalid credentials", 401`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Here&apos;s the attack. The attacker visits the site once, unauthenticated, and notes
        their own session ID from the cookie the server just handed them, say{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">abc123</code>.
        They get the victim to open a link that plants that exact same ID in the victim&apos;s
        browser, some apps accept a session ID from a query string or a shared parent domain
        cookie, which is its own bug but a common one. The victim logs in normally, with their own
        real credentials, in their own browser. The session referenced by{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">abc123</code>{" "}
        is now authenticated as the victim. The attacker already knows{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">abc123</code>,
        so their own browser is too.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Nobody stole a password here, and nobody read a cookie they weren&apos;t supposed to. The
        attacker planted an ID before authentication happened, and the app never bothered to
        assign a new one once it did.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: a new session ID on every privilege change
        </p>
        <CodeBlock
          variant="fixed"
          code={`@app.route("/login", methods=["POST"])
def login():
    user = authenticate(request.form["email"], request.form["password"])
    if user:
        session.regenerate_id()  # old ID, whatever it referenced, is now dead
        session["user_id"] = user.id
        return redirect("/dashboard")
    return "Invalid credentials", 401`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Whatever the attacker planted stops mattering the moment login succeeds, because the ID
        that becomes authenticated is a fresh one they never saw. Most frameworks have this built
        in under some name (Django calls it{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">cycle_key()</code>,
        plenty of session libraries call it{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">regenerate()</code>).
        The same call belongs on logout and on password change too, any point where the
        session&apos;s privilege level actually shifts.
      </p>
    </section>
  );
}
