"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Algorithm = "token-bucket" | "fixed-window" | "sliding-window";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

const CAPACITY = 8;
const REFILL_RATE = 1; // tokens/sec
const WINDOW_MS = 12000; // 12 second window
const WINDOW_LIMIT = 6; // requests per window

type LogEntry = { id: number; allowed: boolean; detail: string };
let logSeq = 0;

export function RateLimiterSimulator() {
  const [algo, setAlgo] = useState<Algorithm>("token-bucket");

  const tokensRef = useRef<number>(CAPACITY);
  const lastRefillRef = useRef<number>(Date.now());
  const [tokenDisplay, setTokenDisplay] = useState(CAPACITY);

  const fixedCountRef = useRef(0);
  const fixedWindowStartRef = useRef(Date.now());
  const [fixedDisplay, setFixedDisplay] = useState({ count: 0, windowPct: 0 });

  const slidingTimestamps = useRef<number[]>([]);
  const [slidingDisplay, setSlidingDisplay] = useState<number[]>([]);

  const [log, setLog] = useState<LogEntry[]>([]);
  const [lastResult, setLastResult] = useState<"allowed" | "rejected" | null>(null);

  const pushLog = (allowed: boolean, detail: string) => {
    logSeq += 1;
    setLog((prev) => [...prev.slice(-12), { id: logSeq, allowed, detail }]);
    setLastResult(allowed ? "allowed" : "rejected");
    setTimeout(() => setLastResult(null), 800);
  };

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();

      if (algo === "token-bucket") {
        const elapsed = (now - lastRefillRef.current) / 1000;
        const newTokens = Math.min(CAPACITY, tokensRef.current + elapsed * REFILL_RATE);
        tokensRef.current = newTokens;
        lastRefillRef.current = now;
        setTokenDisplay(Math.min(CAPACITY, Math.floor(newTokens)));
      }

      if (algo === "fixed-window") {
        if (now - fixedWindowStartRef.current >= WINDOW_MS) {
          fixedCountRef.current = 0;
          fixedWindowStartRef.current = now;
        }
        const pct = ((now - fixedWindowStartRef.current) / WINDOW_MS) * 100;
        setFixedDisplay({ count: fixedCountRef.current, windowPct: pct });
      }

      if (algo === "sliding-window") {
        slidingTimestamps.current = slidingTimestamps.current.filter((t) => now - t < WINDOW_MS);
        setSlidingDisplay([...slidingTimestamps.current]);
      }
    }, 200);
    return () => clearInterval(id);
  }, [algo]);

  const reset = useCallback(() => {
    tokensRef.current = CAPACITY;
    lastRefillRef.current = Date.now();
    setTokenDisplay(CAPACITY);
    fixedCountRef.current = 0;
    fixedWindowStartRef.current = Date.now();
    setFixedDisplay({ count: 0, windowPct: 0 });
    slidingTimestamps.current = [];
    setSlidingDisplay([]);
    setLog([]);
    setLastResult(null);
    logSeq = 0;
  }, []);

  const switchAlgo = (a: Algorithm) => {
    reset();
    setAlgo(a);
  };

  const sendRequest = () => {
    const now = Date.now();

    if (algo === "token-bucket") {
      const elapsed = (now - lastRefillRef.current) / 1000;
      tokensRef.current = Math.min(CAPACITY, tokensRef.current + elapsed * REFILL_RATE);
      lastRefillRef.current = now;
      if (tokensRef.current >= 1) {
        tokensRef.current -= 1;
        setTokenDisplay(Math.floor(tokensRef.current));
        pushLog(true, `Token consumed, ${Math.floor(tokensRef.current)}/${CAPACITY} remaining`);
      } else {
        pushLog(false, `Bucket empty, refills at ${REFILL_RATE}/sec, wait ${(1 / REFILL_RATE).toFixed(0)}s`);
      }
    }

    if (algo === "fixed-window") {
      if (now - fixedWindowStartRef.current >= WINDOW_MS) {
        fixedCountRef.current = 0;
        fixedWindowStartRef.current = now;
      }
      if (fixedCountRef.current < WINDOW_LIMIT) {
        fixedCountRef.current += 1;
        const pct = ((now - fixedWindowStartRef.current) / WINDOW_MS) * 100;
        setFixedDisplay({ count: fixedCountRef.current, windowPct: pct });
        const secsLeft = Math.ceil((WINDOW_MS - (now - fixedWindowStartRef.current)) / 1000);
        pushLog(true, `${fixedCountRef.current}/${WINDOW_LIMIT}, window resets in ${secsLeft}s`);
      } else {
        const secsLeft = Math.ceil((WINDOW_MS - (now - fixedWindowStartRef.current)) / 1000);
        pushLog(false, `Limit ${WINDOW_LIMIT} reached, window resets in ${secsLeft}s`);
      }
    }

    if (algo === "sliding-window") {
      slidingTimestamps.current = slidingTimestamps.current.filter((t) => now - t < WINDOW_MS);
      if (slidingTimestamps.current.length < WINDOW_LIMIT) {
        slidingTimestamps.current.push(now);
        setSlidingDisplay([...slidingTimestamps.current]);
        pushLog(true, `${slidingTimestamps.current.length}/${WINDOW_LIMIT} in last ${WINDOW_MS / 1000}s`);
      } else {
        const oldest = slidingTimestamps.current[0];
        const waitMs = WINDOW_MS - (now - oldest);
        pushLog(false, `${WINDOW_LIMIT} in last ${WINDOW_MS / 1000}s, wait ${Math.ceil(waitMs / 1000)}s`);
      }
    }
  };

  const ALGO_META: Record<Algorithm, { label: string; desc: string }> = {
    "token-bucket": {
      label: "Token Bucket",
      desc: `Bucket holds ${CAPACITY} tokens. Refills at ${REFILL_RATE}/sec. Each request costs 1 token. Burst up to capacity, then limited to refill rate.`,
    },
    "fixed-window": {
      label: "Fixed Window",
      desc: `${WINDOW_LIMIT} requests per ${WINDOW_MS / 1000}s window. Counter resets at window boundary. Simple but susceptible to boundary bursts.`,
    },
    "sliding-window": {
      label: "Sliding Window",
      desc: `${WINDOW_LIMIT} requests in any rolling ${WINDOW_MS / 1000}s period. Timestamps tracked and expired. No boundary burst vulnerability.`,
    },
  };

  const tokenPct = (tokenDisplay / CAPACITY) * 100;
  const now = Date.now();

  return (
    <div className="bg-white border border-brand-border rounded-xl overflow-hidden mb-8 not-prose">
      <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border bg-brand-surface/30">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Rate Limiter Algorithm Simulator
        </span>
        <button
          onClick={reset}
          className="text-[9px] text-brand-text-muted hover:text-brand-text transition-all duration-500 cursor-pointer outline-none"
        >
          reset
        </button>
      </div>

      <div className="flex border-b border-brand-border">
        {(Object.keys(ALGO_META) as Algorithm[]).map((a) => (
          <button
            key={a}
            onClick={() => switchAlgo(a)}
            className={`flex-1 py-2.5 text-[10px] font-semibold cursor-pointer outline-none transition-all duration-500 border-b-2 ${
              algo === a ? "text-brand-primary border-brand-primary bg-brand-surface/30" : "text-brand-text-muted border-transparent hover:bg-brand-surface/20"
            }`}
          >
            {ALGO_META[a].label}
          </button>
        ))}
      </div>

      <div className="px-4 py-2 bg-brand-surface/20 border-b border-brand-border/50">
        <p className="text-[10px] text-brand-text-muted">{ALGO_META[algo].desc}</p>
      </div>

      <div className="p-4 space-y-4">
        <AnimatePresence mode="wait">
          <motion.div key={algo} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={SPRING}>
            {algo === "token-bucket" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-brand-text-muted">Tokens in bucket</span>
                  <span className={`font-mono font-bold ${tokenDisplay === 0 ? "text-brand-destructive" : "text-brand-primary"}`}>
                    {tokenDisplay} / {CAPACITY}
                  </span>
                </div>
                <div className="h-5 bg-brand-surface rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${tokenDisplay === 0 ? "bg-brand-destructive/60" : "bg-brand-primary"}`}
                    animate={{ width: `${tokenPct}%` }}
                    transition={SPRING}
                  />
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {Array.from({ length: CAPACITY }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: i < tokenDisplay ? 1 : 0.6, opacity: i < tokenDisplay ? 1 : 0.2 }}
                      transition={SPRING}
                      className={`w-5 h-5 rounded-full ${i < tokenDisplay ? "bg-brand-primary" : "bg-brand-surface"}`}
                    />
                  ))}
                </div>
                <p className="text-[9px] text-brand-text-muted">
                  Refill rate: {REFILL_RATE} token/sec, burst capacity: {CAPACITY}
                </p>
              </div>
            )}

            {algo === "fixed-window" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-brand-text-muted">Requests this window</span>
                  <span className={`font-mono font-bold ${fixedDisplay.count >= WINDOW_LIMIT ? "text-brand-destructive" : "text-brand-primary"}`}>
                    {fixedDisplay.count} / {WINDOW_LIMIT}
                  </span>
                </div>
                <div className="h-3 bg-brand-surface rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full bg-brand-primary/40" animate={{ width: `${fixedDisplay.windowPct}%` }} transition={{ duration: 0.2 }} />
                </div>
                <p className="text-[9px] text-brand-text-muted">Window progress, resets every {WINDOW_MS / 1000}s</p>
                <div className="h-3 bg-brand-surface rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${fixedDisplay.count >= WINDOW_LIMIT ? "bg-brand-destructive/60" : "bg-brand-primary"}`}
                    animate={{ width: `${(fixedDisplay.count / WINDOW_LIMIT) * 100}%` }}
                    transition={SPRING}
                  />
                </div>
                <p className="text-[9px] text-brand-text-muted">Request quota used</p>
              </div>
            )}

            {algo === "sliding-window" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-brand-text-muted">Active in rolling window</span>
                  <span className={`font-mono font-bold ${slidingDisplay.length >= WINDOW_LIMIT ? "text-brand-destructive" : "text-brand-primary"}`}>
                    {slidingDisplay.length} / {WINDOW_LIMIT}
                  </span>
                </div>
                <div className="relative h-8 bg-brand-surface/40 rounded-xl overflow-hidden border border-brand-border/50">
                  <AnimatePresence>
                    {slidingDisplay.map((ts) => {
                      const age = now - ts;
                      const pct = Math.max(0, Math.min(100, ((WINDOW_MS - age) / WINDOW_MS) * 100));
                      return (
                        <motion.div
                          key={ts}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: pct / 100, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={SPRING}
                          style={{ left: `${100 - pct}%` }}
                          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-primary"
                        />
                      );
                    })}
                  </AnimatePresence>
                  <div className="absolute inset-0 flex items-center px-2">
                    <span className="text-[8px] text-brand-text-subtle">older</span>
                    <div className="flex-1" />
                    <span className="text-[8px] text-brand-text-subtle">now</span>
                  </div>
                </div>
                <p className="text-[9px] text-brand-text-muted">
                  Each dot = one request in the last {WINDOW_MS / 1000}s. Dots fade left as they age out.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={sendRequest}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING}
            className="flex-1 py-2.5 rounded-xl text-[11px] font-semibold bg-brand-primary text-white cursor-pointer outline-none transition-all duration-500"
          >
            Send Request
          </motion.button>
          <AnimatePresence>
            {lastResult && (
              <motion.span
                key={lastResult}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={SPRING}
                className={`text-[10px] font-mono font-bold px-2.5 py-1.5 rounded-lg ${
                  lastResult === "allowed" ? "text-brand-primary bg-brand-primary/10" : "text-brand-destructive bg-brand-destructive/10"
                }`}
              >
                {lastResult === "allowed" ? "200 OK" : "429 Too Many"}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {log.length > 0 && (
        <div className="border-t border-brand-border bg-brand-surface/10 max-h-28 overflow-y-auto px-4 py-2 space-y-0.5">
          <AnimatePresence initial={false}>
            {[...log].reverse().map((entry) => (
              <motion.p
                key={entry.id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-[9px] font-mono ${entry.allowed ? "text-brand-primary" : "text-brand-destructive"}`}
              >
                {entry.allowed ? "✓ allowed" : "✗ rejected"}, {entry.detail}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
