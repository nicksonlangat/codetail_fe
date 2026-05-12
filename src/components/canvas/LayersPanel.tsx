"use client";
import { useState } from "react";
import { useReactFlow, type Node } from "@xyflow/react";
import { Server, Database, Zap, GitMerge, ListOrdered, Monitor, StickyNote, Layers, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TYPE_META: Record<string, { icon: React.ElementType; color: string }> = {
  server:      { icon: Server,      color: "text-blue-400" },
  database:    { icon: Database,    color: "text-orange-400" },
  cache:       { icon: Zap,         color: "text-red-400" },
  loadbalancer:{ icon: GitMerge,    color: "text-green-400" },
  queue:       { icon: ListOrdered, color: "text-purple-400" },
  client:      { icon: Monitor,     color: "text-sky-400" },
  text:        { icon: StickyNote,  color: "text-yellow-400" },
};

interface LayersPanelProps {
  nodes: Node[];
  onDeleteNode: (id: string) => void;
  notes: string;
  onNotesChange: (v: string) => void;
}

export function LayersPanel({ nodes, onDeleteNode, notes, onNotesChange }: LayersPanelProps) {
  const [tab, setTab] = useState<"layers" | "notes">("layers");
  const { setNodes, fitView } = useReactFlow();

  function selectNode(id: string) {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: n.id === id })));
    const node = nodes.find((n) => n.id === id);
    if (node) fitView({ nodes: [node], duration: 350, padding: 0.6 });
  }

  return (
    <aside className="flex h-full w-full flex-col bg-card overflow-hidden">
      {/* Tab bar */}
      <div className="flex shrink-0 border-b border-border">
        {(["layers", "notes"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative flex-1 py-2.5 text-[10px] font-semibold uppercase tracking-wider cursor-pointer transition-all duration-200 ${
              tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "layers" && <Layers className="mr-1 inline h-3 w-3" />}
            {t}
            {tab === t && (
              <motion.div
                layoutId="layer-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Layers tab */}
      {tab === "layers" && (
        <div className="flex-1 overflow-y-auto">
          <div className="px-2 py-1.5">
            <p className="mb-1.5 px-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/40">
              {nodes.length} {nodes.length === 1 ? "node" : "nodes"}
            </p>
            {nodes.length === 0 ? (
              <div className="py-8 text-center">
                <Layers className="mx-auto mb-2 h-6 w-6 text-muted-foreground/20" />
                <p className="text-[11px] text-muted-foreground/40">
                  Drag shapes onto<br />the canvas to start.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {nodes.map((node) => {
                  const d = node.data as { label?: string; text?: string };
                  const label = d.label ?? d.text ?? node.type ?? "Node";
                  const meta = TYPE_META[node.type ?? "server"] ?? TYPE_META.server;
                  const Icon = meta.icon;
                  return (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      onClick={() => selectNode(node.id)}
                      className="group flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-muted/60"
                    >
                      <Icon className={`h-3.5 w-3.5 shrink-0 ${meta.color}`} />
                      <span className="flex-1 truncate text-[11px]">{label}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); onDeleteNode(node.id); }}
                        className="hidden h-5 w-5 cursor-pointer items-center justify-center rounded text-muted-foreground/30 transition-colors duration-150 hover:text-destructive group-hover:flex"
                      >
                        <Trash2 className="h-3 w-3" />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      )}

      {/* Notes tab */}
      {tab === "notes" && (
        <div className="flex flex-1 flex-col overflow-hidden p-3">
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder={"Notes...\n\n• Key decisions\n• Trade-offs\n• Open questions"}
            className="flex-1 w-full resize-none bg-transparent text-[11px] leading-relaxed text-foreground/80 placeholder:text-muted-foreground/40 outline-none"
          />
          <p className="mt-2 shrink-0 border-t border-border pt-2 text-[9px] text-muted-foreground/40">
            {notes.length > 0 ? `${notes.length} chars` : "Empty"}
          </p>
        </div>
      )}
    </aside>
  );
}
