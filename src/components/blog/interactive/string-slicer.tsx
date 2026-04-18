"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type StringSlicerProps = {
  initialString?: string;
};

export function StringSlicer({ initialString = "hello world" }: StringSlicerProps) {
  const [string, setString] = useState(initialString);
  const [start, setStart] = useState(0);
  const [stop, setStop] = useState(5);
  const [step, setStep] = useState(1);

  const characters = string.split("");
  const sliced = characters.slice(start, stop === -1 ? undefined : stop).filter((_, i) => i % step === 0);

  const handleStartChange = (val: number) => {
    setStart(val);
    if (val >= stop && stop !== -1) setStop(val + 1);
  };

  const handleStopChange = (val: number) => {
    setStop(val);
    if (val !== -1 && val <= start) setStart(Math.max(0, val - 1));
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60 mb-4">
        Interactive Slicer
      </div>

      {/* Character grid */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-1">
          {characters.map((char, i) => {
            const isSelected = (stop === -1 || i < stop) && i >= start && (i - start) % step === 0;
            return (
              <motion.div
                key={i}
                animate={{ scale: isSelected ? 1.1 : 1 }}
                className={cn(
                  "relative w-10 h-10 flex items-center justify-center rounded-lg border text-[14px] font-mono font-medium",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
                )}
              >
                {char}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground/60">
                  {i}
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground/60">
                  {i - characters.length}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-[10px] text-muted-foreground mb-2">start</label>
          <input
            type="range"
            min={-characters.length}
            max={characters.length - 1}
            value={start}
            onChange={(e) => handleStartChange(parseInt(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="text-center text-[12px] font-mono text-foreground mt-1">{start}</div>
        </div>
        <div>
          <label className="block text-[10px] text-muted-foreground mb-2">stop</label>
          <input
            type="range"
            min={-characters.length}
            max={characters.length}
            value={stop}
            onChange={(e) => handleStopChange(parseInt(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="text-center text-[12px] font-mono text-foreground mt-1">
            {stop === -1 ? "None" : stop}
          </div>
        </div>
        <div>
          <label className="block text-[10px] text-muted-foreground mb-2">step</label>
          <input
            type="range"
            min={1}
            max={3}
            value={step}
            onChange={(e) => setStep(parseInt(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="text-center text-[12px] font-mono text-foreground mt-1">{step}</div>
        </div>
      </div>

      {/* Result */}
      <div className="bg-secondary/50 rounded-lg p-4">
        <div className="text-[10px] text-muted-foreground mb-2">Result</div>
        <code className="text-[14px] font-mono text-foreground">
          string[{start}:{stop === -1 ? "" : stop}{step > 1 ? `:${step}` : ""}]
        </code>
        <div className="mt-2 font-mono text-lg text-primary">{sliced.join("")}</div>
      </div>
    </div>
  );
}