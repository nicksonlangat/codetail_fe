"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ServerStatus = "healthy" | "degraded" | "down";

type CheckServer = {
  id: number;
  label: string;
  status: ServerStatus;
  lastCheck: string;
  responseTime: number;
};

function ServerStatusCard({ server, isChecking }: { server: CheckServer; isChecking: boolean }) {
  const colors: Record<ServerStatus, string> = {
    healthy: "border-brand-primary/30 bg-brand-primary/5",
    degraded: "border-brand-warning/30 bg-brand-warning/5",
    down: "border-brand-destructive/30 bg-brand-destructive/5",
  };
  const dotColors: Record<ServerStatus, string> = {
    healthy: "bg-brand-primary",
    degraded: "bg-brand-warning",
    down: "bg-brand-destructive",
  };
  const labels: Record<ServerStatus, string> = {
    healthy: "Healthy",
    degraded: "Degraded",
    down: "DOWN",
  };

  return (
    <motion.div
      layout
      animate={isChecking ? { scale: [1, 1.03, 1] } : {}}
      transition={{ duration: 0.3 }}
      className={`p-3 rounded-xl border transition-all duration-300 ${colors[server.status]}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className={`w-2 h-2 rounded-full ${dotColors[server.status]}`} />
            {server.status === "healthy" && isChecking && (
              <motion.div
                className="absolute inset-0 rounded-full bg-brand-primary"
                animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </div>
          <span className="text-[12px] font-semibold text-brand-text">{server.label}</span>
        </div>
        <span
          className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
            server.status === "healthy"
              ? "bg-brand-primary/10 text-brand-primary"
              : server.status === "degraded"
              ? "bg-brand-warning/10 text-brand-warning"
              : "bg-brand-destructive/10 text-brand-destructive"
          }`}
        >
          {labels[server.status]}
        </span>
      </div>
      <div className="flex items-center justify-between text-[9px] text-brand-text-muted">
        <span>Last: {server.lastCheck}</span>
        <span className="font-mono">{server.status === "down" ? "timeout" : `${server.responseTime}ms`}</span>
      </div>
    </motion.div>
  );
}

