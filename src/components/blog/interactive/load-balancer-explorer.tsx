"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RefreshCw } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

type Algorithm = "round-robin" | "least-conn" | "ip-hash" | "weighted";

type Server = {
  id: number;
  label: string;
  connections: number;
  weight: number;
  healthy: boolean;
};

const IP_POOL = [
  "203.0.113.5",
  "198.51.100.2",
  "192.0.2.14",
  "203.0.113.5",
  "198.51.100.2",
  "203.0.113.99",
  "192.0.2.14",
  "203.0.113.5",
];

function pickServer(
  algorithm: Algorithm,
  servers: Server[],
  rrIndex: number,
  ip: string
): number {
  const healthy = servers.filter((s) => s.healthy);
  if (healthy.length === 0) return -1;

  switch (algorithm) {
    case "round-robin": {
      const healthyIds = healthy.map((s) => s.id);
      return healthyIds[rrIndex % healthyIds.length];
    }
    case "least-conn": {
      return healthy.reduce((min, s) =>
        s.connections < servers[min].connections ? s.id : min,
        healthy[0].id
      );
    }
    case "ip-hash": {
      const lastOctet = parseInt(ip.split(".").at(-1) ?? "0", 10);
      return healthy[lastOctet % healthy.length].id;
    }
    case "weighted": {
      const total = healthy.reduce((s, srv) => s + srv.weight, 0);
      let rand = Math.floor(Math.random() * total);
      for (const srv of healthy) {
        rand -= srv.weight;
        if (rand < 0) return srv.id;
      }
      return healthy[0].id;
    }
  }
}

const ALGO_META: Record<Algorithm, { label: string; desc: string }> = {
  "round-robin": { label: "Round Robin", desc: "Requests cycle through servers in order. Simple, effective for uniform workloads." },
  "least-conn": { label: "Least Connections", desc: "Next request goes to the server with fewest active connections. Adapts to slow requests automatically." },
  "ip-hash":    { label: "IP Hash", desc: "Client IP is hashed to always pick the same server. Same source IP = same backend (session affinity without cookies)." },
  "weighted":   { label: "Weighted", desc: "Servers with higher weight receive proportionally more traffic. Useful for heterogeneous hardware." },
};

