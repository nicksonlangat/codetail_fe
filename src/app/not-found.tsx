"use client";

import Link from "next/link";
import { Code2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 px-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-[10px] bg-primary flex items-center justify-center">
            <Code2 className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold tracking-tight">codetail</span>
        </div>

        <div>
          <h1 className="text-6xl font-bold text-foreground tabular-nums">404</h1>
          <p className="text-lg text-muted-foreground mt-2">Page not found</p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <Link href="/dashboard" className={buttonVariants()}>Back to dashboard</Link>
      </div>
    </div>
  );
}
