import { CheckCircle, XCircle, MinusCircle } from "lucide-react";

const CHECKLIST = [
  {
    id: "API1",
    name: "Broken Object Level Authorization",
    status: "addressed",
    note: "Article 4: every query scoped to authenticated user_id, 403 on cross-user access",
  },
  {
    id: "API2",
    name: "Broken Authentication",
    status: "addressed",
    note: "Article 4 + this article: JWT validation, bcrypt hashing, token refresh, no user enumeration",
  },
  {
    id: "API3",
    name: "Broken Object Property Level Authorization",
    status: "addressed",
    note: "Response models exclude internal fields (password_hash, internal IDs) via Pydantic",
  },
  {
    id: "API4",
    name: "Unrestricted Resource Consumption",
    status: "addressed",
    note: "This article: field length limits, body size middleware, pagination limit (le=100)",
  },
  {
    id: "API5",
    name: "Broken Function Level Authorization",
    status: "partial",
    note: "Basic user/resource scoping in place. Admin endpoints and role-based access not implemented",
  },
  {
    id: "API6",
    name: "Unrestricted Access to Sensitive Business Flows",
    status: "partial",
    note: "Auth rate limiting added. Business-specific abuse (bulk task creation, export abuse) not addressed",
  },
  {
    id: "API7",
    name: "Server-Side Request Forgery",
    status: "not-applicable",
    note: "API does not fetch external URLs based on user input",
  },
  {
    id: "API8",
    name: "Security Misconfiguration",
    status: "addressed",
    note: "This article: explicit CORS policy, security headers, input limits, no wildcard origins",
  },
  {
    id: "API9",
    name: "Improper Inventory Management",
    status: "partial",
    note: "No versioning strategy or deprecated endpoint cleanup yet. Single /v1 prefix recommended",
  },
  {
    id: "API10",
    name: "Unsafe Consumption of APIs",
    status: "not-applicable",
    note: "API does not consume third-party APIs in the current implementation",
  },
];

const STATUS_CONFIG = {
  addressed: {
    Icon: CheckCircle,
    label: "Addressed",
    color: "text-emerald-500",
    bg: "bg-emerald-500/8 border-emerald-500/20",
  },
  partial: {
    Icon: MinusCircle,
    label: "Partial",
    color: "text-amber-500",
    bg: "bg-amber-500/8 border-amber-500/20",
  },
  "not-applicable": {
    Icon: XCircle,
    label: "N/A",
    color: "text-muted-foreground",
    bg: "bg-muted/30 border-border",
  },
};

export function OWASPChecklistSection() {
  return (
    <section id="owasp-checklist">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">OWASP API Top 10 Checklist</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Where the series stands against the OWASP API Security Top 10 (2023 edition) after
        six articles. Addressed means the specific vector is mitigated. Partial means the
        primary case is handled but edge cases or advanced scenarios are not. N/A means the
        API does not have the surface area for that finding.
      </p>

      <div className="space-y-2">
        {CHECKLIST.map(({ id, name, status, note }) => {
          const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
          const { Icon, label, color, bg } = config;
          return (
            <div
              key={id}
              className={`flex gap-3 p-3 rounded-xl border ${bg}`}
            >
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${color}`} />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-mono text-muted-foreground">{id}</span>
                  <span className="text-[12px] font-semibold truncate">{name}</span>
                  <span className={`text-[9px] font-medium ml-auto shrink-0 ${color}`}>{label}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
