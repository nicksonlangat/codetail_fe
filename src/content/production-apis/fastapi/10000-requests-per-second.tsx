export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "stateless", title: "Making the App Stateless" },
  { id: "rate-limiting", title: "Per-User Rate Limiting" },
  { id: "background-jobs", title: "Background Job Queue" },
  { id: "read-replicas", title: "Read Replicas" },
  { id: "load-shedding", title: "Load Shedding" },
  { id: "architecture", title: "The Final Architecture" },
  { id: "summary", title: "Summary" },
];

export default function TenKRpsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article is coming soon.
        </p>
      </section>
    </div>
  );
}
