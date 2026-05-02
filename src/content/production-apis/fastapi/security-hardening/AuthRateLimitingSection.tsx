import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const SLOWAPI_SETUP = `from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)`;

const RATE_LIMIT_BEFORE = `@app.post("/auth/login")
async def login(
    request: Request,
    form: LoginForm,
    db: AsyncSession = Depends(get_db),
):
    ...`;

const RATE_LIMIT_AFTER = `@app.post("/auth/login")
@limiter.limit("5/minute")
async def login(
    request: Request,
    form: LoginForm,
    db: AsyncSession = Depends(get_db),
):
    ...


@app.post("/auth/register")
@limiter.limit("3/minute")
async def register(
    request: Request,
    form: RegisterForm,
    db: AsyncSession = Depends(get_db),
):
    ...


@app.post("/auth/forgot-password")
@limiter.limit("3/minute")
async def forgot_password(
    request: Request,
    form: ForgotPasswordForm,
    db: AsyncSession = Depends(get_db),
):
    ...`;

const RATE_LIMIT_DIFF: DiffLine[] = [
  { type: "context", content: "@app.post(\"/auth/login\")" },
  { type: "added",   content: "@limiter.limit(\"5/minute\")" },
  { type: "context", content: "async def login(" },
  { type: "context", content: "    request: Request," },
  { type: "context", content: "    form: LoginForm," },
  { type: "context", content: "    db: AsyncSession = Depends(get_db)," },
  { type: "context", content: "):" },
  { type: "context", content: "    ..." },
];

const RESPONSE_429 = `HTTP/1.1 429 Too Many Requests
Retry-After: 60
Content-Type: application/json

{
  "error": "Rate limit exceeded: 5 per 1 minute"
}`;

const GENERAL_LIMIT = `# Apply a looser limit to all other routes
@app.middleware("http")
async def general_rate_limit(request: Request, call_next):
    # slowapi handles /auth/* with strict limits via decorators.
    # A general limit (e.g. 100/minute per IP) prevents abuse
    # of data endpoints but is applied separately.
    return await call_next(request)

# Or use @limiter.limit("100/minute") on individual data endpoints.
# The key insight: auth endpoints warrant 10-20x stricter limits
# than data endpoints because failed auth attempts cost bcrypt time
# and represent attempted account takeover.`;

export function AuthRateLimitingSection() {
  return (
    <section id="auth-rate-limiting">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Auth Rate Limiting</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Rate limiting on data endpoints prevents abuse. Rate limiting on auth endpoints is
        a security requirement. Without it, a credential stuffing tool can try 10,000
        passwords against a known email in under a minute. The bcrypt delay that protects
        against offline cracking does nothing against online brute force at scale.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">slowapi</code>{" "}
        wraps the same rate-limiting primitives used by Nginx and Starlette, backed by Redis
        or in-memory storage. A decorator per endpoint is all it takes.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          requirements.txt -- addition
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3">
{`slowapi==0.1.9  # rate limiting middleware for FastAPI/Starlette`}
        </pre>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          main.py -- limiter setup
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {SLOWAPI_SETUP}
        </pre>
      </div>

      <CodeDiff filename="main.py" before={RATE_LIMIT_BEFORE} after={RATE_LIMIT_AFTER} diff={RATE_LIMIT_DIFF} />

      <div className="bg-card border border-border rounded-xl p-4 mt-6 mb-4 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          rate limit exceeded response (429)
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {RESPONSE_429}
        </pre>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          general vs auth limits
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {GENERAL_LIMIT}
        </pre>
      </div>

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">Per-IP vs per-user limits</p>
        <p className="text-muted-foreground">
          Auth endpoints limit by IP because unauthenticated requests have no user identity.
          Data endpoints can limit by authenticated user ID, which is more precise and avoids
          penalizing users who share an IP (corporate NAT, university networks). Article 10
          covers per-user rate limiting with a token bucket backed by Redis.
        </p>
      </div>
    </section>
  );
}
