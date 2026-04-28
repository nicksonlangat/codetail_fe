"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, AlertTriangle, CheckCircle } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

const SERVER_CAPACITY = 100; // RPS per server
const BASE_LATENCY_MS = 10;  // ideal response time at low load

function computeResponseTime(loadPerServer: number): number {
  const utilization = Math.min(loadPerServer / SERVER_CAPACITY, 0.99);
  return BASE_LATENCY_MS / (1 - utilization);
}

function LoadBar({ utilization, overloaded }: { utilization: number; overloaded: boolean }) {
  const pct = Math.min(utilization * 100, 100);
  const color = overloaded
    ? "bg-red-500"
    : utilization > 0.7
    ? "bg-orange-400"
    : "bg-primary";

  return (
    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
      <motion.div
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`h-full rounded-full ${color} transition-colors duration-300`}
      />
    </div>
  );
}

function ServerCard({
  index,
  load,
  capacity,
}: {
  index: number;
  load: number;
  capacity: number;
}) {
  const utilization = load / capacity;
  const overloaded = utilization >= 1;
  const responseMs = overloaded ? null : computeResponseTime(load);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={spring}
      className={`p-3 rounded-xl border transition-all duration-300 ${
        overloaded
          ? "border-red-500/40 bg-red-500/5"
          : utilization > 0.7
          ? "border-orange-400/40 bg-orange-400/5"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🖥️</span>
          <span className="text-[11px] font-semibold text-foreground">Server {index + 1}</span>
        </div>
        {overloaded ? (
          <span className="flex items-center gap-1 text-[9px] text-red-500 font-medium">
            <AlertTriangle className="w-2.5 h-2.5" /> OVERLOADED
          </span>
        ) : (
          <span className="text-[9px] font-mono text-muted-foreground">
            {responseMs !== null ? `${responseMs.toFixed(0)}ms` : "—"}
          </span>
        )}
      </div>
      <LoadBar utilization={utilization} overloaded={overloaded} />
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[9px] text-muted-foreground">{Math.round(load)} RPS</span>
        <span className="text-[9px] text-muted-foreground">{Math.round(utilization * 100)}% load</span>
      </div>
    </motion.div>
  );
}

export function ScalabilitySimulator() {
  const [rps, setRps] = useState(80);
  const [serverCount, setServerCount] = useState(1);

  const loadPerServer = rps / serverCount;
  const totalCapacity = serverCount * SERVER_CAPACITY;
  const overloaded = loadPerServer >= SERVER_CAPACITY;
  const utilization = loadPerServer / SERVER_CAPACITY;
  const avgResponseMs = overloaded ? null : computeResponseTime(loadPerServer);

  const addServer = () => setServerCount((c) => Math.min(c + 1, 6));
  const removeServer = () => setServerCount((c) => Math.max(c - 1, 1));

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5 not-prose">
      <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60 block">
        Scalability Simulator
      </span>

      {/* Traffic control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-medium text-foreground">
            Incoming traffic
          </label>
          <span className="text-[12px] font-mono font-semibold text-foreground tabular-nums">
            {rps} <span className="text-muted-foreground font-normal">RPS</span>
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={500}
          step={5}
          value={rps}
          onChange={(e) => setRps(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
        <div className="flex justify-between text-[9px] text-muted-foreground">
          <span>0 RPS</span>
          <span>500 RPS</span>
        </div>
      </div>

      {/* Status bar */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-medium transition-all duration-300 ${
        overloaded
          ? "bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400"
          : utilization > 0.7
          ? "bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400"
          : "bg-primary/5 border border-primary/20 text-primary"
      }`}>
        {overloaded ? (
          <><AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> System overloaded — requests queuing up, users seeing errors</>
        ) : utilization > 0.7 ? (
          <><AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> High load — response times degrading (add capacity soon)</>
        ) : (
          <><CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> Healthy — {avgResponseMs?.toFixed(0)}ms avg response, {Math.round(utilization * 100)}% capacity used</>
        )}
      </div>

      {/* Server grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-medium text-foreground">
            {serverCount} server{serverCount !== 1 ? "s" : ""} · {totalCapacity} RPS capacity
          </span>
          <div className="flex items-center gap-1.5">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={removeServer}
              disabled={serverCount <= 1}
              className="p-1 rounded-md border border-border hover:bg-secondary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Minus className="w-3 h-3" />
            </motion.button>
            <span className="text-[10px] font-mono text-muted-foreground w-4 text-center">{serverCount}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={addServer}
              disabled={serverCount >= 6}
              className="p-1 rounded-md border border-border hover:bg-secondary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-3 h-3" />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <AnimatePresence>
            {Array.from({ length: serverCount }).map((_, i) => (
              <ServerCard
                key={i}
                index={i}
                load={loadPerServer}
                capacity={SERVER_CAPACITY}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Insight */}
      <div className="border-t border-border pt-4 space-y-1.5">
        <p className="text-[10px] text-muted-foreground">
          <span className="font-medium text-foreground">Queueing theory:</span>{" "}
          At 50% utilization, response time ≈ 2× base. At 90%, it's 10×. At 99%, ∞ — the queue never drains.
        </p>
        <p className="text-[10px] text-muted-foreground">
          Try pushing to 120 RPS on 1 server, then add servers to watch the response time recover.
        </p>
      </div>
    </div>
  );
}
