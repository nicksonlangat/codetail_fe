import { CodeBlock } from "@/components/blog/interactive/code-block";

export function IDORSection() {
  return (
    <section>
      <h2 id="idor" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Insecure direct object references: the URL was the exploit
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Broken access control is the OWASP category with the most real-world reports by a wide
        margin, and it earns that spot honestly. It&apos;s rarely a clever exploit. It&apos;s
        usually a missing{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">if</code>{" "}
        statement. The most common shape of it is the insecure direct object reference, IDOR for
        short, and the entire attack is often just editing a number in the address bar.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          An invoice lookup
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`@app.route("/invoices/<int:invoice_id>")
@login_required
def get_invoice(invoice_id):
    invoice = db.query(Invoice).filter_by(id=invoice_id).first()
    return jsonify(invoice.to_dict())`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">@login_required</code>{" "}
        proves you&apos;re logged in. It says nothing about whether{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">invoice_id</code>{" "}
        belongs to you. Your own invoice loads at{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">/invoices/1001</code>.
        Change the last digit and you&apos;re looking at somebody else&apos;s, still fully
        authenticated, still yourself, just reading a record that was never supposed to be yours
        to read.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Sequential integer IDs make this worse because they&apos;re enumerable: 1001, 1002, 1003,
        every one of them a request away. Switching to UUIDs raises the cost of guessing an ID,
        which is worth doing, but it doesn&apos;t fix the actual bug. If an ID ever leaks, in a
        shared link, a support ticket, a browser history, the missing check is still missing.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: scope the query to the authenticated user
        </p>
        <CodeBlock
          variant="fixed"
          code={`@app.route("/invoices/<int:invoice_id>")
@login_required
def get_invoice(invoice_id):
    invoice = db.query(Invoice).filter_by(
        id=invoice_id, user_id=current_user.id
    ).first()
    if invoice is None:
        abort(404)
    return jsonify(invoice.to_dict())`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The query itself now enforces ownership. There&apos;s no separate permission check to
        remember to add, and no way to accidentally return someone else&apos;s row, because the
        database was never asked for one.
      </p>
    </section>
  );
}
