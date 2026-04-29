import { JWTInspector } from "@/components/blog/interactive/jwt-inspector";

const COMPARISON_ROWS = [
  { property: "Server state required", session: "Yes — session store (Redis, DB)", jwt: "No — self-contained" },
  { property: "Revocation", session: "Instant — delete session from store", jwt: "Cannot revoke before exp without a blocklist" },
  { property: "Horizontal scaling", session: "Needs sticky sessions or shared store", jwt: "Trivial — any instance validates the signature" },
  { property: "Payload visibility", session: "Hidden — session ID is opaque", jwt: "Visible — Base64-decoded by anyone with the token" },
  { property: "Size on every request", session: "~32 bytes (session ID cookie)", jwt: "~300-800 bytes (varies with claims)" },
  { property: "Cross-domain auth", session: "Difficult — cookies are same-origin", jwt: "Simple — Authorization header works everywhere" },
  { property: "Microservices", session: "Hard — every service needs session store access", jwt: "Easy — every service verifies independently" },
  { property: "Expiry model", session: "Sliding (activity extends expiry)", jwt: "Fixed (exp claim set at issue time)" },
];

export function SessionsAndTokensSection() {
  return (
    <section>
      <h2 id="sessions-tokens" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Sessions vs Tokens
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Once a user authenticates, the server needs a way to recognize them on subsequent
        requests. HTTP is stateless: every request is independent. Two mechanisms exist for
        maintaining authenticated state across requests — server-side sessions and
        client-side tokens.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Server-side sessions</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        On login, the server generates a random session ID and stores session data (user ID,
        role, expiry) in a server-side store (Redis, database). The session ID is sent to
        the client as an HttpOnly, Secure cookie. On every subsequent request, the browser
        sends the cookie automatically. The server looks up the session ID in the store to
        get the user's identity.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The session ID is opaque — it reveals nothing about the user. Revocation is instant:
        delete the session from the store and the user is logged out on the next request.
        The cost is the session store itself: every authentication check requires a network
        round trip to Redis, and horizontal scaling requires either sticky sessions (route
        each user to the same server) or a shared session store.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">Session flow</p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`1. POST /auth/login { email, password }
   → Server verifies credentials
   → Server stores: sessions["abc123"] = { user_id: 42, role: "admin", exp: ... }
   → Response: Set-Cookie: session_id=abc123; HttpOnly; Secure; SameSite=Lax

2. GET /api/dashboard
   Cookie: session_id=abc123
   → Server: redis.get("sessions:abc123") → { user_id: 42, role: "admin" }
   → Request proceeds as user 42

3. POST /auth/logout
   → Server: redis.del("sessions:abc123")
   → Cookie cleared
   → User instantly logged out — next request finds no session`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">JWTs (JSON Web Tokens)</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A JWT encodes identity and claims directly in a signed token that the client holds.
        The server verifies the signature on every request without consulting a store — the
        token is self-contained. This eliminates the session store and scales trivially across
        instances. Any server with the public key can verify any token.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The tradeoff is revocation. Because the server holds no state, a JWT is valid until
        its expiry (exp claim). If a user is compromised or logs out, the token remains valid
        until it expires. Solutions: short expiry (15 minutes) with refresh tokens, or a
        token blocklist (which reintroduces server state). Neither is as clean as session
        deletion.
      </p>

      <JWTInspector />

      <h3 className="text-base font-semibold mt-2 mb-3">Access tokens and refresh tokens</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">Refresh token flow</p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`1. Login → server issues:
   access_token:  short-lived JWT (15 min), sent in Authorization header
   refresh_token: long-lived opaque token (7 days), stored in HttpOnly cookie

2. API call:
   Authorization: Bearer <access_token>
   → Server validates JWT signature — no DB lookup needed

3. access_token expires:
   POST /auth/refresh
   Cookie: refresh_token=<opaque_value>
   → Server looks up refresh token in store (checks not revoked)
   → Issues new access_token (15 min)

4. Logout:
   → Server deletes refresh_token from store
   → access_token expires naturally in ≤15 min
   → User cannot refresh → effectively logged out`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Sessions vs JWTs: when to use each</h3>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Property</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Session</th>
              <th className="text-left py-2 text-muted-foreground font-medium">JWT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {COMPARISON_ROWS.map(({ property, session, jwt }) => (
              <tr key={property}>
                <td className="py-2.5 pr-4 font-medium text-foreground/80 align-top">{property}</td>
                <td className="py-2.5 pr-4 text-muted-foreground align-top">{session}</td>
                <td className="py-2.5 text-muted-foreground align-top">{jwt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-foreground/70">
          For traditional web apps where instant revocation matters (security-sensitive
          applications, banking, admin panels), sessions win. For APIs serving mobile clients
          and microservices where stateless verification is valuable, JWTs with short expiry
          and refresh tokens are the standard. Most production systems use both: JWTs for
          API authentication, sessions for web app login state.
        </p>
      </div>
    </section>
  );
}
