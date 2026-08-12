"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { connectGitHub } from "@/lib/api/github";

type State = "connecting" | "success" | "error";

export default function GitHubCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const ran = useRef(false);
  const [state, setState] = useState<State>("connecting");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const installationId = params.get("installation_id");
    if (!installationId) {
      setError("No installation ID returned from GitHub.");
      setState("error");
      return;
    }

    connectGitHub(installationId)
      .then(() => {
        setState("success");
        setTimeout(() => router.replace("/resume"), 1200);
      })
      .catch((err) => {
        const detail = (err?.response?.data as { detail?: string } | undefined)?.detail;
        setError(detail ?? "Failed to connect GitHub.");
        setState("error");
      });
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm px-6">
        {state === "connecting" && (
          <>
            <svg className="animate-spin h-8 w-8 text-brand-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-brand-text font-medium">Connecting GitHub...</p>
          </>
        )}

        {state === "success" && (
          <>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-brand-text font-medium">GitHub connected! Redirecting...</p>
          </>
        )}

        {state === "error" && (
          <>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-brand-text font-medium">Something went wrong</p>
            <p className="text-brand-text-muted text-sm">{error}</p>
            <button
              onClick={() => router.replace("/resume")}
              className="mt-2 text-sm text-brand-primary hover:underline cursor-pointer"
            >
              Back to resume
            </button>
          </>
        )}
      </div>
    </div>
  );
}
