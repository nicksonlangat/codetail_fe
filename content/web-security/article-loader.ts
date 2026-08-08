type TocItem = { id: string; title: string };

type ArticleModule = {
  default: React.ComponentType;
  toc: TocItem[];
};

// Add an entry here as each article's content folder is written.
// Slugs without an entry fall back to "coming soon" in the article page.
const loaders: Record<string, () => Promise<ArticleModule>> = {
  "injection": () => import("./injection") as Promise<ArticleModule>,
  "cross-site-scripting": () => import("./cross-site-scripting") as Promise<ArticleModule>,
  "broken-access-control": () => import("./broken-access-control") as Promise<ArticleModule>,
  "csrf": () => import("./csrf") as Promise<ArticleModule>,
  "authentication-and-session-management": () => import("./authentication-and-session-management") as Promise<ArticleModule>,
  "cryptographic-failures": () => import("./cryptographic-failures") as Promise<ArticleModule>,
  "security-misconfiguration": () => import("./security-misconfiguration") as Promise<ArticleModule>,
  "ssrf": () => import("./ssrf") as Promise<ArticleModule>,
  "insecure-deserialization-and-supply-chain": () => import("./insecure-deserialization-and-supply-chain") as Promise<ArticleModule>,
  "vulnerable-and-outdated-components": () => import("./vulnerable-and-outdated-components") as Promise<ArticleModule>,
  "security-logging-and-monitoring": () => import("./security-logging-and-monitoring") as Promise<ArticleModule>,
  "owasp-top-10-checklist": () => import("./owasp-top-10-checklist") as Promise<ArticleModule>,
};

export async function loadArticle(slug: string): Promise<ArticleModule | null> {
  const loader = loaders[slug];
  if (!loader) return null;
  try {
    return await loader();
  } catch {
    return null;
  }
}
