"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SignInPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-[420px] px-6">
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-[10px] bg-primary flex items-center justify-center">
          <Code2 className="w-4.5 h-4.5 text-primary-foreground" />
        </div>
        <span className="text-xl font-semibold tracking-tight">codetail</span>
      </div>

      <Card>
        <CardHeader className="text-center space-y-1 pb-4">
          <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Mock auth — click below to continue
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4 space-y-1">
            <p className="text-sm font-medium">Alex Chen</p>
            <p className="text-xs text-muted-foreground">alex@codetail.dev</p>
          </div>

          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full h-10 font-medium text-sm gap-2 group"
          >
            Continue to Dashboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
