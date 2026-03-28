"use client";

import Link from "next/link";
import { CTLogo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 px-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CTLogo size={32} variant="primary" />
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
