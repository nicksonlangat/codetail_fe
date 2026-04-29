const CODE_GEN = [
  {
    approach: "Random Base62",
    how: "Generate 7 random chars from [0-9A-Za-z]. Check DB for collision; retry if taken.",
    tradeoff: "Simple. Collision probability at 7 chars: ~1 in 3.5 trillion per generation. Requires one DB read per write to check uniqueness.",
    verdict: "Works at small scale. Gets expensive at high write throughput.",
  },
  {
    approach: "Counter + Base62 encode",
    how: "Use the auto-incremented DB primary key. Base62-encode the integer (e.g. id=12345 → 3d7).",
    tradeoff: "Zero collisions. No uniqueness check needed. Sequential IDs are enumerable: anyone can walk your URL space. Mitigate with a random prefix or salted hash.",
    verdict: "Preferred. Deterministic, fast, no retry loop.",
  },
  {
    approach: "Hash of long URL",
    how: "SHA-256 the long URL, take the first 7 chars of the Base62-encoded hash.",
    tradeoff: "Deterministic: same long URL always maps to the same short code. Enables deduplication. Hash collisions (different URLs, same hash prefix) require a fallback.",
    verdict: "Good for deduplication. Combine with counter for collision handling.",
  },
];

export function CoreDesignSection() {
  return (
    <section>
      <h2 id="core-design" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Core Design
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The URL shortener is, at its core, a key-value lookup: short code maps to long URL.
        Three decisions define the design: how to generate short codes without collisions,
        how to store URLs efficiently, and how to serve redirects with sub-100ms latency.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Code generation</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The short code must be unique, URL-safe, and short. Base62 (digits + uppercase + lowercase)
        gives 62 symbols. At 7 characters: 62^7 = 3.5 trillion unique codes. That covers
        decades of URL creation even at hyperscale.
      </p>

      <div className="space-y-3 mb-6">
        {CODE_GEN.map(({ approach, how, tradeoff, verdict }) => (
          <div key={approach} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="text-[11px] font-semibold">{approach}</span>
              <span className="text-[9px] font-mono text-primary">{verdict.split(".")[0]}</span>
            </div>
            <div className="px-4 py-3 space-y-1.5 text-[11px]">
              <p className="text-muted-foreground"><span className="font-medium text-foreground/80">How: </span>{how}</p>
              <p className="text-muted-foreground"><span className="font-medium text-foreground/80">Tradeoff: </span>{tradeoff}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          Base62 encoding (counter approach)
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

def encode(n: int) -> str:
    """Encode a positive integer as a Base62 string."""
    if n == 0:
        return BASE62[0]
    chars = []
    while n:
        chars.append(BASE62[n % 62])
        n //= 62
    return "".join(reversed(chars))

# id=1     → "1"
# id=62    → "A"
# id=3844  → "AA"
# id=12345 → "3Kd"  (7 chars exhausted at id ~3.5 trillion)

async def create_short_url(long_url: str, user_id: int) -> str:
    row = await db.fetchrow(
        "INSERT INTO urls (long_url, user_id) VALUES ($1, $2) RETURNING id",
        long_url, user_id,
    )
    short_code = encode(row["id"])
    await db.execute(
        "UPDATE urls SET short_code = $1 WHERE id = $2",
        short_code, row["id"],
    )
    return short_code`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Schema design</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          PostgreSQL schema
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`CREATE TABLE urls (
    id          BIGSERIAL    PRIMARY KEY,
    short_code  VARCHAR(10)  NOT NULL UNIQUE,
    long_url    TEXT         NOT NULL,
    user_id     BIGINT       REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    expires_at  TIMESTAMPTZ  -- NULL means never expires
);

-- Hot path: every redirect does this lookup
CREATE INDEX idx_urls_short_code ON urls (short_code);

-- Dashboard queries: show a user their links
CREATE INDEX idx_urls_user_id ON urls (user_id, created_at DESC);

-- Background job: reap expired URLs
CREATE INDEX idx_urls_expires_at ON urls (expires_at)
    WHERE expires_at IS NOT NULL;`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The redirect API: 301 vs 302</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The redirect status code is a product decision, not a technical one. 301 Moved
        Permanently tells browsers to cache the redirect permanently; future clicks skip
        your server entirely. 302 Found tells browsers the redirect is temporary; every
        click hits your server. Most URL shorteners use 302 because it enables click analytics
        and allows updating where a short code points after creation.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          Redirect handler with cache-aside
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`@router.get("/{short_code}")
async def redirect_url(short_code: str, request: Request, response: Response):
    # 1. Check Redis first (cache hit: ~1ms)
    long_url = await redis.get(f"url:{short_code}")

    if long_url is None:
        # 2. Cache miss: query the database
        row = await db.fetchrow(
            "SELECT long_url, expires_at FROM urls WHERE short_code = $1",
            short_code,
        )
        if row is None:
            raise HTTPException(status_code=404)

        if row["expires_at"] and row["expires_at"] < datetime.now(UTC):
            raise HTTPException(status_code=410)  # 410 Gone, not 404

        long_url = row["long_url"]
        ttl = int((row["expires_at"] - datetime.now(UTC)).total_seconds()) \
              if row["expires_at"] else 86400
        await redis.setex(f"url:{short_code}", ttl, long_url)

    # 3. Fire-and-forget analytics event (never blocks the redirect)
    asyncio.create_task(emit_click_event(short_code, request))

    # 302: temporary redirect, browsers do not cache
    return RedirectResponse(url=long_url, status_code=302)`}
        </pre>
      </div>
    </section>
  );
}
