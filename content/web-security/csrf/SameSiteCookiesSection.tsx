import { CodeBlock } from "@/components/blog/interactive/code-block";

export function SameSiteCookiesSection() {
  return (
    <section>
      <h2 id="samesite-cookies" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        SameSite cookies, and why a state-changing GET is the real bug underneath
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">SameSite</code>{" "}
        cookie attribute tells the browser when it&apos;s allowed to attach a cookie to a
        cross-site request at all, which moves this defense out of your application code and into
        the browser itself.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A session cookie, set correctly
        </p>
        <CodeBlock language="HTTP" code={`Set-Cookie: session=abc123; SameSite=Lax; Secure; HttpOnly`} />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Strict</code>{" "}
        never sends the cookie on a cross-site request, full stop, including when the user clicks
        a link to your own site from an email. That&apos;s airtight and also mildly broken UX:
        the user lands on your site logged out and has to navigate again for the cookie to kick
        in.{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Lax</code>{" "}
        is the middle ground and the default in every modern browser: it withholds the cookie from
        cross-site POSTs, image loads, iframes, and fetch calls, but still sends it on a top-level
        navigation, clicking an actual link. That default alone would have blocked the
        auto-submitting form from the first section, since a POST triggered by JavaScript from
        another origin is exactly what Lax withholds cookies from.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Notice the gap in that sentence: Lax still sends the cookie on a top-level GET navigation.
        Which means a state-changing action that only checks &quot;is this user logged in&quot;
        and happens to be wired up behind a GET is still exploitable, cookie policy or not.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A delete link, implemented the way it looks in a hundred admin panels
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`@app.route("/posts/<int:post_id>/delete")  # GET, no method specified
@login_required
def delete_post(post_id):
    db.query(Post).filter_by(id=post_id).delete()
    return redirect("/posts")`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A malicious page only needs an ordinary link:{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          {'<a href="https://app.example/posts/42/delete">Click for a free prize</a>'}
        </code>
        . One click, while logged in, and the post is gone, SameSite=Lax and all, because Lax was
        never designed to stop top-level navigation. The actual bug isn&apos;t the missing cookie
        attribute. It&apos;s that a GET request, which the HTTP spec says should be safe to
        prefetch, retry, and follow without a second thought, is doing something that changes
        data.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Every state-changing action, delete, update, transfer, belongs behind POST, PUT, PATCH, or
        DELETE, never GET. Get that right and SameSite=Lax closes the rest of the gap almost by
        accident.
      </p>
    </section>
  );
}
