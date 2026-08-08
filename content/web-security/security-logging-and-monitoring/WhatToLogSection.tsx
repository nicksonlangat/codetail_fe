import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhatToLogSection() {
  return (
    <section>
      <h2 id="what-to-log" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Logging enough to answer &quot;who did what, when&quot;
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A generic access log, one line per HTTP request, method, path, status code, tells you
        traffic happened. It rarely tells you anything useful about a security incident six months
        later: which authenticated user took the action, whether it succeeded, and from where.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A login handler with no security-relevant logging at all
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`@app.route("/login", methods=["POST"])
def login():
    user = authenticate(request.form["email"], request.form["password"])
    if user:
        session["user_id"] = user.id
        return redirect("/dashboard")
    return "Invalid credentials", 401`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A thousand failed login attempts against this endpoint, spread across an hour, leave
        nothing behind. Not a trace, not a count, nothing to look at after the fact even if
        someone knew to look.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: a structured event for every security-relevant action
        </p>
        <CodeBlock
          variant="fixed"
          code={`@app.route("/login", methods=["POST"])
def login():
    user = authenticate(request.form["email"], request.form["password"])
    log_security_event(
        action="login_attempt",
        actor=request.form.get("email"),
        outcome="success" if user else "failure",
        source_ip=request.remote_addr,
    )
    if user:
        session["user_id"] = user.id
        return redirect("/dashboard")
    return "Invalid credentials", 401`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The specific fields matter less than the discipline of always including them: who (the
        actor), what (the action), on what (the target, where applicable), when, from where, and
        whether it succeeded. Apply that same structure to authorization failures, password and
        email changes, admin actions, and data exports, the events that actually matter when
        someone&apos;s reconstructing what happened, not just that something did.
      </p>
    </section>
  );
}