function ServerCard({
  server,
  isPulsing,
  lastRequestCount,
}: {
  server: Server;
  isPulsing: boolean;
  lastRequestCount: number;
}) {
  const utilization = Math.min(server.connections / 10, 1);
  const barColor = utilization > 0.7 ? "bg-orange-400" : "bg-primary";

  return (
    <motion.div
      animate={isPulsing ? { scale: [1, 1.06, 1], boxShadow: ["0 0 0 0px hsl(164 70% 40% / 0)", "0 0 0 4px hsl(164 70% 40% / 0.3)", "0 0 0 0px hsl(164 70% 40% / 0)"] } : {}}
      transition={{ duration: 0.4 }}
      className={`relative p-3 rounded-xl border transition-all duration-300 flex-1 min-w-0 ${
        !server.healthy
          ? "border-destructive/30 bg-destructive/5 opacity-60"
          : isPulsing
          ? "border-primary bg-primary/10"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🖥️</span>
          <span className="text-[11px] font-semibold">{server.label}</span>
        </div>
        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${server.healthy ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
          {server.healthy ? "healthy" : "down"}
        </span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-1.5">
        <motion.div
          animate={{ width: `${utilization * 100}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
      <div className="flex items-center justify-between text-[9px] text-muted-foreground">
        <span>{server.connections} active</span>
        <span className="font-mono">{lastRequestCount} total</span>
      </div>
      {server.id === 0 && (
        <div className="absolute -top-1.5 -right-1.5 text-[8px] bg-secondary border border-border rounded px-1 font-medium text-muted-foreground">
          weight: {server.weight}
        </div>
      )}
    </motion.div>
  );
}

export function LoadBalancerExplorer() {
  const [algorithm, setAlgorithm] = useState<Algorithm>("round-robin");
  const [servers, setServers] = useState<Server[]>([
    { id: 0, label: "Server A", connections: 0, weight: 3, healthy: true },
    { id: 1, label: "Server B", connections: 0, weight: 1, healthy: true },
    { id: 2, label: "Server C", connections: 0, weight: 2, healthy: true },
  ]);
  const [requestCounts, setRequestCounts] = useState([0, 0, 0]);
  const [rrIndex, setRrIndex] = useState(0);
  const [reqIndex, setReqIndex] = useState(0);
  const [pulsingServer, setPulsingServer] = useState<number | null>(null);
  const [pulsingLB, setPulsingLB] = useState(false);
  const [lastRoute, setLastRoute] = useState<{ ip: string; server: string } | null>(null);

  const sendRequest = useCallback(() => {
    const ip = IP_POOL[reqIndex % IP_POOL.length];
    const targetId = pickServer(algorithm, servers, rrIndex, ip);
    if (targetId === -1) return;

    if (algorithm === "round-robin") {
      setRrIndex((i) => i + 1);
    }
    setReqIndex((i) => i + 1);

    setPulsingLB(true);
    setTimeout(() => setPulsingLB(false), 300);

    setTimeout(() => {
      setPulsingServer(targetId);
      setServers((prev) =>
        prev.map((s) => (s.id === targetId ? { ...s, connections: s.connections + 1 } : s))
      );
      setRequestCounts((prev) =>
        prev.map((c, i) => (i === targetId ? c + 1 : c))
      );
      setLastRoute({ ip, server: servers[targetId].label });

      setTimeout(() => {
        setPulsingServer(null);
        setServers((prev) =>
          prev.map((s) => (s.id === targetId ? { ...s, connections: Math.max(0, s.connections - 1) } : s))
        );
      }, 1500);
    }, 350);
  }, [algorithm, servers, rrIndex, reqIndex]);

  const toggleHealth = (id: number) => {
    setServers((prev) => prev.map((s) => (s.id === id ? { ...s, healthy: !s.healthy, connections: 0 } : s)));
  };

  const reset = () => {
    setServers((prev) => prev.map((s) => ({ ...s, connections: 0, healthy: true })));
    setRequestCounts([0, 0, 0]);
    setRrIndex(0);
    setReqIndex(0);
    setLastRoute(null);
  };

  const total = requestCounts.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5 not-prose">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          Load Balancer Explorer
        </span>
        <button onClick={reset} className="p-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer text-muted-foreground hover:text-foreground">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Algorithm picker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {(Object.keys(ALGO_META) as Algorithm[]).map((a) => (
          <button
            key={a}
            onClick={() => { setAlgorithm(a); reset(); }}
            className={`px-2 py-1.5 rounded-lg text-[10px] font-medium border transition-all duration-200 cursor-pointer ${
              algorithm === a
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {ALGO_META[a].label}
          </button>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        {ALGO_META[algorithm].desc}
      </p>

      {/* Diagram */}
      <div className="flex flex-col items-center gap-3">
        {/* Incoming traffic */}
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>🌐</span>
          {lastRoute ? (
            <span>Latest request from <span className="font-mono text-foreground">{lastRoute.ip}</span></span>
          ) : (
            <span>Client requests</span>
          )}
        </div>

        <div className="w-px h-4 bg-border" />

        {/* LB */}
        <motion.div
          animate={pulsingLB ? { scale: 1.05, borderColor: "hsl(164 70% 40%)" } : { scale: 1 }}
          transition={{ duration: 0.2 }}
          className="px-5 py-2.5 rounded-xl border border-border bg-secondary text-[12px] font-semibold text-foreground w-fit"
        >
          ⚖️ Load Balancer
        </motion.div>

        {/* Distribution arrows */}
        <div className="flex items-start gap-2 w-full">
          {servers.map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className={`w-px h-4 transition-colors duration-300 ${pulsingServer === i ? "bg-primary" : "bg-border"}`} />
            </div>
          ))}
        </div>

        {/* Servers */}
        <div className="flex gap-2 w-full">
          {servers.map((server) => (
            <ServerCard
              key={server.id}
              server={server}
              isPulsing={pulsingServer === server.id}
              lastRequestCount={requestCounts[server.id]}
            />
          ))}
        </div>
      </div>

      {/* Distribution stats */}
      {total > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-border">
          <span className="text-[10px] text-muted-foreground">Distribution ({total} requests)</span>
          {servers.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground w-16 flex-shrink-0">{s.label}</span>
              <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (requestCounts[i] / total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-muted-foreground w-8 text-right">
                {total > 0 ? Math.round((requestCounts[i] / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {servers.map((s) => (
            <button
              key={s.id}
              onClick={() => toggleHealth(s.id)}
              className={`text-[9px] px-2 py-1 rounded border transition-colors cursor-pointer ${
                s.healthy
                  ? "border-destructive/30 text-destructive/70 hover:bg-destructive/5"
                  : "border-primary/30 text-primary hover:bg-primary/5"
              }`}
            >
              {s.healthy ? `Kill ${s.label}` : `Revive ${s.label}`}
            </button>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={sendRequest}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-medium cursor-pointer hover:bg-primary/90 transition-colors"
        >
          <Send className="w-3 h-3" />
          Send request
        </motion.button>
      </div>
    </div>
  );
}
