import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TheAttackSection() {
  return (
    <section>
      <h2 id="the-attack" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The browser sends the cookie, the attacker sends the request
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Cookies are scoped to a domain, not to whichever page happened to trigger the request that
        carries them. If you&apos;re logged into{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">bank.example</code>{" "}
        in one tab, and a completely unrelated page in another tab sends a request to{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">bank.example</code>,
        your browser attaches your bank session cookie to that request too. It doesn&apos;t ask
        which tab you meant. It just sees a request going to a domain it holds a cookie for.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          An account email change, guarded by nothing but the session cookie
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`@app.route("/account/email", methods=["POST"])
@login_required
def change_email():
    new_email = request.form["email"]
    current_user.email = new_email
    db.session.commit()
    return redirect("/account")`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This looks fine in isolation. It checks that the request came from a logged-in session,
        which is the only thing{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">@login_required</code>{" "}
        was ever going to check. It never asks whether the request was something the user actually
        meant to send.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A page hosted on a completely different domain, evil.example
        </p>
        <CodeBlock
          variant="vulnerable"
          language="HTML"
          code={`<form action="https://bank.example/account/email" method="POST" id="f">
  <input type="hidden" name="email" value="attacker@evil.example">
</form>
<script>document.getElementById("f").submit();</script>`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A victim who&apos;s logged into{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">bank.example</code>{" "}
        and gets lured to this page, an email link, a forum post, an ad, has the form
        auto-submit the moment the page loads. Nothing about the request looks forged from the
        server&apos;s side. It arrives as a normal POST, with a valid session cookie attached,
        because the browser attached it automatically. The user&apos;s email on the bank account
        changes to one the attacker controls, and the usual next step is a password reset flow
        that now goes straight to them.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          The attacker never sees the victim&apos;s cookie, never steals a token, never touches
          the bank&apos;s servers directly. They just get the victim&apos;s own browser to send a
          request the victim never meant to send, and the browser cooperates, because attaching
          cookies to a request is exactly what browsers are supposed to do.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        This only works because the endpoint has no way to tell &quot;a request with a valid
        cookie&quot; apart from &quot;a request the user actually intended to make.&quot; Every
        defense in this article is some version of teaching it that difference.
      </p>
    </section>
  );
}
