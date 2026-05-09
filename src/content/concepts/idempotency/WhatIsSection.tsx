const HTTP_METHODS = [
  {
    method: "GET",
    idempotent: true,
    safe: true,
    desc: "Retrieves a resource. Calling it 100 times returns the same result (assuming no state changes elsewhere).",
  },
  {
    method: "HEAD",
    idempotent: true,
    safe: true,
    desc: "Same as GET but returns headers only. Same idempotency guarantee.",
  },
  {
    method: "PUT",
    idempotent: true,
    safe: false,
    desc: "Replaces a resource entirely. PUT /users/1 with the same body always produces the same user state, regardless of how many times it runs.",
  },
  {
    method: "DELETE",
    idempotent: true,
    safe: false,
    desc: "The first call removes the resource. Subsequent calls on the same resource return 404. The system state is the same: the resource is absent.",
  },
  {
    method: "POST",
    idempotent: false,
    safe: false,
    desc: "Creates a new resource or triggers an action. POST /orders creates a new order each time. Not idempotent by default.",
  },
  {
    method: "PATCH",
    idempotent: false,
    safe: false,
    desc: "Partially updates a resource. Typically not idempotent: PATCH /counter with { increment: 1 } adds 1 on each call.",
  },
];

export function WhatIsSection() {
  return (
    <section>
      <h2 id="what-is" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        What Idempotency Means
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        An operation is idempotent if calling it once produces the same result as calling
        it ten times. The system ends up in the same state regardless of how many times the
        operation was applied.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Idempotency is not the same as safety. A safe operation has no side effects. An
        idempotent operation can have side effects, but those side effects are identical
        whether the operation runs once or a hundred times. DELETE is idempotent but not
        safe: it modifies state, but deleting an already-deleted resource leaves the system
        in the same final state.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">HTTP methods</h3>

      <div className="space-y-2 mb-8">
        {HTTP_METHODS.map(({ method, idempotent, safe, desc }) => (
          <div key={method} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="font-mono text-[11px] font-bold text-primary w-14 flex-shrink-0 mt-0.5">
              {method}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                    idempotent
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {idempotent ? "Idempotent" : "Not idempotent"}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                    safe ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {safe ? "Safe" : "Not safe"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The classic failure mode</h3>

      <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-2.5 border-b border-border bg-muted/30">
          <p className="text-[11px] font-semibold">Payment processing without idempotency</p>
        </div>
        <div className="px-4 py-4 space-y-2">
          {[
            { step: "1", desc: "Client sends POST /charges with amount=100." },
            { step: "2", desc: "Server processes the charge. Card is debited." },
            { step: "3", desc: "Server sends the response. Network fails before the client receives it." },
            { step: "4", desc: 'Client receives a timeout. It cannot tell if the charge succeeded.' },
            { step: "5", desc: "Client retries: POST /charges with amount=100." },
            { step: "6", desc: "Server processes the charge again. Customer is billed twice." },
          ].map(({ step, desc }) => (
            <div key={step} className="flex gap-3 text-[11px]">
              <span className="w-5 h-5 rounded-full bg-secondary text-muted-foreground text-[9px] font-bold flex-shrink-0 flex items-center justify-center">
                {step}
              </span>
              <p className={`text-muted-foreground mt-0.5 ${step === "6" ? "text-destructive" : ""}`}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
