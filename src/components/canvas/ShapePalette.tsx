"use client";
import { Server, Database, Zap, GitMerge, ListOrdered, Monitor, StickyNote, GripVertical } from "lucide-react";
import { motion } from "framer-motion";

export const SHAPE_DEFINITIONS = [
  {
    type: "server",
    label: "Server",
    subtitle: "FastAPI / Node",
    icon: Server,
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    cardBg: "bg-blue-500/[0.06]",
    border: "border-blue-500/20 hover:border-blue-500/40",
  },
  {
    type: "database",
    label: "Database",
    subtitle: "PostgreSQL",
    icon: Database,
    iconBg: "bg-orange-500/20",
    iconColor: "text-orange-400",
    cardBg: "bg-orange-500/[0.06]",
    border: "border-orange-500/20 hover:border-orange-500/40",
  },
  {
    type: "cache",
    label: "Cache",
    subtitle: "Redis",
    icon: Zap,
    iconBg: "bg-red-500/20",
    iconColor: "text-red-400",
    cardBg: "bg-red-500/[0.06]",
    border: "border-red-500/20 hover:border-red-500/40",
  },
  {
    type: "loadbalancer",
    label: "Load Balancer",
    subtitle: "Nginx / ALB",
    icon: GitMerge,
    iconBg: "bg-green-500/20",
    iconColor: "text-green-400",
    cardBg: "bg-green-500/[0.06]",
    border: "border-green-500/20 hover:border-green-500/40",
  },
  {
    type: "queue",
    label: "Queue",
    subtitle: "Celery / Kafka",
    icon: ListOrdered,
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-400",
    cardBg: "bg-purple-500/[0.06]",
    border: "border-purple-500/20 hover:border-purple-500/40",
  },
  {
    type: "client",
    label: "Client",
    subtitle: "Browser / Mobile",
    icon: Monitor,
    iconBg: "bg-sky-500/20",
    iconColor: "text-sky-400",
    cardBg: "bg-sky-500/[0.06]",
    border: "border-sky-500/20 hover:border-sky-500/40",
  },
  {
    type: "text",
    label: "Note",
    subtitle: "Freeform text",
    icon: StickyNote,
    iconBg: "bg-yellow-500/20",
    iconColor: "text-yellow-400",
    cardBg: "bg-yellow-500/[0.06]",
    border: "border-yellow-500/20 hover:border-yellow-500/40",
  },
] as const;

export type ShapeType = (typeof SHAPE_DEFINITIONS)[number]["type"];

interface ShapePaletteProps {
  onDragStart: (type: ShapeType, label: string, subtitle: string) => void;
}

export function ShapePalette({ onDragStart }: ShapePaletteProps) {
  return (
    <aside className="flex h-full w-full flex-col bg-card">
      <div className="border-b border-border px-3 py-2.5 shrink-0">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Shapes
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {SHAPE_DEFINITIONS.map((shape, i) => {
          const Icon = shape.icon;
          return (
            <motion.div
              key={shape.type}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30, delay: i * 0.04 }}
              draggable
              onDragStart={() => onDragStart(shape.type, shape.label, shape.subtitle)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              className={`flex cursor-grab items-center gap-2.5 rounded-xl border px-2.5 py-2.5 transition-all duration-300 active:cursor-grabbing ${shape.cardBg} ${shape.border}`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${shape.iconBg}`}>
                <Icon className={`h-4 w-4 ${shape.iconColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold leading-tight">{shape.label}</p>
                <p className="text-[9px] text-muted-foreground/70 truncate">{shape.subtitle}</p>
              </div>
              <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/20" />
            </motion.div>
          );
        })}
      </div>

      <div className="shrink-0 border-t border-border px-3 py-2.5">
        <p className="text-[9px] text-muted-foreground/40 leading-relaxed">
          Drag onto canvas · Connect via handles
        </p>
      </div>
    </aside>
  );
}
