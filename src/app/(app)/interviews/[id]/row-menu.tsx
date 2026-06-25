"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Trash2, Mail } from "lucide-react";

const MENU_WIDTH = 208; // w-52

export function formatRelative(d: Date) {
  const h = Math.floor((Date.now() - d.getTime()) / 3_600_000);
  if (h < 1)  return "just now";
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface Props {
  canSendResults: boolean;
  sentAt: string | null;
  removing: boolean;
  onRemove: () => void;
  onSendResults: () => void;
}

export function RowMenu({ canSendResults, sentAt, removing, onRemove, onSendResults }: Props) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const rect = triggerRef.current!.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.right - MENU_WIDTH });

    const close = () => { setOpen(false); setConfirming(false); };
    const onMouseDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!triggerRef.current?.contains(t) && !menuRef.current?.contains(t)) close();
    };
    document.addEventListener("mousedown", onMouseDown);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <>
      <button ref={triggerRef} onClick={() => setOpen(!open)}
        className={`p-1 rounded cursor-pointer transition-all duration-200 ${open ? "bg-secondary text-foreground" : "text-muted-foreground/30 hover:bg-secondary hover:text-muted-foreground"}`}>
        <MoreHorizontal className="size-4" />
      </button>
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && pos && (
            <motion.div ref={menuRef} initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }} transition={{ duration: 0.12 }}
              style={{ top: pos.top, left: pos.left, width: MENU_WIDTH }}
              className="fixed z-50 rounded-md bg-card border border-border shadow-lg shadow-black/20 p-1">
              {confirming ? (
                <div className="p-2 space-y-2">
                  <p className="text-[11px] text-muted-foreground leading-relaxed px-0.5">
                    Remove this candidate? This can&apos;t be undone.
                  </p>
                  <div className="flex gap-1.5">
                    <button onClick={() => setConfirming(false)}
                      className="flex-1 text-[11px] font-medium py-1.5 rounded text-muted-foreground hover:bg-secondary cursor-pointer transition-colors duration-150">
                      Cancel
                    </button>
                    <button onClick={onRemove} disabled={removing}
                      className="flex-1 text-[11px] font-semibold py-1.5 rounded bg-destructive text-white hover:bg-destructive/90 disabled:opacity-50 cursor-pointer transition-colors duration-150">
                      {removing ? "Removing…" : "Remove"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => { if (canSendResults) { onSendResults(); setOpen(false); } }}
                    disabled={!canSendResults}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] font-medium text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors duration-150"
                  >
                    <Mail className="size-3.5 shrink-0" />
                    <span className="flex-1 text-left">{sentAt ? "Resend Results" : "Send Results"}</span>
                  </button>
                  {sentAt && (
                    <p className="px-2.5 pb-1.5 text-[10px] text-muted-foreground/50">Sent {formatRelative(new Date(sentAt))}</p>
                  )}
                  <div className="h-px bg-border/50 my-1" />
                  <button onClick={() => setConfirming(true)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] font-medium text-destructive hover:bg-destructive/10 cursor-pointer transition-colors duration-150">
                    <Trash2 className="size-3.5" /> Remove
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
