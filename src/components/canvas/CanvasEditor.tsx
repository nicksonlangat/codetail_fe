"use client";
import { useCallback, useRef, useState, useMemo } from "react";
import {
  ReactFlow, Background, Controls, MiniMap, addEdge,
  useNodesState, useEdgesState, BackgroundVariant,
  ConnectionMode, type OnConnect, type Node, type Edge,
  type NodeTypes, MarkerType, ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { ServerNode }      from "./nodes/ServerNode";
import { DatabaseNode }    from "./nodes/DatabaseNode";
import { CacheNode }       from "./nodes/CacheNode";
import { LoadBalancerNode }from "./nodes/LoadBalancerNode";
import { QueueNode }       from "./nodes/QueueNode";
import { ClientNode }      from "./nodes/ClientNode";
import { TextNode }        from "./nodes/TextNode";
import { ShapePalette, type ShapeType } from "./ShapePalette";
import { LayersPanel }     from "./LayersPanel";
import { ResizeHandle }    from "./ResizeHandle";
import { CanvasToolbar }   from "./CanvasToolbar";
import { useCanvasStore }  from "@/stores/canvas-store";

const TEAL = "#1fad87";
const NODE_TYPES: NodeTypes = {
  server: ServerNode, database: DatabaseNode, cache: CacheNode,
  loadbalancer: LoadBalancerNode, queue: QueueNode,
  client: ClientNode, text: TextNode,
};
const EDGE_STYLE = {
  type: "straight",
  markerEnd: { type: MarkerType.ArrowClosed, color: TEAL },
  style: { stroke: TEAL, strokeWidth: 1.5 },
};

type Snapshot = { nodes: Node[]; edges: Edge[] };

const LEFT_DEFAULT = 210; const LEFT_MIN = 150; const LEFT_MAX = 300;
const RIGHT_DEFAULT = 240; const RIGHT_MIN = 160; const RIGHT_MAX = 380;

interface Props {
  canvasId: string; initialNodes: Node[]; initialEdges: Edge[]; initialNotes: string;
  onDelete?: () => void;
}

export function CanvasEditor({ canvasId, initialNodes, initialEdges, initialNotes, onDelete }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [notes, setNotes]     = useState(initialNotes);
  const [leftW, setLeftW]     = useState(LEFT_DEFAULT);
  const [rightW, setRightW]   = useState(RIGHT_DEFAULT);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [dragType, setDragType] = useState<{ type: ShapeType; label: string; subtitle: string } | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const updateNodes = useCanvasStore((s) => s.updateNodes);
  const updateEdges = useCanvasStore((s) => s.updateEdges);
  const updateNotes = useCanvasStore((s) => s.updateNotes);

  const pushHistory = useCallback((n: Node[], e: Edge[]) =>
    setHistory((h) => [...h.slice(-30), { nodes: [...n], edges: [...e] }]), []);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setNodes(prev.nodes); setEdges(prev.edges);
      updateNodes(canvasId, prev.nodes); updateEdges(canvasId, prev.edges);
      return h.slice(0, -1);
    });
  }, [setNodes, setEdges, canvasId, updateNodes, updateEdges]);

  const undoRef = useRef(undo); undoRef.current = undo;
  useMemo(() => {
    if (typeof window === "undefined") return;
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); undoRef.current(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const onConnect: OnConnect = useCallback((params) => {
    pushHistory(nodes, edges);
    setEdges((eds) => { const next = addEdge({ ...params, ...EDGE_STYLE }, eds); updateEdges(canvasId, next); return next; });
  }, [nodes, edges, pushHistory, setEdges, canvasId, updateEdges]);

  const onNodeDragStop = useCallback((_e: React.MouseEvent, _n: Node, all: Node[]) => {
    updateNodes(canvasId, all);
  }, [canvasId, updateNodes]);

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!dragType || !reactFlowWrapper.current) return;
    const b = reactFlowWrapper.current.getBoundingClientRect();
    const newNode: Node = {
      id: crypto.randomUUID(), type: dragType.type,
      position: { x: e.clientX - b.left - 65, y: e.clientY - b.top - 22 },
      data: dragType.type === "text" ? { text: "Note..." } : { label: dragType.label, subtitle: dragType.subtitle },
    };
    pushHistory(nodes, edges);
    setNodes((nds) => { const next = nds.concat(newNode); updateNodes(canvasId, next); return next; });
    setDragType(null);
  }, [dragType, nodes, edges, pushHistory, setNodes, canvasId, updateNodes]);

  const deleteNode = useCallback((id: string) => {
    pushHistory(nodes, edges);
    setNodes((nds) => { const next = nds.filter((n) => n.id !== id); updateNodes(canvasId, next); return next; });
    setEdges((eds) => { const next = eds.filter((e) => e.source !== id && e.target !== id); updateEdges(canvasId, next); return next; });
  }, [nodes, edges, pushHistory, setNodes, setEdges, canvasId, updateNodes, updateEdges]);

  const onNodesDelete = useCallback((del: Node[]) => {
    if (!del.length) return; pushHistory(nodes, edges);
    setTimeout(() => {
      setNodes((nds) => { updateNodes(canvasId, nds); return nds; });
      setEdges((eds) => { updateEdges(canvasId, eds); return eds; });
    }, 0);
  }, [nodes, edges, pushHistory, setNodes, setEdges, canvasId, updateNodes, updateEdges]);

  const onEdgesDelete = useCallback((del: Edge[]) => {
    if (!del.length) return; pushHistory(nodes, edges);
    setTimeout(() => { setEdges((eds) => { updateEdges(canvasId, eds); return eds; }); }, 0);
  }, [nodes, edges, pushHistory, setEdges, canvasId, updateEdges]);

  const notesTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleNotesChange = useCallback((v: string) => {
    setNotes(v);
    if (notesTimerRef.current) clearTimeout(notesTimerRef.current);
    notesTimerRef.current = setTimeout(() => updateNotes(canvasId, v), 500);
  }, [canvasId, updateNotes]);
  const handleLeftResize  = useCallback((d: number) => setLeftW((w)  => Math.min(LEFT_MAX,  Math.max(LEFT_MIN,  w + d))), []);
  const handleRightResize = useCallback((d: number) => setRightW((w) => Math.min(RIGHT_MAX, Math.max(RIGHT_MIN, w - d))), []);

  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  return (
    <div className="flex h-full w-full overflow-hidden">

      {/* ── Left: Shapes ── */}
      <div style={{ width: leftW }} className="shrink-0 overflow-hidden">
        <ShapePalette onDragStart={(type, label, subtitle) => setDragType({ type, label, subtitle })} />
      </div>

      <ResizeHandle onResize={handleLeftResize} />

      {/* ── Center: Canvas ── */}
      <div ref={reactFlowWrapper} className="relative flex-1 overflow-hidden" onDrop={onDrop} onDragOver={onDragOver}>
        <CanvasToolbar canUndo={history.length > 0} onUndo={undo} edgeCount={edges.length} nodeCount={nodes.length} />
        <ReactFlow
          nodes={nodes} edges={edges}
          onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
          onConnect={onConnect} onNodeDragStop={onNodeDragStop}
          onNodesDelete={onNodesDelete} onEdgesDelete={onEdgesDelete}
          nodeTypes={NODE_TYPES} defaultEdgeOptions={EDGE_STYLE}
          connectionMode={ConnectionMode.Loose}
          connectionLineType={ConnectionLineType.Straight}
          connectionLineStyle={{ stroke: TEAL, strokeWidth: 1.5 }}
          fitView proOptions={proOptions} deleteKeyCode="Backspace"
          className="h-full bg-background"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(var(--border))" />
          <Controls className="!border-border !bg-card !shadow-sm [&>button]:!bg-card [&>button]:!border-border [&>button:hover]:!bg-muted" />
          <MiniMap nodeColor={() => `${TEAL}55`} maskColor="hsl(var(--background)/0.7)"
            className="!border-border !bg-card !rounded-xl overflow-hidden" />
        </ReactFlow>
      </div>

      <ResizeHandle onResize={handleRightResize} />

      {/* ── Right: Layers + Notes ── */}
      <div style={{ width: rightW }} className="shrink-0 overflow-hidden border-l border-border">
        <LayersPanel
          nodes={nodes} onDeleteNode={deleteNode}
          notes={notes} onNotesChange={handleNotesChange}
        />
      </div>

    </div>
  );
}
