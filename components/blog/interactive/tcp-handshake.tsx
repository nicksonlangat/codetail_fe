"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

type Message = {
  from: "client" | "server";
  label: string;
  flag: string;
  color: string;
  description: string;
};

const TCP_STEPS: Message[] = [
  {
    from: "client",
    label: "SYN",
    flag: "seq=0",
    color: "bg-brand-chart-2/10 border-brand-chart-2/30 text-brand-chart-2",
    description: "Client sends SYN (synchronize) with a random sequence number. 'I want to connect and my sequence starts at 0.'",
  },
  {
    from: "server",
    label: "SYN-ACK",
    flag: "seq=0, ack=1",
    color: "bg-brand-chart-4/10 border-brand-chart-4/30 text-brand-chart-4",
    description: "Server acknowledges the SYN (ack=1) and sends its own SYN. 'Got your SYN, here's mine. My sequence starts at 0.'",
  },
  {
    from: "client",
    label: "ACK",
    flag: "ack=1",
    color: "bg-brand-primary/10 border-brand-primary/30 text-brand-primary",
    description: "Client acknowledges the server's SYN. Connection established. Both sides are now synchronized and ready to exchange data.",
  },
];

const TLS_STEPS: Message[] = [
  {
    from: "client",
    label: "ClientHello",
    flag: "TLS versions, cipher suites",
    color: "bg-brand-chart-2/10 border-brand-chart-2/30 text-brand-chart-2",
    description: "Client advertises supported TLS versions and cipher suites. 'Here's what encryption I understand.'",
  },
  {
    from: "server",
    label: "ServerHello + Certificate",
    flag: "chosen cipher, public cert",
    color: "bg-brand-chart-3/10 border-brand-chart-3/30 text-brand-chart-3",
    description: "Server picks a cipher suite and sends its certificate (signed by a CA). Client verifies the certificate chain.",
  },
  {
    from: "client",
    label: "Key Exchange",
    flag: "encrypted with server's key",
    color: "bg-brand-chart-2/10 border-brand-chart-2/30 text-brand-chart-2",
    description: "Client generates a session key, encrypts it with the server's public key. Only the server (with its private key) can decrypt it.",
  },
  {
    from: "server",
    label: "Finished",
    flag: "encrypted channel ready",
    color: "bg-brand-chart-3/10 border-brand-chart-3/30 text-brand-chart-3",
    description: "Both sides confirm the handshake. The symmetric session key is now shared. All future messages are encrypted.",
  },
];

type Mode = "tcp" | "tls";

function MessageRow({ msg, revealed }: { msg: Message; revealed: boolean }) {
  const isClient = msg.from === "client";
  return (
    <AnimatePresence>
      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="grid grid-cols-[1fr_auto_1fr] items-center gap-2"
        >
          <div className={isClient ? "flex justify-end" : ""}>
            {isClient && (
              <span className={`text-[10px] font-mono font-semibold px-2 py-1 rounded border shrink-0 ${msg.color}`}>
                {msg.label}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <div className={`h-[1px] w-16 sm:w-24 relative ${isClient ? "self-end" : "self-start"}`}>
              <div className={`absolute inset-0 ${isClient ? "bg-gradient-to-r" : "bg-gradient-to-l"} from-transparent to-brand-primary/60`} />
            </div>
            <div className={`flex items-center gap-1 ${isClient ? "" : "flex-row-reverse"}`}>
              <div className="text-[8px] text-brand-text-muted font-mono">{msg.flag}</div>
              <span className="text-[8px]">{isClient ? "→" : "←"}</span>
            </div>
          </div>

          <div className={!isClient ? "flex justify-start" : ""}>
            {!isClient && (
              <span className={`text-[10px] font-mono font-semibold px-2 py-1 rounded border shrink-0 ${msg.color}`}>
                {msg.label}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function TCPHandshake() {
  const [mode, setMode] = useState<Mode>("tcp");
  const [revealedCount, setRevealedCount] = useState(0);
  const [playing, setPlaying] = useState(false);

  const steps = mode === "tcp" ? TCP_STEPS : TLS_STEPS;
  const current = steps[revealedCount - 1] ?? null;

  const playAll = async () => {
    setPlaying(true);
    setRevealedCount(0);
    for (let i = 1; i <= steps.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setRevealedCount(i);
    }
    setPlaying(false);
  };

  const reset = () => {
    setRevealedCount(0);
    setPlaying(false);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    reset();
  };

  return (
    <div className="bg-white border border-brand-border rounded-xl p-5 not-prose">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          {mode === "tcp" ? "TCP 3-Way Handshake" : "TLS Handshake (simplified)"}
        </span>
        <div className="flex items-center rounded-lg bg-brand-surface p-0.5 text-[10px] font-medium">
          {(["tcp", "tls"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`px-2.5 py-1 rounded-md transition-all duration-500 cursor-pointer outline-none uppercase ${
                mode === m ? "bg-white text-brand-text shadow-sm" : "text-brand-text-muted hover:text-brand-text"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] mb-4 text-[10px] font-medium text-brand-text-muted">
        <div className="text-right pr-2">Client</div>
        <div className="w-20 sm:w-28" />
        <div className="pl-2">Server</div>
      </div>

      <div className="space-y-3 min-h-[120px]">
        {steps.map((msg, i) => (
          <MessageRow key={`${mode}-${i}`} msg={msg} revealed={i < revealedCount} />
        ))}
        {revealedCount === steps.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[11px] font-medium text-brand-primary py-2 border-t border-brand-border mt-3"
          >
            {mode === "tcp" ? "✓ Connection established, data transfer can begin" : "✓ Encrypted channel ready, HTTP request sent"}
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {current && (
          <motion.p
            key={revealedCount}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[11px] text-brand-text-muted leading-relaxed mt-4 pt-4 border-t border-brand-border"
          >
            {current.description}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 mt-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="p-1.5 rounded-lg hover:bg-brand-surface transition-all duration-500 cursor-pointer outline-none text-brand-text-muted"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={playAll}
          disabled={playing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary text-white text-[11px] font-medium cursor-pointer outline-none hover:bg-brand-primary-hover transition-all duration-500 disabled:opacity-50"
        >
          <Play className="w-3 h-3" />
          {playing ? "Running..." : "Animate handshake"}
        </motion.button>
        {revealedCount < steps.length && (
          <button
            onClick={() => setRevealedCount((c) => Math.min(c + 1, steps.length))}
            className="text-[11px] text-brand-text-muted hover:text-brand-text transition-all duration-500 cursor-pointer outline-none"
          >
            Step →
          </button>
        )}
        <span className="text-[10px] text-brand-text-muted ml-auto">
          {mode === "tcp" ? "1 RTT" : "2 RTTs"} overhead
        </span>
      </div>
    </div>
  );
}
