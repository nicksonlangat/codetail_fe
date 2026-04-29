const OAUTH_FLOWS = [
  {
    flow: "Authorization Code + PKCE",
    actors: "User, Browser, Auth Server, Resource Server",
    use: "Web apps and mobile apps acting on behalf of a user",
    steps: [
      "App redirects user to auth server with client_id, scope, redirect_uri, code_challenge (PKCE)",
      "User authenticates and consents on auth server",
      "Auth server redirects to redirect_uri with authorization code",
      "App exchanges code + code_verifier for access_token and refresh_token",
      "App uses access_token in Authorization header for API calls",
    ],
    why: "Code is short-lived (seconds) and useless without code_verifier. PKCE prevents interception attacks on mobile apps where client_secret cannot be kept secret.",
  },
  {
    flow: "Client Credentials",
    actors: "Service A, Auth Server, Service B",
    use: "Machine-to-machine: background jobs, microservices, cron tasks",
    steps: [
      "Service authenticates directly to auth server with client_id + client_secret",
      "Auth server returns access_token (no user involved)",
      "Service uses access_token to call downstream APIs",
    ],
    why: "No user interaction needed. The client is the resource owner. Token scope limits which downstream APIs the service can call.",
  },
  {
    flow: "Device Code",
    actors: "Device (no browser), Auth Server, User's phone/PC",
    use: "Smart TVs, CLI tools, IoT devices without a browser",
    steps: [
      "Device requests device_code and user_code from auth server",
      "Device shows user_code and verification_uri to user",
      "User visits URI on separate device (phone/PC) and enters user_code",
      "Device polls auth server until user completes authorization",
      "Auth server returns access_token to device",
    ],
    why: "Handles the case where the device cannot open a browser for a redirect flow.",
  },
];

const SCOPES_EXAMPLE = [
  { scope: "read:profile", meaning: "Read the user's name, email, and avatar" },
  { scope: "read:orders", meaning: "List the user's past orders" },
  { scope: "write:orders", meaning: "Create orders on the user's behalf" },
  { scope: "admin:users", meaning: "Manage all users — only for admin clients" },
  { scope: "offline_access", meaning: "Issue a refresh token (persisted access)" },
];

export function OAuth2Section() {
  return (
    <section>
      <h2 id="oauth2" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        OAuth 2.0 and OpenID Connect
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        OAuth 2.0 is an authorization framework. It allows a user to grant a third-party
        application limited access to their account on another service without sharing their
        credentials. The key insight is delegation: the user consents to a specific set of
        permissions (scopes), and the authorization server issues a token that represents
        exactly those permissions.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        OAuth 2.0 is authorization only — it says what the token permits, not who the user
        is. OpenID Connect (OIDC) is a thin identity layer on top of OAuth 2.0 that adds
        an ID token (a JWT) containing the user's identity (sub, email, name). Most modern
        identity providers (Google, GitHub, Auth0, Okta) implement both: OAuth 2.0 for
        authorization, OIDC for authentication.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">OAuth 2.0 grant flows</h3>

      <div className="space-y-4 mb-8">
        {OAUTH_FLOWS.map(({ flow, actors, use, steps, why }) => (
          <div key={flow} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
              <p className="text-[11px] font-semibold">{flow}</p>
              <p className="text-[9px] text-muted-foreground">Use: {use}</p>
            </div>
            <div className="px-4 py-3 space-y-3">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-1.5">Actors: {actors}</p>
                <ol className="space-y-1">
                  {steps.map((step, i) => (
                    <li key={i} className="flex gap-2 text-[11px]">
                      <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="border-l-2 border-primary/30 pl-3 text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground/70">Why this flow: </span>{why}
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Scopes: the unit of delegation</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Scopes define what a token is permitted to do. The client requests a set of scopes.
        The user consents to those scopes. The token carries only the consented scopes —
        the resource server checks them on every request. Scopes follow the principle of
        least privilege: request only what is needed.
      </p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Scope</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Permits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {SCOPES_EXAMPLE.map(({ scope, meaning }) => (
              <tr key={scope}>
                <td className="py-2 pr-4 font-mono text-[10px] text-primary align-top">{scope}</td>
                <td className="py-2 text-muted-foreground">{meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">OIDC: identity on top of OAuth 2.0</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose space-y-3">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50">What OIDC adds to OAuth 2.0</p>
        {[
          { term: "ID token", def: "A JWT issued alongside the access_token containing the user's identity (sub, email, name). Never sent to APIs — only consumed by the client to know who the user is." },
          { term: "UserInfo endpoint", def: "GET /userinfo with the access_token returns the user's profile claims. An alternative to embedding claims in the ID token." },
          { term: "Discovery document", def: "GET /.well-known/openid-configuration returns the provider's endpoints, supported scopes, and public keys. Clients auto-configure from this." },
          { term: "openid scope", def: "Requesting the openid scope signals to the auth server that this is an OIDC request and triggers ID token issuance." },
        ].map(({ term, def }) => (
          <div key={term} className="flex gap-3 p-2.5 bg-muted/30 rounded-xl text-[11px]">
            <span className="font-mono font-semibold text-primary w-36 flex-shrink-0">{term}</span>
            <span className="text-muted-foreground">{def}</span>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-warning bg-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-foreground/70">
          Never implement your own OAuth server unless you have a very specific reason.
          Use an identity provider (Auth0, Clerk, Supabase Auth, Cognito, Keycloak) that
          handles token issuance, rotation, revocation, MFA, and compliance. The attack
          surface of a custom auth implementation is large and the mistakes are severe.
        </p>
      </div>
    </section>
  );
}
