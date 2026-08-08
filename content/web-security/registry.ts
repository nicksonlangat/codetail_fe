import type { ArticleMeta } from "@/content/python/registry";

export const webSecurityArticles: ArticleMeta[] = [
  {
    slug: "injection",
    title: "Injection: SQL, NoSQL, and Command",
    subtitle: "The oldest attack in the book still tops the charts.",
    description:
      "String-concatenated queries, the ORM footguns that reintroduce injection anyway, and why parameterized queries and allowlisting are the actual fix, not 'escaping the input.'",
    order: 1,
    estimatedMinutes: 22,
    tags: ["sql-injection", "nosql-injection", "command-injection", "parameterized-queries", "owasp"],
    relatedChallenges: [],
    icon: "💉",
  },
  {
    slug: "cross-site-scripting",
    title: "Cross-Site Scripting (XSS)",
    subtitle: "The payload runs in someone else's browser, as them.",
    description:
      "Stored, reflected, and DOM-based XSS explained with real payloads. Output encoding, Content Security Policy, and why dangerouslySetInnerHTML is a loaded gun.",
    order: 2,
    estimatedMinutes: 22,
    tags: ["xss", "csp", "output-encoding", "dom-xss", "owasp"],
    relatedChallenges: [],
    icon: "🕸️",
  },
  {
    slug: "broken-access-control",
    title: "Broken Access Control and IDOR",
    subtitle: "The #1 vulnerability class by prevalence, and the simplest to introduce.",
    description:
      "Insecure direct object references, missing per-request authorization checks, and why 'the URL was guessable' is a real, common bug report.",
    order: 3,
    estimatedMinutes: 24,
    tags: ["idor", "access-control", "authorization", "object-level-permissions", "owasp"],
    relatedChallenges: [],
    icon: "🔓",
  },
  {
    slug: "csrf",
    title: "Cross-Site Request Forgery (CSRF)",
    subtitle: "The browser sends the cookie, the attacker sends the request.",
    description:
      "How a logged-in session gets weaponized from another tab, CSRF tokens, SameSite cookies, and why a state-changing GET request is the real underlying bug.",
    order: 4,
    estimatedMinutes: 18,
    tags: ["csrf", "samesite", "cookies", "state-changing-requests", "owasp"],
    relatedChallenges: [],
    icon: "🍪",
  },
  {
    slug: "authentication-and-session-management",
    title: "Authentication and Session Management Failures",
    subtitle: "Login is the highest-value target in the entire app.",
    description:
      "Credential stuffing, session fixation, weak password reset flows, and token expiry and rotation done wrong.",
    order: 5,
    estimatedMinutes: 24,
    tags: ["authentication", "sessions", "credential-stuffing", "password-reset", "owasp"],
    relatedChallenges: [],
    icon: "🔑",
  },
  {
    slug: "cryptographic-failures",
    title: "Cryptographic Failures",
    subtitle: "The data was 'encrypted.' It just wasn't encrypted well.",
    description:
      "Plaintext secrets at rest, weak password hashing, TLS misconfiguration, and the key management basics almost every app gets wrong.",
    order: 6,
    estimatedMinutes: 20,
    tags: ["encryption", "hashing", "tls", "key-management", "owasp"],
    relatedChallenges: [],
    icon: "🔐",
  },
  {
    slug: "security-misconfiguration",
    title: "Security Misconfiguration",
    subtitle: "Nothing was exploited. The defaults just did the attacker's job for them.",
    description:
      "Verbose error pages leaking stack traces, default credentials, open CORS and storage buckets, and unnecessary exposed endpoints.",
    order: 7,
    estimatedMinutes: 20,
    tags: ["misconfiguration", "cors", "default-credentials", "error-handling", "owasp"],
    relatedChallenges: [],
    icon: "⚙️",
  },
  {
    slug: "ssrf",
    title: "Server-Side Request Forgery (SSRF)",
    subtitle: "You asked the server to fetch a URL. It fetched your internal metadata endpoint.",
    description:
      "Why 'fetch this URL for the user' is dangerous, cloud metadata endpoint attacks, and how to allowlist outbound requests properly.",
    order: 8,
    estimatedMinutes: 18,
    tags: ["ssrf", "cloud-metadata", "outbound-requests", "owasp"],
    relatedChallenges: [],
    icon: "🌐",
  },
  {
    slug: "insecure-deserialization-and-supply-chain",
    title: "Insecure Deserialization and Supply Chain Attacks",
    subtitle: "Trusting a byte stream and trusting a package registry are the same mistake.",
    description:
      "Insecure deserialization RCEs, unsigned or unverified dependency updates, and why every install command is part of your attack surface.",
    order: 9,
    estimatedMinutes: 20,
    tags: ["deserialization", "supply-chain", "dependency-integrity", "owasp"],
    relatedChallenges: [],
    icon: "📦",
  },
  {
    slug: "vulnerable-and-outdated-components",
    title: "Vulnerable and Outdated Components",
    subtitle: "The vulnerability isn't in your code. It's in your package.json.",
    description:
      "Dependency scanning, software bills of materials, patch cadence, and why 'it's a transitive dependency' isn't a defense.",
    order: 10,
    estimatedMinutes: 16,
    tags: ["dependencies", "sbom", "patching", "cve", "owasp"],
    relatedChallenges: [],
    icon: "🧱",
  },
  {
    slug: "security-logging-and-monitoring",
    title: "Security Logging and Monitoring Failures",
    subtitle: "The breach happened three months before anyone noticed.",
    description:
      "What to log and what to never log, alerting on the right signals, and why having logs isn't the same thing as having detection.",
    order: 11,
    estimatedMinutes: 18,
    tags: ["logging", "monitoring", "incident-response", "alerting", "owasp"],
    relatedChallenges: [],
    icon: "🔍",
  },
  {
    slug: "owasp-top-10-checklist",
    title: "The OWASP Top 10 Checklist",
    subtitle: "Every article in this series, collapsed into one audit you can run today.",
    description:
      "A consolidated, per-category checklist mapped directly to the OWASP Top 10, with concrete, verifiable items instead of vague advice.",
    order: 12,
    estimatedMinutes: 20,
    tags: ["owasp", "checklist", "security-audit", "capstone"],
    relatedChallenges: [],
    icon: "✅",
  },
];

export function getArticleBySlug(slug: string): ArticleMeta | undefined {
  return webSecurityArticles.find((a) => a.slug === slug);
}

export function getAdjacentArticles(slug: string) {
  const idx = webSecurityArticles.findIndex((a) => a.slug === slug);
  return {
    prev: idx > 0 ? webSecurityArticles[idx - 1] : null,
    next: idx < webSecurityArticles.length - 1 ? webSecurityArticles[idx + 1] : null,
  };
}
