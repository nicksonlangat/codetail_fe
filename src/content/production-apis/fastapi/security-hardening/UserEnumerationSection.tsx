import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const LOGIN_BEFORE = `@app.post("/auth/login")
async def login(
    form: LoginForm,
    db: AsyncSession = Depends(get_db),
):
    user = await get_user_by_email(db, form.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(form.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}`;

const LOGIN_AFTER = `DUMMY_HASH = bcrypt.hashpw(b"dummy", bcrypt.gensalt()).decode()


@app.post("/auth/login")
async def login(
    form: LoginForm,
    db: AsyncSession = Depends(get_db),
):
    user = await get_user_by_email(db, form.email)

    # Always run bcrypt regardless of whether the user exists.
    # This prevents timing-based user enumeration.
    candidate_hash = user.password_hash if user else DUMMY_HASH
    password_valid = verify_password(form.password, candidate_hash)

    if not user or not password_valid:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}`;

const LOGIN_DIFF: DiffLine[] = [
  { type: "added",   content: "DUMMY_HASH = bcrypt.hashpw(b\"dummy\", bcrypt.gensalt()).decode()" },
  { type: "context", content: "" },
  { type: "context", content: "" },
  { type: "context", content: "@app.post(\"/auth/login\")" },
  { type: "context", content: "async def login(" },
  { type: "context", content: "    form: LoginForm," },
  { type: "context", content: "    db: AsyncSession = Depends(get_db)," },
  { type: "context", content: "):" },
  { type: "context", content: "    user = await get_user_by_email(db, form.email)" },
  { type: "removed", content: "    if not user:" },
  { type: "removed", content: "        raise HTTPException(status_code=401, detail=\"Invalid credentials\")" },
  { type: "context", content: "" },
  { type: "removed", content: "    if not verify_password(form.password, user.password_hash):" },
  { type: "removed", content: "        raise HTTPException(status_code=401, detail=\"Invalid credentials\")" },
  { type: "added",   content: "    candidate_hash = user.password_hash if user else DUMMY_HASH" },
  { type: "added",   content: "    password_valid = verify_password(form.password, candidate_hash)" },
  { type: "context", content: "" },
  { type: "added",   content: "    if not user or not password_valid:" },
  { type: "added",   content: "        raise HTTPException(status_code=401, detail=\"Invalid credentials\")" },
  { type: "context", content: "" },
  { type: "context", content: "    token = create_access_token({\"sub\": str(user.id)})" },
  { type: "context", content: "    return {\"access_token\": token, \"token_type\": \"bearer\"}" },
];

const REGISTER_PATTERN = `# Password reset follows the same rule: identical response
# whether the email is registered or not.
@app.post("/auth/forgot-password")
async def forgot_password(
    form: ForgotPasswordForm,
    db: AsyncSession = Depends(get_db),
):
    user = await get_user_by_email(db, form.email)
    if user:
        await send_reset_email(user.email, create_reset_token(user.id))

    # Always return 200. Callers cannot infer whether the email exists.
    return {"message": "If that email is registered, a reset link is on its way."}`;

export function UserEnumerationSection() {
  return (
    <section id="user-enumeration">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">User Enumeration</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The original login handler returns immediately when the email is not found. It only
        runs bcrypt when the email exists. bcrypt is designed to be slow — about 80ms. An
        attacker who times two requests sees the difference: 2ms means the email is not
        registered, 80ms means it is. The error message is identical. The timing is not.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The fix is to always run bcrypt. When the user is not found, run it against a dummy
        hash. The response time becomes constant regardless of whether the email exists.
      </p>

      <CodeDiff filename="main.py" before={LOGIN_BEFORE} after={LOGIN_AFTER} diff={LOGIN_DIFF} />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        The same principle applies to password reset. If you return an error for an
        unregistered email, you confirm that real emails exist by contrast. Return the same
        success message whether the email is found or not.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          main.py -- password reset (same pattern)
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {REGISTER_PATTERN}
        </pre>
      </div>

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">Why this matters beyond privacy</p>
        <p className="text-muted-foreground">
          A confirmed email list enables targeted phishing and credential stuffing. Attackers
          enumerate first, then attack. Timing-safe responses make enumeration expensive enough
          that attackers move to easier targets. The DUMMY_HASH should be pre-computed at startup,
          not generated per request — generating it per request adds a measurable extra delay
          that itself leaks the "user not found" branch.
        </p>
      </div>
    </section>
  );
}
