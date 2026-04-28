import { TCPHandshake } from "@/components/blog/interactive/tcp-handshake";

export function TCPSection() {
  return (
    <section>
      <h2 id="tcp-tls" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Step 2: TCP Handshake & TLS
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        With an IP address in hand, the browser opens a <strong>TCP connection</strong>. TCP (Transmission
        Control Protocol) is the reliable transport layer — it guarantees that data arrives in order and
        without gaps, retransmitting any lost packets. Before a single byte of HTTP can be sent, TCP
        requires a 3-way handshake.
      </p>

      <TCPHandshake />

      <h3 className="text-base font-semibold mt-8 mb-3">Why the handshake costs a round trip</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Each round trip (client → server → client) takes time proportional to the physical distance. A
        request from New York to London travels ~5,500 km each way at roughly the speed of light through
        fiber — adding ~70ms of irreducible latency per round trip, regardless of server speed.
      </p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Route</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Distance</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Min RTT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {[
              { route: "NYC → NYC (same city)", dist: "~50km", rtt: "~1ms" },
              { route: "NYC → LA", dist: "~4,500km", rtt: "~40ms" },
              { route: "NYC → London", dist: "~5,500km", rtt: "~70ms" },
              { route: "NYC → Sydney", dist: "~16,000km", rtt: "~180ms" },
            ].map((r) => (
              <tr key={r.route}>
                <td className="py-2 pr-4 text-foreground/80">{r.route}</td>
                <td className="py-2 pr-4 text-muted-foreground font-mono">{r.dist}</td>
                <td className="py-2 font-mono text-primary">{r.rtt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">TLS: adding encryption on top of TCP</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        HTTPS requires a TLS handshake after TCP. Switch the interactive above to{" "}
        <strong>TLS</strong> mode to see the additional round trips. TLS 1.2 added 2 RTTs on top of TCP's
        1 RTT. TLS 1.3 (the current standard) reduced this to 1 RTT. Combined with TCP: 2 RTTs total before
        the first HTTP byte.
      </p>

      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        {[
          { label: "TLS 1.2", cost: "2 RTTs", note: "Deprecated, still common on older infra" },
          { label: "TLS 1.3", cost: "1 RTT", note: "Current standard — 0-RTT resumption for repeat connections" },
          { label: "HTTP/3 + QUIC", cost: "0 RTT*", note: "QUIC replaces TCP — connection + TLS in one packet. *First visit: 1 RTT" },
        ].map(({ label, cost, note }) => (
          <div key={label} className="p-4 bg-card border border-border rounded-xl">
            <div className="text-[11px] font-semibold mb-1">{label}</div>
            <div className="text-[20px] font-bold text-primary mb-1">{cost}</div>
            <div className="text-[10px] text-muted-foreground">{note}</div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Connection reuse: the real optimization</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The handshake cost is amortized across many requests via <strong>keep-alive</strong> connections.
        HTTP/1.1 introduced persistent connections. HTTP/2 added multiplexing — multiple requests over
        a single TCP connection simultaneously, eliminating the per-request overhead entirely.
      </p>

      <div className="border-l-2 border-info bg-info/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-foreground/70">
          <strong>Performance tip:</strong> CDNs terminate TCP and TLS at edge locations close to users,
          then maintain long-lived "warm" connections back to your origin. A user in Sydney connecting
          to a CDN PoP 10ms away pays 20ms for TLS, not 360ms.
        </p>
      </div>
    </section>
  );
}
