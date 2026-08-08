"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "queue" | "stream";

type Msg = {
  id: number;
  label: string;
  colorClass: string;
  consuming: boolean;
};

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

const MSG_LABELS = ["order.created", "payment.done", "user.signup", "email.queued", "cart.abandoned", "review.posted", "stock.updated"];
const MSG_COLORS = [
  "bg-brand-chart-2",
  "bg-brand-primary",
  "bg-brand-chart-4",
  "bg-brand-chart-3",
  "bg-brand-chart-5",
  "bg-brand-chart-6",
  "bg-brand-chart-2",
];

let globalId = 0;

type LogEntry = {
  id: number;
  text: string;
  type: "producer" | "a" | "b" | "info";
};

export function QueueStreamVisualizer() {
  const [mode, setMode] = useState<Mode>("queue");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [offsetA, setOffsetA] = useState(0);
  const [offsetB, setOffsetB] = useState(0);
  const [busyA, setBusyA] = useState(false);
  const [busyB, setBusyB] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const logId = useRef(0);
  const logEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEl.current) logEl.current.scrollTop = logEl.current.scrollHeight;
  }, [log]);

  const pushLog = useCallback((text: string, type: LogEntry["type"]) => {
    logId.current += 1;
    setLog((prev) => [...prev.slice(-30), { id: logId.current, text, type }]);
  }, []);

  const reset = useCallback(() => {
    globalId = 0;
    setMessages([]);
    setOffsetA(0);
    setOffsetB(0);
    setBusyA(false);
    setBusyB(false);
    setLog([]);
    logId.current = 0;
  }, []);

  const switchMode = (m: Mode) => {
    reset();
    setMode(m);
  };

  const produce = () => {
    globalId += 1;
    const idx = (globalId - 1) % MSG_LABELS.length;
    const msg: Msg = {
      id: globalId,
      label: MSG_LABELS[idx],
      colorClass: MSG_COLORS[idx],
      consuming: false,
    };
    setMessages((prev) => [...prev, msg]);
    pushLog(`Producer  ->  "${msg.label}" (id ${msg.id})`, "producer");
  };

  const consumeQueue = (consumer: "a" | "b") => {
    const busy = consumer === "a" ? busyA : busyB;
    if (busy) return;
    const setBusy = consumer === "a" ? setBusyA : setBusyB;
    setMessages((prev) => {
      const available = prev.find((m) => !m.consuming);
      if (!available) return prev;
      setBusy(true);
      pushLog(`Consumer ${consumer.toUpperCase()}  <-  "${available.label}" (acked + deleted)`, consumer);
      const marked = prev.map((m) => (m.id === available.id ? { ...m, consuming: true } : m));
      setTimeout(() => {
        setMessages((cur) => cur.filter((m) => m.id !== available.id));
        setBusy(false);
      }, 700);
      return marked;
    });
  };

  const consumeStream = (consumer: "a" | "b") => {
    const busy = consumer === "a" ? busyA : busyB;
    const offset = consumer === "a" ? offsetA : offsetB;
    const setBusy = consumer === "a" ? setBusyA : setBusyB;
    const setOffset = consumer === "a" ? setOffsetA : setOffsetB;
    if (busy || offset >= messages.length) return;
    const msg = messages[offset];
    setBusy(true);
    pushLog(`Consumer ${consumer.toUpperCase()}  <-  "${msg.label}" (offset ${offset} -> ${offset + 1})`, consumer);
    setOffset(offset + 1);
    setTimeout(() => setBusy(false), 600);
  };

  const canA = mode === "queue" ? messages.some((m) => !m.consuming) : offsetA < messages.length;
  const canB = mode === "queue" ? messages.some((m) => !m.consuming) : offsetB < messages.length;

  const consumers = [
    {
      id: "a" as const,
      label: "Consumer A",
      busy: busyA,
      can: canA,
      offset: offsetA,
      accent: "text-brand-primary border-brand-primary/20 bg-brand-primary/5",
      dot: "bg-brand-primary",
    },
    {
      id: "b" as const,
      label: "Consumer B",
      busy: busyB,
      can: canB,
      offset: offsetB,
      accent: "text-brand-warning border-brand-warning/20 bg-brand-warning/5",
      dot: "bg-brand-warning",
    },
  ];

  return (
    <div className="bg-white border border-brand-border rounded-xl overflow-hidden mb-8 not-prose">
      <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border bg-brand-surface/30">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Queue vs Stream Visualizer
        </span>
        <button
          onClick={reset}
          className="text-[9px] text-brand-text-muted hover:text-brand-text transition-all duration-500 cursor-pointer outline-none"
        >
          reset
        </button>
      </div>

      <div className="flex border-b border-brand-border">
        {(["queue", "stream"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`flex-1 py-2.5 text-[11px] font-semibold cursor-pointer outline-none transition-all duration-500 border-b-2 ${
              mode === m ? "text-brand-primary border-brand-primary bg-brand-surface/30" : "text-brand-text-muted border-transparent hover:bg-brand-surface/20"
            }`}
          >
            {m === "queue" ? "Message Queue" : "Event Stream"}
          </button>
        ))}
      </div>

      <div className="px-4 py-2 bg-brand-surface/20 border-b border-brand-border/50">
        <p className="text-[10px] text-brand-text-muted">
          {mode === "queue"
            ? "Each message is delivered to exactly one consumer then deleted. Consumers compete for messages."
            : "Messages are retained in order. Each consumer tracks its own offset and reads independently."}
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-20 h-8 rounded-lg bg-brand-surface/50 border border-brand-border flex items-center justify-center shrink-0">
            <span className="text-[9px] font-mono text-brand-text-muted">Producer</span>
          </div>
          <div className="flex-1 h-px bg-brand-border" />
          <motion.button
            onClick={produce}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING}
            className="text-[9px] font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-lg px-3 py-1.5 cursor-pointer outline-none transition-all duration-500"
          >
            + Publish message
          </motion.button>
        </div>

        <div className="bg-brand-surface/30 border border-brand-border rounded-xl p-3 min-h-16">
          <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-2">
            {mode === "queue" ? "Queue" : "Partition (append-only log)"}
          </p>
          {messages.length === 0 ? (
            <p className="text-[9px] text-brand-text-subtle text-center py-2">
              empty, publish some messages above
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={msg.id}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: msg.consuming ? 0.25 : 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={SPRING}
                    className="relative"
                  >
                    {mode === "stream" && (
                      <span className="absolute -top-3 left-1 text-[7px] font-mono text-brand-text-muted">{idx}</span>
                    )}
                    <span className={`block text-[8px] font-mono text-white px-2 py-1 rounded ${msg.colorClass} whitespace-nowrap`}>
                      {msg.label}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {mode === "stream" && messages.length > 0 && (
            <div className="flex gap-4 mt-3 pt-2 border-t border-brand-border/40">
              {consumers.map((c) => (
                <div key={c.id} className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                  <span className="text-[8px] text-brand-text-muted">
                    {c.label} offset:{" "}
                    <span className={`font-mono font-bold ${c.id === "a" ? "text-brand-primary" : "text-brand-warning"}`}>{c.offset}</span>
                    {c.offset < messages.length && <span className="text-brand-text-subtle"> (next: {messages[c.offset]?.label})</span>}
                    {c.offset >= messages.length && messages.length > 0 && <span className="text-brand-text-subtle"> (caught up)</span>}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {consumers.map((c) => (
            <motion.button
              key={c.id}
              onClick={() => (mode === "queue" ? consumeQueue(c.id) : consumeStream(c.id))}
              whileHover={c.can && !c.busy ? { scale: 1.02 } : {}}
              whileTap={c.can && !c.busy ? { scale: 0.98 } : {}}
              transition={SPRING}
              disabled={!c.can || c.busy}
              className={`py-3 rounded-xl border text-[10px] font-semibold transition-all duration-500 cursor-pointer outline-none ${c.accent} ${
                !c.can || c.busy ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              {c.busy ? "processing..." : `${c.label}, Consume`}
            </motion.button>
          ))}
        </div>
      </div>

      {log.length > 0 && (
        <div ref={logEl} className="border-t border-brand-border bg-brand-surface/10 max-h-28 overflow-y-auto px-4 py-2 space-y-0.5">
          <AnimatePresence initial={false}>
            {log.map((entry) => (
              <motion.p
                key={entry.id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-[9px] font-mono ${
                  entry.type === "producer"
                    ? "text-brand-primary"
                    : entry.type === "a"
                    ? "text-brand-primary/70"
                    : entry.type === "b"
                    ? "text-brand-warning"
                    : "text-brand-text-muted"
                }`}
              >
                {entry.text}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
