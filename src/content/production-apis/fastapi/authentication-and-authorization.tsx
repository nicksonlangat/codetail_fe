import { WhatBreaksSection } from "./authentication-and-authorization/WhatBreaksSection";
import { UsersSection } from "./authentication-and-authorization/UsersSection";
import { EndpointsSection } from "./authentication-and-authorization/EndpointsSection";
import { IdorSection } from "./authentication-and-authorization/IdorSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "what-breaks", title: "What Breaks" },
  { id: "users-and-auth", title: "Users, Password Hashing, and JWT" },
  { id: "endpoints", title: "Auth Endpoints and Scoped Queries" },
  { id: "idor", title: "Object-Level Authorization and IDOR" },
  { id: "summary", title: "Summary" },
];

export default function AuthenticationArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Article 3 fixed query performance: the list endpoint now runs in constant time
          regardless of table size. The new constraint is identity. Without authentication,
          every caller can read, create, and delete any record. Adding a login system is not
          enough -- every query must also be scoped to the authenticated user, and every
          ID-based endpoint must verify ownership before returning data.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          This article adds JWT authentication via{" "}
          <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">python-jose</code>,
          password hashing via{" "}
          <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">passlib[bcrypt]</code>,
          and a{" "}
          <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">get_current_user</code>{" "}
          FastAPI dependency that rejects unauthenticated requests before the handler runs. It
          also addresses three distinct failure modes that each require a different fix.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          The rule: authenticating a caller is not the same as authorizing them. Authentication
          answers "who are you" -- authorization answers "are you allowed to touch this specific
          record." Both checks are required, on every endpoint.
        </p>
      </section>

      <WhatBreaksSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <UsersSection />
      <EndpointsSection />
      <IdorSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              title: "Authentication is a dependency, not middleware",
              desc: "FastAPI's Depends(get_current_user) runs before the handler and raises 401 automatically. Any endpoint that omits the dependency is publicly accessible -- accidental omission is a bug, not a configuration.",
            },
            {
              title: "Hashing is non-negotiable",
              desc: "passlib[bcrypt] hashes passwords with a per-password salt and a work factor that can be increased as hardware improves. Storing plaintext or using a fast hash (MD5, SHA-256) means a leaked database gives attackers all passwords immediately.",
            },
            {
              title: "JWTs are stateless -- revocation requires extra work",
              desc: "A valid JWT remains valid until expiry. Logging out does not invalidate the token. For this API, 30-minute expiry keeps the window short. Revocation requires a token blocklist (typically Redis) -- add it when the business requires immediate invalidation.",
            },
            {
              title: "Every list query needs a WHERE user_id clause",
              desc: "Adding authentication without scoping queries is a half-fix. A user who can list all records, even if they cannot delete them, has access to data they should not see. Scope first, then add further restrictions.",
            },
            {
              title: "Object-level checks cannot be skipped",
              desc: "Scoping the list endpoint does not protect individual-record endpoints. GET /tasks/{id} must verify ownership independently. IDOR vulnerabilities consistently rank in OWASP's top API security failures because the fix is obvious in hindsight but easy to miss.",
            },
            {
              title: "Next: observability",
              desc: "Article 5 adds structured logging, request tracing, and a /metrics endpoint. Authentication failures, slow queries, and 5xx errors will surface in dashboards before users report them.",
            },
          ].map(({ title, desc }) => (
            <div key={title} className="flex gap-3 p-4 bg-card border border-border rounded-xl">
              <div>
                <p className="text-[13px] font-semibold mb-0.5">{title}</p>
                <p className="text-[12px] text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
