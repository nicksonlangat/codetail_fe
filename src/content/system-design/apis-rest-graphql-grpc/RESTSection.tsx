const HTTP_METHODS = [
  { method: "GET", safe: true, idempotent: true, body: false, use: "Fetch a resource or collection" },
  { method: "POST", safe: false, idempotent: false, body: true, use: "Create a new resource" },
  { method: "PUT", safe: false, idempotent: true, body: true, use: "Replace a resource entirely" },
  { method: "PATCH", safe: false, idempotent: false, body: true, use: "Partially update a resource" },
  { method: "DELETE", safe: false, idempotent: true, body: false, use: "Remove a resource" },
];

const STATUS_GROUPS = [
  {
    range: "2xx",
    label: "Success",
    color: "text-primary bg-primary/10 border-primary/20",
    codes: [
      { code: 200, name: "OK", when: "GET/PUT/PATCH succeeded" },
      { code: 201, name: "Created", when: "POST created a resource; include Location header" },
      { code: 204, name: "No Content", when: "DELETE succeeded; no body to return" },
    ],
  },
  {
    range: "4xx",
    label: "Client error",
    color: "text-orange-500 bg-orange-400/10 border-orange-400/20",
    codes: [
      { code: 400, name: "Bad Request", when: "Malformed JSON, missing required field" },
      { code: 401, name: "Unauthorized", when: "No or invalid credentials" },
      { code: 403, name: "Forbidden", when: "Authenticated but not allowed" },
      { code: 404, name: "Not Found", when: "Resource does not exist" },
      { code: 409, name: "Conflict", when: "State conflict (duplicate, optimistic lock)" },
      { code: 422, name: "Unprocessable", when: "Syntactically valid but semantically wrong" },
      { code: 429, name: "Too Many Requests", when: "Rate limit hit; include Retry-After header" },
    ],
  },
  {
    range: "5xx",
    label: "Server error",
    color: "text-destructive bg-destructive/10 border-destructive/20",
    codes: [
      { code: 500, name: "Internal Server Error", when: "Unhandled exception; do not leak stack traces" },
      { code: 502, name: "Bad Gateway", when: "Upstream service returned an invalid response" },
      { code: 503, name: "Service Unavailable", when: "Overloaded or in maintenance; include Retry-After" },
    ],
  },
];

const VERSIONING = [
  {
    strategy: "URL segment",
    example: "/api/v2/users",
    pro: "Explicit, cacheable, easy to route",
    con: "Duplicates URLs across versions",
  },
  {
    strategy: "Query param",
    example: "/api/users?version=2",
    pro: "Backward-compatible default",
    con: "Often forgotten, less cache-friendly",
  },
  {
    strategy: "Header",
    example: "Accept: application/vnd.api+json;version=2",
    pro: "Clean URL, spec-compliant",
    con: "Invisible in browser, harder to test",
  },
  {
    strategy: "Content negotiation",
    example: "Accept: application/vnd.company.user.v2+json",
    pro: "Fully REST-compliant (HATEOAS-friendly)",
    con: "Complex to implement and document",
  },
];

