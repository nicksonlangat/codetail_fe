import { BlogTopBar } from "@/components/blog/layout/blog-top-bar";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <BlogTopBar />
      {children}
    </div>
  );
}
