import Link from "next/link";
import { Check } from "lucide-react";

function Checklist({ items }: { items: { text: string; href: string }[] }) {
  return (
    <ul className="space-y-2.5 mb-6">
      {items.map((item) => (
        <li key={item.href + item.text} className="flex items-start gap-2.5">
          <Check className="size-4 text-brand-success mt-0.5 shrink-0" />
          <span className="text-[14px] leading-relaxed text-brand-text/90">
            {item.text}{" "}
            <Link
              href={item.href}
              className="text-brand-primary underline text-[12px] cursor-pointer transition-all duration-500 hover:text-brand-primary-hover"
            >
              detail
            </Link>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function InjectionAndAccessControlSection() {
  return (
    <section>
      <h2 id="injection-and-xss" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A03: Injection
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Untrusted input reaching something that interprets structure, a SQL query, a shell, a
        browser&apos;s HTML parser, instead of being treated as inert data the whole way through.
      </p>
      <Checklist
        items={[
          { text: "All SQL queries use parameterized queries or an ORM's query builder, never string formatting.", href: "/blog/web-security/injection#parameterized-queries" },
          { text: "Dynamic table or column names (sort order, filters) are checked against a hardcoded allowlist before touching a query.", href: "/blog/web-security/injection#defense-in-depth" },
          { text: "Shell commands are invoked with an argument list, never a single interpolated string handed to a shell.", href: "/blog/web-security/injection#beyond-sql" },
          { text: "All user-supplied content rendered into HTML is escaped by the template engine's default, not manually.", href: "/blog/web-security/cross-site-scripting#reflected-xss" },
          { text: "Every dangerouslySetInnerHTML, v-html, or [innerHTML] usage has been reviewed for a path from user input.", href: "/blog/web-security/cross-site-scripting#dom-xss" },
          { text: "A Content-Security-Policy header is set and blocks inline scripts as a backstop.", href: "/blog/web-security/cross-site-scripting#defense-in-depth" },
        ]}
      />

      <h2 id="broken-access-control-and-csrf" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A01: Broken Access Control
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Checking that a request is authenticated is not the same as checking that it&apos;s
        authorized. This category, and CSRF alongside it, covers every place those two get
        confused.
      </p>
      <Checklist
        items={[
          { text: "Every object lookup by ID is scoped to the authenticated user, not just checked for a valid session.", href: "/blog/web-security/broken-access-control#idor" },
          { text: "Admin-only and privileged routes have their own authorization check, separate from the login check.", href: "/blog/web-security/broken-access-control#function-level-access" },
          { text: "No authorization decision is made only in frontend code; every sensitive action is enforced again on the server.", href: "/blog/web-security/broken-access-control#client-side-authorization" },
          { text: "Access-denied responses default to a 404 unless the resource's existence is not itself sensitive.", href: "/blog/web-security/broken-access-control#default-deny" },
          { text: "Every state-changing action uses POST, PUT, PATCH, or DELETE, never GET.", href: "/blog/web-security/csrf#samesite-cookies" },
          { text: "State-changing form endpoints validate a CSRF token, and session cookies set SameSite=Lax or stricter.", href: "/blog/web-security/csrf#csrf-tokens" },
        ]}
      />
    </section>
  );
}
