const MODELS = [
  {
    name: "RBAC",
    full: "Role-Based Access Control",
    color: "text-primary bg-primary/10 border-primary/20",
    model: "Users are assigned roles. Roles have permissions. Access decision: does this role have this permission?",
    example: `roles = {
  viewer:  ["read:posts", "read:comments"],
  editor:  ["read:posts", "write:posts", "read:comments"],
  admin:   ["*"],  # all permissions
}

user.role = "editor"
can_edit = "write:posts" in roles[user.role]  # True`,
    strengths: ["Simple to understand and audit", "Permissions change by editing role definitions", "Works well when users fall into clear categories"],
    weaknesses: ["Role explosion: 50+ roles to express fine-grained access", "Cannot express context: 'own resources only' requires extra logic", "No attribute-based decisions (time, location, resource state)"],
    when: "Internal admin tools, SaaS with clear tiers (free/pro/admin), APIs with well-defined scopes.",
  },
  {
    name: "ABAC",
    full: "Attribute-Based Access Control",
    color: "text-orange-500 bg-orange-400/10 border-orange-400/20",
    model: "Access decision based on attributes of the subject (user), resource, action, and environment. Policy is expressed as rules over attribute combinations.",
    example: `# Policy: editors can edit posts they authored;
# admins can edit any post;
# only during business hours in their timezone

def can_edit(user, post, context):
    if user.role == "admin":
        return True
    if user.role == "editor":
        authored = post.author_id == user.id
        in_hours = 9 <= context.local_hour < 18
        return authored and in_hours
    return False`,
    strengths: ["Fine-grained: any combination of attributes", "Handles ownership, time, location, resource state", "One policy engine, no role explosion"],
    weaknesses: ["Complex policies are hard to audit", "Performance: policy evaluation can be slow for complex rules", "Debugging access denials requires tracing the policy evaluation"],
    when: "Healthcare (HIPAA: access by role + department + patient relationship), financial data, multi-tenant SaaS with complex ownership rules.",
  },
  {
    name: "ReBAC",
    full: "Relationship-Based Access Control",
    color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    model: "Access is determined by the graph of relationships between users and resources. 'Can user U access resource R?' is answered by traversing the relationship graph.",
    example: `# Google Zanzibar model:
# user:alice is viewer of document:plan
# user:alice is member of group:eng
# group:eng is editor of folder:projects
# document:plan is in folder:projects

# Question: can alice edit document:plan?
# → alice member of eng
# → eng editor of projects
# → plan in projects
# → YES (inherited through relationship chain)`,
    strengths: ["Natural model for hierarchical resources (drives, folders, documents)", "Handles group membership and inheritance automatically", "Used by Google Drive, GitHub, Notion, Figma"],
    weaknesses: ["Complex to implement from scratch", "Graph traversal at request time requires optimization (caching, precomputation)", "Reasoning about policy requires graph visualization tools"],
    when: "Collaborative applications with hierarchical resources and group-based sharing (Google Docs model, GitHub orgs/teams/repos).",
  },
];

export function AuthZModelsSection() {
  return (
    <section>
      <h2 id="authz-models" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Authorization Models: RBAC, ABAC, ReBAC
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Authorization is a policy problem: given a verified identity and a requested action,
        does this identity have permission? Three models dominate production systems, each
        expressing policy at different levels of sophistication. RBAC works for simple access
        control. ABAC handles context-dependent decisions. ReBAC models the relationship
        graphs used by collaborative applications.
      </p>

      <div className="space-y-6 mb-8">
        {MODELS.map(({ name, full, color, model, example, strengths, weaknesses, when }) => (
          <div key={name} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30">
              <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded border ${color}`}>
                {name}
              </span>
              <span className="text-[12px] font-semibold">{full}</span>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-[11px] text-muted-foreground">{model}</p>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-2">Example</p>
                <pre className="text-[9px] font-mono bg-muted/50 rounded-xl px-4 py-3 overflow-x-auto leading-relaxed text-foreground/80">
                  {example}
                </pre>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-primary mb-1.5">Strengths</p>
                  <ul className="space-y-1">
                    {strengths.map(s => (
                      <li key={s} className="flex gap-1.5 text-muted-foreground">
                        <span className="text-primary flex-shrink-0">+</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-orange-500 mb-1.5">Weaknesses</p>
                  <ul className="space-y-1">
                    {weaknesses.map(w => (
                      <li key={w} className="flex gap-1.5 text-muted-foreground">
                        <span className="text-orange-500 flex-shrink-0">-</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-[11px]">
                <span className="font-medium text-foreground/80">Use when: </span>
                <span className="text-muted-foreground">{when}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Practical guidance</h3>

      <div className="space-y-2">
        {[
          {
            rule: "Start with RBAC — add complexity only when needed",
            detail: "Most applications have fewer than five meaningful roles. RBAC is auditable, easy to explain to non-engineers, and sufficient for the majority of access control requirements.",
          },
          {
            rule: "Add ownership checks on top of RBAC for resource-level control",
            detail: 'RBAC says "editors can edit posts". Add: "and only posts they created." This is the most common extension and does not require a full ABAC engine.',
          },
          {
            rule: "Enforce authorization at every access point, not just the HTTP layer",
            detail: "Direct database queries, async jobs, and admin scripts all need authorization checks. A row-level security policy at the database layer is the only guarantee.",
          },
          {
            rule: "Use OpenFGA or Casbin before building your own authorization engine",
            detail: "OpenFGA (based on Google Zanzibar) is the open-source reference for ReBAC. Casbin handles RBAC and ABAC. Both have client libraries for major languages.",
          },
        ].map(({ rule, detail }) => (
          <div key={rule} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">→</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{rule}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
