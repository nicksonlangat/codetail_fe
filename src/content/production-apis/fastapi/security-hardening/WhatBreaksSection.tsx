import { SlidersHorizontal, Globe, Clock, Zap } from "lucide-react";

const FINDINGS = [
  {
    Icon: SlidersHorizontal,
    title: "No input length limits -- any caller can send a 100MB request body",
    trigger: "Immediately, with no authentication required",
    symptom: "POST /tasks with a 100MB title string consumes memory and CPU until the server OOMs or times out.",
    detail:
      "Pydantic validates types but not lengths by default. A str field accepts a string of any size. Without a max_length constraint, a single unauthenticated request can consume the full server memory allocation. This is OWASP API4: Unrestricted Resource Consumption.",
  },
  {
    Icon: Globe,
    title: "CORS allows all origins -- any website can make authenticated requests as your users",
    trigger: "The moment the API is deployed with a public URL",
    symptom: "A malicious site embeds JavaScript that sends requests to your API using the visitor's stored credentials.",
    detail:
      "allow_origins=[\"*\"] means any origin can make cross-origin requests, including requests that carry the user's cookies or session tokens. Combined with the absence of security headers, clickjacking and cross-site request forgery are straightforward to execute.",
  },
  {
    Icon: Clock,
    title: "Login response time leaks whether an email is registered",
    trigger: "Any attacker who times two login attempts with different emails",
    symptom: "Unknown email returns in ~2ms. Known email with wrong password returns in ~80ms (bcrypt ran). The difference is measurable.",
    detail:
      "bcrypt hashing takes ~80ms by design. If the user lookup returns no result, verify_password is skipped -- the response is fast. If the email exists, verify_password runs -- the response is slow. Timing reveals user existence even when the error message is identical.",
  },
  {
    Icon: Zap,
    title: "No rate limiting on auth endpoints -- credential stuffing is unrestricted",
    trigger: "Any automated tool that can send HTTP requests",
    symptom: "10,000 password guesses against /auth/login complete in under a minute with no throttling.",
    detail:
      "Without rate limiting, brute-force and credential stuffing attacks have no practical constraint. A common password list applied to a known email address will eventually succeed. Auth endpoints need significantly tighter per-IP limits than data endpoints.",
  },
];

export function WhatBreaksSection() {
  return (
    <section id="what-breaks">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">What the Audit Finds</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Four findings from an OWASP API Top 10 review of the current API. Each is independently
        exploitable; none requires chaining with another vulnerability. The fixes are also
        independent -- they can be applied in any order.
      </p>

      <div className="space-y-3">
        {FINDINGS.map(({ Icon, title, trigger, symptom, detail }) => (
          <div key={title} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] font-semibold">{title}</span>
              </div>
              <span className="text-[9px] text-muted-foreground font-mono hidden sm:block">
                triggers: {trigger}
              </span>
            </div>
            <div className="px-4 py-3 space-y-2">
              <p className="text-[11px]">
                <span className="font-medium text-foreground/80">Observable: </span>
                <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">{symptom}</code>
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
