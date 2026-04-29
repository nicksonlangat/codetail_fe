import { AuthNvsAuthZSection } from "./authentication-and-authorization/AuthNvsAuthZSection";
import { SessionsAndTokensSection } from "./authentication-and-authorization/SessionsAndTokensSection";
import { OAuth2Section } from "./authentication-and-authorization/OAuth2Section";
import { AuthZModelsSection } from "./authentication-and-authorization/AuthZModelsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "authn-authz", title: "AuthN vs AuthZ" },
  { id: "sessions-tokens", title: "Sessions vs Tokens" },
  { id: "oauth2", title: "OAuth 2.0 and OIDC" },
  { id: "authz-models", title: "Authorization Models" },
  { id: "summary", title: "Summary" },
];

export default function AuthArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Authentication and authorization are the two gatekeeping concerns of every
          system that handles user data. They are related but distinct: authentication
          establishes identity, authorization enforces what that identity is permitted
          to do. Getting either wrong has direct security consequences.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          The mechanisms for authentication have evolved from server-side sessions (a
          session ID cookie that the server looks up on every request) to client-side
          tokens (a signed JWT that carries claims and can be verified without a database
          call). Each model has tradeoffs: sessions allow instant revocation but require
          shared state; JWTs scale horizontally but cannot be invalidated before expiry
          without a blocklist.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          OAuth 2.0 adds delegation: a user can grant a third-party application specific
          permissions without sharing credentials. OpenID Connect layers identity on top.
          For authorization logic, three models cover most cases: RBAC (roles and
          permissions), ABAC (attribute-based policies), and ReBAC (relationship graphs).
          This article covers each in turn and explains when to use which.
        </p>
      </section>

      <AuthNvsAuthZSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <SessionsAndTokensSection />
      <OAuth2Section />
      <AuthZModelsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🔑",
              label: "AuthN establishes identity; AuthZ enforces policy",
              desc: "Authentication says who you are. Authorization says what you can do. They happen in sequence. Authentication is always required before an authorization decision.",
            },
            {
              icon: "🍪",
              label: "Sessions for revocability; JWTs for stateless scale",
              desc: "Sessions allow instant logout and fine-grained revocation. JWTs verify without a DB call and scale across instances. Combine both: short-lived JWT access tokens + opaque refresh tokens.",
            },
            {
              icon: "🔏",
              label: "JWT payload is visible — never put secrets in it",
              desc: "The payload is Base64, not encrypted. Anyone with the token can read the claims. Use the signature to verify integrity; use HTTPS to protect the token in transit.",
            },
            {
              icon: "🤝",
              label: "OAuth 2.0 delegates authorization without credentials",
              desc: "The user consents to specific scopes. The authorization server issues a scoped token. The resource server checks the scope. Credentials never leave the auth server.",
            },
            {
              icon: "👥",
              label: "RBAC for most systems; ABAC for context; ReBAC for graphs",
              desc: "Start with RBAC. Add ownership checks as a simple extension. Graduate to ABAC for time- or attribute-based rules. Use ReBAC (OpenFGA) for hierarchical collaborative resources.",
            },
            {
              icon: "🛡️",
              label: "Do not implement your own auth infrastructure",
              desc: "Use a proven identity provider (Auth0, Clerk, Supabase, Cognito) for authentication. Use OpenFGA or Casbin for authorization. The attack surface is large and mistakes are severe.",
            },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="flex gap-3 p-4 bg-card border border-border rounded-xl">
              <span className="text-lg flex-shrink-0">{icon}</span>
              <div>
                <p className="text-[13px] font-semibold mb-0.5">{label}</p>
                <p className="text-[12px] text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
