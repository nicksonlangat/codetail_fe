"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

type Phase = "start" | "request" | "response" | "done";
type Dir = "fwd" | "bwd" | null;

type StepDef = {
  node: string | null;
  edge: string | null;
  dir: Dir;
  phase: Phase;
  title: string;
  body: string;
  latency: string;
};

const NODES = [
  { id: "browser", label: "Browser", sublabel: "Client", icon: "🌐" },
  { id: "dns",     label: "DNS",     sublabel: "Resolver", icon: "📡" },
  { id: "lb",      label: "Load Bal.", sublabel: "Router", icon: "⚖️" },
  { id: "server",  label: "App Server", sublabel: "Logic", icon: "🖥️" },
  { id: "db",      label: "Database",  sublabel: "Storage", icon: "🗄️" },
];

const EDGES = ["browser-dns", "dns-lb", "lb-server", "server-db"];

const STEPS: StepDef[] = [
  { node: "browser", edge: null, dir: null, phase: "start",
    title: "You type a URL and press Enter",
    body: "The browser parses the URL (protocol, hostname, path). Before connecting, it needs to translate the hostname into an IP address — that's DNS's job.",
    latency: "0ms" },
  { node: null, edge: "browser-dns", dir: "fwd", phase: "request",
    title: "DNS Lookup: hostname → IP",
    body: "The browser checks its local DNS cache first. Cache miss? Ask the OS. Still nothing? A query goes to the recursive resolver (your ISP or 8.8.8.8). A cold lookup adds 1–50ms.",
    latency: "1–50ms" },
  { node: "dns", edge: null, dir: null, phase: "request",
    title: "DNS resolver returns the IP",
    body: "The resolver walks the DNS tree — root → .com TLD → google.com's authoritative nameservers — and returns 142.250.80.46. This result is cached per TTL so future requests skip this step entirely.",
    latency: "~20ms typical" },
  { node: null, edge: "dns-lb", dir: "fwd", phase: "request",
    title: "TCP Handshake + TLS Negotiation",
    body: "The browser opens a TCP connection: SYN → SYN-ACK → ACK (1 round trip). HTTPS then negotiates TLS, adding 1–2 more RTTs. TLS 1.3 cuts this to 1 RTT. HTTP/3 + QUIC eliminates the TCP overhead entirely.",
    latency: "30–100ms" },
  { node: "lb", edge: null, dir: null, phase: "request",
    title: "Load balancer receives the request",
    body: "Large services use Anycast or GeoDNS so the IP resolves to a nearby load balancer. The LB distributes traffic across many app servers using algorithms like round-robin or least-connections.",
    latency: "<1ms overhead" },
  { node: null, edge: "lb-server", dir: "fwd", phase: "request",
    title: "Request forwarded to app server",
    body: "The LB picks a backend, strips its own headers, and forwards the HTTP request. Stateless backends (the goal) mean any server can handle any request — this is what makes horizontal scaling work.",
    latency: "<1ms" },
  { node: "server", edge: null, dir: null, phase: "request",
    title: "App server processes the request",
    body: "Your application runs: verify the JWT, authorize, check Redis cache. Cache hit? Return immediately. Cache miss? Query the database. Most latency optimization opportunities live right here.",
    latency: "5–50ms" },
  { node: null, edge: "server-db", dir: "fwd", phase: "request",
    title: "Database query",
    body: "The server sends SQL over a connection pool. No index: O(n) full table scan. Indexed: O(log n). The query planner picks the execution strategy — EXPLAIN reveals what it chose.",
    latency: "1–100ms+" },
  { node: "db", edge: null, dir: null, phase: "request",
    title: "Database returns results",
    body: "Rows travel back over the internal LAN (sub-millisecond). The app server deserializes them, applies business logic, and serializes the response to JSON.",
    latency: "<1ms network" },
  { node: null, edge: "server-db", dir: "bwd", phase: "response",
    title: "Response: Database → Server",
    body: "The server assembles the HTTP response: status (200 OK), headers (Content-Type, Cache-Control, CORS, X-Request-ID), and body (JSON). Now it flows back up the stack.",
    latency: "<1ms" },
  { node: null, edge: "lb-server", dir: "bwd", phase: "response",
    title: "Response: Server → Load Balancer",
    body: "The LB can inspect L7 responses — applying compression (gzip/brotli), adding security headers, or logging the full request/response for observability. All transparent to the app.",
    latency: "<1ms" },
  { node: null, edge: "dns-lb", dir: "bwd", phase: "response",
    title: "Response: Network → Browser",
    body: "The HTTP response travels back over TCP. Large bodies are chunked so the browser can start parsing before the full payload arrives. The TCP connection stays alive for future requests.",
    latency: "10–100ms" },
  { node: "browser", edge: null, dir: null, phase: "done",
    title: "Browser renders the response",
    body: "Status parsed, headers read. JSON dispatched to JavaScript. HTML triggers the critical rendering path: parse → DOM → CSSOM → layout → paint. Total round trip: 50–500ms for a typical web request.",
    latency: "10–50ms paint" },
];

