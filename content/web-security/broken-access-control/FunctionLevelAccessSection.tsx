import { CodeBlock } from "@/components/blog/interactive/code-block";

export function FunctionLevelAccessSection() {
  return (
    <section>
      <h2 id="function-level-access" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Missing function-level access control
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The check in the last section covers &quot;is this record yours.&quot; A separate,
        equally easy to forget check covers &quot;are you even allowed to call this action at
        all,&quot; regardless of whose record it touches.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          An admin action, guarded by login only
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`@app.route("/admin/users/<int:user_id>", methods=["DELETE"])
@login_required
def delete_user(user_id):
    db.query(User).filter_by(id=user_id).delete()
    return "", 204`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The route lives under{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">/admin/</code>,
        which reads like a permission check but isn&apos;t one. The only thing{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">@login_required</code>{" "}
        verifies is that a valid session exists. Any logged-in user, admin or not, can send this
        request directly and it will run.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Not from the admin dashboard, just a terminal
        </p>
        <CodeBlock
          variant="vulnerable"
          language="Bash"
          code={`curl -X DELETE https://app.example/admin/users/42 \\
  -H "Authorization: Bearer <any-regular-user-token>"`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Authentication and authorization answer two different questions. Authentication is
        &quot;who are you.&quot; Authorization is &quot;what are you allowed to do, now that I
        know who you are.&quot; A decorator or middleware that only handles the first one will
        happily let a regular account delete another user, because nothing in the request path
        ever asked the second question.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: ask both questions
        </p>
        <CodeBlock
          variant="fixed"
          code={`@app.route("/admin/users/<int:user_id>", methods=["DELETE"])
@login_required
@admin_required
def delete_user(user_id):
    db.query(User).filter_by(id=user_id).delete()
    return "", 204`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        This class of bug shows up most often on newer, less-visited endpoints: the one internal
        tool route, the export feature added for one customer, the debug endpoint nobody remembered
        to remove. Nothing about them looks wrong in a code review that&apos;s scanning for logic
        bugs. They look wrong only if you&apos;re specifically checking who&apos;s allowed to hit
        them.
      </p>
    </section>
  );
}
