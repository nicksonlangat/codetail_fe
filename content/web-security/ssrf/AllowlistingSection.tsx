import { CodeBlock } from "@/components/blog/interactive/code-block";

export function AllowlistingSection() {
  return (
    <section>
      <h2 id="allowlisting-outbound-requests" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Allowlisting outbound requests, and the two ways the obvious fix fails
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The obvious fix is to check the destination before fetching it. The obvious version of
        that check has two holes in it that aren&apos;t obvious at all.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A validation check that looks complete
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`def is_safe_url(url):
    host = urlparse(url).hostname
    ip = socket.gethostbyname(host)
    return not ip.startswith(("10.", "172.16.", "192.168.", "127.", "169.254."))

@app.route("/fetch-preview", methods=["POST"])
def fetch_preview():
    url = request.form["url"]
    if not is_safe_url(url):
        abort(400)
    response = requests.get(url, timeout=5)
    return {"content": response.text[:500]}`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This resolves the hostname, checks the IP it gets back, and only proceeds if it looks
        public. Two things break it. First, DNS rebinding: an attacker who controls DNS for their
        own domain can set a very short TTL, answer{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">is_safe_url</code>&apos;s
        lookup with a public IP, and answer{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">requests.get</code>&apos;s
        separate lookup, moments later, with{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">127.0.0.1</code>.
        Two independent DNS lookups on the same hostname are not guaranteed to return the same
        answer, and this code relies on them matching.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Second, redirects.{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">requests.get</code>{" "}
        follows them by default. A URL that&apos;s completely legitimate at validation time can
        respond with a 302 to an internal address, and the library happily follows it, past a
        check that only ever looked at the original URL.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: resolve once, validate that exact result, don&apos;t auto-follow redirects
        </p>
        <CodeBlock
          variant="fixed"
          code={`PRIVATE_RANGES = [
    ipaddress.ip_network(r) for r in
    ("10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16", "127.0.0.0/8", "169.254.0.0/16")
]

def resolve_and_validate(url):
    host = urlparse(url).hostname
    ip = socket.gethostbyname(host)
    addr = ipaddress.ip_address(ip)
    if any(addr in net for net in PRIVATE_RANGES):
        raise ValueError("blocked: private address")
    return ip  # the IP actually validated; connect to this one, don't re-resolve

@app.route("/fetch-preview", methods=["POST"])
def fetch_preview():
    url = request.form["url"]
    resolve_and_validate(url)
    response = requests.get(url, timeout=5, allow_redirects=False)
    if response.is_redirect:
        abort(400)  # or: validate the redirect target the same way, one hop at a time
    return {"content": response.text[:500]}`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The important part isn&apos;t any single line here, it&apos;s the principle: validate the
        exact network destination the request will actually use, not a URL that might resolve
        differently by the time the real connection happens, and never let an automatic redirect
        undo a check you already did. Most teams that need this reliably reach for a library built
        specifically to pin DNS resolution and re-validate every hop, rather than hand-rolling it
        per endpoint the way this example does for clarity.
      </p>
    </section>
  );
}
