import type React from "react";

type TocItem = { id: string; title: string };

type ArticleModule = {
  default: React.ComponentType;
  toc: TocItem[];
};

const loaders: Record<string, () => Promise<ArticleModule>> = {
  "the-request-journey": () => import("./the-request-journey") as Promise<ArticleModule>,
  "scalability-fundamentals": () => import("./scalability-fundamentals") as Promise<ArticleModule>,
  "load-balancing": () => import("./load-balancing") as Promise<ArticleModule>,
  "caching": () => import("./caching") as Promise<ArticleModule>,
  "databases-sql-vs-nosql": () => import("./databases-sql-vs-nosql") as Promise<ArticleModule>,
  "indexes-and-query-optimization": () => import("./indexes-and-query-optimization") as Promise<ArticleModule>,
  "cap-theorem": () => import("./cap-theorem") as Promise<ArticleModule>,
  "apis-rest-graphql-grpc": () => import("./apis-rest-graphql-grpc") as Promise<ArticleModule>,
  "message-queues-and-event-streams": () => import("./message-queues-and-event-streams") as Promise<ArticleModule>,
  "microservices-vs-monolith": () => import("./microservices-vs-monolith") as Promise<ArticleModule>,
  "rate-limiting": () => import("./rate-limiting") as Promise<ArticleModule>,
  "authentication-and-authorization": () => import("./authentication-and-authorization") as Promise<ArticleModule>,
  "cdns-and-edge-networks": () => import("./cdns-and-edge-networks") as Promise<ArticleModule>,
  "resilience-patterns": () => import("./resilience-patterns") as Promise<ArticleModule>,
  "design-a-real-system": () => import("./design-a-real-system") as Promise<ArticleModule>,
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
