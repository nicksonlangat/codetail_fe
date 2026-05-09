import { OffsetSection } from "./pagination-at-scale/OffsetSection";
import { CursorSection } from "./pagination-at-scale/CursorSection";
import { PracticalSection } from "./pagination-at-scale/PracticalSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "offset", title: "The Problem with OFFSET" },
  { id: "cursor", title: "Cursor-Based Pagination" },
  { id: "practical", title: "API Design and Edge Cases" },
  { id: "summary", title: "Summary" },
];

export default function PaginationAtScaleArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Offset-based pagination works until it does not. At small dataset sizes and
          shallow page depths, OFFSET 0, OFFSET 20, OFFSET 40 are fast. At production
          scale, OFFSET 9980 means the database scans ten thousand rows to return twenty.
          Response time grows linearly with page depth, and it does so silently — no
          error, just an endpoint that gets slower the further into the data you go.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Cursor-based pagination eliminates both problems. It replaces the OFFSET with
          a WHERE clause that uses an index to seek directly to the right position.
          Page 5000 is as fast as page 1. And because the cursor points to a specific
          row rather than a position, inserts and deletes do not cause results to skip
          or repeat across pages.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article explains why OFFSET pagination degrades at scale, how keyset
          pagination works, and the practical API design decisions that come with it.
        </p>
      </section>

      <OffsetSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <CursorSection />
      <PracticalSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🐢",
              label: "OFFSET scans and discards rows",
              desc: "OFFSET 9980 reads 10,000 rows to return 20. There is no shortcut — the database must count through all preceding rows. Query time grows linearly with page depth.",
            },
            {
              icon: "📄",
              label: "Live data causes offset results to shift",
              desc: "New rows push existing rows to different offsets. A user paginating through live data will see duplicate items on consecutive pages or skip items that moved to the previous page.",
            },
            {
              icon: "⚡",
              label: "Cursor pagination is O(1) at any depth",
              desc: "WHERE (created_at, id) < ($last_ts, $last_id) seeks directly to the right position via an index. Page 5000 reads exactly 20 rows. No rows are scanned and discarded.",
            },
            {
              icon: "🔑",
              label: "The sort key must be unique",
              desc: "Cursor pagination requires that the ORDER BY columns uniquely identify each row. Use a composite key (non-unique column + unique ID) to prevent skipped or duplicated rows at boundaries.",
            },
            {
              icon: "🎯",
              label: "Encode the cursor as an opaque token",
              desc: "Base64-encode the sort key values of the last row. Return it as next_cursor. The client sends it back in the next request. Clients should not construct or inspect cursors.",
            },
            {
              icon: "📊",
              label: "Offset is still fine for shallow, static data",
              desc: "Admin panels, small datasets, and UIs where users never go past page 5 do not need cursor pagination. The complexity is only worth it when depth or live data are real concerns.",
            },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="flex gap-3 p-4 bg-card border border-border rounded-xl">
              <span className="text-lg flex-shrink-0">{icon}</span>
              <div>
                <p className="text-[13px] font-semibold mb-0.5">{label}</p>
                <p className="text-[12px] text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
