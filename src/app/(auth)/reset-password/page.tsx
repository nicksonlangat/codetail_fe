"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Code2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabels = ["", "Weak", "Good", "Strong"];
  const strengthColors = ["", "bg-destructive", "bg-amber-500", "bg-emerald-500"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordsMatch && passwordStrength >= 2) {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="w-full max-w-[420px] px-6">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-[10px] bg-primary flex items-center justify-center">
            <Code2 className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold tracking-tight">codetail</span>
        </div>

        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-semibold tracking-tight">Password reset!</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
            </div>

            <Link href="/signin" className={cn(buttonVariants(), "w-full h-10 font-medium text-sm gap-2 group")}>
                Back to sign in
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            href="/forgot-password"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>

          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">Set new password</h1>
            <p className="text-sm text-muted-foreground">
              Choose a strong password to secure your account.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength ? strengthColors[passwordStrength] : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{strengthLabels[passwordStrength]}</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-[10px] text-destructive mt-1">Passwords don&apos;t match</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10 font-medium text-sm gap-2 group mt-2"
              disabled={!passwordsMatch || passwordStrength < 2}
            >
              Reset password
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
