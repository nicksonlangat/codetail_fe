const STRANGLER_STEPS = [
  {
    step: 1,
    name: "Identify the extraction candidate",
    detail: "Find a module with a clear bounded context, stable interfaces, and a team that owns it. Notification sending is a good first extraction — it is purely downstream, no other service needs to call it back synchronously.",
  },
  {
    step: 2,
    name: "Create a facade in front of the monolith module",
    detail: "Insert a routing layer (HTTP proxy, message consumer, or anti-corruption layer) that sits in front of the existing module. All traffic for that module now goes through the facade. No callers change yet.",
  },
  {
    step: 3,
    name: "Build the new service in parallel",
    detail: "The new service implements the same interface as the monolith module. It is developed and tested independently. The facade routes a percentage of traffic (or a canary subset) to the new service.",
  },
  {
    step: 4,
    name: "Migrate the data",
    detail: "The hardest step. The new service needs its own database. Dual-write during the transition: write to both the monolith's schema and the new service's schema. Validate consistency. Then switch reads to the new service.",
  },
  {
    step: 5,
    name: "Route all traffic to the new service",
    detail: "The facade now sends 100% of traffic to the new service. The monolith's module code still exists but receives no traffic. Run both in parallel for a soak period (days to weeks) to validate correctness.",
  },
  {
    step: 6,
    name: "Delete the monolith module",
    detail: "Once the new service is stable, delete the module from the monolith codebase. Remove the facade. The monolith no longer owns this responsibility. The extraction is complete.",
  },
];

const DATA_DECOMPOSITION_PROBLEMS = [
  {
    problem: "Shared tables",
    symptom: "Two services both write to the users table. Splitting the database means one service must call the other for user data it no longer owns directly.",
    approach: "Assign ownership. One service is the system of record for each table. Others read via API or event subscription. Migrate foreign key relationships to reference IDs across service boundaries.",
  },
  {
    problem: "Cross-service joins",
    symptom: "The reporting query joins orders, users, and products in a single SQL statement. After splitting, that query cannot exist.",
    approach: "Materialized views or read models. Build a dedicated read service that subscribes to events from all three and maintains a denormalized projection optimized for the query.",
  },
  {
    problem: "Distributed transactions",
    symptom: "Creating an order requires atomically decrementing inventory and creating a payment record. With separate databases, there is no two-phase commit.",
    approach: "Saga pattern: publish order.created event, inventory service decrements stock and emits stock.reserved, payment service charges and emits payment.succeeded. Compensating events handle failures.",
  },
  {
    problem: "Referential integrity",
    symptom: "The orders table has a foreign key to users.id. Splitting means the database can no longer enforce this constraint.",
    approach: "Soft references: store the user ID as a plain integer with no FK constraint. The service is responsible for data consistency. Eventual consistency is the new contract.",
  },
];

export function MigrationSection() {
  return (
    <section>
      <h2 id="migration" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Migrating: The Strangler Fig Pattern
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The strangler fig is a vine that grows around a tree, gradually replacing it. Martin
        Fowler named the pattern after it: instead of rewriting the monolith from scratch
        (a project that almost universally fails), you extract services incrementally from
        the outside in, while the monolith continues running in production.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Each extraction is a self-contained project with a defined start and end state. The
        monolith shrinks one module at a time. If an extraction goes wrong, you route traffic
        back to the monolith. There is no big-bang cutover, no rewrite risk.
      </p>

      <div className="space-y-2 mb-8">
        {STRANGLER_STEPS.map(({ step, name, detail }) => (
          <div key={step} className="flex gap-4 p-3 bg-card border border-border rounded-xl">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
              {step}
            </span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{name}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The hardest part: splitting the database</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Code extraction is the easy part. Database decomposition is what makes migrations
        genuinely hard. A shared relational database provides joins, foreign key constraints,
        and atomic transactions across all tables. When services get their own databases,
        all three disappear. Every shared table is a dependency that must be resolved before
        the service can be independent.
      </p>

      <div className="space-y-3 mb-6">
        {DATA_DECOMPOSITION_PROBLEMS.map(({ problem, symptom, approach }) => (
          <div key={problem} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="text-[11px] font-semibold">{problem}</span>
            </div>
            <div className="px-4 py-3 space-y-1.5 text-[11px]">
              <p>
                <span className="font-medium text-orange-500">Symptom: </span>
                <span className="text-muted-foreground">{symptom}</span>
              </p>
              <p>
                <span className="font-medium text-primary">Approach: </span>
                <span className="text-muted-foreground">{approach}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-warning bg-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-foreground/70">
          The Lessons of Microservices from organizations that have done it at scale
          (Uber, Netflix, Shopify) consistently point to the same insight: if you cannot
          define clear ownership boundaries in the monolith, splitting into services does not
          create those boundaries — it just makes the coupling more expensive. Fix the
          architecture in the monolith first. Extract services second.
        </p>
      </div>
    </section>
  );
}
