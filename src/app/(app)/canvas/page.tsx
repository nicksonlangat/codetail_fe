"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Workflow, Trash2, Clock } from "lucide-react";
import { useCanvasStore } from "@/stores/canvas-store";
import { useAuthStore } from "@/stores/auth-store";
import { formatDistanceToNow } from "date-fns";

function NewCanvasModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (title: string) => void;
}) {
  const [title, setTitle] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 8 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[15px] font-semibold mb-1">New canvas</h2>
        <p className="text-[12px] text-muted-foreground mb-4">Give it a name to get started.</p>

        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && title.trim()) onCreate(title.trim());
            if (e.key === "Escape") onClose();
          }}
          placeholder="e.g. Horizontal scaling diagram"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] outline-none placeholder:text-muted-foreground/50 focus:border-primary/60 transition-all duration-500"
        />

        <div className="mt-4 flex gap-2 justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={onClose}
            className="rounded-lg border border-border px-3 py-1.5 text-[12px] cursor-pointer transition-all duration-500 hover:bg-muted"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            disabled={!title.trim()}
            onClick={() => title.trim() && onCreate(title.trim())}
            className="rounded-lg bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground cursor-pointer transition-all duration-500 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CanvasListPage() {
  const router = useRouter();
  const { canvases, createCanvas, deleteCanvas, seedDefaults, loadFromAPI, createCanvasFromAPI, deleteCanvasFromAPI } = useCanvasStore();
  const { isAuthenticated } = useAuthStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadFromAPI().catch(() => {});
    } else {
      seedDefaults();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  async function handleCreate(title: string) {
    setShowModal(false);
    if (isAuthenticated) {
      const canvas = await createCanvasFromAPI(title);
      router.push(`/canvas/${canvas.id}`);
    } else {
      const canvas = createCanvas(title);
      router.push(`/canvas/${canvas.id}`);
    }
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (isAuthenticated) {
      deleteCanvasFromAPI(id).catch(() => {});
    } else {
      deleteCanvas(id);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Canvas</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Freeform diagrams for system design and architecture.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[13px] font-medium text-primary-foreground cursor-pointer transition-all duration-500 hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New canvas
        </motion.button>
      </div>

      {canvases.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
            <Workflow className="h-6 w-6 text-primary" />
          </div>
          <p className="text-[14px] font-medium mb-1">No canvases yet</p>
          <p className="text-[12px] text-muted-foreground mb-5">
            Create your first diagram to visualise architecture.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[13px] font-medium text-primary-foreground cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            New canvas
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {canvases.map((canvas, i) => (
              <motion.div
                key={canvas.id}
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ type: "spring", stiffness: 300, damping: 30, delay: i * 0.04 }}
                whileHover={{ y: -2 }}
                onClick={() => router.push(`/canvas/${canvas.id}`)}
                className="group relative flex flex-col rounded-xl border border-border bg-card p-4 cursor-pointer transition-all duration-500 hover:border-primary/40 hover:shadow-sm"
              >
                <div className="flex h-24 items-center justify-center rounded-lg bg-muted/50 mb-3">
                  <Workflow className="h-8 w-8 text-muted-foreground/30" />
                </div>

                <p className="text-[13px] font-semibold truncate">{canvas.title}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(canvas.updatedAt), { addSuffix: true })}
                  <span className="ml-auto font-mono">
                    {canvas.nodes.length}n · {canvas.edges.length}e
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  onClick={(e) => handleDelete(e, canvas.id)}
                  className="absolute top-3 right-3 hidden group-hover:flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-all duration-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <NewCanvasModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
        )}
      </AnimatePresence>
    </div>
  );
}
