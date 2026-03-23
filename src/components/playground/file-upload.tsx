"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, FileText, CheckCircle2, X } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

type UploadState = "idle" | "dragging" | "uploading" | "uploaded";

export function FileUpload() {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);

  const simulateUpload = useCallback(() => {
    setState("dragging");

    setTimeout(() => {
      setState("uploading");
      setProgress(0);

      const duration = 2000;
      const steps = 50;
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setProgress(Math.min(100, Math.round((step / steps) * 100)));
        if (step >= steps) {
          clearInterval(interval);
          setState("uploaded");
        }
      }, duration / steps);
    }, 600);
  }, []);

  const reset = useCallback(() => {
    setState("idle");
    setProgress(0);
  }, []);

  const borderColor =
    state === "dragging"
      ? "border-primary bg-primary/5"
      : state === "uploading"
        ? "border-primary/50"
        : state === "uploaded"
          ? "border-green-500/50 bg-green-500/5"
          : "border-border border-dashed";

  return (
    <div className="py-6 space-y-4">
      <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 mb-3">
        Upload Zone
      </p>

      {/* Drop zone */}
      <motion.div
        className={`relative rounded-xl border-2 p-8 flex flex-col items-center justify-center min-h-[180px] transition-all duration-500 ${borderColor}`}
        animate={{
          scale: state === "dragging" ? 1.01 : 1,
        }}
        transition={spring}
      >
        <AnimatePresence mode="wait">
          {/* Idle */}
          {state === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={spring}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center transition-all duration-500">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-[13px] font-medium text-foreground">Drop your file here</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  or click simulate below
                </p>
              </div>
            </motion.div>
          )}

          {/* Dragging */}
          {state === "dragging" && (
            <motion.div
              key="dragging"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={spring}
              className="flex flex-col items-center gap-3"
            >
              <motion.div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-500"
                animate={{ y: -4 }}
                transition={spring}
              >
                <Upload className="w-5 h-5 text-primary" />
              </motion.div>
              <p className="text-[13px] font-medium text-primary">Release to upload</p>
            </motion.div>
          )}

          {/* Uploading */}
          {state === "uploading" && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={spring}
              className="flex flex-col items-center gap-4 w-full max-w-xs"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-6 h-6 text-primary" />
              </motion.div>
              <div className="w-full">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-muted-foreground">solution.ts</span>
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    {progress}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Uploaded */}
          {state === "uploaded" && (
            <motion.div
              key="uploaded"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={spring}
              className="flex flex-col items-center gap-3"
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center"
              >
                <FileText className="w-5 h-5 text-green-600" />
              </motion.div>

              <div className="text-center">
                <div className="flex items-center gap-1.5 justify-center">
                  <p className="text-[13px] font-medium text-foreground">solution.ts</p>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ ...spring, delay: 0.15 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </motion.div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">2.4 KB uploaded</p>
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ...spring, delay: 0.25 }}
                className="flex items-center gap-1 text-[11px] text-muted-foreground cursor-pointer transition-all duration-500 hover:text-foreground mt-1"
                onClick={reset}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X className="w-3 h-3" />
                Remove
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Simulate button */}
      {state === "idle" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={spring}
          className="text-[12px] font-medium text-primary-foreground bg-primary px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-500"
          onClick={simulateUpload}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Simulate Upload
        </motion.button>
      )}
    </div>
  );
}
