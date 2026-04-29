"use client";
import { useState, useMemo } from "react";

function fmtRps(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K/s` : `${Math.round(n)}/s`;
}

function fmtStorage(gb: number) {
  if (gb >= 1000) return `${(gb / 1000).toFixed(1)} TB`;
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  return `${(gb * 1000).toFixed(0)} MB`;
}

function Slider({
  label, value, min, max, step, display, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  display: string; onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <span className="text-[11px] font-mono font-semibold">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 rounded-full cursor-pointer accent-primary bg-muted"
      />
    </div>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-border bg-muted/40">
      <div className="space-y-0.5">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50">{label}</p>
        <p className="text-[10px] text-muted-foreground">{sub}</p>
      </div>
      <span className="font-mono text-[15px] font-bold text-primary ml-4 flex-shrink-0">{value}</span>
    </div>
  );
}

export function SystemDesignCalculator() {
  const [dailyM, setDailyM] = useState(100);
  const [rwRatio, setRwRatio] = useState(100);
  const [cacheHit, setCacheHit] = useState(90);
  const [retention, setRetention] = useState(5);
  const [avgBytes, setAvgBytes] = useState(200);

  const m = useMemo(() => {
    const peakRps = (dailyM * 1e6 / 86400) * 2.5;
    const writeRps = peakRps / rwRatio;
    const totalUrls = writeRps * 86400 * 365 * retention;
    const storageGb = (totalUrls * avgBytes) / 1e9;
    const cacheGb = (totalUrls * 0.2 * avgBytes) / 1e9;
    const dbIops = Math.round(peakRps * (1 - cacheHit / 100));
    const servers = Math.max(1, Math.ceil(peakRps / 2000));
    return { peakRps, writeRps, storageGb, cacheGb, dbIops, servers };
  }, [dailyM, rwRatio, cacheHit, retention, avgBytes]);

  const scale =
    m.peakRps < 500 ? "Startup" :
    m.peakRps < 5000 ? "Growth" :
    m.peakRps < 50000 ? "Scale" : "Hyperscale";

  return (
    <div className="not-prose bg-card border border-border rounded-xl overflow-hidden mb-6">
      <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex items-center justify-between">
        <span className="text-[11px] font-semibold">URL shortener capacity estimator</span>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary">
          {scale}
        </span>
      </div>
      <div className="grid sm:grid-cols-2 gap-5 p-4">
        <div className="space-y-4">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50">Assumptions</p>
          <Slider label="Daily redirects" value={dailyM} min={1} max={1000} step={1}
            display={dailyM >= 1000 ? "1B" : `${dailyM}M`} onChange={setDailyM} />
          <Slider label="Read / write ratio" value={rwRatio} min={10} max={1000} step={10}
            display={`${rwRatio}:1`} onChange={setRwRatio} />
          <Slider label="Cache hit rate" value={cacheHit} min={50} max={99} step={1}
            display={`${cacheHit}%`} onChange={setCacheHit} />
          <Slider label="Data retention" value={retention} min={1} max={10} step={1}
            display={`${retention} yr`} onChange={setRetention} />
          <Slider label="Avg record size" value={avgBytes} min={50} max={500} step={10}
            display={`${avgBytes} B`} onChange={setAvgBytes} />
        </div>
        <div className="space-y-2">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50">Infrastructure</p>
          <Metric label="Peak read RPS" value={fmtRps(m.peakRps)} sub="2.5x average (traffic burst)" />
          <Metric label="Write RPS" value={fmtRps(m.writeRps)} sub="new short URLs created" />
          <Metric
            label="DB read IOPS"
            value={m.dbIops >= 1000 ? `${(m.dbIops / 1000).toFixed(1)}K` : `${m.dbIops}`}
            sub={`after ${cacheHit}% cache hit rate`}
          />
          <Metric label="Redis memory" value={fmtStorage(m.cacheGb)} sub="top 20% of URLs (hot set)" />
          <Metric label="Total storage" value={fmtStorage(m.storageGb)} sub={`${retention}-yr URL retention`} />
          <Metric label="App servers" value={`${m.servers}`} sub="at 2K RPS capacity each" />
        </div>
      </div>
    </div>
  );
}
