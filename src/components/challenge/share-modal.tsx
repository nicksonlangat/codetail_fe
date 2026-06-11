"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Share2, X, Copy, Check, Link, Trash2, Lock, Globe, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  createShare,
  listShares,
  revokeShare,
  type ShareResponse,
} from "@/lib/api/share";
import { DatePicker } from "@/components/ui/date-picker";

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

interface ShareModalProps {
  problemId: string;
}

function shareUrl(token: string) {
  return `https://codetail.cc/share/${token}`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500"
    >
      {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function ShareModal({ problemId }: ShareModalProps) {
  const [open, setOpen] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [emailsInput, setEmailsInput] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [neverExpires, setNeverExpires] = useState(false);
  const queryClient = useQueryClient();

  const { data: shares = [] } = useQuery({
    queryKey: ["shares", problemId],
    queryFn: () => listShares(problemId),
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createShare(problemId, {
        visibility,
        allowed_emails: visibility === "private"
          ? emailsInput.split(",").map((e) => e.trim()).filter(Boolean)
          : [],
        expires_at: neverExpires || !expiryDate ? null : expiryDate.toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shares", problemId] });
      setEmailsInput("");
      setExpiryDate(null);
      setNeverExpires(true);
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (token: string) => revokeShare(token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shares", problemId] }),
  });

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={spring}
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-md ring-1 ring-border/60 hover:bg-secondary cursor-pointer transition-all duration-500"
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </motion.button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="relative w-full max-w-[420px] mx-4 rounded-2xl border border-border bg-card"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={spring}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-all duration-500 z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Share2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-semibold tracking-tight">Share Challenge</h2>
                    <p className="text-[11px] text-muted-foreground">Anyone with the link can solve and comment</p>
                  </div>
                </div>

                {/* Visibility toggle */}
                <div className="flex items-center gap-1.5 p-1 bg-muted rounded-lg mb-4">
                  {(["public", "private"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setVisibility(v)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium cursor-pointer transition-all duration-500 ${
                        visibility === v
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {v === "public" ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Private: allowed emails */}
                <AnimatePresence>
                  {visibility === "private" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mb-3 overflow-hidden"
                    >
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1.5">
                        Allowed emails (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={emailsInput}
                        onChange={(e) => setEmailsInput(e.target.value)}
                        placeholder="alice@example.com, bob@example.com"
                        className="w-full text-[12px] px-3 py-2 rounded-lg bg-muted border border-border/60 text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-500"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expiry */}
                <div className="mb-4">
                  <div className={`transition-opacity duration-300 mb-2 ${neverExpires ? "opacity-40 pointer-events-none" : ""}`}>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1.5">
                      Expires
                    </label>
                    <DatePicker
                      value={expiryDate}
                      onChange={setExpiryDate}
                      placeholder="Pick an expiry date"
                      minDate={new Date()}
                    />
                  </div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-[12px] text-muted-foreground">Never expires</span>
                    <Switch
                      checked={neverExpires}
                      onCheckedChange={(v) => { setNeverExpires(v); if (v) setExpiryDate(null); }}
                      size="sm"
                    />
                  </label>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={spring}
                  onClick={() => createMutation.mutate()}
                  disabled={createMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:bg-primary/90 disabled:opacity-50 cursor-pointer transition-colors duration-100"
                >
                  {createMutation.isPending ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                  ) : (
                    <><Link className="w-3.5 h-3.5" /> Generate Link</>
                  )}
                </motion.button>
              </div>

              {/* Existing shares */}
              {shares.length > 0 && (
                <div className="px-6 pb-5 space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-2">
                    Active Links
                  </p>
                  {shares.map((share: ShareResponse) => (
                    <div
                      key={share.token}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/50 border border-border/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-mono text-foreground truncate">{shareUrl(share.token)}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            share.visibility === "public"
                              ? "bg-primary/10 text-primary"
                              : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                          }`}>
                            {share.visibility}
                          </span>
                          {share.expires_at && (
                            <span className="text-[9px] text-muted-foreground/50 font-mono">
                              exp {new Date(share.expires_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <CopyButton text={shareUrl(share.token)} />
                      <button
                        onClick={() => revokeMutation.mutate(share.token)}
                        disabled={revokeMutation.isPending}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-all duration-500 disabled:opacity-40"
                        title="Revoke"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
