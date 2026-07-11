"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, ArrowRight, Info } from "lucide-react";

const NULL_BOX = () => (
  <div className="flex items-center gap-1">
    <div className="w-14 h-12 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs font-bold">
      NULL
    </div>
  </div>
);

const NodeBox = ({ val, isHead, isTail, isCurrent, isHighlighted, slow, fast, index }) => {
  let bg = "bg-blue-50 border-blue-300 text-blue-800";
  let label = null;

  if (isCurrent) { bg = "bg-violet-500 border-violet-600 text-white shadow-lg shadow-violet-200"; }
  else if (isHighlighted) { bg = "bg-amber-400 border-amber-500 text-white shadow-lg shadow-amber-200"; }

  const badges = [];
  if (isHead) badges.push({ text: "HEAD", cls: "bg-emerald-100 text-emerald-700 border-emerald-300" });
  if (isTail) badges.push({ text: "TAIL", cls: "bg-rose-100 text-rose-700 border-rose-300" });
  if (slow === index) badges.push({ text: "🐢 SLOW", cls: "bg-blue-100 text-blue-700 border-blue-300" });
  if (fast === index) badges.push({ text: "⚡ FAST", cls: "bg-purple-100 text-purple-700 border-purple-300" });

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Labels above */}
      <div className="flex gap-1 min-h-5">
        {badges.map(b => (
          <span key={b.text} className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${b.cls}`}>{b.text}</span>
        ))}
      </div>

      {/* Box */}
      <motion.div
        layout
        animate={{ scale: isCurrent ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center font-black text-lg transition-all ${bg}`}
      >
        <span>{val}</span>
        <span className="text-[9px] font-semibold opacity-60">idx {index}</span>
      </motion.div>
    </div>
  );
};

export default function LinkedListVisualizer({ stepData, algorithmId, eli5Mode }) {
  if (!stepData) {
    return (
      <div className="flex-1 flex flex-col bg-white items-center justify-center">
        <Info size={20} className="text-slate-400 mb-2" />
        <span className="text-sm text-slate-400">Select a linked list algorithm and press Play</span>
      </div>
    );
  }

  const state = stepData.state || {};
  const description = stepData.description || "";

  // Extract node list from state
  let nodes = [];
  if (Array.isArray(state.list)) nodes = state.list;
  else if (Array.isArray(state.nodes)) nodes = state.nodes;
  else if (Array.isArray(state.items)) nodes = state.items;
  else if (Array.isArray(state.array)) nodes = state.array;

  const headIdx = state.head ?? 0;
  const tailIdx = state.tail ?? (nodes.length - 1);
  const currentIdx = state.current ?? state.curr ?? state.currentNode ?? null;
  const highlightIdx = state.highlight ?? null;
  const slow = state.slow ?? null;
  const fast = state.fast ?? null;
  const hasNext = state.hasNext ?? state.hasCycle;

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <Link2 size={16} className="text-purple-600" />
          <span className="text-sm font-bold text-slate-700">Linked List Visualization</span>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-violet-500" />
            <span className="text-xs text-slate-500">Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-amber-400" />
            <span className="text-xs text-slate-500">Highlighted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-blue-200 border border-blue-300" />
            <span className="text-xs text-slate-500">Regular</span>
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className={`mx-6 mt-3 shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border self-center text-center max-w-2xl ${
          eli5Mode ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-purple-50 text-purple-800 border-purple-100"
        }`}>
          {description}
        </div>
      )}

      {/* Linked list chain */}
      <div className="flex-1 flex items-center justify-center px-6 overflow-x-auto">
        <div className="flex items-center gap-0 flex-wrap justify-center">
          {nodes.map((val, i) => (
            <div key={`ll-${i}`} className="flex items-center">
              <NodeBox
                val={val}
                index={i}
                isHead={i === headIdx}
                isTail={i === tailIdx}
                isCurrent={currentIdx === i || currentIdx === val}
                isHighlighted={highlightIdx === i || highlightIdx === val}
                slow={slow}
                fast={fast}
              />
              {/* Arrow */}
              <div className="flex items-center mx-1 mt-5">
                {i < nodes.length - 1 ? (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="flex items-center gap-0.5"
                  >
                    <div className="w-6 h-0.5 bg-slate-400" />
                    <ArrowRight size={14} className="text-slate-400 -ml-1" />
                  </motion.div>
                ) : (
                  <div className="ml-1">
                    <NULL_BOX />
                  </div>
                )}
              </div>
            </div>
          ))}

          {nodes.length === 0 && (
            <div className="text-slate-300 text-sm font-semibold italic">
              List is empty — NULL
            </div>
          )}
        </div>
      </div>

      {/* ELI5 panel */}
      {eli5Mode && (
        <div className="shrink-0 mx-6 mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-sm font-bold text-amber-800 mb-1">🚂 Think of a train!</p>
          <p className="text-xs text-amber-700">
            Each train car (node) holds a value and is connected to the NEXT car via a link (arrow). To get to car #5, you have to start at the engine (HEAD) and walk through each car one by one!
          </p>
        </div>
      )}

      {/* Footer info */}
      <div className="shrink-0 px-6 pb-4 flex items-center gap-3 border-t border-slate-100 pt-3 flex-wrap">
        <span className="text-xs font-bold text-slate-500">Length: <span className="text-purple-700">{nodes.length}</span></span>
        {nodes.length > 0 && <>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs font-bold text-slate-500">Head: <span className="text-emerald-700">{nodes[0]}</span></span>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs font-bold text-slate-500">Tail: <span className="text-rose-700">{nodes[nodes.length - 1]}</span></span>
        </>}
        {hasNext !== undefined && (
          <>
            <span className="text-xs text-slate-400">|</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${hasNext ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
              {hasNext ? "🔄 Cycle Detected!" : "✅ No Cycle"}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