export function HealthChecksSection() {
  const [servers, setServers] = useState<CheckServer[]>([
    { id: 0, label: "Server A", status: "healthy", lastCheck: "just now", responseTime: 4 },
    { id: 1, label: "Server B", status: "healthy", lastCheck: "just now", responseTime: 6 },
    { id: 2, label: "Server C", status: "healthy", lastCheck: "just now", responseTime: 3 },
  ]);
  const [checkingId, setCheckingId] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const failServer = (id: number) => {
    setServers((prev) => prev.map((s) => (s.id === id ? { ...s, status: "down", responseTime: 0, lastCheck: "just now" } : s)));
    setLog((prev) => [`[FAIL] Server ${String.fromCharCode(65 + id)} stopped responding`, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setLog((prev) => [`[HEALTH CHECK] Server ${String.fromCharCode(65 + id)}, TIMEOUT after 2000ms`, ...prev.slice(0, 4)]);
      setTimeout(() => {
        setLog((prev) => [`[LB] Removing Server ${String.fromCharCode(65 + id)} from rotation`, ...prev.slice(0, 4)]);
      }, 600);
    }, 600);
  };

  const reviveServer = (id: number) => {
    setServers((prev) => prev.map((s) => (s.id === id ? { ...s, status: "healthy", responseTime: 4 + id, lastCheck: "just now" } : s)));
    setLog((prev) => [`[HEALTH CHECK] Server ${String.fromCharCode(65 + id)}, OK (5ms)`, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setLog((prev) => [`[LB] Returning Server ${String.fromCharCode(65 + id)} to rotation`, ...prev.slice(0, 4)]);
    }, 600);
  };

  const runCheck = () => {
    servers.forEach((s, i) => {
      setTimeout(() => {
        setCheckingId(s.id);
        setLog((prev) => [
          `[HEALTH CHECK] ${s.label}, ${s.status === "down" ? "TIMEOUT" : `OK (${s.responseTime}ms)`}`,
          ...prev.slice(0, 4),
        ]);
        setTimeout(() => setCheckingId(null), 400);
      }, i * 400);
    });
  };

  const healthyCount = servers.filter((s) => s.status === "healthy").length;

  return (
    <section>
      <h2 id="health-checks" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Health Checks and Failure Handling
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A load balancer is only as reliable as its knowledge of which backends are working.
        Health checks are the mechanism by which the LB continuously verifies that each server
        is alive and capable of handling requests.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-6">
        Use the simulator below: run health checks to see the LB probing each server, then kill
        a server to watch the LB detect failure and remove it from rotation.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-5 mb-8 not-prose space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
            Health Check Simulator
          </span>
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
              healthyCount === 3
                ? "bg-brand-primary/10 text-brand-primary"
                : healthyCount > 0
                ? "bg-brand-warning/10 text-brand-warning"
                : "bg-brand-destructive/10 text-brand-destructive"
            }`}
          >
            {healthyCount}/3 servers healthy
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {servers.map((s) => (
            <ServerStatusCard key={s.id} server={s} isChecking={checkingId === s.id} />
          ))}
        </div>

        <div className="bg-brand-surface rounded-lg p-3 min-h-[64px] font-mono space-y-1">
          <AnimatePresence initial={false}>
            {log.length === 0 ? (
              <p className="text-[9px] text-brand-text-muted italic">Run a health check to see the log...</p>
            ) : (
              log.map((entry, i) => (
                <motion.p
                  key={`${entry}-${i}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-[9px] ${
                    entry.includes("FAIL") || entry.includes("TIMEOUT")
                      ? "text-brand-destructive"
                      : entry.includes("Removing")
                      ? "text-brand-warning"
                      : entry.includes("Returning")
                      ? "text-brand-primary"
                      : "text-brand-text-muted"
                  }`}
                >
                  {entry}
                </motion.p>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={runCheck}
            className="px-3 py-1.5 rounded-lg bg-brand-primary text-white text-[11px] font-medium cursor-pointer outline-none hover:bg-brand-primary-hover transition-all duration-500"
          >
            Run health check
          </motion.button>
          {servers.map((s) => (
            <button
              key={s.id}
              onClick={() => (s.status === "down" ? reviveServer(s.id) : failServer(s.id))}
              className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-medium transition-all duration-500 cursor-pointer outline-none ${
                s.status === "down"
                  ? "border-brand-primary/30 text-brand-primary hover:bg-brand-primary/5"
                  : "border-brand-destructive/30 text-brand-destructive hover:bg-brand-destructive/5"
              }`}
            >
              {s.status === "down" ? `Revive ${s.label}` : `Kill ${s.label}`}
            </button>
          ))}
        </div>
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">How health checks work</h3>

      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        {[
          { label: "Interval", desc: "How often the LB sends a probe. Typically 5-30 seconds. Lower intervals detect failures faster but add probe traffic.", icon: "⏱️" },
          { label: "Timeout", desc: "How long to wait for a response before declaring a failure. Typically 2-5 seconds. Must be less than interval.", icon: "⌛" },
          { label: "Threshold", desc: "How many consecutive failures before removing from rotation (healthy to sick), and successes to re-add (sick to healthy).", icon: "🔢" },
        ].map(({ label, desc, icon }) => (
          <div key={label} className="p-4 bg-white border border-brand-border rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{icon}</span>
              <span className="text-[12px] font-semibold text-brand-text">{label}</span>
            </div>
            <p className="text-[11px] text-brand-text-muted leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">Active vs passive health checks</h3>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        <div className="p-4 bg-white border border-brand-border rounded-xl">
          <p className="text-[12px] font-semibold text-brand-text mb-2">Active (probing)</p>
          <p className="text-[11px] text-brand-text-muted mb-3 leading-relaxed">
            The LB periodically sends a request to a designated health endpoint
            (typically <code className="font-mono text-[10px] bg-brand-surface px-1 rounded">/health</code> or <code className="font-mono text-[10px] bg-brand-surface px-1 rounded">/healthz</code>).
            A 200 OK means healthy. Anything else, or no response within timeout, means sick.
          </p>
          <pre className="text-[9px] font-mono bg-brand-surface rounded p-2">
            GET /health HTTP/1.1{"\n"}Host: server-a.internal{"\n"}
            {"\n"}HTTP/1.1 200 OK{"\n"}
            {"{"}&quot;status&quot;:&quot;ok&quot;,&quot;db&quot;:&quot;connected&quot;{"}"}
          </pre>
        </div>
        <div className="p-4 bg-white border border-brand-border rounded-xl">
          <p className="text-[12px] font-semibold text-brand-text mb-2">Passive (observing)</p>
          <p className="text-[11px] text-brand-text-muted mb-3 leading-relaxed">
            The LB watches real traffic responses. If a server returns 5xx errors or connections
            time out on X consecutive requests, it is marked unhealthy. No extra probe traffic,
            but slower to detect failures under low traffic.
          </p>
          <pre className="text-[9px] font-mono bg-brand-surface rounded p-2">
            {"# Nginx passive health check config"}
            {"\n"}proxy_next_upstream error timeout;{"\n"}proxy_next_upstream_tries 3;{"\n"}proxy_next_upstream_timeout 30s;
          </pre>
        </div>
      </div>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted">
          Design your <code className="font-mono text-[11px] bg-brand-surface px-1 rounded">/health</code> endpoint to
          check real dependencies: can it reach the database? the cache? If the server is up but
          its DB connection pool is exhausted, it should return 503, not 200. The LB should route
          around broken servers, not just dead ones.
        </p>
      </div>
    </section>
  );
}
