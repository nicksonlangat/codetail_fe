import { ArchitectureEvolver } from "@/components/blog/interactive/architecture-evolver";

const DISTRIBUTED_TAX = [
  {
    cost: "Network calls instead of function calls",
    detail: "An in-process function call takes nanoseconds. A network call to another service takes milliseconds. A chain of five synchronous service calls adds 5ms+ of irreducible latency before a single byte of business logic runs.",
    severity: "high",
  },
  {
    cost: "Partial failure",
    detail: "A function call either returns or throws. A network call can time out, return a corrupted response, or succeed from the perspective of the server but never arrive at the client. Every service call is a distributed transaction that can partially fail.",
    severity: "high",
  },
  {
    cost: "Distributed tracing",
    detail: "A single user request now touches 5 services. When it is slow, which service is responsible? Without distributed tracing (Jaeger, Zipkin, DataDog APM), a 300ms request with no obvious cause takes hours to diagnose.",
    severity: "high",
  },
  {
    cost: "Service discovery",
    detail: "Services need to find each other. In a monolith, it is a function import. In microservices, it requires a registry (Consul, Kubernetes DNS, AWS Cloud Map) and health checking to route only to healthy instances.",
    severity: "medium",
  },
  {
    cost: "Data consistency across services",
    detail: "A transaction that spans two services cannot use database ACID guarantees. Sagas and compensating transactions replace atomic commits. Eventual consistency becomes a design constraint, not an edge case.",
    severity: "high",
  },
  {
    cost: "API versioning at every boundary",
    detail: "Changing a field in a monolith is one PR. Changing a field in a service API that three other services depend on requires versioning the API, running multiple versions simultaneously, and coordinating migration across teams.",
    severity: "medium",
  },
  {
    cost: "Operational surface area",
    detail: "Ten services means ten deploy pipelines, ten Kubernetes deployments, ten sets of alerts, ten log streams to correlate, and ten services to maintain TLS certificates for. The ops burden grows with service count.",
    severity: "medium",
  },
];

const BOUNDED_CONTEXTS = [
  {
    context: "Orders",
    owns: "Order lifecycle, order lines, order status, fulfilment state",
    publishedEvents: "order.created, order.cancelled, order.shipped",
    dependencies: "Catalog (read: product price at time of order), Payments (async: charge)",
  },
  {
    context: "Catalog",
    owns: "Product definitions, SKUs, pricing, inventory counts",
    publishedEvents: "product.updated, stock.depleted, price.changed",
    dependencies: "None upstream — source of truth for product data",
  },
  {
    context: "Payments",
    owns: "Payment methods, charges, refunds, payment state machine",
    publishedEvents: "payment.succeeded, payment.failed, refund.issued",
    dependencies: "Orders (async: consume order.created to initiate charge)",
  },
  {
    context: "Notifications",
    owns: "Email templates, push notification routing, send logs",
    publishedEvents: "notification.sent, notification.bounced",
    dependencies: "Subscribes to events from Orders, Payments — pure consumer",
  },
];

export function MicroservicesSection() {
  return (
    <section>
      <h2 id="microservices" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Microservices: Independent Deployability and Its Price
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A microservice is a service with a single, bounded responsibility that is independently
        deployable, independently scalable, and owned end-to-end by a single team. The goal is
        not small code. The goal is organizational independence: the team that owns the Payments
        service can deploy a fix at 2am without coordinating with the Orders team, the Catalog
        team, or the Notifications team.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The key word is independently. If deploying service A requires deploying service B first,
        they are not independent. If they share a database table, they are not independent. True
        independence requires process isolation, network boundaries between services, and each
        service owning its own data store. These constraints are what make microservices hard.
      </p>

      <ArchitectureEvolver />

      <h3 className="text-base font-semibold mt-4 mb-3">Bounded contexts: where to draw the lines</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Domain-Driven Design's bounded context is the right unit for a microservice. A bounded
        context is a region of the domain model where a given set of terms has a precise, unambiguous
        meaning. Orders, Catalog, Payments, and Notifications are different bounded contexts
        because the word "product" means something different in each: a thing you sell (Catalog),
        a line item with a locked-in price (Orders), a charge amount (Payments), a subject line in
        an email (Notifications).
      </p>

      <div className="space-y-2 mb-8">
        {BOUNDED_CONTEXTS.map(({ context, owns, publishedEvents, dependencies }) => (
          <div key={context} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="text-[11px] font-semibold text-primary">{context} Service</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-x-4 gap-y-1 px-4 py-3 text-[11px]">
              <p><span className="font-medium text-foreground/80">Owns:</span> <span className="text-muted-foreground">{owns}</span></p>
              <p><span className="font-medium text-foreground/80">Emits:</span> <span className="text-muted-foreground font-mono text-[10px]">{publishedEvents}</span></p>
              <p><span className="font-medium text-foreground/80">Depends on:</span> <span className="text-muted-foreground">{dependencies}</span></p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The distributed systems tax</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Every microservice architecture incurs a set of costs that simply do not exist in a
        monolith. These are not implementation details you can avoid — they are structural
        consequences of process isolation and network communication. Before choosing microservices,
        you must be willing to pay each of these costs permanently.
      </p>

      <div className="space-y-2">
        {DISTRIBUTED_TAX.map(({ cost, detail, severity }) => (
          <div
            key={cost}
            className={`flex gap-3 p-3 rounded-xl border ${
              severity === "high"
                ? "border-orange-400/20 bg-orange-400/5"
                : "border-border bg-card"
            }`}
          >
            <span className={`text-sm flex-shrink-0 mt-0.5 font-bold ${severity === "high" ? "text-orange-500" : "text-muted-foreground"}`}>
              {severity === "high" ? "!" : "~"}
            </span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{cost}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
