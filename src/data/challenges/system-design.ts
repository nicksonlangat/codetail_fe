import type { ChallengeContent } from "@/types/challenge";

export const systemDesignChallenges: Record<string, ChallengeContent> = {
  "sd-1": {
    problemId: "sd-1",
    title: "Design URL Shortener",
    type: "code",
    description: "Design a URL shortening service like bit.ly. You need to outline the core components: how short URLs are generated, how they map back to original URLs, and how the system handles high read traffic.\n\nFocus on the data model, the hashing/encoding strategy, and how you'd scale reads.",
    requirements: [
      "Define the database schema (table name, columns, indexes)",
      "Explain the short-code generation strategy (base62 encoding, counter vs hash)",
      "Describe the read path: what happens when a user hits `short.ly/abc123`",
      "Add a caching layer for hot URLs — explain cache invalidation strategy",
      "Discuss how you'd handle collisions if using hashing",
    ],
    hints: [
      "Base62 (a-z, A-Z, 0-9) gives 62^7 ≈ 3.5 trillion unique codes with 7 characters",
      "A counter-based approach avoids collisions but requires a centralized ID generator",
      "Read-heavy workloads (100:1 read/write ratio) benefit massively from an in-memory cache like Redis",
      "301 (permanent) vs 302 (temporary) redirects have different caching implications for browsers and CDNs",
    ],
    starterCode: `# URL Shortener — System Design Outline

## 1. Database Schema
# Define your table(s), columns, types, and indexes
# Table: ___
# Columns: ___
# Indexes: ___

## 2. Short Code Generation
# Strategy: ___ (base62 counter / MD5 hash + truncate / UUID)
# Why this approach: ___
# Collision handling: ___

## 3. API Endpoints
# POST /shorten  — input: ___, output: ___
# GET /:code     — behavior: ___

## 4. Read Path (step by step)
# 1. User requests short.ly/abc123
# 2. ___
# 3. ___
# 4. ___

## 5. Caching Layer
# Cache technology: ___
# Cache key: ___
# TTL strategy: ___
# Invalidation: ___

## 6. Scale Considerations
# Estimated QPS: ___
# How to handle 10K+ writes/sec: ___
# How to handle 1M+ reads/sec: ___`,
    exampleOutput: `# A strong answer covers:
# - Table: urls (id BIGINT PK, short_code VARCHAR UNIQUE INDEX, original_url TEXT, created_at TIMESTAMP)
# - Base62 encoding of auto-increment ID (no collisions, predictable)
# - GET /:code → check Redis cache → fallback to DB → 302 redirect
# - Redis cache with TTL 24h for hot URLs, write-through on creation
# - Horizontal scaling: read replicas for DB, Redis cluster for cache`,
  },
  "sd-2": {
    problemId: "sd-2",
    title: "Design Rate Limiter",
    type: "mcq",
    description: "You're building a rate limiter for an API gateway that needs to enforce **100 requests per minute per user**. The system handles 50,000 concurrent users.\n\nWhich algorithm provides the best balance of accuracy, memory efficiency, and burst handling?",
    requirements: [
      "Consider memory usage across 50K concurrent users",
      "Think about how each algorithm handles burst traffic at window boundaries",
      "Consider implementation complexity and operational overhead",
    ],
    hints: [
      "Fixed window counters have a well-known boundary problem: a user can make 200 requests in 2 seconds (100 at end of window 1 + 100 at start of window 2)",
      "Token bucket allows controlled bursts while maintaining long-term rate limits",
      "Sliding window log stores every timestamp — that's 100 entries × 50K users = 5M entries in memory",
    ],
    starterCode: "",
    options: [
      {
        id: "a",
        label: "Fixed Window Counter",
        code: `# Fixed Window Counter
# - One counter per user per time window
# - Reset counter when window expires
# Memory: O(1) per user
# Problem: 2x burst at window boundaries`,
      },
      {
        id: "b",
        label: "Sliding Window Log",
        code: `# Sliding Window Log
# - Store timestamp of every request per user
# - Count requests in last 60 seconds
# Memory: O(rate_limit) per user — up to 100 entries each
# Accurate but memory-heavy at scale`,
      },
      {
        id: "c",
        label: "Token Bucket",
        code: `# Token Bucket
# - Each user has a bucket with max 100 tokens
# - Tokens added at fixed rate (100/min)
# - Each request consumes 1 token
# Memory: O(1) per user (just token count + last_refill timestamp)
# Allows controlled bursts`,
      },
      {
        id: "d",
        label: "Leaky Bucket",
        code: `# Leaky Bucket
# - Requests enter a queue (bucket)
# - Processed at fixed rate regardless of input
# Memory: O(queue_size) per user
# Smooths traffic but adds latency`,
      },
    ],
    correctOptionId: "c",
    explanation: "Token Bucket is the industry standard (used by AWS, Stripe, GitHub APIs) because it stores only 2 values per user (token count + timestamp = ~16 bytes), allows controlled bursts up to the bucket size, and enforces the long-term rate. Fixed Window has the 2x boundary burst problem. Sliding Window Log uses too much memory at scale (100 timestamps × 50K users). Leaky Bucket adds unnecessary latency by queuing requests instead of rejecting them immediately.",
  },
  "sd-3": {
    problemId: "sd-3",
    title: "Design Key-Value Store",
    type: "code",
    description: "Design a distributed key-value store similar to DynamoDB or Redis Cluster. The system must handle partitioning data across multiple nodes, replication for fault tolerance, and consistency trade-offs.\n\nFocus on the data partitioning strategy, replication model, and how reads/writes work.",
    requirements: [
      "Choose a partitioning strategy and explain why (consistent hashing vs range-based)",
      "Define the replication factor and how replicas stay in sync",
      "Explain the read/write path step by step",
      "Discuss consistency levels (strong vs eventual) and their trade-offs",
      "Handle node failures — what happens when a node goes down?",
    ],
    hints: [
      "Consistent hashing with virtual nodes distributes load more evenly than naive modulo hashing",
      "Quorum reads/writes (W + R > N) give you tunable consistency",
      "Vector clocks or last-write-wins (LWW) resolve conflicts in eventually consistent systems",
      "Gossip protocol lets nodes discover failures without a central coordinator",
    ],
    starterCode: `# Distributed Key-Value Store — System Design

## 1. Partitioning Strategy
# Approach: ___ (consistent hashing / range-based / hash mod N)
# Why: ___
# Virtual nodes: ___ (yes/no, and why)

## 2. Replication
# Replication factor (N): ___
# Replication strategy: ___ (leader-follower / leaderless)
# How replicas sync: ___

## 3. Write Path
# 1. Client sends PUT(key, value)
# 2. ___
# 3. ___
# 4. Write acknowledged when ___

## 4. Read Path
# 1. Client sends GET(key)
# 2. ___
# 3. ___
# Consistency level: ___

## 5. Consistency Trade-offs
# Strong consistency: ___
# Eventual consistency: ___
# Your default choice and why: ___

## 6. Failure Handling
# Node detection: ___ (heartbeat / gossip)
# When a node fails: ___
# When it comes back: ___`,
    exampleOutput: `# Strong answer covers:
# - Consistent hashing with 128+ virtual nodes per physical node
# - N=3 replicas, leaderless with quorum (W=2, R=2)
# - Write: hash key → find 3 nodes on ring → write to all → ack after W=2 succeed
# - Read: query R=2 replicas → return latest version (vector clock comparison)
# - Hinted handoff for temporary failures, Merkle trees for anti-entropy repair`,
  },
  "sd-4": {
    problemId: "sd-4",
    title: "Design Twitter Feed",
    type: "mcq",
    description: "You're designing the home timeline for a Twitter-like social network. A user follows hundreds of accounts, and you need to assemble their feed showing the most recent posts from all followed accounts.\n\nUser A follows 500 accounts. When they open the app, how should their feed be generated?",
    requirements: [
      "Consider that some users (celebrities) have millions of followers",
      "The feed must load in under 200ms for a good user experience",
      "Think about write amplification vs read amplification trade-offs",
    ],
    hints: [
      "Fan-out on write pre-computes feeds but is expensive for users with millions of followers",
      "Fan-out on read computes the feed at request time — no wasted work, but slower reads",
      "Twitter actually uses a hybrid: fan-out on write for normal users, fan-out on read for celebrities",
    ],
    starterCode: "",
    options: [
      {
        id: "a",
        label: "Fan-out on Write (push)",
        code: `# When a user posts a tweet:
# 1. Look up all followers (could be millions)
# 2. Insert the tweet into each follower's feed cache
# 3. Reading feed = just read from pre-computed cache
# Pro: Fast reads (O(1) cache lookup)
# Con: Celebrity with 10M followers = 10M writes per tweet`,
      },
      {
        id: "b",
        label: "Fan-out on Read (pull)",
        code: `# When a user opens their feed:
# 1. Look up all accounts they follow
# 2. Fetch recent tweets from each (500 queries)
# 3. Merge-sort by timestamp, return top N
# Pro: No write amplification
# Con: Slow reads — 500 queries at read time`,
      },
      {
        id: "c",
        label: "Hybrid (push + pull)",
        code: `# For normal users (< 10K followers): fan-out on write
#   → tweet is pushed to all follower feed caches
# For celebrities (> 10K followers): fan-out on read
#   → their tweets are fetched at read time and merged
# Reading: merge pre-computed cache + celebrity tweets
# Best of both worlds`,
      },
      {
        id: "d",
        label: "Polling with Client-side Merge",
        code: `# Client periodically polls each followed user's tweet endpoint
# Client merges and sorts locally
# Pro: Simple server
# Con: Massive client bandwidth, battery drain, stale data`,
      },
    ],
    correctOptionId: "c",
    explanation: "The hybrid approach is what Twitter actually uses in production. Fan-out on write works great for the 99% of users with fewer than 10K followers — the write cost is manageable and reads are instant (just fetch the pre-computed cache). But for celebrities with millions of followers, pushing to every follower's cache is prohibitively expensive. Instead, celebrity tweets are fetched and merged at read time. This gives you O(1) reads for most content + a small merge of celebrity tweets, keeping the 200ms latency target achievable.",
  },
  "sd-5": {
    problemId: "sd-5",
    title: "Design Chat System",
    type: "code",
    description: "Design a real-time chat system like WhatsApp or Slack that supports 1-on-1 messaging, group chats, online presence, and message delivery guarantees.\n\nFocus on the real-time communication protocol, message storage, delivery guarantees, and how presence works.",
    requirements: [
      "Choose a real-time protocol and justify it (WebSocket vs long polling vs SSE)",
      "Design the message storage schema for both 1:1 and group chats",
      "Explain message delivery guarantees (sent → delivered → read)",
      "Design the online presence system",
      "Handle offline users — how do they receive missed messages?",
    ],
    hints: [
      "WebSockets provide full-duplex communication — ideal for chat where both sides send/receive",
      "Message ordering in group chats is harder than 1:1 — consider per-chat sequence numbers",
      "Presence is expensive at scale: if 10M users are online, every status change notifies their contacts",
      "Use a message queue (Kafka/RabbitMQ) to decouple message ingestion from delivery",
    ],
    starterCode: `# Real-Time Chat System — System Design

## 1. Real-Time Protocol
# Choice: ___ (WebSocket / Long Polling / SSE)
# Why: ___
# Connection management: ___

## 2. Message Storage Schema
# Table: messages
# Columns: ___
# Indexes: ___
# Group chat table: ___

## 3. Send Message Flow (step by step)
# 1. User A sends message to User B
# 2. ___
# 3. ___
# 4. ___
# 5. Message status: sent → delivered → read

## 4. Message Delivery Guarantees
# "Sent" = ___
# "Delivered" = ___
# "Read" = ___
# Offline handling: ___

## 5. Online Presence
# How to track who's online: ___
# Heartbeat interval: ___
# How to notify contacts of status change: ___
# Optimization for users with many contacts: ___

## 6. Group Chat Considerations
# Max group size: ___
# Message fan-out strategy: ___
# Ordering guarantee: ___`,
    exampleOutput: `# Strong answer covers:
# - WebSocket for bidirectional real-time messaging, with long-polling fallback
# - messages table: id, chat_id, sender_id, content, timestamp, status (sent/delivered/read)
# - Send flow: client → WebSocket server → message queue → recipient's WS server → recipient
# - Offline: persist to DB, push notification, deliver when reconnected
# - Presence: heartbeat every 30s, Redis TTL key per user, pub/sub for status changes
# - Group: fan-out via message queue, per-chat monotonic sequence numbers`,
  },
};
