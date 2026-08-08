import { RESTSection } from "./RESTSection";
import { GraphQLSection } from "./GraphQLSection";
import { GRPCSection } from "./GRPCSection";
import { ChoosingSection } from "./ChoosingSection";

export const toc = [
  { id: "rest", title: "REST: Constraints, Not a Standard" },
  { id: "graphql", title: "GraphQL: Query What You Need" },
  { id: "grpc", title: "gRPC: Protocol Buffers and HTTP/2" },
  { id: "choosing", title: "Choosing the Right Paradigm" },
];

export default function ApisRestGraphqlGrpcArticle() {
  return (
    <>
      <RESTSection />
      <GraphQLSection />
      <GRPCSection />
      <ChoosingSection />
    </>
  );
}