function NodeBox({ node, isActive, isPassed }: { node: typeof NODES[0]; isActive: boolean; isPassed: boolean }) {
  return (
    <motion.div
      animate={{ scale: isActive ? 1.06 : 1 }}
      transition={spring}
      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all duration-300 min-w-0 flex-1 max-w-[100px] ${
        isActive ? "border-primary bg-primary/10 shadow-md shadow-primary/20"
        : isPassed ? "border-primary/25 bg-primary/5"
        : "border-border bg-card"
      }`}
    >
      <span className="text-xl leading-none">{node.icon}</span>
      <span className={`text-[10px] font-semibold text-center leading-tight ${isActive ? "text-primary" : "text-foreground"}`}>
        {node.label}
      </span>
      <span className="text-[8px] text-muted-foreground text-center">{node.sublabel}</span>
    </motion.div>
  );
}

function EdgeArrow({ isActive, isPassed, dir }: { isActive: boolean; isPassed: boolean; dir: Dir }) {
  const highlighted = isActive || isPassed;
  return (
    <div className="flex items-center flex-1 min-w-[12px] max-w-[60px]">
      <div className="flex-1 h-[2px] bg-border relative overflow-hidden rounded-full">
        {highlighted && (
          <div className={`absolute inset-0 transition-colors duration-300 ${highlighted ? "bg-primary" : ""}`} />
        )}
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-white/50 rounded-full"
            animate={{ x: dir === "bwd" ? ["-100%", "100%"] : ["0%", "200%"] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ width: "50%" }}
          />
        )}
      </div>
      <div className={`w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px] border-transparent flex-shrink-0 transition-colors duration-300 ${highlighted ? "border-l-primary" : "border-l-border"}`} />
    </div>
  );
}

const PHASE_COLORS: Record<Phase, string> = {
  start: "bg-secondary text-muted-foreground",
  request: "bg-primary/10 text-primary",
  response: "bg-green-500/10 text-green-600 dark:text-green-400",
  done: "bg-primary/10 text-primary",
};

const PHASE_LABELS: Record<Phase, string> = {
  start: "Start",
  request: "→ Request",
  response: "← Response",
  done: "Complete",
};

export function RequestFlowVisualizer() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);
  const next = useCallback(() => {
    setStep((s) => {
      if (s >= STEPS.length - 1) { setIsPlaying(false); return s; }
      return s + 1;
    });
  }, []);
  const reset = useCallback(() => { setStep(0); setIsPlaying(false); }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= STEPS.length - 1) { setIsPlaying(false); return s; }
        return s + 1;
      });
    }, 2200);
    return () => clearInterval(id);
  }, [isPlaying]);

  const current = STEPS[step];

  const passedNodes = new Set<string>();
  const passedEdges = new Set<string>();
  for (let i = 0; i < step; i++) {
    const s = STEPS[i];
    if (s.node) passedNodes.add(s.node);
    if (s.edge) passedEdges.add(s.edge);
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5 not-prose">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          Request Flow Visualizer
        </span>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${PHASE_COLORS[current.phase]}`}>
          {PHASE_LABELS[current.phase]}
        </span>
      </div>

      {/* Diagram */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {NODES.map((node, i) => (
          <div key={node.id} className="flex items-center flex-1 min-w-0">
            <NodeBox
              node={node}
              isActive={current.node === node.id}
              isPassed={passedNodes.has(node.id)}
            />
            {i < EDGES.length && (
              <EdgeArrow
                isActive={current.edge === EDGES[i]}
                isPassed={passedEdges.has(EDGES[i])}
                dir={current.edge === EDGES[i] ? current.dir : null}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="space-y-2"
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-[13px] font-semibold text-foreground leading-snug">{current.title}</h3>
            <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded flex-shrink-0">
              {current.latency}
            </span>
          </div>
          <p className="text-[12px] text-muted-foreground leading-relaxed">{current.body}</p>
        </motion.div>
      </AnimatePresence>

      {/* Progress + Controls */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex gap-0.5">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIsPlaying(false); setStep(i); }}
              className={`flex-1 h-1 rounded-full transition-all duration-300 cursor-pointer ${i <= step ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground tabular-nums flex-shrink-0">
          {step + 1}/{STEPS.length}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.95 }} onClick={reset}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer text-muted-foreground hover:text-foreground">
            <RotateCcw className="w-3.5 h-3.5" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setIsPlaying((p) => !p)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-medium cursor-pointer hover:bg-primary/90 transition-colors">
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isPlaying ? "Pause" : "Play all"}
          </motion.button>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.button whileTap={{ scale: 0.95 }} onClick={prev} disabled={step === 0}
            className="p-1.5 rounded-lg border border-border hover:bg-secondary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronLeft className="w-3.5 h-3.5" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={next} disabled={step === STEPS.length - 1}
            className="p-1.5 rounded-lg border border-border hover:bg-secondary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
