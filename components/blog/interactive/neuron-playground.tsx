"use client";

import { useMemo, useState } from "react";

type Activation = "linear" | "relu" | "sigmoid" | "tanh";

const ACTIVATIONS: { id: Activation; label: string; fn: (z: number) => number }[] = [
  { id: "linear", label: "Linear (no activation)", fn: (z) => z },
  { id: "relu", label: "ReLU", fn: (z) => Math.max(0, z) },
  { id: "sigmoid", label: "Sigmoid", fn: (z) => 1 / (1 + Math.exp(-z)) },
  { id: "tanh", label: "Tanh", fn: (z) => Math.tanh(z) },
];

const DOMAIN = 8;

function buildCurve(fn: (z: number) => number): string {
  const points: string[] = [];
  for (let i = -DOMAIN; i <= DOMAIN; i += 0.2) {
    const y = fn(i);
    points.push(`${i},${-y}`);
  }
  return `M ${points.join(" L ")}`;
}

export function NeuronPlayground() {
  const [x, setX] = useState([1, 0.5, -1]);
  const [w, setW] = useState([0.6, -0.8, 0.3]);
  const [bias, setBias] = useState(0);
  const [activationId, setActivationId] = useState<Activation>("relu");

  const activation = ACTIVATIONS.find((a) => a.id === activationId)!;
  const z = x[0] * w[0] + x[1] * w[1] + x[2] * w[2] + bias;
  const output = activation.fn(z);
  const curvePath = useMemo(() => buildCurve(activation.fn), [activation]);

  return (
    <div className="not-prose bg-white border border-brand-border rounded-xl overflow-hidden mb-6">
      <div className="px-4 py-2.5 border-b border-brand-border bg-brand-surface/30">
        <span className="text-[11px] font-semibold text-brand-text">A single neuron, forward pass</span>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between">
                <span className="text-[10px] font-mono text-brand-text-muted">x{i + 1}</span>
                <span className="text-[10px] font-mono text-brand-text">{x[i].toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={-2}
                max={2}
                step={0.1}
                value={x[i]}
                onChange={(e) => setX((prev) => prev.map((v, j) => (j === i ? Number(e.target.value) : v)))}
                className="w-full h-1 rounded-full cursor-pointer accent-brand-primary bg-brand-surface"
              />
              <div className="flex justify-between">
                <span className="text-[10px] font-mono text-brand-text-muted">w{i + 1}</span>
                <span className="text-[10px] font-mono text-brand-text">{w[i].toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={-2}
                max={2}
                step={0.1}
                value={w[i]}
                onChange={(e) => setW((prev) => prev.map((v, j) => (j === i ? Number(e.target.value) : v)))}
                className="w-full h-1 rounded-full cursor-pointer accent-brand-chart-2 bg-brand-surface"
              />
            </div>
          ))}
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-[10px] font-mono text-brand-text-muted">bias</span>
            <span className="text-[10px] font-mono text-brand-text">{bias.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={-2}
            max={2}
            step={0.1}
            value={bias}
            onChange={(e) => setBias(Number(e.target.value))}
            className="w-full h-1 rounded-full cursor-pointer accent-brand-chart-3 bg-brand-surface"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ACTIVATIONS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setActivationId(a.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium cursor-pointer transition-all duration-500 outline-none ${
                a.id === activationId
                  ? "bg-brand-primary text-white"
                  : "bg-brand-surface text-brand-text-muted hover:text-brand-text"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="bg-brand-surface/40 rounded-lg px-3 py-2.5 font-mono text-[11px] text-brand-text-muted space-y-1">
          <div>
            z = ({w[0].toFixed(1)}&times;{x[0].toFixed(1)}) + ({w[1].toFixed(1)}&times;{x[1].toFixed(1)}) + (
            {w[2].toFixed(1)}&times;{x[2].toFixed(1)}) + {bias.toFixed(1)} ={" "}
            <span className="text-brand-text font-semibold">{z.toFixed(2)}</span>
          </div>
          <div>
            output = {activation.label.split(" ")[0].toLowerCase()}(z) ={" "}
            <span className="text-brand-text font-semibold">{output.toFixed(3)}</span>
          </div>
        </div>

        <svg viewBox={`-${DOMAIN} -${DOMAIN} ${DOMAIN * 2} ${DOMAIN * 2}`} className="w-full aspect-square bg-brand-surface/40 rounded-lg">
          <line x1={-DOMAIN} y1={0} x2={DOMAIN} y2={0} stroke="var(--brand-border)" strokeWidth={0.05} />
          <line x1={0} y1={-DOMAIN} x2={0} y2={DOMAIN} stroke="var(--brand-border)" strokeWidth={0.05} />
          <path d={curvePath} fill="none" stroke="var(--brand-chart-1)" strokeWidth={0.15} />
          <circle cx={z} cy={-output} r={0.35} fill="var(--brand-primary)" />
        </svg>
        <p className="text-[10px] text-brand-text-subtle text-center">
          x-axis: z (the weighted sum). y-axis: activation(z). The dot marks this neuron&apos;s current output.
        </p>
      </div>
    </div>
  );
}
