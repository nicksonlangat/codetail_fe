const STRATEGIES = [
  {
    name: "Pessimistic locking",
    mechanism:
      "Lock the row at read time. No other transaction can modify it until the lock is released. The check and the act run within the same exclusive lock.",
    when: "High-contention operations where conflicts are likely. Short critical sections. Seat booking, inventory reservation, balance transfers.",
    tradeoff:
      "Blocking: other transactions wait for the lock to be released. Risk of deadlocks if multiple rows are locked in different orders across transactions.",
  },
  {
    name: "Optimistic locking",
    mechanism:
      "Read without locking. At write time, verify that the row has not changed since it was read. If it has changed, the update affects zero rows and the application retries.",
    when: "Low-contention operations where conflicts are rare. Workflows where holding a lock for the entire processing window would be impractical.",
    tradeoff:
      "Requires retry logic in the application. Under high contention, retry storms increase load rather than reducing it.",
  },
  {
    name: "Atomic SQL",
    mechanism:
      "Perform the read, check, and write in a single SQL statement. The database guarantees the statement is atomic.",
    when: "Simple increment and decrement operations. Counter updates. Any mutation that can be expressed as a single conditional UPDATE.",
    tradeoff:
      "Limited expressiveness: only works when the entire business logic fits inside one SQL statement.",
  },
];

export function SolvingSection() {
  return (
    <section>
      <h2 id="solving" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Solving Race Conditions
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Three patterns cover most race conditions in application code. The right choice
        depends on how likely conflicts are, how long the critical section takes, and
        whether the logic fits in a single SQL statement.
      </p>

      <div className="space-y-3 mb-8">
        {STRATEGIES.map(({ name, mechanism, when: w, tradeoff }) => (
          <div key={name} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
              <p className="text-[11px] font-semibold">{name}</p>
            </div>
            <div className="px-4 py-3 space-y-1.5 text-[11px]">
              <p className="text-muted-foreground">{mechanism}</p>
              <p>
                <span className="font-medium text-foreground/80">Use when: </span>
                <span className="text-muted-foreground">{w}</span>
              </p>
              <p>
                <span className="font-medium text-orange-500">Trade-off: </span>
                <span className="text-muted-foreground">{tradeoff}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Pessimistic locking: SELECT FOR UPDATE</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-8 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`async def book_seat(seat_id: int, user_id: int):
    async with db.transaction():
        # FOR UPDATE acquires a row-level lock.
        # Any other transaction attempting the same SELECT FOR UPDATE
        # on this row will block until this transaction commits or rolls back.
        seat = await db.fetchrow(
            "SELECT * FROM seats WHERE id = $1 FOR UPDATE",
            seat_id,
        )

        if not seat["available"]:
            return {"status": "unavailable"}

        await db.execute(
            "UPDATE seats SET available = false, user_id = $1 WHERE id = $2",
            user_id,
            seat_id,
        )
        return {"status": "booked"}`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Optimistic locking: version column</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-8 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Schema: add a version column
CREATE TABLE accounts (
    id      UUID PRIMARY KEY,
    balance INT NOT NULL,
    version INT NOT NULL DEFAULT 0
);

-- Application: include the version in the WHERE clause
async def withdraw(account_id: str, amount: int, max_retries: int = 3):
    for attempt in range(max_retries):
        account = await db.fetchrow(
            "SELECT * FROM accounts WHERE id = $1", account_id
        )

        if account["balance"] < amount:
            raise ValueError("Insufficient funds")

        rows_updated = await db.execute(
            """
            UPDATE accounts
               SET balance = balance - $1,
                   version = version + 1
             WHERE id = $2
               AND version = $3
            """,
            amount, account_id, account["version"],
        )

        if rows_updated == 1:
            return          # success: no concurrent modification
        # rows_updated == 0 means another transaction changed the row first
        # loop and retry with the fresh version

    raise RuntimeError("Too many concurrent modifications, retry limit reached")`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Atomic SQL: single-statement update</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-8 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- The entire check-then-act is a single atomic statement.
-- No application-level locking needed.

-- Decrement inventory only if stock is available
UPDATE inventory
   SET quantity = quantity - 1
 WHERE product_id = $1
   AND quantity > 0;

-- The database guarantees this statement runs atomically.
-- Two concurrent requests cannot both pass the quantity > 0 check
-- and both decrement from the same value.`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Distributed locks with Redis</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        When the critical section spans multiple services or multiple databases, a
        row-level lock does not help. Redis SET NX EX creates a lock that is visible to
        all application instances. Only one holder at a time. The TTL ensures the lock
        is released automatically if the holder crashes.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`import uuid
from contextlib import asynccontextmanager
from redis.asyncio import Redis

redis = Redis(decode_responses=True)

@asynccontextmanager
async def distributed_lock(resource_id: str, ttl_seconds: int = 30):
    lock_key = f"lock:{resource_id}"
    lock_value = str(uuid.uuid4())      # unique so we only release our own lock

    acquired = await redis.set(lock_key, lock_value, nx=True, ex=ttl_seconds)
    if not acquired:
        raise RuntimeError(f"Could not acquire lock on {resource_id}")

    try:
        yield
    finally:
        # Release atomically: only delete if we still own the lock
        release_script = """
            if redis.call('get', KEYS[1]) == ARGV[1] then
                return redis.call('del', KEYS[1])
            end
            return 0
        """
        await redis.eval(release_script, 1, lock_key, lock_value)

# Usage
async def process_payment(payment_id: str):
    async with distributed_lock(f"payment:{payment_id}"):
        await charge_card(payment_id)
        await update_order_status(payment_id)`}
        </pre>
      </div>
    </section>
  );
}
