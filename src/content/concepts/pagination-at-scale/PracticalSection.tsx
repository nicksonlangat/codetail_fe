export function PracticalSection() {
  return (
    <section>
      <h2 id="practical" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        API Design and Edge Cases
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Cursor pagination requires slightly more care in the API design than offset
        pagination. The cursor is opaque to clients, navigation is sequential rather
        than random-access, and a few edge cases need explicit handling.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">API response structure</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`# FastAPI endpoint with cursor pagination
from fastapi import Query

@router.get("/posts")
async def list_posts(
    after: str | None = Query(default=None),
    limit: int = Query(default=20, le=100),
):
    if after:
        cursor = decode_cursor(after)
        posts = await db.fetch(
            """
            SELECT * FROM posts
             WHERE (created_at, id) < ($1, $2)
             ORDER BY created_at DESC, id DESC
             LIMIT $3
            """,
            cursor["created_at"], cursor["id"], limit + 1,
        )
    else:
        posts = await db.fetch(
            "SELECT * FROM posts ORDER BY created_at DESC, id DESC LIMIT $1",
            limit + 1,
        )

    has_next = len(posts) > limit
    items = posts[:limit]

    return {
        "items": items,
        "next_cursor": encode_cursor(items[-1]["created_at"], items[-1]["id"])
                       if has_next else None,
        "has_next": has_next,
    }`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Fetching limit + 1 rows is the standard trick for detecting whether a next page
        exists without a separate COUNT query. If limit + 1 rows are returned, trim the
        last one and set has_next = true. If fewer are returned, this is the last page.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Edge cases</h3>

      <div className="space-y-2 mb-8">
        {[
          {
            case: "Deleted rows in the cursor position",
            handling: "If the row referenced by the cursor is deleted, the WHERE clause still works correctly — it finds the next row with a smaller key. No special handling needed.",
          },
          {
            case: "Empty result on the first request",
            handling: "Return items: [] and next_cursor: null. Do not attempt to encode a cursor for an empty result set.",
          },
          {
            case: "Client sends a stale cursor",
            handling: "Cursor pagination is naturally tolerant of stale cursors. The query returns rows after the cursor position, even if rows near the cursor have been deleted. No error handling required.",
          },
          {
            case: "Jumping to a specific page",
            handling: "Cursor pagination does not support random access. If a UI requires jumping to page 50, use offset for that UI and cursor for infinite scroll or sequential navigation.",
          },
          {
            case: "Bidirectional navigation",
            handling: 'Include a prev_cursor alongside next_cursor. The prev_cursor uses a reversed WHERE clause: WHERE (created_at, id) > ($prev_created_at, $prev_id) ORDER BY created_at ASC, id ASC LIMIT N, then reverse the result.',
          },
        ].map(({ case: c, handling }) => (
          <div key={c} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
              <p className="text-[11px] font-semibold">{c}</p>
            </div>
            <p className="px-4 py-2.5 text-[11px] text-muted-foreground">{handling}</p>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Offset vs cursor: the decision</h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          {
            label: "Use offset when",
            items: [
              "Total dataset is small (under ~10,000 rows)",
              "UI shows page numbers (1, 2, 3 ...)",
              "Users need to jump to a specific page",
              "Data is static or append-only at a slow rate",
            ],
            color: "text-primary",
          },
          {
            label: "Use cursor when",
            items: [
              "Dataset is large or growing continuously",
              "UI is infinite scroll or next/prev navigation",
              "Data has frequent inserts or deletes",
              "Deep pagination performance matters",
            ],
            color: "text-primary",
          },
        ].map(({ label, items, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4">
            <p className={`text-[12px] font-semibold mb-3 ${color}`}>{label}</p>
            <ul className="space-y-1.5">
              {items.map((item) => (
                <li key={item} className="flex gap-2 text-[11px] text-muted-foreground">
                  <span className="text-primary mt-0.5 flex-shrink-0">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
