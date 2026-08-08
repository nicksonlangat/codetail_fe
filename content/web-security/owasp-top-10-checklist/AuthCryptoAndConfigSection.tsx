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

export function AuthCryptoAndConfigSection() {
  return (
    <section>
      <h2 id="authentication-failures" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A07: Identification and Authentication Failures
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Login is the highest-value target in the app. Everything here is about what happens
        around a correct password, not just whether one was entered.
      </p>
      <Checklist
        items={[
          { text: "Login endpoints are rate-limited per account and per source.", href: "/blog/web-security/authentication-and-session-management#credential-stuffing" },
          { text: "The session ID is regenerated on login, logout, and password change.", href: "/blog/web-security/authentication-and-session-management#session-fixation" },
          { text: "Password reset tokens are cryptographically random, single-use, and expire in under 30 minutes.", href: "/blog/web-security/authentication-and-session-management#password-reset" },
          { text: "Any link emailed to a user is built from a hardcoded host, never the request's Host header.", href: "/blog/web-security/authentication-and-session-management#password-reset" },
          { text: "Access tokens expire in minutes, not days; refresh tokens are revocable and rotated on use.", href: "/blog/web-security/authentication-and-session-management#token-expiry-and-rotation" },
        ]}
      />

      <h2 id="cryptographic-failures" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A02: Cryptographic Failures
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Data that was &quot;encrypted&quot; in name only: the wrong hash function, a key sitting
        next to the data it protects, or a certificate check quietly turned off.
      </p>
      <Checklist
        items={[
          { text: "Passwords are hashed with bcrypt or argon2, never a general-purpose hash like SHA-256 or MD5.", href: "/blog/web-security/cryptographic-failures#password-hashing" },
          { text: "Sensitive fields held on behalf of users are encrypted at rest with a key stored outside the database.", href: "/blog/web-security/cryptographic-failures#secrets-at-rest" },
          { text: "No .env or secrets file has ever been committed to git; secrets load from the environment or a secrets manager.", href: "/blog/web-security/cryptographic-failures#secrets-at-rest" },
          { text: "No code path sets verify=False, or the equivalent, on an HTTPS request.", href: "/blog/web-security/cryptographic-failures#tls-misconfiguration" },
          { text: "Signing and encryption keys are unique per environment, never hardcoded, and rotated on a schedule.", href: "/blog/web-security/cryptographic-failures#key-management" },
        ]}
      />

      <h2 id="security-misconfiguration" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A05: Security Misconfiguration
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Nothing exploited, a default just did the attacker&apos;s job for them.
      </p>
      <Checklist
        items={[
          { text: "Debug mode and verbose stack traces are disabled outside local development.", href: "/blog/web-security/security-misconfiguration#verbose-errors" },
          { text: "No service (Redis, database, admin panel) is reachable with a default or blank credential.", href: "/blog/web-security/security-misconfiguration#default-credentials" },
          { text: "CORS responses use an explicit origin allowlist, never a reflected Origin header, whenever credentials are allowed.", href: "/blog/web-security/security-misconfiguration#cors-misconfiguration" },
          { text: "Cloud storage buckets holding user data default to private, with access mediated by the application.", href: "/blog/web-security/security-misconfiguration#exposed-storage-and-endpoints" },
          { text: "Deployments ship only the built artifact, never the .git directory or the full repository.", href: "/blog/web-security/security-misconfiguration#exposed-storage-and-endpoints" },
        ]}
      />
    </section>
  );
}
