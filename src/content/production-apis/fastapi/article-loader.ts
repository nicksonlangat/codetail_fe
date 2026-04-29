import type React from "react";

type TocItem = { id: string; title: string };

type ArticleModule = {
  default: React.ComponentType;
  toc: TocItem[];
};

const loaders: Record<string, () => Promise<ArticleModule>> = {
  "the-baseline": () => import("./the-baseline") as Promise<ArticleModule>,
  "100-concurrent-users": () => import("./100-concurrent-users") as Promise<ArticleModule>,
  "slow-queries": () => import("./slow-queries") as Promise<ArticleModule>,
  "authentication-and-authorization": () => import("./authentication-and-authorization") as Promise<ArticleModule>,
  "observability": () => import("./observability") as Promise<ArticleModule>,
  "security-hardening": () => import("./security-hardening") as Promise<ArticleModule>,
  "sub-100ms-latency": () => import("./sub-100ms-latency") as Promise<ArticleModule>,
  "zero-downtime-deployments": () => import("./zero-downtime-deployments") as Promise<ArticleModule>,
  "surviving-partial-failures": () => import("./surviving-partial-failures") as Promise<ArticleModule>,
  "10000-requests-per-second": () => import("./10000-requests-per-second") as Promise<ArticleModule>,
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
