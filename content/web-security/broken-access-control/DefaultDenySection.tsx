import { CodeBlock } from "@/components/blog/interactive/code-block";

export function DefaultDenySection() {
  return (
    <section>
      <h2 id="default-deny" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Default deny, and putting the check in one place
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Three different bugs, same root cause: a check that existed somewhere in the system but
        not on the specific path that needed it. That pattern doesn&apos;t get fixed by being more
        careful next time. It gets fixed by changing what &quot;careful&quot; even means, so a
        missing check is the exception a linter or a test catches, not the default state of a new
        route.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Default deny
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Most frameworks default to open: a new route works the moment you define it, and
        authorization is something you bolt on afterward if you remember to. Flip that assumption
        and every route is unreachable until something explicitly grants access to it. Forgetting
        to add a check now fails closed, a 403, instead of failing open, full access to whoever
        asks.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        One function, not one check per handler
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Scattering{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">if resource.owner_id != user.id</code>{" "}
        across every handler that touches a resource means fixing this bug once doesn&apos;t fix
        it everywhere, it fixes it in the one place you happened to be looking. Centralizing the
        check gives you one function to audit, one place to add a new role, one thing to write a
        test against.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A single authorization function, reused everywhere
        </p>
        <CodeBlock
          variant="fixed"
          code={`def authorize(user, resource, action="view"):
    if user.is_admin:
        return
    if resource.owner_id != user.id:
        abort(404)

# usage, wherever a handler touches a resource
invoice = get_invoice_or_404(invoice_id)
authorize(current_user, invoice)`}
        />
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        403 or 404: whether existence itself is a secret
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The function above returns 404, not 403, for a resource that exists but isn&apos;t yours.
        That&apos;s deliberate. If &quot;not found&quot; and &quot;found, but not yours&quot;
        produce different status codes, an attacker can tell which invoice IDs are real just by
        watching which response they get back, 403 versus 404, without ever seeing the data
        itself. Returning 404 for both cases makes them indistinguishable from outside the
        system.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        This isn&apos;t a universal rule. For a resource where existence isn&apos;t sensitive, an
        admin settings page any employee already knows is there, a clear 403 with a real message
        is better UX and there&apos;s no meaningful secret being protected either way. The
        question worth asking per resource is simple: does knowing this exists tell an attacker
        something they shouldn&apos;t know. If yes, 404. If not, 403 is fine, and kinder to
        whoever hits it by mistake.
      </p>
    </section>
  );
}
