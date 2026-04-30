import { ShieldOff, Eye, Database } from "lucide-react";

const FAILURES = [
  {
    Icon: ShieldOff,
    title: "No authentication -- any caller can act as any user",
    trigger: "From the very first request",
    symptom: "POST /tasks with no token creates a task. GET /tasks returns all tasks in the database.",
    detail:
      "Without a token requirement, every endpoint is fully public. A user who discovers the API URL can read every task, create tasks attributed to no one, and delete records that belong to other users. There is no concept of identity.",
  },
  {
    Icon: Eye,
    title: "Queries are not scoped -- user A sees user B's data",
    trigger: "The moment a second user registers",
    symptom: "GET /tasks returns tasks belonging to all users, not just the requester.",
    detail:
      "Even after adding authentication, a query like SELECT * FROM tasks returns every row in the table. Identifying the caller is not enough -- every query must be filtered to WHERE user_id = current_user.id. Forgetting this on a single endpoint is a data breach.",
  },
  {
    Icon: Database,
    title: "No object-level checks -- direct ID access bypasses list scoping",
    trigger: "Any authenticated user who guesses a task ID",
    symptom: "GET /tasks/42 returns the task even if task 42 belongs to another user.",
    detail:
      "Scoping the list endpoint is not sufficient. A caller who knows or guesses a task ID can access it directly via GET /tasks/{id}. Every endpoint that accepts an ID must verify that the retrieved record belongs to the current user before returning it.",
  },
];

export function WhatBreaksSection() {
  return (
    <section id="what-breaks">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">What Breaks</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Three distinct failure modes, each requiring a different fix. The first is
        about identity (who are you), the second is about data scoping (what are you
        allowed to see in aggregate), and the third is about object-level access (are
        you allowed to see this specific record).
      </p>

      <div className="space-y-3">
        {FAILURES.map(({ Icon, title, trigger, symptom, detail }) => (
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
