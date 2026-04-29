import { RESTSection } from "./apis-rest-graphql-grpc/RESTSection";
import { GraphQLSection } from "./apis-rest-graphql-grpc/GraphQLSection";
import { GRPCSection } from "./apis-rest-graphql-grpc/GRPCSection";
import { ChoosingSection } from "./apis-rest-graphql-grpc/ChoosingSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "rest", title: "REST" },
  { id: "graphql", title: "GraphQL" },
  { id: "grpc", title: "gRPC" },
  { id: "choosing", title: "Choosing the Right Paradigm" },
  { id: "summary", title: "Summary" },
];

export default function APIsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Every client-server interaction is an API call. The paradigm you choose determines
          how clients discover what data is available, how they ask for it, how much of it they
          receive, and at what cost. REST, GraphQL, and gRPC are the three dominant paradigms
          in backend engineering today, each with a distinct model for solving these problems.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          REST uses HTTP as the application protocol: URLs identify resources, verbs express
          intent, status codes communicate outcome. It is the default choice for public APIs
          because it requires no client tooling and every developer already knows it. Its
          weakness is that the server controls the response shape. Clients receive what the
          endpoint returns, not what they need.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          GraphQL inverts that control. The client specifies exactly which fields it needs in
          a typed query language. The server validates the query against a schema and returns
          precisely that shape. One endpoint, one request, zero over-fetching. The tradeoff is
          that caching, rate limiting, and query complexity become the server's problem.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          gRPC uses Protocol Buffers and HTTP/2 to achieve what neither REST nor GraphQL can:
          binary serialization 3-10x smaller than JSON, multiplexed streams over a single TCP
          connection, and type-safe client stubs generated from the schema. It is the standard
          for internal microservice communication at high throughput. Browsers cannot call it
          directly. That constraint makes it the wrong choice for public APIs and the right
          choice for everything behind the gateway.
        </p>
      </section>

      <RESTSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <GraphQLSection />
      <GRPCSection />
      <ChoosingSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🌐",
              label: "REST: resources over HTTP",
              desc: "URLs name resources. Verbs express intent. Status codes communicate outcome. The universal default for public APIs. Every client, every language, no toolchain required.",
            },
            {
              icon: "📦",
              label: "Over-fetching is REST's core weakness",
              desc: "REST endpoint shapes are server-defined. A client needing 3 fields downloads 30. A page needing 3 resources makes 3 round trips. GraphQL was built to solve exactly this.",
            },
            {
              icon: "🎯",
              label: "GraphQL: client-driven queries",
              desc: "The client specifies the exact shape it needs. One request returns data from any depth of the type graph. Eliminates over-fetching and multi-round-trip waterfalls for complex UIs.",
            },
            {
              icon: "⚡",
              label: "gRPC: binary speed for internal services",
              desc: "Protocol Buffers produce frames 3-10x smaller than JSON. HTTP/2 multiplexes streams over one connection. Type-safe stubs generated in 10+ languages from a single .proto file.",
            },
            {
              icon: "🔀",
              label: "Streaming is a gRPC superpower",
              desc: "Four modes: unary, server-streaming, client-streaming, and bidirectional. REST needs SSE or WebSockets bolted on. GraphQL subscriptions require WebSocket. gRPC streaming is built into the protocol.",
            },
            {
              icon: "🏗️",
              label: "Hybrid architectures are the norm",
              desc: "REST for public APIs. gRPC between internal services. GraphQL as a BFF aggregating multiple gRPC backends. Match the paradigm to the boundary, not team preference.",
            },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="flex gap-3 p-4 bg-card border border-border rounded-xl">
              <span className="text-lg flex-shrink-0">{icon}</span>
              <div>
                <p className="text-[13px] font-semibold mb-0.5">{label}</p>
                <p className="text-[12px] text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
