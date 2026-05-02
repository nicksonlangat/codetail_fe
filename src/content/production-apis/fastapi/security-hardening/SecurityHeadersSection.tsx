import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const HEADERS_CODE = `from fastapi import Request


async def security_headers_middleware(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Strict-Transport-Security"] = (
        "max-age=31536000; includeSubDomains"
    )
    response.headers["Content-Security-Policy"] = (
        "default-src 'none'; frame-ancestors 'none'"
    )
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=()"
    return response`;

const MAIN_DIFF: DiffLine[] = [
  { type: "context", content: "from middleware import logging_middleware" },
  { type: "added",   content: "from security import security_headers_middleware" },
  { type: "context", content: "" },
  { type: "context", content: "app = FastAPI(title=\"Tasks API\")" },
  { type: "context", content: "app.middleware(\"http\")(logging_middleware)" },
  { type: "added",   content: "app.middleware(\"http\")(security_headers_middleware)" },
];

const HEADERS_TABLE = [
  {
    header: "X-Content-Type-Options: nosniff",
    protects: "MIME sniffing",
    detail: "Prevents the browser from interpreting a response as a different content type than declared. Stops attacks that serve JavaScript disguised as an image.",
  },
  {
    header: "X-Frame-Options: DENY",
    protects: "Clickjacking",
    detail: "Prevents the page from being embedded in an iframe. An attacker cannot overlay your UI with invisible elements to trick users into clicking things.",
  },
  {
    header: "Strict-Transport-Security",
    protects: "Protocol downgrade",
    detail: "Instructs browsers to only connect over HTTPS for the next year. Prevents stripping HTTPS to HTTP on the wire. Only effective once served over HTTPS.",
  },
  {
    header: "Content-Security-Policy",
    protects: "XSS, framing",
    detail: "For an API that returns JSON, a restrictive CSP (default-src 'none') limits the damage if a response is accidentally rendered as HTML.",
  },
];

export function SecurityHeadersSection() {
  return (
    <section id="security-headers">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Security Headers</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Security headers are instructions from the server to the browser. They do not protect
        against server-side attacks. They protect against client-side attacks that use your
        API's responses as raw material: clickjacking, MIME sniffing, protocol downgrade.
        Adding them is two lines of middleware.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          security.py (new file)
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {HEADERS_CODE}
        </pre>
      </div>

      <CodeDiff filename="main.py" before="" after="" diff={MAIN_DIFF} />

      <div className="mt-6 space-y-3">
        {HEADERS_TABLE.map(({ header, protects, detail }) => (
          <div key={header} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
              <code className="text-[10px] font-mono font-semibold">{header}</code>
              <span className="text-[9px] text-muted-foreground font-mono hidden sm:block">
                protects against: {protects}
              </span>
            </div>
            <div className="px-4 py-3">
              <p className="text-[11px] text-muted-foreground leading-relaxed">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">These headers apply to the API, not a web frontend</p>
        <p className="text-muted-foreground">
          A JSON API that never renders HTML still benefits from{" "}
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">X-Content-Type-Options</code>{" "}
          and{" "}
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">X-Frame-Options</code>.
          If your API is consumed by a web client, ensure the frontend also sets its own CSP.
          The API's CSP only governs responses from the API's domain.
        </p>
      </div>
    </section>
  );
}
