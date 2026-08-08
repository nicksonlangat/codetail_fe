import { CodeBlock } from "@/components/blog/interactive/code-block";

export function CSRFTokensSection() {
  return (
    <section>
      <h2 id="csrf-tokens" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        CSRF tokens: proving the request came from your own form
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A CSRF token is a random, unpredictable value the server generates and embeds in the real
        form. On submission, the server checks that the token in the request matches the one it
        issued for that session. The forged form from the last section has no way to know that
        value, so its request fails the check.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          The real form, served by bank.example itself
        </p>
        <CodeBlock
          language="HTML"
          code={`<form action="/account/email" method="POST">
  <input type="hidden" name="csrf_token" value="{{ csrf_token }}">
  <input type="email" name="email">
  <button type="submit">Update email</button>
</form>`}
        />
      </div>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: issue a token, then require it back
        </p>
        <CodeBlock
          variant="fixed"
          code={`@app.route("/account/email", methods=["GET"])
@login_required
def email_form():
    token = generate_csrf_token(session)
    return render_template("email_form.html", csrf_token=token)

@app.route("/account/email", methods=["POST"])
@login_required
def change_email():
    if request.form.get("csrf_token") != session.get("csrf_token"):
        abort(403)
    current_user.email = request.form["email"]
    db.session.commit()
    return redirect("/account")`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Why can&apos;t the attacker just read the token off the real page and put it in their
        form? Same-origin policy. A script running on{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">evil.example</code>{" "}
        can point the victim&apos;s browser at{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">bank.example</code>,
        but it can&apos;t read the response, embed it in an iframe and inspect its contents, or
        otherwise get at the token value. The browser enforces that boundary regardless of what
        the attacker&apos;s page tries.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        This is why the token has to be unpredictable, not just present. A hidden field with a
        constant value, or one derived from something guessable like the user&apos;s ID, defeats
        the entire point, the attacker just puts the same predictable value in their forged form.
        Use whatever your framework generates for this (Django, Rails, and most others ship one
        built in) rather than rolling your own.
      </p>
    </section>
  );
}
