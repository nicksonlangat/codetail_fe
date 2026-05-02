import { WhatBreaksSection } from "./security-hardening/WhatBreaksSection";
import { InputValidationSection } from "./security-hardening/InputValidationSection";
import { CORSSection } from "./security-hardening/CORSSection";
import { SecurityHeadersSection } from "./security-hardening/SecurityHeadersSection";
import { UserEnumerationSection } from "./security-hardening/UserEnumerationSection";
import { AuthRateLimitingSection } from "./security-hardening/AuthRateLimitingSection";
import { OWASPChecklistSection } from "./security-hardening/OWASPChecklistSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "what-breaks", title: "What the Audit Finds" },
  { id: "input-validation", title: "Input Validation" },
  { id: "cors", title: "CORS Policy" },
  { id: "security-headers", title: "Security Headers" },
  { id: "user-enumeration", title: "User Enumeration" },
  { id: "auth-rate-limiting", title: "Auth Rate Limiting" },
  { id: "owasp-checklist", title: "OWASP API Top 10 Checklist" },
  { id: "summary", title: "Summary" },
];

export default function SecurityHardeningArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Article 5 made the API observable. The new constraint is survivability under
          deliberate attack. A security audit against the OWASP API Top 10 finds four
          exploitable issues: no field length limits, CORS wide open, timing-based user
          enumeration on the login endpoint, and no rate limiting on auth routes.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          This article fixes all four. Each fix is independent. Pydantic Field constraints
          address resource consumption. An explicit CORS allowlist closes cross-origin
          credential theft. Constant-time auth responses close the timing side channel.
          slowapi decorators close the brute-force surface. The article ends with an
          OWASP API Top 10 checklist showing where the series stands after six articles.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          The rule: security fixes do not require a security team. They require knowing which
          surface exists and which one-line change closes it.
        </p>
      </section>

      <WhatBreaksSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <InputValidationSection />
      <CORSSection />
      <SecurityHeadersSection />
      <UserEnumerationSection />
      <AuthRateLimitingSection />
      <OWASPChecklistSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              title: "Field constraints are not optional",
              desc: "Pydantic validates types, not sizes. A str field without max_length accepts arbitrarily large strings. Add Field(..., max_length=N) to every user-controlled string. This is the minimum viable input validation.",
            },
            {
              title: "CORS wildcards belong in development only",
              desc: "allow_origins=[\"*\"] is correct for local development and wrong for production. Load the allowed origin list from an environment variable so it changes per deployment without code changes.",
            },
            {
              title: "Security headers are one middleware, six protections",
              desc: "X-Content-Type-Options, X-Frame-Options, HSTS, CSP, Referrer-Policy, and Permissions-Policy each close a different browser-level attack surface. Apply them in a single middleware that runs on every response.",
            },
            {
              title: "Timing side channels leak data even with identical error messages",
              desc: "If bcrypt only runs when the user exists, response time reveals existence. Always run bcrypt against a dummy hash when the user is not found. Pre-compute the dummy hash at startup to avoid an extra timing signal.",
            },
            {
              title: "Auth endpoints need 10-20x stricter limits than data endpoints",
              desc: "A failed auth attempt costs bcrypt time and represents a potential account takeover. 5 per minute per IP is reasonable for login. Data endpoints typically tolerate 100-300 per minute per user.",
            },
            {
              title: "Next: sub-100ms latency",
              desc: "Article 7 adds Redis cache-aside on the GET /tasks/{id} endpoint to drive p95 under 100ms at 100 RPS. It also covers cache invalidation on update and delete, response model trimming, and reading a flamegraph.",
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
