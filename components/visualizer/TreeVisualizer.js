"use client";
import { motion } from "framer-motion";
import { TreePine, Info } from "lucide-react";

function buildBST(values) {
  class Node { constructor(v) { this.v = v; this.left = null; this.right = null; } }

  function insert(root, v) {
    if (!root) return new Node(v);
    if (v < root.v) root.left = insert(root.left, v);
    else if (v > root.v) root.right = insert(root.right, v);
    return root;
  }

  let root = null;
  for (const v of values) root = insert(root, v);

  function getHeight(node) {
    if (!node) return 0;
    return 1 + Math.max(getHeight(node.left), getHeight(node.right));
  }

  const height = getHeight(root);
  const W = 760;
  const H = Math.min(380, height * 80 + 40);
  const nodesOut = [];
  const edgesOut = [];

  function layout(node, x, y, spread) {
    if (!node) return;
    nodesOut.push({ id: node.v, val: node.v, x, y });
    const childY = y + 72;
    const childSpread = Math.max(24, spread / 1.7);
    if (node.left) {
      edgesOut.push({ from: node.v, to: node.left.v, x1: x, y1: y, x2: x - spread, y2: childY });
      layout(node.left, x - spread, childY, childSpread);
    }
    if (node.right) {
      edgesOut.push({ from: node.v, to: node.right.v, x1: x, y1: y, x2: x + spread, y2: childY });
      layout(node.right, x + spread, childY, childSpread);
    }
  }

  const initSpread = Math.min(180, W / (Math.pow(2, Math.ceil(height / 2)) * 0.8));
  layout(root, W / 2, 40, initSpread);

  const allX = nodesOut.map(n => n.x);
  const allY = nodesOut.map(n => n.y);
  const minX = Math.min(...allX) - 32;
  const maxX = Math.max(...allX) + 32;
  const minY = Math.min(...allY) - 32;
  const maxY = Math.max(...allY) + 32;
  const vw = maxX - minX;
  const vh = maxY - minY;

  return { nodes: nodesOut, edges: edgesOut, vw: Math.max(vw, 200), vh: Math.max(vh, 120), minX, minY };
}

function layoutCustomTree(rootObj) {
  if (!rootObj || typeof rootObj !== "object") return null;

  function getVal(node) {
    if (!node) return null;
    if (node.val !== undefined) return node.val;
    if (node.value !== undefined) return node.value;
    if (node.data !== undefined) return node.data;
    if (node.key !== undefined) return node.key;
    return null;
  }

  function getTreeHeight(node) {
    if (!node) return 0;
    return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
  }

  const height = getTreeHeight(rootObj);
  const W = 760;
  const nodesOut = [];
  const edgesOut = [];

  function layout(node, x, y, spread) {
    if (!node) return;
    const val = getVal(node);
    if (val === null) return;
    nodesOut.push({ id: val, val: val, x, y });
    const childY = y + 72;
    const childSpread = Math.max(24, spread / 1.7);
    if (node.left) {
      const leftVal = getVal(node.left);
      if (leftVal !== null) {
        edgesOut.push({ from: val, to: leftVal, x1: x, y1: y, x2: x - spread, y2: childY });
        layout(node.left, x - spread, childY, childSpread);
      }
    }
    if (node.right) {
      const rightVal = getVal(node.right);
      if (rightVal !== null) {
        edgesOut.push({ from: val, to: rightVal, x1: x, y1: y, x2: x + spread, y2: childY });
        layout(node.right, x + spread, childY, childSpread);
      }
    }
  }

  const initSpread = Math.min(180, W / (Math.pow(2, Math.ceil(height / 2)) * 0.8));
  layout(rootObj, W / 2, 40, initSpread);

  if (nodesOut.length === 0) return null;

  const allX = nodesOut.map(n => n.x);
  const allY = nodesOut.map(n => n.y);
  const minX = Math.min(...allX) - 32;
  const maxX = Math.max(...allX) + 32;
  const minY = Math.min(...allY) - 32;
  const maxY = Math.max(...allY) + 32;
  const vw = maxX - minX;
  const vh = maxY - minY;

  return { nodes: nodesOut, edges: edgesOut, vw: Math.max(vw, 200), vh: Math.max(vh, 120), minX, minY };
}

const DEFAULT_VALUES = [50, 30, 70, 20, 40, 60, 80, 10, 25];

const DIFF_LEGEND = [
  { color: "#f59e0b", label: "Current" },
  { color: "#60a5fa", label: "Visited"  },
  { color: "#f1f5f9", label: "Unvisited" },
];

