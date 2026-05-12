const EXAMPLES = [
  {
    title: "Bank balance transfer",
    description: "Two concurrent withdrawals from an account with a $100 balance.",
    steps: [
      { text: "Thread A reads balance: $100", bad: false },
      { text: "Thread B reads balance: $100", bad: false },
      { text: "Thread A checks: $100 >= $80. Proceeds.", bad: false },
      { text: "Thread B checks: $100 >= $90. Proceeds.", bad: false },
      { text: "Thread A writes new balance: $100 - $80 = $20.", bad: false },
      { text: "Thread B writes new balance: $100 - $90 = $10.", bad: false },
      { text: "Final balance: $10. Account overdrawn by $70.", bad: true },
    ],
  },
  {
    title: "Ticket reservation",
    description: "Two users attempt to book the last seat on a flight.",
    steps: [
      { text: "Request A reads available seats: 1.", bad: false },
      { text: "Request B reads available seats: 1.", bad: false },
      { text: "Request A: 1 > 0, seat is available. Creates booking.", bad: false },
      { text: "Request B: 1 > 0, seat is available. Creates booking.", bad: false },
      { text: "Both bookings are committed to the database.", bad: false },
      { text: "Two passengers, one seat. One arrives at the gate with an invalid ticket.", bad: true },
    ],
  },
];

export function WhatIsSection() {
  return (
    <section>
      <h2 id="what-is" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        What a Race Condition Is
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A race condition occurs when two concurrent operations read shared state, make a
        decision based on that state, and both proceed as if the other did not exist. By
        the time each writes back, the assumption it made about the state is no longer valid.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The classic pattern is read-modify-write. Operation A reads a value. Before A can
        write back, operation B reads the same value. Both modify it. B writes first. A
        overwrites B. Neither operation raises an error. The data is just wrong.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Classic examples</h3>

      <div className="space-y-4 mb-8">
        {EXAMPLES.map(({ title, description, steps }) => (
          <div key={title} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
              <p className="text-[11px] font-semibold">{title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>
            </div>
            <div className="px-4 py-3 space-y-1.5">
              {steps.map(({ text, bad }, i) => (
                <div key={i} className="flex gap-2.5 text-[11px]">
                  <span className="font-mono text-muted-foreground/40 flex-shrink-0 mt-0.5 w-4">
                    {i + 1}.
                  </span>
                  <span className={bad ? "text-destructive font-medium" : "text-muted-foreground"}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The check-then-act problem</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Check-then-act is the most common race condition in application code. The code
        checks a condition, then acts on the assumption that the condition is still true.
        Under concurrency, the condition can change between the check and the act. These
        two steps are not atomic.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`# Broken: check-then-act is not atomic
async def book_seat(seat_id: int, user_id: int):
    seat = await db.fetchrow(
        "SELECT * FROM seats WHERE id = $1", seat_id
    )

    if seat["available"]:        # CHECK  <- another request runs here
        await db.execute(        # ACT    <- seat may already be taken
            "UPDATE seats SET available = false, user_id = $1 WHERE id = $2",
            user_id, seat_id,
        )
        return {"status": "booked"}

    return {"status": "unavailable"}

# Two concurrent requests both pass the check and both book the same seat.`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90">
        The fix is to make the check and the act a single atomic operation. How you do
        that depends on where the shared state lives. The next two sections cover database
        isolation and the three locking strategies that eliminate race conditions in practice.
      </p>
    </section>
  );
}
