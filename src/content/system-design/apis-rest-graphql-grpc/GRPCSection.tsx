const STREAMING_MODES = [
  {
    mode: "Unary",
    pattern: "client → server → client",
    proto: "rpc GetUser(UserRequest) returns (User);",
    analogy: "Standard HTTP request/response",
    use: "Most API calls: fetch a resource, run a command",
  },
  {
    mode: "Server streaming",
    pattern: "client → server ⟶⟶⟶ client",
    proto: "rpc WatchLogs(LogQuery) returns (stream LogEntry);",
    analogy: "Server-sent events",
    use: "Live feeds, log tailing, export of large datasets",
  },
  {
    mode: "Client streaming",
    pattern: "client ⟶⟶⟶ server → client",
    proto: "rpc UploadChunks(stream Chunk) returns (UploadResult);",
    analogy: "Chunked upload",
    use: "File upload, batch ingest, streaming metrics",
  },
  {
    mode: "Bidirectional streaming",
    pattern: "client ⟷⟷⟷ server",
    proto: "rpc Chat(stream Message) returns (stream Message);",
    analogy: "WebSocket",
    use: "Real-time chat, multiplayer, interactive sessions",
  },
];

const PROTOBUF_TYPES = [
  { type: "int32 / int64", wire: "varint", bytes: "1-10", note: "Variable-length encoding; small numbers cost fewer bytes" },
  { type: "float / double", wire: "fixed32 / fixed64", bytes: "4 / 8", note: "Fixed size regardless of value" },
  { type: "string", wire: "length-delimited", bytes: "2 + len", note: "UTF-8 encoded; 2 bytes overhead for length" },
  { type: "bool", wire: "varint", bytes: "1", note: "Encoded as 0 or 1" },
  { type: "bytes", wire: "length-delimited", bytes: "2 + len", note: "Arbitrary binary; use for images, encrypted payloads" },
  { type: "repeated T", wire: "packed varint", bytes: "varies", note: "Arrays. Packed encoding for numeric types" },
  { type: "message", wire: "length-delimited", bytes: "nested", note: "Embedded messages, fully recursive" },
];

