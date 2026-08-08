"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CBState = "closed" | "open" | "half-open";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

const FAILURE_THRESHOLD = 5;
const OPEN_TIMEOUT_MS = 7000;

type LogEntry = { id: number; status: "success" | "failure" | "rejected" | "probe"; detail: string };
let logId = 0;

const STATE_META: Record<CBState, { label: string; color: string; bg: string; border: string; desc: string }> = {
  closed: { label: "CLOSED", color: "text-brand-primary", bg: "bg-brand-primary/10", border: "border-brand-primary/30", desc: "Requests pass through normally. Failures tracked." },
  open: { label: "OPEN", color: "text-brand-destructive", bg: "bg-brand-destructive/10", border: "border-brand-destructive/30", desc: "All requests rejected immediately. Service recovering." },
  "half-open": { label: "HALF-OPEN", color: "text-brand-warning", bg: "bg-brand-warning/10", border: "border-brand-warning/30", desc: "One probe allowed. Success resets; failure re-opens." },
};

export function CircuitBreakerSimulator() {
  const [cbState, setCBState] = useState<CBState>("closed");
  const [failureCount, setFailureCount] = useState(0);
  const [serviceHealthy, setServiceHealthy] = useState(true);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [openCountdown, setOpenCountdown] = useState(0);
  const [probeInFlight, setProbeInFlight] = useState(false);
  const stateRef = useRef<CBState>("closed");
  const failureRef = useRef(0);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const openAt = useRef<number>(0);

  const pushLog = useCallback((status: LogEntry["status"], detail: string) => {
    logId += 1;
    setLog((prev) => [...prev.slice(-20), { id: logId, status, detail }]);
  }, []);

  const startOpenTimer = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    openAt.current = Date.now();
    setOpenCountdown(OPEN_TIMEOUT_MS / 1000);
    countdownInterval.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((OPEN_TIMEOUT_MS - (Date.now() - openAt.current)) / 1000));
      setOpenCountdown(remaining);
    }, 200);
    openTimer.current = setTimeout(() => {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
      setOpenCountdown(0);
      stateRef.current = "half-open";
      setCBState("half-open");
      pushLog("probe", "Timeout elapsed, transitioning to HALF-OPEN, sending probe");
    }, OPEN_TIMEOUT_MS);
  }, [pushLog]);

  const reset = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    stateRef.current = "closed";
    failureRef.current = 0;
    setCBState("closed");
    setFailureCount(0);
    setOpenCountdown(0);
    setProbeInFlight(false);
    setLog([]);
    logId = 0;
  }, []);

  useEffect(
    () => () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    },
    []
  );

  const call = useCallback(() => {
    const state = stateRef.current;

    if (state === "open") {
      pushLog("rejected", "Circuit OPEN, request rejected immediately (fail-fast)");
      return;
    }

    if (state === "half-open") {
      if (probeInFlight) return;
      setProbeInFlight(true);
      setTimeout(() => {
        if (serviceHealthy) {
          stateRef.current = "closed";
          failureRef.current = 0;
          setCBState("closed");
          setFailureCount(0);
          setProbeInFlight(false);
          pushLog("success", "Probe succeeded, circuit CLOSED, normal operation resumed");
        } else {
          stateRef.current = "open";
          setCBState("open");
          setProbeInFlight(false);
          pushLog("failure", "Probe failed, circuit re-opened, resetting timeout");
          startOpenTimer();
        }
      }, 600);
      pushLog("probe", "Half-open probe sent to service...");
      return;
    }

    if (serviceHealthy) {
      pushLog("success", `Request succeeded (${failureRef.current} consecutive failures)`);
      if (failureRef.current > 0) {
        failureRef.current = 0;
        setFailureCount(0);
      }
    } else {
      failureRef.current += 1;
      setFailureCount(failureRef.current);
      if (failureRef.current >= FAILURE_THRESHOLD) {
        stateRef.current = "open";
        setCBState("open");
        pushLog("failure", `Failure ${failureRef.current}/${FAILURE_THRESHOLD}, threshold reached, circuit OPENED`);
        startOpenTimer();
      } else {
        pushLog("failure", `Failure ${failureRef.current}/${FAILURE_THRESHOLD}, circuit still closed`);
      }
    }
  }, [serviceHealthy, probeInFlight, pushLog, startOpenTimer]);

  const meta = STATE_META[cbState];

  return (
    <div className="bg-white border border-brand-border rounded-xl overflow-hidden mb-8 not-prose">
      <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border bg-brand-surface/30">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Circuit Breaker State Machine
        </span>
        <button onClick={reset} className="text-[9px] text-brand-text-muted hover:text-brand-text transition-all duration-500 cursor-pointer outline-none">
          reset
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={cbState}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={SPRING}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${meta.bg} ${meta.border}`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${meta.color.replace("text-", "bg-")}`} />
              <span className={`text-[11px] font-mono font-bold ${meta.color}`}>{meta.label}</span>
            </motion.div>
          </AnimatePresence>
          <p className="text-[10px] text-brand-text-muted flex-1">{meta.desc}</p>
        </div>

        <div className="flex items-center justify-between px-2 py-3 bg-brand-surface/20 rounded-xl border border-brand-border/50">
          {(["closed", "open", "half-open"] as CBState[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  animate={{
                    scale: cbState === s ? 1.1 : 1,
                    opacity: cbState === s ? 1 : 0.4,
                  }}
                  transition={SPRING}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${STATE_META[s].bg} ${STATE_META[s].border}`}
                >
                  <span className={`text-[7px] font-mono font-bold text-center leading-tight ${STATE_META[s].color}`}>
                    {s.replace("-", "-\n")}
                  </span>
                </motion.div>
              </div>
              {i < 2 && <div className="w-8 h-px bg-brand-border/60 mx-1" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 text-[10px]">
          <div className="bg-brand-surface/30 rounded-xl p-2.5 text-center">
            <p className="text-brand-text-muted mb-0.5">Failures</p>
            <motion.p
              key={failureCount}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={SPRING}
              className={`font-mono font-bold text-[14px] ${
                failureCount >= FAILURE_THRESHOLD ? "text-brand-destructive" : failureCount > 0 ? "text-brand-warning" : "text-brand-primary"
              }`}
            >
              {failureCount} / {FAILURE_THRESHOLD}
            </motion.p>
          </div>
          <div className="bg-brand-surface/30 rounded-xl p-2.5 text-center">
            <p className="text-brand-text-muted mb-0.5">Reopen in</p>
            <p className={`font-mono font-bold text-[14px] ${openCountdown > 0 ? "text-brand-warning" : "text-brand-text-subtle"}`}>
              {openCountdown > 0 ? `${openCountdown}s` : "—"}
            </p>
          </div>
          <div className="bg-brand-surface/30 rounded-xl p-2.5 text-center">
            <p className="text-brand-text-muted mb-0.5">Service</p>
            <button
              onClick={() => setServiceHealthy((h) => !h)}
              className={`font-mono font-bold text-[11px] cursor-pointer outline-none transition-all duration-500 ${serviceHealthy ? "text-brand-primary" : "text-brand-destructive"}`}
            >
              {serviceHealthy ? "healthy" : "down"}
            </button>
          </div>
        </div>
        <p className="text-[9px] text-brand-text-subtle text-center -mt-2">Click &quot;down/healthy&quot; above to toggle service state</p>

        <motion.button
          onClick={call}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={SPRING}
          className={`w-full py-2.5 rounded-xl text-[11px] font-semibold cursor-pointer outline-none transition-all duration-500 ${
            cbState === "open" ? "bg-brand-destructive/10 text-brand-destructive border border-brand-destructive/20" : "bg-brand-primary text-white"
          }`}
        >
          {cbState === "open" ? "Call Service (will be rejected)" : cbState === "half-open" ? "Send Probe" : "Call Service"}
        </motion.button>
      </div>

      {log.length > 0 && (
        <div className="border-t border-brand-border bg-brand-surface/10 max-h-32 overflow-y-auto px-4 py-2 space-y-0.5">
          <AnimatePresence initial={false}>
            {[...log].reverse().map((entry) => (
              <motion.p
                key={entry.id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-[9px] font-mono ${
                  entry.status === "success"
                    ? "text-brand-primary"
                    : entry.status === "failure"
                    ? "text-brand-destructive"
                    : entry.status === "rejected"
                    ? "text-brand-warning"
                    : "text-brand-chart-2"
                }`}
              >
                [{entry.status}] {entry.detail}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