export function RESTSection() {
  return (
    <section>
      <h2 id="rest" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        REST: Constraints, Not a Standard
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        REST is not a protocol or a specification. It is an architectural style described by Roy
        Fielding in his 2000 dissertation. A REST API is one that satisfies six constraints:
        client-server separation, statelessness, cacheability, uniform interface, layered system,
        and optional code on demand. Most APIs called "RESTful" satisfy only the first three and
        ignore the rest, particularly HATEOAS (Hypermedia As The Engine Of Application State).
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        In practice, REST means resources identified by URLs, manipulated via HTTP verbs, with
        representations in JSON (or XML). The protocol does the heavy lifting: caching via
        ETags and Cache-Control, content negotiation via Accept headers, authentication via
        Authorization headers. The tradeoff is that the client drives everything. The server
        cannot push updates; the client must poll.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">HTTP verbs and their contracts</h3>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Method</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Safe</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Idempotent</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Body</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Use</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {HTTP_METHODS.map(({ method, safe, idempotent, body, use }) => (
              <tr key={method}>
                <td className="py-2 pr-4 font-mono font-semibold text-primary text-[11px]">{method}</td>
                <td className="py-2 pr-4">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${safe ? "text-primary bg-primary/10" : "text-muted-foreground bg-muted"}`}>
                    {safe ? "yes" : "no"}
                  </span>
                </td>
                <td className="py-2 pr-4">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${idempotent ? "text-primary bg-primary/10" : "text-muted-foreground bg-muted"}`}>
                    {idempotent ? "yes" : "no"}
                  </span>
                </td>
                <td className="py-2 pr-4">
                  <span className="text-[10px] font-mono text-muted-foreground">{body ? "yes" : "no"}</span>
                </td>
                <td className="py-2 text-muted-foreground">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[13px] text-muted-foreground mb-6">
        <strong className="text-foreground/80">Safe</strong> means the operation has no side effects.
        <strong className="text-foreground/80 ml-2">Idempotent</strong> means calling it N times
        produces the same result as calling it once. Safe implies idempotent. POST is neither.
        PUT and DELETE are idempotent but not safe.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Status codes worth knowing</h3>

      <div className="space-y-4 mb-8">
        {STATUS_GROUPS.map(({ range, label, color, codes }) => (
          <div key={range} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${color}`}>{range}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">{label}</span>
            </div>
            <div className="divide-y divide-border/50">
              {codes.map(({ code, name, when }) => (
                <div key={code} className="flex items-start gap-4 px-4 py-2.5">
                  <span className="font-mono text-[11px] font-semibold text-foreground/80 w-8 flex-shrink-0">{code}</span>
                  <span className="text-[11px] font-medium w-32 flex-shrink-0">{name}</span>
                  <span className="text-[11px] text-muted-foreground">{when}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">URL design principles</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose space-y-3">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">Good vs bad URL patterns</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[9px] text-destructive uppercase tracking-wider mb-2">Avoid</p>
            <pre className="text-[10px] font-mono bg-destructive/5 border border-destructive/20 rounded-lg p-3 space-y-1 leading-relaxed">
{`/getUser?id=42
/api/createPost
/users/getFollowers
/deleteComment/5
/api/v1/user_list`}
            </pre>
          </div>
          <div>
            <p className="text-[9px] text-primary uppercase tracking-wider mb-2">Prefer</p>
            <pre className="text-[10px] font-mono bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-1 leading-relaxed">
{`GET /users/42
POST /posts
GET /users/42/followers
DELETE /comments/5
GET /users`}
            </pre>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Nouns, not verbs. Plural collection names. Nesting max two levels deep. Actions via HTTP verbs.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">API versioning strategies</h3>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Strategy</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Example</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Pro</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Con</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {VERSIONING.map(({ strategy, example, pro, con }) => (
              <tr key={strategy}>
                <td className="py-2 pr-4 font-medium text-foreground/80 align-top whitespace-nowrap">{strategy}</td>
                <td className="py-2 pr-4 font-mono text-[10px] text-primary align-top">{example}</td>
                <td className="py-2 pr-4 text-muted-foreground align-top">{pro}</td>
                <td className="py-2 text-muted-foreground align-top">{con}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-foreground/70">
          URL segment versioning (/v2/) is the industry default and for good reason. It is explicit,
          trivially cacheable by CDNs and proxies, easy to route at the load balancer, and visible
          in logs. Start here unless you have a specific reason not to.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The over-fetching problem</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        REST couples resource shape to endpoint. A GET /users/42 returns the entire user object
        whether the client needs one field or all of them. A mobile app showing a user avatar and
        name burns bandwidth downloading the full profile. Worse, a page that needs user, post,
        and comment data must make three sequential requests before it can render.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90">
        Partial solutions exist: sparse fieldsets (?fields=id,name), compound documents (embed
        related resources in the response), and purpose-built endpoints (/api/post-card-data).
        All of these are workarounds. They either push the problem to the client (sparse fieldsets),
        over-engineer the API (compound documents), or erode the uniform interface (bespoke
        endpoints). GraphQL emerged specifically to solve this.
      </p>
    </section>
  );
}
