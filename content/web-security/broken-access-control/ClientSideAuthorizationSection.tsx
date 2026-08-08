import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ClientSideAuthorizationSection() {
  return (
    <section>
      <h2 id="client-side-authorization" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Hiding the button isn&apos;t access control
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">delete_user</code>{" "}
        endpoint from the last section probably does have a role check somewhere in this
        app, just in the wrong place.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          The admin dashboard, React
        </p>
        <CodeBlock
          variant="vulnerable"
          language="JSX"
          code={`{user.role === "admin" && (
  <button onClick={() => deleteUser(targetId)}>Delete User</button>
)}`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This is genuinely correct React. Non-admins never see the button, which is exactly the
        UX you want, most users should never even be aware this action exists. But it&apos;s
        UX, not enforcement. If the backend route behind{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">deleteUser()</code>{" "}
        is the unfixed version from the last section, hiding the button changes nothing for
        anyone willing to open their browser&apos;s network tab, copy the request, and replay it
        with a different token. The button was never the boundary. The endpoint was, whether
        anyone remembered that or not.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          A check that lives only in frontend code is a suggestion, not a rule. The frontend is
          one client of your API among many. Anyone can write a different one, curl, Postman, a
          five-line script, that simply skips the part you didn&apos;t enforce on the server.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        None of this means hiding the button is wrong to do. It&apos;s good UX and it reduces
        support tickets from confused users who technically could see an action but shouldn&apos;t
        have. The mistake is treating it as the security control instead of what it actually is:
        a convenience layered on top of a check that has to live on the server regardless.
      </p>
    </section>
  );
}
