"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "sql" | "document" | "kv";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

const MODES: Record<Mode, {
  label: string;
  db: string;
  accent: string;
  schema: string;
  query: string;
  traits: { icon: string; label: string; positive: boolean }[];
}> = {
  sql: {
    label: "Relational",
    db: "PostgreSQL",
    accent: "blue",
    schema: `CREATE TABLE users (
  id      SERIAL PRIMARY KEY,
  name    TEXT NOT NULL,
  email   TEXT UNIQUE NOT NULL
);

CREATE TABLE posts (
  id         SERIAL PRIMARY KEY,
  user_id    INT REFERENCES users(id),
  content    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE comments (
  id       SERIAL PRIMARY KEY,
  post_id  INT REFERENCES posts(id),
  user_id  INT REFERENCES users(id),
  content  TEXT
);`,
    query: `-- Fetch post with comments and authors
SELECT p.content,
       u.name    AS author,
       c.content AS comment,
       cu.name   AS commenter
FROM   posts p
JOIN   users    u  ON u.id  = p.user_id
JOIN   comments c  ON c.post_id = p.id
JOIN   users    cu ON cu.id = c.user_id
WHERE  p.id = 42;`,
    traits: [
      { icon: "✓", label: "ACID transactions", positive: true },
      { icon: "✓", label: "Arbitrary queries via SQL", positive: true },
      { icon: "✓", label: "No duplicated data (normalized)", positive: true },
      { icon: "–", label: "JOIN cost grows with scale", positive: false },
      { icon: "–", label: "Schema changes need migrations", positive: false },
    ],
  },
  document: {
    label: "Document",
    db: "MongoDB",
    accent: "green",
    schema: `// posts collection — one document per post
{
  "_id": "42",
  "content": "Hello world",
  "author": {
    "id": "1",
    "name": "Alice"
  },
  "comments": [
    { "content": "Nice!", "author": "Bob" },
    { "content": "Great post", "author": "Carol" }
  ],
  "tags": ["engineering", "systems"],
  "created_at": "2025-01-01T12:00:00Z"
}`,
    query: `// Fetch post — no JOIN needed
db.posts.findOne({ _id: "42" })

// Push a new comment atomically
db.posts.updateOne(
  { _id: "42" },
  { $push: {
      comments: {
        content: "Agreed!",
        author: "Dave"
      }
  }}
)`,
    traits: [
      { icon: "✓", label: "Fast reads (data co-located)", positive: true },
      { icon: "✓", label: "Flexible schema — add fields freely", positive: true },
      { icon: "✓", label: "Natural fit for hierarchical data", positive: true },
      { icon: "–", label: "Author name duplicated in every post", positive: false },
      { icon: "–", label: "Update anomalies if author renames", positive: false },
    ],
  },
  kv: {
    label: "Key-Value",
    db: "Redis",
    accent: "orange",
    schema: `# Post fields — stored as a hash
HSET post:42 content "Hello world"
HSET post:42 user_id "1"
HSET post:42 created_at "2025-01-01"

# Comments — stored as a list
LPUSH post:42:comments "Bob:Nice!"
LPUSH post:42:comments "Carol:Great post"

# Like counter — atomic integer
SET post:42:likes 142`,
    query: `# Fetch all post fields — O(1)
HGETALL post:42

# Fetch all comments
LRANGE post:42:comments 0 -1

# Increment likes atomically — no race condition
INCR post:42:likes

# No query language — must know the key.
# Cannot ask "all posts by Alice" without
# maintaining a separate index key.`,
    traits: [
      { icon: "✓", label: "O(1) read/write by key", positive: true },
      { icon: "✓", label: "Atomic operations (INCR, SETNX)", positive: true },
      { icon: "✓", label: "TTL support — built-in expiry", positive: true },
      { icon: "–", label: "No query language, must know key", positive: false },
      { icon: "–", label: "Relationships must be managed manually", positive: false },
    ],
  },
};

const ACCENT_CLASSES: Record<string, {
  tab: string;
  activeTab: string;
  border: string;
  badge: string;
}> = {
  blue: {
    tab: "hover:text-blue-500",
    activeTab: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    border: "border-blue-500/20",
    badge: "bg-blue-500/10 text-blue-500",
  },
  green: {
    tab: "hover:text-primary",
    activeTab: "bg-primary/10 text-primary border-primary/30",
    border: "border-primary/20",
    badge: "bg-primary/10 text-primary",
  },
  orange: {
    tab: "hover:text-orange-500",
    activeTab: "bg-orange-500/10 text-orange-500 border-orange-500/30",
    border: "border-orange-500/20",
    badge: "bg-orange-500/10 text-orange-500",
  },
};

export function DataModelExplorer() {
  const [mode, setMode] = useState<Mode>("sql");
  const [view, setView] = useState<"schema" | "query">("schema");
  const current = MODES[mode];
  const accent = ACCENT_CLASSES[current.accent];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-8 not-prose">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          Data Model Explorer — same data, three paradigms
        </span>
        <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${accent.badge}`}>
          {current.db}
        </span>
      </div>

      <div className="flex border-b border-border">
        {(Object.keys(MODES) as Mode[]).map(m => {
          const a = ACCENT_CLASSES[MODES[m].accent];
          return (
            <button
              key={m}
              onClick={() => { setMode(m); setView("schema"); }}
              className={`flex-1 py-2.5 text-[11px] font-medium cursor-pointer transition-all duration-500 border-b-2 ${
                mode === m
                  ? `${a.activeTab} border-b-current`
                  : "text-muted-foreground border-transparent hover:bg-muted/30"
              }`}
            >
              {MODES[m].label}
            </button>
          );
        })}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex gap-1.5">
          {(["schema", "query"] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded-md text-[10px] font-medium cursor-pointer transition-all duration-500 ${
                view === v ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v === "schema" ? "Schema / Structure" : "Query / Operations"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.pre
            key={`${mode}-${view}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={spring}
            className={`text-[10px] font-mono bg-muted rounded-xl p-4 overflow-x-auto whitespace-pre leading-relaxed border ${accent.border}`}
          >
            {view === "schema" ? current.schema : current.query}
          </motion.pre>
        </AnimatePresence>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
          {current.traits.map(({ icon, label, positive }) => (
            <div
              key={label}
              className={`flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] ${
                positive ? "bg-primary/5 text-foreground/80" : "bg-muted text-muted-foreground"
              }`}
            >
              <span className={positive ? "text-primary font-bold" : "text-muted-foreground/60 font-bold"}>
                {icon}
              </span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
