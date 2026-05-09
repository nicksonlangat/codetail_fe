"use client";
import { useCallback, useRef } from "react";

interface ResizeHandleProps {
  onResize: (delta: number) => void;
}

export function ResizeHandle({ onResize }: ResizeHandleProps) {
  const isDragging = useRef(false);
  const lastX = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      lastX.current = e.clientX;

      const onMove = (ev: MouseEvent) => {
        if (!isDragging.current) return;
        const delta = ev.clientX - lastX.current;
        lastX.current = ev.clientX;
        onResize(delta);
      };
      const onUp = () => {
        isDragging.current = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [onResize]
  );

  return (
    <div
      onMouseDown={onMouseDown}
      className="group relative w-[5px] shrink-0 cursor-col-resize bg-border hover:bg-primary/40 active:bg-primary/60 transition-colors duration-150 select-none"
    >
      {/* grip dots */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 flex -translate-x-1/2 flex-col items-center justify-center gap-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[3px] w-[3px] rounded-full bg-primary/70" />
        ))}
      </div>
    </div>
  );
}
