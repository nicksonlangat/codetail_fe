"use client";
import { useReactFlow, useViewport } from "@xyflow/react";
import { Undo2, Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CanvasToolbarProps {
  canUndo: boolean;
  onUndo: () => void;
  nodeCount: number;
  edgeCount: number;
}

export function CanvasToolbar({ canUndo, onUndo, nodeCount, edgeCount }: CanvasToolbarProps) {
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const { zoom } = useViewport();

  return (
    <div className="pointer-events-none absolute top-3 right-3 z-10 flex items-center gap-2">

      {/* Node / edge count */}
      <div className="pointer-events-none flex items-center gap-1.5 rounded-lg border border-border bg-card/90 backdrop-blur-sm px-2.5 py-1.5 shadow-sm">
        <span className="text-[10px] font-mono text-muted-foreground/60 tabular-nums">
          {nodeCount}n · {edgeCount}e
        </span>
      </div>

      {/* Zoom controls */}
      <div className="pointer-events-auto flex items-center rounded-lg border border-border bg-card/90 backdrop-blur-sm shadow-sm overflow-hidden">
        <motion.button
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={() => zoomOut({ duration: 200 })}
          className="flex h-7 w-7 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors duration-150"
          title="Zoom out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </motion.button>
        <button
          onClick={() => fitView({ duration: 350, padding: 0.1 })}
          className="cursor-pointer border-x border-border px-2.5 text-[10px] font-mono tabular-nums text-muted-foreground hover:text-foreground hover:bg-muted/50 h-7 transition-colors duration-150"
          title="Click to fit view"
        >
          {Math.round(zoom * 100)}%
        </button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={() => zoomIn({ duration: 200 })}
          className="flex h-7 w-7 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors duration-150"
          title="Zoom in"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </motion.button>
      </div>

      {/* Fit view */}
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onClick={() => fitView({ duration: 400, padding: 0.12 })}
        className="pointer-events-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-border bg-card/90 backdrop-blur-sm text-muted-foreground shadow-sm hover:border-primary/40 hover:text-foreground transition-all duration-150"
        title="Fit all nodes"
      >
        <Maximize2 className="h-3.5 w-3.5" />
      </motion.button>

      {/* Undo */}
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        className={cn(
          "pointer-events-auto flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium shadow-sm transition-all duration-150 backdrop-blur-sm",
          canUndo
            ? "border-border bg-card/90 text-foreground hover:border-primary/40 hover:text-primary"
            : "border-border/40 bg-card/40 text-muted-foreground/30 cursor-not-allowed"
        )}
      >
        <Undo2 className="h-3 w-3" />
        Undo
      </motion.button>

    </div>
  );
}
