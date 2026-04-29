"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "cp" | "ap";

type LogEntry = { id: number; text: string; kind: "ok" | "err" | "warn" | "sync" | "info" };

let _id = 0;

export function PartitionSimulator() {
  const [mode, setMode] = useState<Mode>("cp");
  const [partitioned, setPartitioned] = useState(false);
  const [nodeA, setNodeA] = useState(1);
  const [nodeB, setNodeB] = useState(1);
  const [log, setLog] = useState<LogEntry[]>([]);

  const diverged = nodeA !== nodeB;

  function push(text: string, kind: LogEntry["kind"]) {
    setLog(prev => [{ id: _id++, text, kind }, ...prev].slice(0, 7));
  }

  function doWrite() {
    const next = nodeA + 1;
    if (!partitioned) {
      setNodeA(next);
      setNodeB(next);
      push(`WRITE  x: ${nodeA} → ${next}  both nodes updated`, "ok");
    } else if (mode === "cp") {
      push(`ERROR  Write rejected — cannot confirm quorum (Node B unreachable)`, "err");
    } else {
      setNodeA(next);
      push(`WRITE  x: ${nodeA} → ${next}  Node A accepted`, "warn");
      push(`WARN   Node B still has x=${nodeB}  nodes have diverged`, "warn");
    }
  }

  function togglePartition() {
    if (partitioned) {
      if (diverged) {
        push(`HEAL   Network restored — running reconciliation...`, "sync");
        push(`SYNC   Node B: ${nodeB} → ${nodeA}  (last-write-wins)`, "sync");
        setNodeB(nodeA);
      } else {
        push(`HEAL   Network restored — nodes were consistent, nothing to reconcile`, "sync");
      }
      setPartitioned(false);
    } else {
      setPartitioned(true);
      push(`PART   Network severed — ${mode.toUpperCase()} mode now active`, "info");
    }
  }

  function reset() {
    setPartitioned(false);
    setNodeA(1);
    setNodeB(1);
    setLog([]);
  }

  const nodeStyle = (val: number, other: number) => {
    if (!partitioned || val === other) return "border-border bg-card";
    return "border-orange-400/40 bg-orange-400/5";
  };

  const statusLabel = !partitioned
    ? "Connected"
    : diverged
    ? "Partitioned — DIVERGED"
    : "Partitioned";

  const statusColor = !partitioned
    ? "bg-primary/10 text-primary"
    : diverged
    ? "bg-destructive/10 text-destructive"
    : "bg-orange-400/10 text-orange-500";

  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-8 not-prose space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          Network Partition Simulator
        </span>
        <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {(["cp", "ap"] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => { if (!partitioned) setMode(m); }}
            disabled={partitioned}
            className={`px-4 py-1 rounded-md text-[10px] font-semibold transition-all duration-500 cursor-pointer disabled:cursor-not-allowed ${
              mode === m
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground disabled:opacity-40"
            }`}
          >
            {m === "cp" ? "CP mode" : "AP mode"}
          </button>
        ))}
      </div>

      {/* Nodes */}
      <div className="flex items-center gap-3">
        <motion.div
          layout
          className={`flex-1 p-4 rounded-xl border-2 text-center transition-all duration-300 ${nodeStyle(nodeA, nodeB)}`}
        >
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-1">Node A</p>
          <motion.p
            key={nodeA}
            initial={{ scale: 1.4, color: "hsl(164 70% 40%)" }}
            animate={{ scale: 1, color: "currentColor" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-[30px] font-black font-mono leading-none"
          >
            {nodeA}
          </motion.p>
          <p className="text-[9px] text-muted-foreground/60 font-mono mt-1">x = {nodeA}</p>
        </motion.div>

        {/* Link */}
        <div className="flex flex-col items-center gap-1.5 w-16 flex-shrink-0">
          <div className={`w-full transition-all duration-500 ${
            partitioned
              ? "border-t-2 border-dashed border-destructive/50"
              : "h-0.5 bg-primary/40 rounded"
          }`} />
          <span className={`text-[8px] font-semibold tracking-wider ${
            partitioned ? "text-destructive" : "text-primary"
          }`}>
            {partitioned ? "SEVERED" : "linked"}
          </span>
        </div>

        <motion.div
          layout
          className={`flex-1 p-4 rounded-xl border-2 text-center transition-all duration-300 ${nodeStyle(nodeB, nodeA)}`}
        >
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-1">Node B</p>
          <motion.p
            key={nodeB}
            initial={{ scale: 1.4, color: "hsl(164 70% 40%)" }}
            animate={{ scale: 1, color: "currentColor" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-[30px] font-black font-mono leading-none"
          >
            {nodeB}
          </motion.p>
          <p className="text-[9px] text-muted-foreground/60 font-mono mt-1">x = {nodeB}</p>
        </motion.div>
      </div>

      {/* Mode explanation during partition */}
      <AnimatePresence>
        {partitioned && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`px-3 py-2.5 rounded-xl border text-[11px] leading-relaxed ${
              mode === "cp"
                ? "border-primary/30 bg-primary/5 text-primary"
                : "border-orange-400/30 bg-orange-400/5 text-orange-500"
            }`}
          >
            {mode === "cp"
              ? "CP: writes are rejected until the partition heals. Reads return consistent data."
              : "AP: writes succeed on Node A immediately. Node B serves stale data until the link heals."}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log */}
      <div className="bg-muted rounded-xl p-3 min-h-[72px] space-y-1">
        <AnimatePresence initial={false}>
          {log.length === 0 ? (
            <p className="text-[9px] text-muted-foreground/50 italic font-mono">
              Try writing a value, then partition the network...
            </p>
          ) : (
            log.map(e => (
              <motion.p
                key={e.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-[9px] font-mono ${
                  e.kind === "ok" ? "text-primary"
                  : e.kind === "err" ? "text-destructive"
                  : e.kind === "warn" ? "text-orange-500"
                  : e.kind === "sync" ? "text-blue-500"
                  : "text-muted-foreground"
                }`}
              >
                {e.text}
              </motion.p>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={doWrite}
          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-medium cursor-pointer hover:bg-primary/90 transition-all duration-500"
        >
          Write x = {nodeA + 1}
        </motion.button>
        <button
          onClick={togglePartition}
          className={`px-3 py-1.5 rounded-lg border text-[11px] font-medium cursor-pointer transition-all duration-500 ${
            partitioned
              ? "border-primary/30 text-primary hover:bg-primary/5"
              : "border-destructive/30 text-destructive hover:bg-destructive/5"
          }`}
        >
          {partitioned ? "Heal network" : "Partition network"}
        </button>
        <button
          onClick={reset}
          className="px-3 py-1.5 rounded-lg border border-border text-[11px] text-muted-foreground font-medium cursor-pointer hover:bg-muted/50 transition-all duration-500"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
