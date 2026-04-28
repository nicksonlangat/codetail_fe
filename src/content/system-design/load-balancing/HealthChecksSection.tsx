"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

type ServerStatus = "healthy" | "degraded" | "down";

type CheckServer = {
  id: number;
  label: string;
  status: ServerStatus;
  lastCheck: string;
  responseTime: number;
};

function ServerStatusCard({
  server,
  isChecking,
}: {
  server: CheckServer;
  isChecking: boolean;
}) {
  const colors: Record<ServerStatus, string> = {
    healthy: "border-primary/30 bg-primary/5",
    degraded: "border-orange-400/30 bg-orange-400/5",
    down: "border-destructive/30 bg-destructive/5",
  };
  const dotColors: Record<ServerStatus, string> = {
    healthy: "bg-primary",
    degraded: "bg-orange-400",
    down: "bg-destructive",
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
                className="absolute inset-0 rounded-full bg-primary"
                animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </div>
          <span className="text-[12px] font-semibold">{server.label}</span>
        </div>
        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
          server.status === "healthy" ? "bg-primary/10 text-primary"
          : server.status === "degraded" ? "bg-orange-400/10 text-orange-500"
          : "bg-destructive/10 text-destructive"
        }`}>
          {labels[server.status]}
        </span>
      </div>
      <div className="flex items-center justify-between text-[9px] text-muted-foreground">
        <span>Last: {server.lastCheck}</span>
        <span className="font-mono">
          {server.status === "down" ? "timeout" : `${server.responseTime}ms`}
        </span>
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
    setServers((prev) => prev.map((s) => s.id === id ? { ...s, status: "down", responseTime: 0, lastCheck: "just now" } : s));
    setLog((prev) => [`[FAIL] Server ${String.fromCharCode(65 + id)} stopped responding`, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setLog((prev) => [`[HEALTH CHECK] Server ${String.fromCharCode(65 + id)} — TIMEOUT after 2000ms`, ...prev.slice(0, 4)]);
      setTimeout(() => {
        setLog((prev) => [`[LB] Removing Server ${String.fromCharCode(65 + id)} from rotation`, ...prev.slice(0, 4)]);
      }, 600);
    }, 600);
  };

  const reviveServer = (id: number) => {
    setServers((prev) => prev.map((s) => s.id === id ? { ...s, status: "healthy", responseTime: 4 + id, lastCheck: "just now" } : s));
    setLog((prev) => [`[HEALTH CHECK] Server ${String.fromCharCode(65 + id)} — OK (5ms)`, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setLog((prev) => [`[LB] Returning Server ${String.fromCharCode(65 + id)} to rotation`, ...prev.slice(0, 4)]);
    }, 600);
  };

  const runCheck = () => {
    servers.forEach((s, i) => {
      setTimeout(() => {
        setCheckingId(s.id);
        setLog((prev) => [
          `[HEALTH CHECK] ${s.label} — ${s.status === "down" ? "TIMEOUT" : `OK (${s.responseTime}ms)`}`,
          ...prev.slice(0, 4),
        ]);
        setTimeout(() => setCheckingId(null), 400);
      }, i * 400);
    });
  };

  const healthyCount = servers.filter((s) => s.status === "healthy").length;

  return (
    <section>
      <h2 id="health-checks" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Health Checks and Failure Handling
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A load balancer is only as reliable as its knowledge of which backends are working.
        Health checks are the mechanism by which the LB continuously verifies that each server
        is alive and capable of handling requests.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Use the simulator below: run health checks to see the LB probing each server, then kill
        a server to watch the LB detect failure and remove it from rotation.
      </p>

      {/* Simulator */}
      <div className="bg-card border border-border rounded-xl p-5 mb-8 not-prose space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
            Health Check Simulator
          </span>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
            healthyCount === 3 ? "bg-primary/10 text-primary"
            : healthyCount > 0 ? "bg-orange-400/10 text-orange-500"
            : "bg-destructive/10 text-destructive"
          }`}>
            {healthyCount}/3 servers healthy
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {servers.map((s) => (
            <ServerStatusCard key={s.id} server={s} isChecking={checkingId === s.id} />
          ))}
        </div>

        {/* Event log */}
        <div className="bg-muted rounded-lg p-3 min-h-[64px] font-mono space-y-1">
          <AnimatePresence initial={false}>
            {log.length === 0 ? (
              <p className="text-[9px] text-muted-foreground italic">Run a health check to see the log...</p>
            ) : (
              log.map((entry, i) => (
                <motion.p
                  key={`${entry}-${i}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-[9px] ${
                    entry.includes("FAIL") || entry.includes("TIMEOUT") ? "text-destructive"
                    : entry.includes("Removing") ? "text-orange-400"
                    : entry.includes("Returning") ? "text-primary"
                    : "text-muted-foreground"
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
            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-medium cursor-pointer hover:bg-primary/90 transition-colors"
          >
            Run health check
          </motion.button>
          {servers.map((s) => (
            <button
              key={s.id}
              onClick={() => s.status === "down" ? reviveServer(s.id) : failServer(s.id)}
              className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-medium transition-colors cursor-pointer ${
                s.status === "down"
                  ? "border-primary/30 text-primary hover:bg-primary/5"
                  : "border-destructive/30 text-destructive hover:bg-destructive/5"
              }`}
            >
              {s.status === "down" ? `Revive ${s.label}` : `Kill ${s.label}`}
            </button>
          ))}
        </div>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">How health checks work</h3>

      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        {[
          { label: "Interval", desc: "How often the LB sends a probe. Typically 5-30 seconds. Lower intervals detect failures faster but add probe traffic.", icon: "⏱️" },
          { label: "Timeout", desc: "How long to wait for a response before declaring a failure. Typically 2-5 seconds. Must be less than interval.", icon: "⌛" },
          { label: "Threshold", desc: "How many consecutive failures before removing from rotation (healthy to sick), and successes to re-add (sick to healthy).", icon: "🔢" },
        ].map(({ label, desc, icon }) => (
          <div key={label} className="p-4 bg-card border border-border rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{icon}</span>
              <span className="text-[12px] font-semibold">{label}</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Active vs passive health checks</h3>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        <div className="p-4 bg-card border border-border rounded-xl">
          <p className="text-[12px] font-semibold mb-2">Active (probing)</p>
          <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
            The LB periodically sends a request to a designated health endpoint
            (typically <code className="font-mono text-[10px] bg-muted px-1 rounded">/health</code> or <code className="font-mono text-[10px] bg-muted px-1 rounded">/healthz</code>).
            A 200 OK means healthy. Anything else, or no response within timeout, means sick.
          </p>
          <pre className="text-[9px] font-mono bg-muted rounded p-2">GET /health HTTP/1.1{"\n"}Host: server-a.internal{"\n"}{"\n"}HTTP/1.1 200 OK{"\n"}{"{"}"status":"ok","db":"connected"{"}"}</pre>
        </div>
        <div className="p-4 bg-card border border-border rounded-xl">
          <p className="text-[12px] font-semibold mb-2">Passive (observing)</p>
          <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
            The LB watches real traffic responses. If a server returns 5xx errors or connections
            time out on X consecutive requests, it is marked unhealthy. No extra probe traffic,
            but slower to detect failures under low traffic.
          </p>
          <pre className="text-[9px] font-mono bg-muted rounded p-2">{"# Nginx passive health check config"}
proxy_next_upstream error timeout;
proxy_next_upstream_tries 3;
proxy_next_upstream_timeout 30s;</pre>
        </div>
      </div>

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-foreground/70">
          Design your <code className="font-mono text-[11px] bg-muted px-1 rounded">/health</code> endpoint to
          check real dependencies: can it reach the database? the cache? If the server is up but
          its DB connection pool is exhausted, it should return 503, not 200. The LB should route
          around broken servers, not just dead ones.
        </p>
      </div>
    </section>
  );
}
