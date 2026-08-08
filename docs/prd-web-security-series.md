# PRD: Web Security — From Exploit to Fix

**Status:** Shipped, all 12 articles live
**Author:** Codetail
**Created:** 2026-07-28
**Updated:** 2026-07-29
**Shipped:** 2026-07-29

---

## 1. Vision

A fifth long-form series for the Codetail Library: the major web application vulnerability classes, how each is actually exploited, and how to close it. Every article follows the same shape: show the attack working against real, runnable code, explain the root cause, then show the fix. Ends in a consolidated **OWASP Top 10 checklist** article a reader can use to audit their own app.

Not a copy of the OWASP Top 10 page. Every vulnerability gets a real payload, a broken code sample, and a fixed one, same "show it breaking, then show the fix" instinct as the Production APIs series in `frontend/docs/prd-production-apis-series.md`, but organized by vulnerability class instead of by constraint.

**Article count is not fixed at 15.** Scope is driven by which vulnerability classes are actually major (OWASP Top 10 2021 plus a handful of extremely common attacks that Top 10 folds into broader categories but that deserve their own article because they're so frequently asked about: XSS, CSRF, IDOR).

---

## 2. Relationship to existing series

Distinct from System Design (scale/availability) and the proposed AI Engineering series (building on LLMs). This one is entirely about the attack surface of a normal web app: auth, input handling, config, dependencies, the stuff every engineer ships and most never gets formally taught.

---

## 3. Target audience

- Engineers who've never had a security review catch something in their own code
- Engineers prepping for security-focused interview rounds
- Anyone who wants "I know the OWASP Top 10 cold" to actually be true, not just something on a resume

---

## 4. Naming & infrastructure

- **Title:** Web Security
- **Subtitle:** From Exploit to Fix
- **Route:** `/blog/web-security/[slug]`
- **Registry:** `content/web-security/registry.ts`, same `ArticleMeta[]` shape as the other three series
- **Content folders:** `content/web-security/<slug>/index.tsx` + `*Section.tsx`
- **Landing page + article page + loader:** identical pattern to the other three series, no new infra
- **Hub card:** fifth entry in the `SERIES` array in `app/(dashboard)/blog/page.tsx` once content exists

---

## 5. Article list (12, shipped as proposed)

Every article below shipped with the exact slug, order, tag set, and estimated read time proposed here, no drift during writing. Live at `/blog/web-security/<slug>`.

Each article: the attack (real payload against a vulnerable sample), root cause, the fix (before/after code), and where it maps in OWASP Top 10 2021.

1. ✅ **Injection: SQL, NoSQL, and Command** — *The oldest attack in the book still tops the charts.*
   String-concatenated queries, ORM footguns that reintroduce it anyway, parameterized queries and allowlisting as the actual fix.
   OWASP: **A03 Injection** · `~22m` · `sql-injection, nosql-injection, command-injection, parameterized-queries` · 💉 · `/blog/web-security/injection`

2. ✅ **Cross-Site Scripting (XSS)** — *The payload runs in someone else's browser, as them.*
   Stored, reflected, and DOM-based XSS. Output encoding, CSP, why `dangerouslySetInnerHTML`/`v-html` is a loaded gun.
   OWASP: **A03 Injection** (historically its own category) · `~22m` · `xss, csp, output-encoding, dom-xss` · 🕸️ · `/blog/web-security/cross-site-scripting`

3. ✅ **Broken Access Control & IDOR** — *The #1 vulnerability class by prevalence, and the simplest to introduce.*
   Insecure direct object references, missing per-request authorization checks, why "the URL was guessable" is a real bug report.
   OWASP: **A01 Broken Access Control** · `~24m` · `idor, access-control, authorization, object-level-permissions` · 🔓 · `/blog/web-security/broken-access-control`

4. ✅ **Cross-Site Request Forgery (CSRF)** — *The browser sends the cookie, the attacker sends the request.*
   How a logged-in session gets weaponized from another tab, CSRF tokens, `SameSite` cookies, why state-changing GETs are the real bug.
   OWASP: folded into **A01 Broken Access Control** · `~18m` · `csrf, samesite, cookies, state-changing-requests` · 🍪 · `/blog/web-security/csrf`

5. ✅ **Authentication & Session Management Failures** — *Login is the highest-value target in the app.*
   Credential stuffing, session fixation, weak password reset flows, token expiry and rotation done wrong.
   OWASP: **A07 Identification and Authentication Failures** · `~24m` · `authentication, sessions, credential-stuffing, password-reset` · 🔑 · `/blog/web-security/authentication-and-session-management`

6. ✅ **Cryptographic Failures** — *Data was "encrypted." It just wasn't encrypted well.*
   Plaintext secrets at rest, weak hashing for passwords (MD5/SHA1 vs. bcrypt/argon2), TLS misconfiguration, key management basics.
   OWASP: **A02 Cryptographic Failures** · `~20m` · `encryption, hashing, tls, key-management` · 🔐 · `/blog/web-security/cryptographic-failures`

7. ✅ **Security Misconfiguration** — *Nothing was exploited, the defaults just did the attacker's job for them.*
   Verbose error pages leaking stack traces, default credentials, open S3 buckets/CORS wildcards, unnecessary exposed endpoints.
   OWASP: **A05 Security Misconfiguration** · `~20m` · `misconfiguration, cors, default-credentials, error-handling` · ⚙️ · `/blog/web-security/security-misconfiguration`

8. ✅ **Server-Side Request Forgery (SSRF)** — *You asked the server to fetch a URL. It fetched your internal metadata endpoint.*
   Why "fetch this URL for the user" is dangerous, cloud metadata endpoint attacks, allowlisting outbound requests.
   OWASP: **A10 Server-Side Request Forgery** · `~18m` · `ssrf, cloud-metadata, outbound-requests` · 🌐 · `/blog/web-security/ssrf`

9. ✅ **Insecure Deserialization & Software Supply Chain** — *Trusting a byte stream, or trusting a package registry, is the same mistake.*
   Insecure deserialization RCEs, unsigned/unverified dependency updates, why `npm install` is an attack surface.
   OWASP: **A08 Software and Data Integrity Failures** · `~20m` · `deserialization, supply-chain, dependency-integrity` · 📦 · `/blog/web-security/insecure-deserialization-and-supply-chain`

10. ✅ **Vulnerable and Outdated Components** — *The vulnerability isn't in your code, it's in your `package.json`.*
    Dependency scanning, SBOMs, patch cadence, why "it's a transitive dependency" isn't a defense.
    OWASP: **A06 Vulnerable and Outdated Components** · `~16m` · `dependencies, sbom, patching, cve` · 🧱 · `/blog/web-security/vulnerable-and-outdated-components`

11. ✅ **Security Logging and Monitoring Failures** — *The breach happened three months before anyone noticed.*
    What to log (and what never to log), alerting on the right signals, why "we had logs" isn't the same as detection.
    OWASP: **A09 Security Logging and Monitoring Failures** · `~18m` · `logging, monitoring, incident-response, alerting` · 🔍 · `/blog/web-security/security-logging-and-monitoring`

12. ✅ **The OWASP Top 10 Checklist** (capstone) — *Every article, collapsed into one audit you can run against your own app.*
    A consolidated, per-category checklist mapped 1:1 to OWASP Top 10 2021, with a link back to the article that covers each item in depth. Shipped as 4 Section files grouping 2-3 OWASP categories each (not 10 separate files), with all 47 cross-links to other articles verified programmatically against real anchor IDs.
    `~20m` · `owasp, checklist, security-audit, capstone` · ✅ · `/blog/web-security/owasp-top-10-checklist`

**Ordering logic:** the vulnerability classes attackers actually hit first and most often (injection, XSS, access control, CSRF) come before the ones that require more context to appreciate (supply chain, logging/monitoring), ending in the checklist that ties every category together.

**Note on scope:** article 4 (CSRF) technically lives inside OWASP's A01 category now, and article 2 (XSS) inside A03. They're broken out anyway because they're the two attacks every engineer has heard of by name and searches for by name. Everything else maps directly to one OWASP Top 10 2021 category, so the series covers all ten categories in twelve articles.

---

## 6. The OWASP checklist (capstone article, shipped)

Shipped matching the planned structure:

- One `<h2>` per OWASP Top 10 2021 category (all ten covered, plus a closing "how to use this" section), a short recap paragraph, then a checklist of concrete, verifiable items (e.g. "password reset tokens are cryptographically random, single-use, and expire in under 30 minutes," not "use strong passwords")
- Every checklist item links to the specific article and anchor that explains it, all 47 links verified against real `id`s with a small script, not eyeballed
- Not a separate printable/downloadable asset, it's a regular article in the series like the other eleven (see section 8, decision 3)

---

## 7. Voice

Same rules as every other `content/*` series (`webapp/CLAUDE.md`, "Blog Article Voice"). Extra rule specific to this series: every vulnerability needs a **working, runnable payload** against a **working, runnable fix**, not a hypothetical description of an attack. This is a hands-on series, same instinct as `frontend/docs/prd-production-apis-series.md`'s before/after code diffs.

---

## 8. Decisions (resolved during build)

1. **No sandboxed "try the payload" demo.** Static before/after code blocks carried it, same as the other three series. The one piece of new infrastructure: `components/blog/interactive/code-block.tsx` gained two optional, non-breaking props, `language` (was hardcoded to display "Python") and `variant` (`"vulnerable" | "fixed"`, tints the card border and adds a labeled pill). Every existing call site in the other three series still renders identically.
2. **Kept all twelve, CSRF stayed standalone.** `SameSite=Lax` being a browser default made it worth calling out explicitly rather than a reason to cut the article: the CSRF piece's third section is specifically about the gap `Lax` doesn't close (a state-changing action wired up behind a GET route defeats it entirely).
3. **No standalone downloadable/printable asset.** The checklist shipped as a normal article. Revisit only if analytics show it's the single most-visited page in the series and a dedicated format would clearly do better.
4. **Used OWASP Top 10 2021** as planned; still the current list at time of writing.

---

## 9. Post-launch notes

- **Voice audit, applied and then re-verified.** After article 1 (Injection) was drafted, a close read caught AI-generated tells: the same "quote a strawman claim, then dismiss it" opener reused in most sections of one article, "X isn't Y, it's Z" overused, and mic-drop one-liners closing nearly every paragraph. Article 1 was rewritten and the same discipline was applied proactively while writing articles 2 through 12. A second full pass across articles 5-12 afterward still caught three more instances worth fixing, notably a literal cross-article callback ("that was the last one," referencing the previous article by name) in Vulnerable and Outdated Components, and two recurrences of the same quoted-strawman opener template spread further apart in the series. **Takeaway for the next AI-authored series:** budget for this as a real second pass, not just proactive discipline while writing, some repetition across articles only becomes visible once several are read back to back.
- **Link integrity is checkable, not just reviewable.** The 47 cross-links in the checklist article were verified with a short script cross-referencing every `href`'s slug and anchor against the real `id`s in each target article's `index.tsx`, rather than trusting that they were typed correctly.
- **All three verification gates** (`tsc --noEmit`, `eslint`, a grep for em/en dashes and the banned-phrase list from `webapp/CLAUDE.md`) ran after every single article, not just at the end. Caught two real lint errors (unescaped apostrophes in JSX headings) and one plain typo (`text-15px` instead of `text-[15px]`) before they shipped.
- **`/blog` hub page** already existed from earlier work in this series of sessions; Web Security was added as its fourth live card with zero changes to the hub's own layout or search logic, confirming that page was actually built to take an arbitrary series list.

---

## 10. Dependencies / sequencing

Shipped independently. Reused the same infrastructure the AI Engineering series proposal (`prd-ai-engineering-series.md`) assumed it would need, that series is still unstarted as of this writing.
