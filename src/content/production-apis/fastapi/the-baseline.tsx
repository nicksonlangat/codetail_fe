import { SetupSection } from "./the-baseline/SetupSection";
import { EndpointsSection } from "./the-baseline/EndpointsSection";
import { WhatBreaksSection } from "./the-baseline/WhatBreaksSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "project-setup", title: "Project Setup" },
  { id: "the-endpoints", title: "The Three Endpoints" },
  { id: "what-breaks", title: "What Will Break First" },
  { id: "summary", title: "Summary" },
];

export default function TheBaselineArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Every production system starts as something simpler. This series tracks one API
          from that starting point to a system handling 10,000 requests per second. Each
          article introduces a single new constraint, shows exactly what breaks, and fixes
          it with the minimum code change required.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          This article is the starting point. No constraints yet. The goal is to build
          the simplest possible task management API, understand every line of it, and
          identify what will fail first when real traffic arrives.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          The API has three endpoints: create a task, fetch a task by ID, and list tasks.
          The database is SQLite. The handlers are synchronous. There is no caching, no
          auth, no error handling beyond 404s. It works on your laptop. That is the entire
          goal of this article.
        </p>
      </section>

      <SetupSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <EndpointsSection />
      <WhatBreaksSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🔧",
              label: "Start simple and know why",
              desc: "SQLite, sync handlers, and offset pagination are the right defaults when you have no traffic. The cost of this simplicity is precisely known: 5 failure modes, all of them fixable.",
            },
            {
              icon: "📋",
              label: "Four files, four concerns",
              desc: "main.py (routes), database.py (connection), models.py (ORM), schemas.py (validation). Each file has one job. This separation makes every subsequent change localized.",
            },
            {
              icon: "🔒",
              label: "SQLite breaks at 2 concurrent writers",
              desc: "File-level locking is not a bug, it is a design constraint of SQLite. Article 2 replaces it with PostgreSQL and a connection pool.",
            },
            {
              icon: "🐢",
              label: "Offset pagination does not scale",
              desc: 'OFFSET 10000 LIMIT 20 reads and discards 10,000 rows. At small table sizes this is invisible. Article 3 replaces it with cursor-based pagination.',
            },
            {
              icon: "💔",
              label: "No health check means invisible failures",
              desc: "Load balancers cannot distinguish a running process from a crashed one without a /health endpoint. Article 2 adds liveness and readiness probes.",
            },
            {
              icon: "➡️",
              label: "Next: 100 concurrent users",
              desc: "Article 2 applies the first real constraint: 100 simultaneous requests without errors. SQLite goes, PostgreSQL arrives, and the handlers become async.",
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
