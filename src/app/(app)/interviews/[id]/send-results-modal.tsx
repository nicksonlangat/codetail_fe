"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { X, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { previewResultsEmail, sendResultsEmail, type CandidateSession } from "@/lib/api/interviews";
import { InviteSentIllustration } from "@/components/brand/illustrations";

const SP = { type: "spring" as const, stiffness: 300, damping: 30 };

interface Props {
  session: CandidateSession;
  interviewId: string;
  onClose: () => void;
  onSent: () => void;
}

export function SendResultsModal({ session, interviewId, onClose, onSent }: Props) {
  const [message, setMessage] = useState("");
  const [debouncedMessage, setDebouncedMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedMessage(message), 400);
    return () => clearTimeout(t);
  }, [message]);

  const preview = useQuery({
    queryKey: ["results-email-preview", session.id, debouncedMessage],
    queryFn: () => previewResultsEmail(interviewId, session.id, debouncedMessage),
    placeholderData: (prev) => prev,
  });

  const send = useMutation({
    mutationFn: () => sendResultsEmail(interviewId, session.id, message),
    onSuccess: () => { setSent(true); onSent(); toast.success("Results sent"); },
    onError: () => toast.error("Failed to send results email"),
  });

  const displayName = session.candidate_name || session.candidate_email;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.96, opacity: 0, y: 8 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 8 }} transition={SP} onClick={e => e.stopPropagation()}
        className="bg-card border border-border/60 rounded-md w-full max-w-lg overflow-hidden">

        <div className="flex items-center justify-between px-5 h-12 border-b border-border/50">
          <p className="text-[13px] font-semibold">Send Results</p>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {sent ? (
          <div className="p-8 space-y-4 text-center">
            <div className="flex justify-center"><InviteSentIllustration size={56} /></div>
            <p className="text-[12px] text-foreground/80">
              Results sent to <span className="font-semibold text-foreground">{session.candidate_email}</span>
            </p>
            <button onClick={onClose} className="w-full flex items-center justify-center text-[12px] font-semibold py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-all duration-500">
              Done
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <p className="text-[12px] text-muted-foreground">
              Sending <span className="font-medium text-foreground">{displayName}</span>&apos;s results to{" "}
              <span className="font-mono text-foreground/80">{session.candidate_email}</span>.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">Personal note (optional)</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Add a short note for the candidate…"
                rows={2}
                maxLength={1000}
                className="w-full text-[13px] bg-background border border-border/60 rounded-md px-3 py-2 placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-500 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-medium text-muted-foreground">Preview</p>
              <div className="rounded-md border border-border/60 overflow-hidden">
                <div className="px-3 py-2 border-b border-border/40 bg-muted/50 flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground truncate block flex-1">
                    {preview.data?.subject ?? "Loading subject…"}
                  </span>
                  {preview.isFetching && !preview.isLoading && (
                    <Loader2 className="w-3 h-3 shrink-0 animate-spin text-muted-foreground/40" />
                  )}
                </div>
                <div className="h-72 bg-white relative">
                  {preview.isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground/40" />
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: preview.isFetching ? 0.5 : 1 }}
                      transition={{ duration: 0.25 }}
                      className="w-full h-full"
                    >
                      <iframe
                        title="Email preview"
                        srcDoc={preview.data?.html ?? ""}
                        className="w-full h-full"
                        sandbox=""
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <motion.button whileTap={{ scale: 0.97 }} onClick={() => send.mutate()}
              disabled={send.isPending}
              className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold py-2.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-500">
              {send.isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…</> : <><Send className="w-3.5 h-3.5" /> Send Results</>}
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
