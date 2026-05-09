const SCENARIOS = [
  {
    title: "Payment processing",
    situation:
      "Client sends a payment request. Server processes it and debits the card, but the response is lost in transit.",
    without:
      "Client retries. Server charges the card again. Customer is billed twice. Resolving requires a refund, a support ticket, and damaged trust.",
    with:
      "Client sends the same idempotency key on retry. Server detects the duplicate and returns the original charge result without reprocessing.",
  },
  {
    title: "Email sending",
    situation:
      "A background job sends a welcome email. The job crashes after sending but before marking the task complete. The job runner retries.",
    without:
      "The user receives two welcome emails. If the job retries ten times before giving up, they receive ten.",
    with:
      "A unique constraint on (user_id, email_type) ensures the send record is only inserted once. INSERT ON CONFLICT DO NOTHING prevents duplicate sends.",
  },
  {
    title: "Order creation",
    situation:
      "A mobile client submits an order. The network is slow. The app times out and the user taps Place Order a second time.",
    without:
      "Two orders are created. The warehouse ships twice. Returns, customer service, refund. The cost is high.",
    with:
      "An idempotency key tied to the user session means the second tap returns the existing order ID instead of creating a new one.",
  },
];

export function WhyItMattersSection() {
  return (
    <section>
      <h2 id="why-it-matters" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Why It Matters
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Networks fail. TCP connections drop. Mobile clients switch from WiFi to cellular
        mid-request. Servers crash between processing a request and sending the response.
        Load balancers time out. Every layer between a client and a server introduces a
        chance that a request is processed but the client never learns the outcome.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        A well-behaved client retries on failure. This is correct behavior: the alternative
        is silently losing operations. But retrying a non-idempotent operation creates
        duplicates. The only way to allow safe retries is to make the operation idempotent.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">At-least-once delivery</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Distributed messaging systems guarantee at-least-once delivery, not exactly-once.
        Kafka, SQS, and RabbitMQ may deliver a message more than once if the consumer
        crashes after processing but before acknowledging. This is a deliberate trade-off:
        exactly-once delivery is expensive, and at-least-once delivery with idempotent
        consumers achieves the same practical result at lower cost.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Any consumer that processes a payment, sends a notification, or creates a record
        must handle duplicate messages. If it does not, at-least-once delivery becomes
        at-least-once-charge, at-least-once-email, at-least-once-row.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Where duplicates hurt most</h3>

      <div className="space-y-3 mb-6">
        {SCENARIOS.map(({ title, situation, without: wo, with: wi }) => (
          <div key={title} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
              <p className="text-[11px] font-semibold">{title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{situation}</p>
            </div>
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
              <div className="px-4 py-3">
                <p className="text-[9px] uppercase tracking-wider text-destructive mb-1">
                  Without idempotency
                </p>
                <p className="text-[11px] text-muted-foreground">{wo}</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[9px] uppercase tracking-wider text-primary mb-1">
                  With idempotency
                </p>
                <p className="text-[11px] text-muted-foreground">{wi}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
