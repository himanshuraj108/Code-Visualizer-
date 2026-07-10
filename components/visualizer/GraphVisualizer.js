"use client";
import { motion } from "framer-motion";
import { Network, Info } from "lucide-react";

const GRAPH = {
  nodes: [
    { id: 'A', x: 250, y: 60 },
    { id: 'B', x: 120, y: 180 },
    { id: 'C', x: 380, y: 180 },
    { id: 'D', x: 60,  y: 320 },
    { id: 'E', x: 200, y: 320 },
    { id: 'F', x: 380, y: 320 },
  ],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'B', to: 'E', weight: 3 },
    { from: 'C', to: 'E', weight: 1 },
    { from: 'C', to: 'F', weight: 6 },
    { from: 'D', to: 'E', weight: 2 },
    { from: 'E', to: 'F', weight: 4 },
  ],
};

export default function GraphVisualizer({ stepData, eli5Mode }) {
  if (!stepData) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Network size={16} className="text-emerald-600" />
            <span className="text-sm font-semibold text-slate-700">Graph Visualization</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-400 gap-2">
          <Info size={20} />
          <span className="text-sm">Select a graph algorithm and press Play</span>
        </div>
      </div>
    );
  }

  const { visitedNodes = [], visitedEdges = [], currentNode, description, queue = [] } = stepData;
  const graph = stepData.graph || GRAPH;

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-slate-50 shrink-0">
        <div className="flex items-center gap-2">
          <Network size={16} className="text-emerald-600" />
          <span className="text-sm font-semibold text-slate-700">Graph Visualization</span>
        </div>
        <div className="flex items-center gap-4">
          {[
            { color: "#fbbf24", label: "Current" },
            { color: "#60a5fa", label: "Visited" },
            { color: "#e2e8f0", label: "Unvisited" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {description && (
        <div className={`mx-6 mt-3 px-4 py-2.5 rounded-xl text-sm font-semibold border self-center text-center max-w-xl ${
          eli5Mode ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-emerald-50 text-emerald-800 border-emerald-100"
        }`}>
          {description}
        </div>
      )}

      <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
        <svg viewBox="0 0 460 400" className="w-full max-w-lg" style={{ maxHeight: 360 }}>
          {graph.edges.map((edge, i) => {
            const from = graph.nodes.find(n => n.id === edge.from);
            const to   = graph.nodes.find(n => n.id === edge.to);
            if (!from || !to) return null;
            const isVisited = visitedEdges.includes(`${edge.from}-${edge.to}`) || visitedEdges.includes(`${edge.to}-${edge.from}`);
            const mx = (from.x + to.x) / 2;
            const my = (from.y + to.y) / 2;
            return (
              <g key={i}>
                <motion.line
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  strokeWidth={isVisited ? 3 : 1.5}
                  animate={{ stroke: isVisited ? "#3b82f6" : "#cbd5e1" }}
                  transition={{ duration: 0.3 }}
                />
                <rect x={mx - 10} y={my - 9} width={20} height={16} rx={4} fill="white" />
                <text x={mx} y={my + 4} textAnchor="middle" fontSize={11} fontWeight="600" fill="#94a3b8">{edge.weight}</text>
              </g>
            );
          })}

          {graph.nodes.map((node) => {
            const isVisited = visitedNodes.includes(node.id);
            const isCurrent = currentNode === node.id;
            const fill   = isCurrent ? "#f59e0b" : isVisited ? "#3b82f6" : "#f1f5f9";
            const stroke = isCurrent ? "#d97706" : isVisited ? "#1d4ed8" : "#cbd5e1";
            const textFill = isVisited || isCurrent ? "white" : "#475569";
            return (
              <g key={node.id}>
                <motion.circle
                  cx={node.x} cy={node.y} r={28}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2.5}
                  animate={{ fill, stroke, scale: isCurrent ? 1.2 : 1 }}
                  transition={{ duration: 0.25, type: "spring", stiffness: 300 }}
                />
                <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize={16} fontWeight="800" fill={textFill}>
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {queue.length > 0 && (
        <div className="px-6 pb-4 flex items-center gap-3 shrink-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Queue:</span>
          <div className="flex items-center gap-2">
            {queue.map((item, i) => (
              <motion.div
                key={`${item}-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-9 h-9 rounded-xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-sm font-bold text-blue-700"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
