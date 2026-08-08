"use client";

import { useRef } from "react";

interface OtpInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  onComplete?: (code: string) => void;
}

export function OtpInput({ value, onChange, onComplete }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function setDigit(i: number, digit: string) {
    const next = [...value];
    next[i] = digit;
    onChange(next);
    if (digit && i < value.length - 1) refs.current[i + 1]?.focus();
    if (next.every((d) => d.length === 1)) onComplete?.(next.join(""));
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, value.length);
    if (!text) return;
    e.preventDefault();
    const next = [...value];
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    onChange(next);
    refs.current[Math.min(text.length, value.length - 1)]?.focus();
    if (next.every((d) => d.length === 1)) onComplete?.(next.join(""));
  }

  return (
    <div className="flex gap-2.5">
      {value.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => setDigit(i, e.target.value.replace(/\D/g, "").slice(-1))}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="size-12 rounded-lg border border-transparent bg-brand-surface text-center text-lg font-semibold text-brand-text outline-none focus:bg-white focus:border-brand-primary/60 transition-all duration-500"
        />
      ))}
    </div>
  );
}
