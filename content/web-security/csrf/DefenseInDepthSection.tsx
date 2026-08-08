import { CodeBlock } from "@/components/blog/interactive/code-block";

export function DefenseInDepthSection() {
  return (
    <section>
      <h2 id="defense-in-depth" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Layering the defenses, and what JSON APIs get for free
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        None of the three defenses above is meant to stand alone. CSRF tokens protect
        form-submitting requests. SameSite protects against browsers that respect it, which is
        most of them now, but not every client an app might have to support. Correct HTTP methods
        remove an entire category of exploit outright. Use all three, and a gap in one is covered
        by the other two.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        JSON APIs get a defense almost by accident
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A plain HTML{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">{"<form>"}</code>{" "}
        can only send a body as{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          application/x-www-form-urlencoded
        </code>
        ,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">multipart/form-data</code>,
        or{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">text/plain</code>.
        It cannot set{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Content-Type: application/json</code>{" "}
        without JavaScript, and cross-origin JavaScript that tries to make that request triggers a
        CORS preflight your server controls the answer to. An endpoint that only accepts JSON is,
        without anyone specifically designing it that way, already unreachable by a bare
        auto-submitting form.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Requiring the content type is a real, if incidental, CSRF check
        </p>
        <CodeBlock
          variant="fixed"
          code={`@app.route("/api/account/email", methods=["POST"])
@login_required
def change_email_api():
    if request.headers.get("Content-Type") != "application/json":
        abort(400)
    current_user.email = request.get_json()["email"]
    db.session.commit()
    return {"status": "ok"}`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This only holds as long as your CORS configuration doesn&apos;t undo it, an{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          Access-Control-Allow-Origin: *
        </code>{" "}
        paired with credentials enabled hands the whole protection back to any origin that asks.
        That&apos;s its own failure mode, covered in the misconfiguration article later in this
        series, worth knowing about now so it doesn&apos;t undo the work here without you
        noticing.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        For anything that really matters, ask again
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Tokens and SameSite stop the forged request from working. For actions where the cost of
        being wrong is high, wiring transfers, changing the account email, deleting an
        organization, add a second factor the token model doesn&apos;t cover: re-enter your
        password, confirm a code sent to your existing email, whatever fits the product. It
        doesn&apos;t replace the defenses above. It just accepts that any single check can fail in
        a way nobody predicted, and makes sure the most damaging actions don&apos;t depend on only
        one.
      </p>
    </section>
  );
}
