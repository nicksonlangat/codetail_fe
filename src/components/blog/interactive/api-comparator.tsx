"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type API = "rest" | "graphql" | "grpc";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

const MODES: Record<API, {
  label: string;
  badge: string;
  badgeBg: string;
  roundTrips: number;
  payloadSize: string;
  payloadBytes: number;
  requestLabel: string;
  responseLabel: string;
  request: string;
  response: string;
}> = {
  rest: {
    label: "REST",
    badge: "text-blue-500",
    badgeBg: "bg-blue-500/10 border-blue-500/20",
    roundTrips: 3,
    payloadSize: "~8 KB",
    payloadBytes: 8192,
    requestLabel: "3 HTTP requests required",
    responseLabel: "Response — 5 fields needed, 10+ returned",
    request:
`GET /api/v1/posts/42

  → also needed:

GET /api/v1/users/1
GET /api/v1/posts/42/comments?count=true

Three round trips before the
page can render.`,
    response:
`{
  "id": 42,
  "title": "Building at Scale",  ✓ needed
  "excerpt": "A deep dive...",   ✓ needed
  "content": "Lorem ipsum...",   ✗ 5 KB, not needed
  "slug": "building-at-scale",   ✗ not needed
  "author_id": 1,                ✗ need name, not id
  "created_at": "2025-01-01T...",✗ not needed
  "updated_at": "2025-01-15T...",✗ not needed
  "view_count": 14200,           ✗ not needed
  "status": "published",         ✗ not needed
  "category_id": 3               ✗ not needed
}
  + separate responses for
    /users/1 and /comments count`,
  },
  graphql: {
    label: "GraphQL",
    badge: "text-primary",
    badgeBg: "bg-primary/10 border-primary/20",
    roundTrips: 1,
    payloadSize: "~220 B",
    payloadBytes: 220,
    requestLabel: "1 query — specify exactly what you need",
    responseLabel: "Response — exactly what was asked for",
    request:
`query PostCard {
  post(id: 42) {
    title
    excerpt
    commentCount
    tags { name }
    author {
      name
      avatarUrl
    }
  }
}`,
    response:
`{
  "data": {
    "post": {
      "title": "Building at Scale",
      "excerpt": "A deep dive...",
      "commentCount": 23,
      "tags": [
        { "name": "systems" },
        { "name": "scale" }
      ],
      "author": {
        "name": "Alice Chen",
        "avatarUrl": "https://cdn.example.com/alice.jpg"
      }
    }
  }
}`,
  },
  grpc: {
    label: "gRPC",
    badge: "text-orange-500",
    badgeBg: "bg-orange-400/10 border-orange-400/20",
    roundTrips: 1,
    payloadSize: "~150 B",
    payloadBytes: 150,
    requestLabel: "Protobuf schema — compiled, strongly typed",
    responseLabel: "Binary wire format — compact, no field names",
    request:
`// post_service.proto
message GetPostCardRequest {
  int64 post_id = 1;
}

message Tag { string name = 1; }

message PostCard {
  string  title            = 1;
  string  excerpt          = 2;
  int32   comment_count    = 3;
  string  author_name      = 4;
  string  author_avatar_url= 5;
  repeated Tag tags        = 6;
}

service PostService {
  rpc GetPostCard(GetPostCardRequest)
      returns (PostCard);
}`,
    response:
`Binary (Protocol Buffers):
0A 12 42 75 69 6C 64 69 6E 67...

Decoded fields:
  title:             "Building at Scale"
  excerpt:           "A deep dive..."
  comment_count:     23
  author_name:       "Alice Chen"
  author_avatar_url: "https://cdn.example.com/..."
  tags:              ["systems", "scale"]

~150 bytes — no field names on the wire,
~37x smaller than the REST response.`,
  },
};

const MAX_BYTES = 8192;

export function APIComparator() {
  const [api, setApi] = useState<API>("rest");
  const mode = MODES[api];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-8 not-prose">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          API Paradigm Comparator — fetch a blog post card
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {(Object.keys(MODES) as API[]).map(a => (
          <button
            key={a}
            onClick={() => setApi(a)}
            className={`flex-1 py-2.5 text-[11px] font-semibold cursor-pointer transition-all duration-500 border-b-2 ${
              api === a
                ? `${MODES[a].badge} border-current bg-muted/30`
                : "text-muted-foreground border-transparent hover:bg-muted/20"
            }`}
          >
            {MODES[a].label}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 px-4 py-2.5 border-b border-border/50 bg-muted/20">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-muted-foreground">Round trips</span>
          <span className={`text-[11px] font-mono font-bold ${
            mode.roundTrips === 1 ? "text-primary" : "text-orange-500"
          }`}>{mode.roundTrips}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-muted-foreground">Payload</span>
          <span className={`text-[11px] font-mono font-bold ${
            mode.payloadBytes < 500 ? "text-primary" : "text-orange-500"
          }`}>{mode.payloadSize}</span>
        </div>
        <div className="flex-1 ml-2">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${mode.payloadBytes < 500 ? "bg-primary" : "bg-orange-400"}`}
              animate={{ width: `${(mode.payloadBytes / MAX_BYTES) * 100}%` }}
              transition={spring}
            />
          </div>
        </div>
      </div>

      {/* Request + Response panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={api}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={spring}
          className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/50"
        >
          <div className="p-4 space-y-2">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50">{mode.requestLabel}</p>
            <pre className={`text-[9px] font-mono rounded-xl p-3 overflow-x-auto whitespace-pre leading-relaxed border ${mode.badgeBg} bg-opacity-50`}>
              {mode.request}
            </pre>
          </div>
          <div className="p-4 space-y-2">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50">{mode.responseLabel}</p>
            <pre className="text-[9px] font-mono bg-muted rounded-xl p-3 overflow-x-auto whitespace-pre leading-relaxed">
              {mode.response}
            </pre>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
