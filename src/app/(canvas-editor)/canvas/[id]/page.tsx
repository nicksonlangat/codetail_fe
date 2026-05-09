"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Pencil, Check, Download, Share2, Trash2 } from "lucide-react";
import { ReactFlowProvider } from "@xyflow/react";
import { toast } from "sonner";
import { useCanvasStore } from "@/stores/canvas-store";
import { useAuthStore } from "@/stores/auth-store";
import { CanvasEditor } from "@/components/canvas/CanvasEditor";

interface Props {
  params: Promise<{ id: string }>;
}

export default function CanvasEditorPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { canvases, renameCanvas, deleteCanvas, deleteCanvasFromAPI } = useCanvasStore();
  const { isAuthenticated } = useAuthStore();
  const canvas = canvases.find((c) => c.id === id);

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(canvas?.title ?? "");

  if (!canvas) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3">
        <p className="text-[14px] text-muted-foreground">Canvas not found.</p>
        <button
          onClick={() => router.push("/canvas")}
          className="text-[12px] text-primary underline cursor-pointer"
        >
          Back to canvases
        </button>
      </div>
    );
  }

  function handleDelete() {
    if (isAuthenticated) {
      deleteCanvasFromAPI(id).catch(() => {});
    } else {
      deleteCanvas(id);
    }
    router.push("/canvas");
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  }

  function handleExport() {
    toast.info("Export coming soon — PNG and SVG support in the next update.");
  }

  function commitTitle() {
    setEditingTitle(false);
    const trimmed = titleValue.trim();
    if (trimmed && trimmed !== canvas!.title) {
      renameCanvas(id, trimmed);
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Canvas header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-border bg-card px-4 py-2.5">
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={() => router.push("/canvas")}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-500"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </motion.button>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          {editingTitle ? (
            <input
              autoFocus
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitTitle();
                if (e.key === "Escape") { setEditingTitle(false); setTitleValue(canvas.title); }
              }}
              className="flex-1 min-w-0 rounded-md border border-primary/40 bg-background px-2 py-0.5 text-[13px] font-semibold outline-none"
            />
          ) : (
            <h1 className="text-[13px] font-semibold truncate">{canvas.title}</h1>
          )}

          {!editingTitle && (
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => { setTitleValue(canvas.title); setEditingTitle(true); }}
              className="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-muted-foreground/40 hover:text-muted-foreground transition-all duration-500"
            >
              <Pencil className="h-3 w-3" />
            </motion.button>
          )}
          {editingTitle && (
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={commitTitle}
              className="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-primary transition-all duration-500"
            >
              <Check className="h-3 w-3" />
            </motion.button>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={handleExport}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-muted-foreground shadow-sm hover:bg-muted/60 hover:text-foreground transition-all duration-150"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={handleShare}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-[11px] font-medium text-primary shadow-sm hover:bg-primary/20 transition-all duration-150"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={handleDelete}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/8 px-3 py-1.5 text-[11px] font-medium text-destructive shadow-sm hover:bg-destructive/15 hover:border-destructive/50 transition-all duration-150"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </motion.button>
        </div>
      </div>

      {/* Full-screen canvas body */}
      <div className="flex-1 overflow-hidden">
        <ReactFlowProvider>
          <CanvasEditor
            canvasId={id}
            initialNodes={canvas.nodes}
            initialEdges={canvas.edges}
            initialNotes={canvas.notes}
            onDelete={handleDelete}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
