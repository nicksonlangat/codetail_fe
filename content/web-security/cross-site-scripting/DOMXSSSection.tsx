import { CodeBlock } from "@/components/blog/interactive/code-block";

export function DOMXSSSection() {
  return (
    <section>
      <h2 id="dom-xss" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        DOM-based XSS: no server involved at all
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Reflected and stored XSS both involve the server rendering something it shouldn&apos;t.
        DOM-based XSS doesn&apos;t need the server to do anything wrong, because the server is
        never even in the loop. The bug lives entirely in client-side JavaScript that reads
        something from the page&apos;s own URL and writes it straight into the DOM.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A client-side welcome message
        </p>
        <CodeBlock
          variant="vulnerable"
          language="JavaScript"
          code={`const params = new URLSearchParams(location.search);
document.getElementById("welcome").innerHTML = "Welcome, " + params.get("name");`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Load this page with{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          {"?name=<img src=x onerror=alert(document.cookie)>"}
        </code>{" "}
        in the URL and the browser never sends that value to any backend at all. It stays in the
        browser, gets read straight out of{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">location.search</code>,
        and lands in{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">innerHTML</code>,
        which parses whatever string it&apos;s given as HTML and executes anything in it that
        looks like a script.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: textContent, not innerHTML
        </p>
        <CodeBlock
          variant="fixed"
          language="JavaScript"
          code={`document.getElementById("welcome").textContent = "Welcome, " + params.get("name");`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">textContent</code>{" "}
        never parses its argument as HTML. The browser displays{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">{"<img src=x onerror=...>"}</code>{" "}
        as visible, literal, slightly ugly text on the page. Nothing runs.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Frameworks put a name on the exit
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        React escapes anything you interpolate directly into JSX. Rendering{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">{"<div>{comment.body}</div>"}</code>{" "}
        is safe by default, the same way a modern template engine&apos;s{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">{"{{ }}"}</code>{" "}
        is safe by default. The only way to get raw, unescaped HTML injection in a React app is to
        explicitly ask for it.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Exactly what the prop name is warning you about
        </p>
        <CodeBlock
          variant="vulnerable"
          language="JSX"
          code={`<div dangerouslySetInnerHTML={{ __html: comment.body }} />`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Vue has the same escape hatch in{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">v-html</code>{" "}
        next to its safe{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">{"{{ }}"}</code>{" "}
        interpolation, and Angular has it in{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">[innerHTML]</code>.
        Every framework built after XSS became a known problem ships a safe default and makes you
        opt out of it by name. If you find one of these in a codebase, the question isn&apos;t
        whether it&apos;s dangerous. It&apos;s whether the value it&apos;s rendering ever passes
        through user input on its way there.
      </p>
    </section>
  );
}
