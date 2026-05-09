export function CursorSection() {
  return (
    <section>
      <h2 id="cursor" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Cursor-Based Pagination
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Cursor-based pagination (also called keyset pagination) replaces the OFFSET with
        a WHERE clause based on the last row seen. Instead of skipping rows, the database
        seeks directly to the right position using an index.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The cost is O(1) regardless of how deep the pagination goes. Page 5000 reads
        exactly 20 rows, the same as page 1. And because the cursor points to a specific
        row rather than a position, inserts and deletes do not shift results.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">The keyset WHERE clause</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Offset (slow): skip N rows
SELECT * FROM posts
 ORDER BY created_at DESC
 LIMIT 20 OFFSET 9980;

-- Cursor (fast): start after the last row seen
SELECT * FROM posts
 WHERE (created_at, id) < ($last_created_at, $last_id)
 ORDER BY created_at DESC, id DESC
 LIMIT 20;

-- The WHERE clause jumps directly to the right position via index.
-- No rows are scanned and discarded.`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Why a composite key is required</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Cursor pagination requires a stable, unique sort key. If the sort column is not
        unique (e.g. created_at, where multiple rows can share the same timestamp), rows
        with the same value may be skipped or returned twice.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 mb-8">
        {[
          {
            label: "Sort by id (unique)",
            sql: "WHERE id < $last_id ORDER BY id DESC",
            verdict: "Correct",
            note: "IDs are unique. No ties. No skipped or duplicated rows.",
            good: true,
          },
          {
            label: "Sort by created_at (non-unique)",
            sql: "WHERE created_at < $last_created_at ORDER BY created_at DESC",
            verdict: "Broken",
            note: "Multiple rows can share the same timestamp. Rows at the boundary may be skipped.",
            good: false,
          },
          {
            label: "Sort by created_at + id (composite)",
            sql: "WHERE (created_at, id) < ($last_ts, $last_id) ORDER BY created_at DESC, id DESC",
            verdict: "Correct",
            note: "The composite key is unique. No row shares the same (created_at, id) pair.",
            good: true,
          },
          {
            label: "Sort by non-indexed column",
            sql: "WHERE score < $last_score ORDER BY score DESC",
            verdict: "Slow",
            note: "The WHERE clause is correct, but without an index on score, it degrades to a full table scan.",
            good: false,
          },
        ].map(({ label, sql, verdict, note, good }) => (
          <div key={label} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex items-center justify-between">
              <p className="text-[11px] font-semibold">{label}</p>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${good ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                {verdict}
              </span>
            </div>
            <div className="px-4 py-3 space-y-1.5">
              <div className="font-mono text-[9px] bg-muted rounded px-2 py-1 text-muted-foreground overflow-x-auto">
                {sql}
              </div>
              <p className="text-[11px] text-muted-foreground">{note}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The cursor value</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The cursor is the sort key values of the last row on the current page. For a
        composite key (created_at, id), the cursor encodes both values. It is sent to
        the client as an opaque token and sent back in the next request to fetch the
        next page.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`import base64, json

def encode_cursor(created_at: str, id: str) -> str:
    payload = json.dumps({"created_at": created_at, "id": id})
    return base64.urlsafe_b64encode(payload.encode()).decode()

def decode_cursor(cursor: str) -> dict:
    payload = base64.urlsafe_b64decode(cursor.encode()).decode()
    return json.loads(payload)

# API response includes:
# { "items": [...], "next_cursor": "eyJjcmVhdGVkX2F0IjogIjIwMjQt..." }

# Next request: GET /posts?after=eyJjcmVhdGVkX2F0IjogIjIwMjQt...`}
        </pre>
      </div>
    </section>
  );
}