export function GRPCSection() {
  return (
    <section>
      <h2 id="grpc" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        gRPC: Protocol Buffers and HTTP/2
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        gRPC is a remote procedure call framework developed at Google and open-sourced in 2015.
        It uses Protocol Buffers as its interface definition language and serialization format,
        and HTTP/2 as its transport. The combination gives it properties that REST and GraphQL
        cannot match: strongly typed schemas enforced at compile time, binary serialization 3-10x
        smaller than JSON, multiplexed streams over a single TCP connection, and server push.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The workflow is schema-first and code-generated. You define your service in a .proto file.
        The gRPC compiler (protoc) generates type-safe client stubs and server interfaces in your
        language of choice. The generated code handles serialization, deserialization, and transport.
        You implement the server interface and call the client stub as if it were a local function.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Protocol Buffers: how binary encoding works</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Protocol Buffers (protobuf) encode messages as binary sequences of field-number/value pairs.
        Field names are not transmitted on the wire; only the field number is. This is what makes
        the format compact and why it is schema-dependent: you cannot decode a protobuf message
        without the .proto definition.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-4 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          From .proto definition to binary wire format
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[9px] text-muted-foreground mb-2">Schema (.proto)</p>
            <pre className="text-[10px] font-mono bg-muted rounded-lg px-3 py-2 leading-relaxed overflow-x-auto">
{`message User {
  int64  id         = 1;
  string name       = 2;
  string email      = 3;
  bool   is_active  = 4;
}

// Populated with:
// id: 42, name: "Alice",
// email: "a@ex.com", is_active: true`}
            </pre>
          </div>
          <div>
            <p className="text-[9px] text-muted-foreground mb-2">Wire format (binary, 24 bytes)</p>
            <pre className="text-[10px] font-mono bg-muted rounded-lg px-3 py-2 leading-relaxed overflow-x-auto">
{`08 2A              field 1, varint, 42
12 05 41 6C 69     field 2, "Alice"
   63 65
1A 07 61 40 65     field 3, "a@ex.com"
   78 2E 63 6F
   6D
20 01              field 4, bool true

vs JSON (67 bytes):
{"id":42,"name":"Alice",
"email":"a@ex.com",
"is_active":true}`}
            </pre>
          </div>
        </div>
      </div>

      <p className="text-[13px] text-muted-foreground mb-6">
        Field names absent on the wire. Unknown field numbers are silently skipped (forward
        compatibility). Missing fields use the type default (0, "", false). This is how .proto
        achieves backward and forward compatibility without versioning.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Scalar types and wire sizes</h3>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Type</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Wire type</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Bytes</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {PROTOBUF_TYPES.map(({ type, wire, bytes, note }) => (
              <tr key={type}>
                <td className="py-2 pr-4 font-mono text-primary text-[10px] align-top">{type}</td>
                <td className="py-2 pr-4 font-mono text-[10px] text-muted-foreground align-top">{wire}</td>
                <td className="py-2 pr-4 font-mono text-[10px] text-foreground/80 align-top whitespace-nowrap">{bytes}</td>
                <td className="py-2 text-muted-foreground align-top">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">HTTP/2 and multiplexing</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        REST over HTTP/1.1 opens one TCP connection per in-flight request (or reuses connections
        serially). HTTP/2 sends multiple streams over a single connection simultaneously using
        framing. Each request/response pair is a stream. Streams are independent: a slow response
        does not block a fast one (head-of-line blocking is eliminated at the HTTP layer).
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mb-8 not-prose">
        {[
          { label: "Multiplexing", desc: "Multiple RPC calls share one TCP connection. No per-request connection overhead. No head-of-line blocking between streams." },
          { label: "Header compression", desc: "HPACK compresses HTTP headers. Repeated headers (Content-Type, Authorization) are sent once and referenced by index on subsequent frames." },
          { label: "Flow control", desc: "Each stream has a flow control window. Fast senders cannot overwhelm slow receivers. Works at both the stream and connection level." },
          { label: "Server push", desc: "Server can send frames the client has not requested yet. gRPC uses this for server-streaming and bidirectional RPCs." },
        ].map(({ label, desc }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-3">
            <p className="text-[12px] font-semibold mb-1">{label}</p>
            <p className="text-[11px] text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Four streaming modes</h3>

      <div className="space-y-3 mb-8">
        {STREAMING_MODES.map(({ mode, pattern, proto, analogy, use }) => (
          <div key={mode} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/30">
              <span className="text-[11px] font-semibold">{mode}</span>
              <span className="font-mono text-[9px] text-muted-foreground">{pattern}</span>
              <span className="ml-auto text-[9px] text-muted-foreground">like: {analogy}</span>
            </div>
            <div className="px-4 py-3 space-y-2">
              <pre className="text-[10px] font-mono bg-muted/50 rounded-lg px-3 py-2 overflow-x-auto">{proto}</pre>
              <p className="text-[11px] text-muted-foreground">{use}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">When NOT to use gRPC</h3>

      <div className="space-y-2">
        {[
          {
            reason: "Public APIs",
            detail: "Browsers cannot call gRPC directly. gRPC-Web requires a proxy (Envoy, grpc-gateway). REST or GraphQL is far more accessible for public developer APIs.",
          },
          {
            reason: "Human-readable debugging",
            detail: "Binary frames are not readable with curl or browser DevTools without tooling. REST JSON is immediately inspectable. Protobuf requires protoc or a dedicated tool.",
          },
          {
            reason: "Teams new to the pattern",
            detail: "Schema-first development, code generation, and proto file management add upfront complexity. The ROI materializes at scale; it is overhead in a small service.",
          },
          {
            reason: "Firewall-restricted environments",
            detail: "Some corporate proxies and API gateways do not support HTTP/2 or pass binary frames correctly. REST over HTTP/1.1 has zero environment friction.",
          },
        ].map(({ reason, detail }) => (
          <div key={reason} className="flex gap-3 p-3 rounded-xl border border-orange-400/20 bg-orange-400/5">
            <span className="text-orange-500 text-sm flex-shrink-0 mt-0.5">!</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{reason}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
