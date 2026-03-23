"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Code2, Mail } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="w-full max-w-[420px] px-6">
      {/* Branding */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-[10px] bg-primary flex items-center justify-center">
          <Code2 className="w-4.5 h-4.5 text-primary-foreground" />
        </div>
        <span className="text-xl font-semibold tracking-tight">codetail</span>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <Link
            href="/signin"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>

          {!submitted ? (
            <div className="space-y-1">
              <h1 className="text-xl font-semibold tracking-tight">Reset your password</h1>
              <p className="text-sm text-muted-foreground">
                Enter the email associated with your account and we&apos;ll send a reset link.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-semibold tracking-tight">Check your email</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We sent a password reset link to{" "}
                  <span className="text-foreground font-medium">{email}</span>.
                </p>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10"
                  required
                />
              </div>

              <Button type="submit" className="w-full h-10 font-medium text-sm gap-2 group">
                Send reset link
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </form>
          ) : (
            <div className="space-y-3">
              <Link href="/reset-password" className={cn(buttonVariants(), "w-full h-10 font-medium text-sm gap-2 group")}>
                  Continue to reset
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Button
                variant="ghost"
                className="w-full h-10 text-sm text-muted-foreground"
                onClick={() => setSubmitted(false)}
              >
                Try a different email
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Didn&apos;t receive it? Check your spam folder.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
