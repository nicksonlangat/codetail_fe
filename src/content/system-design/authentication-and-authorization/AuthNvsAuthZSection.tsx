const EXAMPLES = [
  {
    scenario: "User provides correct email and password",
    authn: "Identity confirmed — this is alice@example.com",
    authz: "Is alice allowed to access /admin? Check role.",
  },
  {
    scenario: "API request arrives with a valid JWT",
    authn: "Signature valid, not expired — this is user_123",
    authz: "Can user_123 delete this resource? Check ownership.",
  },
  {
    scenario: "Service A calls Service B with an mTLS certificate",
    authn: "Certificate valid, signed by internal CA — this is the Orders service",
    authz: "Is Orders service allowed to call /payments? Check service policy.",
  },
  {
    scenario: "OAuth token presented by a mobile app",
    authn: "Token valid, issued by identity provider — this is user@gmail.com",
    authz: "Does this token have the read:orders scope? Check scopes.",
  },
];

const COMMON_MISTAKES = [
  {
    mistake: "Trusting unauthenticated input for authorization checks",
    detail: 'Checking if req.body.userId === "admin" for authorization. The client controls req.body. The identity assertion must come from the server-verified token, not the request payload.',
    severity: "critical",
  },
  {
    mistake: "Conflating authentication with authorization",
    detail: '"The user is logged in, so they can access anything." Authentication says who you are. Authorization says what you can do. A logged-in free-tier user should not access paid features.',
    severity: "critical",
  },
  {
    mistake: "Authorization checks only at the API layer",
    detail: "Authorization enforced at the HTTP handler but not at the database layer. Direct database access, batch jobs, and internal APIs bypass the check. Enforce at every access point.",
    severity: "high",
  },
  {
    mistake: "Storing sensitive data in the JWT payload",
    detail: "The JWT payload is Base64-encoded, not encrypted. Anyone with the token can read it. Never put passwords, SSNs, payment data, or secrets in JWT claims.",
    severity: "high",
  },
];

export function AuthNvsAuthZSection() {
  return (
    <section>
      <h2 id="authn-authz" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Authentication vs Authorization
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Authentication answers one question: who are you? It verifies identity — that the
        entity making the request is who they claim to be. Authorization answers a different
        question: what are you allowed to do? It enforces policy — given a verified identity,
        what resources and actions are permitted.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        They are separate concerns that happen in sequence. A system cannot make an
        authorization decision without first establishing identity through authentication.
        But authentication alone is never sufficient — knowing who someone is does not
        determine what they are allowed to do. Both must be correct for a system to be secure.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-8 not-prose">
        <div className="grid sm:grid-cols-2 gap-4 text-[11px]">
          <div className="p-3 bg-muted/40 rounded-xl space-y-2">
            <p className="font-semibold text-[12px]">Authentication (AuthN)</p>
            <p className="text-muted-foreground">Who are you? Prove your identity.</p>
            <div className="space-y-1">
              {["Password + username", "OAuth token from a trusted provider", "mTLS client certificate", "SSH key", "Passkey / WebAuthn"].map(m => (
                <p key={m} className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="text-primary">→</span> {m}
                </p>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground/60">Result: verified identity (e.g., user_123)</p>
          </div>
          <div className="p-3 bg-muted/40 rounded-xl space-y-2">
            <p className="font-semibold text-[12px]">Authorization (AuthZ)</p>
            <p className="text-muted-foreground">What can you do? Enforce access policy.</p>
            <div className="space-y-1">
              {["Role-based access control (RBAC)", "Attribute-based access control (ABAC)", "OAuth scopes", "Row-level permissions", "Resource ownership checks"].map(m => (
                <p key={m} className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="text-primary">→</span> {m}
                </p>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground/60">Result: allow or deny</p>
          </div>
        </div>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The sequence in practice</h3>

      <div className="space-y-2 mb-8">
        {EXAMPLES.map(({ scenario, authn, authz }) => (
          <div key={scenario} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-border bg-muted/30">
              <p className="text-[10px] text-muted-foreground">{scenario}</p>
            </div>
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
              <div className="px-4 py-2.5">
                <p className="text-[9px] uppercase tracking-wider text-blue-500 mb-1">AuthN result</p>
                <p className="text-[11px] text-muted-foreground">{authn}</p>
              </div>
              <div className="px-4 py-2.5">
                <p className="text-[9px] uppercase tracking-wider text-primary mb-1">AuthZ check</p>
                <p className="text-[11px] text-muted-foreground">{authz}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Common mistakes</h3>

      <div className="space-y-2">
        {COMMON_MISTAKES.map(({ mistake, detail, severity }) => (
          <div
            key={mistake}
            className={`flex gap-3 p-3 rounded-xl border ${
              severity === "critical"
                ? "border-destructive/20 bg-destructive/5"
                : "border-orange-400/20 bg-orange-400/5"
            }`}
          >
            <span className={`font-bold text-sm flex-shrink-0 mt-0.5 ${severity === "critical" ? "text-destructive" : "text-orange-500"}`}>
              !
            </span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{mistake}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
