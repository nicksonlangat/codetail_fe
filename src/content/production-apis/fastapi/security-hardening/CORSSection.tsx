import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const CORS_BEFORE = `from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)`;

const CORS_AFTER = `from fastapi.middleware.cors import CORSMiddleware
import os

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)`;

const CORS_DIFF: DiffLine[] = [
  { type: "context", content: "from fastapi.middleware.cors import CORSMiddleware" },
  { type: "added",   content: "import os" },
  { type: "context", content: "" },
  { type: "added",   content: "ALLOWED_ORIGINS = os.getenv(\"ALLOWED_ORIGINS\", \"\").split(\",\")" },
  { type: "context", content: "" },
  { type: "context", content: "app.add_middleware(" },
  { type: "context", content: "    CORSMiddleware," },
  { type: "removed", content: "    allow_origins=[\"*\"]," },
  { type: "added",   content: "    allow_origins=ALLOWED_ORIGINS," },
  { type: "context", content: "    allow_credentials=True," },
  { type: "removed", content: "    allow_methods=[\"*\"]," },
  { type: "removed", content: "    allow_headers=[\"*\"]," },
  { type: "added",   content: "    allow_methods=[\"GET\", \"POST\", \"PUT\", \"PATCH\", \"DELETE\"]," },
  { type: "added",   content: "    allow_headers=[\"Authorization\", \"Content-Type\", \"X-Request-ID\"]," },
  { type: "context", content: ")" },
];

const ENV_EXAMPLE = `# .env.production
ALLOWED_ORIGINS=https://app.yourdomain.com,https://admin.yourdomain.com

# .env.development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001`;

export function CORSSection() {
  return (
    <section id="cors">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">CORS Policy</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">allow_origins=["*"]</code>{" "}
        is the correct default for development and the wrong choice for production. It allows
        any origin to make cross-origin requests, including requests that carry the user's
        cookies or stored credentials. A malicious site can embed JavaScript that calls your
        API as the authenticated user with no user interaction.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The fix is an explicit allowlist. Load it from an environment variable so development,
        staging, and production each use the correct list without code changes. Explicit
        method and header allowlists prevent unexpected behavior if the default browser
        preflight logic changes.
      </p>

      <CodeDiff filename="main.py" before={CORS_BEFORE} after={CORS_AFTER} diff={CORS_DIFF} />

      <div className="bg-card border border-border rounded-xl p-4 mt-6 mb-4 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          environment configuration
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {ENV_EXAMPLE}
        </pre>
      </div>

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">Why allow_credentials=True matters</p>
        <p className="text-muted-foreground">
          When{" "}
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">allow_credentials=True</code>{" "}
          is set, browsers will include cookies and authorization headers in cross-origin
          requests to allowed origins. This is necessary for cookie-based auth flows. The
          browser spec explicitly prohibits combining{" "}
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">allow_credentials=True</code>{" "}
          with a wildcard origin — FastAPI will raise a warning if you try.
        </p>
      </div>
    </section>
  );
}
