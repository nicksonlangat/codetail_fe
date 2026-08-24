export interface DesignSection {
  id: string;
  title: string;
  prompt: string;
  placeholder: string;
}

export interface DesignChallenge {
  slug: string;
  title: string;
  subtitle: string;
  difficulty: "Medium" | "Hard" | "Expert";
  estimatedMinutes: number;
  tags: string[];
  icon: string;
  brief: string;
  scale: { label: string; value: string }[];
  requirements: string[];
  constraints: string[];
  sections: DesignSection[];
}

export const designChallenges: DesignChallenge[] = [
  {
    slug: "design-notification-system",
    title: "Design a Notification System",
    subtitle: "Push, email, SMS, and in-app at 100M+ notifications per day.",
    difficulty: "Hard",
    estimatedMinutes: 50,
    tags: ["queues", "fan-out", "pub-sub", "rate-limiting", "scalability"],
    icon: "🔔",
    brief:
      "Design a system that reliably delivers notifications to users across push (FCM/APNs), email, SMS, and in-app channels. Users have preferences. Notifications must not duplicate. The system must handle massive fan-out (a single event can trigger millions of notifications) and gracefully retry failures.",
    scale: [
      { label: "Active users", value: "10M" },
      { label: "Notifications / day", value: "100M+" },
      { label: "Delivery SLA", value: "<1s (push/in-app)" },
      { label: "Uptime", value: "99.9%" },
      { label: "Fan-out", value: "Up to 5M recipients per event" },
    ],
    requirements: [
      "Send push (FCM/APNs), email, SMS, and in-app notifications",
      "Users can set channel preferences per notification type",
      "Deduplicate: same notification never delivered twice",
      "Retry failed deliveries with exponential backoff",
      "Rate-limit per user (max N notifications per channel per hour)",
      "Support scheduled and triggered notifications",
    ],
    constraints: [
      "Third-party rate limits: FCM, Twilio, SendGrid all have caps",
      "No message loss — durability is required",
      "System must survive a single region going down",
      "Preference lookups must not become a bottleneck at fan-out",
    ],
    sections: [
      {
        id: "architecture",
        title: "High-Level Architecture",
        prompt: "Draw out the main components and how they connect.",
        placeholder:
          "e.g. API service receives notification requests and publishes to a message queue. A dispatcher service consumes from the queue and routes to channel-specific workers (push worker, email worker, SMS worker). Each worker calls the relevant third-party API...",
      },
      {
        id: "data-model",
        title: "Data Model & Storage",
        prompt: "What are the key entities? What databases do you use and why?",
        placeholder:
          "e.g. Notification (id, type, recipient_id, payload, status, created_at, sent_at). User preferences stored in Redis for fast lookup. Notification log in PostgreSQL for deduplication and audit. Failed delivery queue in Redis with TTL...",
      },
      {
        id: "api-design",
        title: "API Design",
        prompt: "Key endpoints — what do callers send and what do you return?",
        placeholder:
          "POST /notifications — trigger a notification\nGET /notifications/{id} — check delivery status\nPUT /users/{id}/preferences — update channel preferences\n\nInclude auth strategy, rate limit headers, idempotency keys...",
      },
      {
        id: "scaling",
        title: "Scaling & Queue Strategy",
        prompt: "How do you handle a 5M-recipient fan-out without melting?",
        placeholder:
          "e.g. Fan-out happens asynchronously — API writes one event, a fan-out service reads user list in pages of 1000 and enqueues per-user jobs. Separate queues per channel to isolate SMS slowness from push. Channel workers autoscale based on queue depth...",
      },
      {
        id: "tradeoffs",
        title: "Trade-offs & Decisions",
        prompt: "What did you choose, what did you sacrifice, and why?",
        placeholder:
          "e.g. Chose at-least-once delivery over exactly-once for simplicity — deduplication at write prevents user impact. Chose Redis for preferences over DB to avoid N+1 on fan-out — trade-off is eventual consistency on preference updates. Chose per-channel queues over a unified queue to prevent head-of-line blocking...",
      },
    ],
  },
];

export function getChallengeBySlug(slug: string): DesignChallenge | undefined {
  return designChallenges.find((c) => c.slug === slug);
}
