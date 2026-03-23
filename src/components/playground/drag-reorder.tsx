"use client";

import { useState } from "react";
import { Reorder, motion } from "framer-motion";
import { GripVertical } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

interface Item {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const initialItems: Item[] = [
  { id: "tp", title: "Two Pointers", difficulty: "Easy" },
  { id: "sw", title: "Sliding Window", difficulty: "Medium" },
  { id: "bs", title: "Binary Search", difficulty: "Easy" },
  { id: "dfs", title: "DFS", difficulty: "Medium" },
  { id: "dp", title: "Dynamic Programming", difficulty: "Hard" },
];

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-500/10 text-green-600",
  Medium: "bg-yellow-500/10 text-yellow-700",
  Hard: "bg-red-500/10 text-red-600",
};

function ReorderItem({ item, index }: { item: Item; index: number }) {
  return (
    <Reorder.Item
      value={item}
      id={item.id}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-card border border-border cursor-pointer select-none transition-all duration-500"
      style={{ touchAction: "none" }}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        backgroundColor: "var(--card)",
        zIndex: 50,
      }}
      transition={spring}
      layout
    >
      <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 cursor-grab active:cursor-grabbing" />

      <motion.span
        layout
        className="w-6 h-6 rounded-md bg-muted text-muted-foreground text-[11px] font-mono flex items-center justify-center flex-shrink-0 transition-all duration-500"
      >
        {index + 1}
      </motion.span>

      <span className="text-[13px] font-medium text-foreground flex-1">{item.title}</span>

      <span
        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${difficultyColor[item.difficulty]} transition-all duration-500`}
      >
        {item.difficulty}
      </span>
    </Reorder.Item>
  );
}

export function DragReorder() {
  const [items, setItems] = useState(initialItems);

  return (
    <div className="py-6 space-y-4">
      <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 mb-3">
        Drag to reorder
      </p>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="space-y-1.5"
        as="div"
      >
        {items.map((item, i) => (
          <ReorderItem key={item.id} item={item} index={i} />
        ))}
      </Reorder.Group>

      <motion.p
        className="text-[10px] text-muted-foreground mt-2"
        layout
        transition={spring}
      >
        Current order:{" "}
        <span className="font-mono text-foreground">
          {items.map((item) => item.title).join(" → ")}
        </span>
      </motion.p>

      <motion.button
        className="text-[11px] text-primary font-medium cursor-pointer transition-all duration-500 hover:underline"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={spring}
        onClick={() => setItems(initialItems)}
      >
        Reset order
      </motion.button>
    </div>
  );
}