export default function TreeVisualizer({ stepData, eli5Mode }) {
  if (!stepData) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center text-slate-400 gap-2">
          <Info size={20} />
          <span className="text-sm">Select a tree algorithm and press Play</span>
        </div>
      </div>
    );
  }

  const rawNodes = stepData.nodes || stepData.state?.nodes || [];
  const rawEdges = stepData.edges || stepData.state?.edges || [];
  const currentNode = stepData.currentNode !== undefined ? stepData.currentNode : stepData.state?.currentNode;
  
  // Smart visited list parsing to capture output prints or string lists
  const rawVisited = stepData.visited || stepData.state?.visited || [];
  let visitedList = [];
  if (Array.isArray(rawVisited)) {
    visitedList = rawVisited;
  } else if (typeof rawVisited === "string") {
    visitedList = rawVisited.trim().split(/[\s,->]+/);
  }
  if (visitedList.length === 0 && stepData.state) {
    const keys = ["output", "path", "traversal", "print", "visitedNodes"];
    for (const k of keys) {
      const val = stepData.state[k];
      if (typeof val === "string") {
        const parts = val.trim().split(/[\s,->]+/);
        if (parts.length > 0 && parts[0] !== "") visitedList = visitedList.concat(parts);
      } else if (Array.isArray(val)) {
        visitedList = visitedList.concat(val);
      }
    }
  }

  const description = stepData.description;

  // Look for a tree root variable in stepData.state to render changes dynamically
  let customTreeLayout = null;
  if (stepData.state) {
    const treeKeys = ["root", "tree", "node", "head"];
    for (const key of treeKeys) {
      const val = stepData.state[key];
      if (val && typeof val === "object" && (val.left !== undefined || val.right !== undefined || val.val !== undefined || val.value !== undefined)) {
        customTreeLayout = layoutCustomTree(val);
        if (customTreeLayout) break;
      }
    }
    if (!customTreeLayout) {
      const foundKey = Object.keys(stepData.state).find(k => {
        const val = stepData.state[k];
        return val && typeof val === "object" && (val.left !== undefined || val.right !== undefined);
      });
      if (foundKey) {
        customTreeLayout = layoutCustomTree(stepData.state[foundKey]);
      }
    }
  }

  const layoutResult = customTreeLayout || (
    rawNodes.length > 0
      ? (() => {
          const allX = rawNodes.map(n => n.x);
          const allY = rawNodes.map(n => n.y);
          const mX = Math.min(...allX) - 32;
          const mY = Math.min(...allY) - 32;
          const w  = Math.max(...allX) + 32 - mX;
          const h  = Math.max(...allY) + 32 - mY;
          return { nodes: rawNodes, edges: rawEdges, vw: w, vh: h, minX: mX, minY: mY };
        })()
      : buildBST(DEFAULT_VALUES)
  );

  const { nodes, edges, vw, vh, minX, minY } = layoutResult;

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <Header />

      {description && (
        <div className={`mx-6 mt-3 shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border self-center text-center max-w-2xl ${
          eli5Mode ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-blue-50 text-blue-800 border-blue-100"
        }`}>
          {description}
        </div>
      )}

      <div className="flex-1 flex items-start justify-center overflow-hidden px-4 pt-3">
        <svg
          viewBox={`${minX} ${minY} ${vw} ${vh}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
          style={{ maxHeight: "100%", maxWidth: "100%" }}
        >
          {edges.map((edge, i) => {
            const x1 = edge.x1 !== undefined ? edge.x1 : (nodes.find(n => n.id === edge.from)?.x ?? 0);
            const y1 = edge.y1 !== undefined ? edge.y1 : (nodes.find(n => n.id === edge.from)?.y ?? 0);
            const x2 = edge.x2 !== undefined ? edge.x2 : (nodes.find(n => n.id === edge.to)?.x ?? 0);
            const y2 = edge.y2 !== undefined ? edge.y2 : (nodes.find(n => n.id === edge.to)?.y ?? 0);
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#e2e8f0"
                strokeWidth={2}
              />
            );
          })}

          {nodes.map((node) => {
            const isCurrent = currentNode != null && (
              String(currentNode) === String(node.val) ||
              String(currentNode) === String(node.id) ||
              String(currentNode).includes(`(${node.val})`) ||
              String(currentNode).includes(` ${node.val}`)
            );
            const isVisited = visitedList.some(v =>
              String(v) === String(node.val) ||
              String(v) === String(node.id)
            );
            const fill      = isCurrent ? "#f59e0b" : isVisited ? "#60a5fa" : "#f8fafc";
            const stroke    = isCurrent ? "#d97706" : isVisited ? "#3b82f6" : "#cbd5e1";
            const textFill  = isCurrent || isVisited ? "white" : "#475569";
            return (
              <g key={`node-${node.id}`}>
                <motion.circle
                  cx={node.x} cy={node.y} r={22}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2.5}
                  animate={{ fill, stroke }}
                  transition={{ duration: 0.2 }}
                />
                <text
                  x={node.x} y={node.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={node.val >= 100 ? 11 : 13}
                  fontWeight="800"
                  fill={textFill}
                  style={{ userSelect: "none" }}
                >
                  {node.val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {visitedList.length > 0 && (
        <div className="shrink-0 px-6 pb-4 flex items-center gap-3 flex-wrap border-t border-slate-100 pt-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Traversal:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {visitedList.map((val, i) => (
              <motion.div
                key={`vis-${val}-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="w-9 h-9 rounded-xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-xs font-bold text-blue-700"
              >
                {val}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <div className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-slate-50">
      <div className="flex items-center gap-2">
        <TreePine size={16} className="text-amber-600" />
        <span className="text-sm font-bold text-slate-700">Tree Visualization</span>
      </div>
      <div className="flex items-center gap-4">
        {DIFF_LEGEND.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: color }} />
            <span className="text-xs text-slate-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
