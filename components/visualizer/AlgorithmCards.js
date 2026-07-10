"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2, Search, Network, TreePine, Layers, Shuffle,
  Hash, GitBranch, X, ChevronRight, Clock, HardDrive,
  GraduationCap, Code2, BookOpen, Zap, ChevronDown
} from "lucide-react";
import { ALGORITHM_LIBRARY } from "@/lib/algorithms/index";

const CATEGORY_META = {
  arrays:         { icon: Shuffle,   color: "#3b82f6", bg: "#f0f7ff", border: "#dbeafe", tag: "bg-blue-100 text-blue-800" },
  datastructures: { icon: Hash,      color: "#6366f1", bg: "#eef2ff", border: "#e0e7ff", tag: "bg-indigo-100 text-indigo-800" },
  sorting:        { icon: BarChart2, color: "#8b5cf6", bg: "#f5f3ff", border: "#ede9fe", tag: "bg-violet-100 text-violet-800" },
  searching:      { icon: Search,    color: "#ec4899", bg: "#fdf2f8", border: "#fce7f3", tag: "bg-pink-100 text-pink-800" },
  graph:          { icon: Network,   color: "#10b981", bg: "#ecfdf5", border: "#d1fae5", tag: "bg-emerald-100 text-emerald-800" },
  tree:           { icon: TreePine,  color: "#f59e0b", bg: "#fffbeb", border: "#fef3c7", tag: "bg-amber-100 text-amber-800" },
  dp:             { icon: Layers,    color: "#ef4444", bg: "#fef2f2", border: "#fee2e2", tag: "bg-rose-100 text-rose-800" },
  strings:        { icon: Shuffle,   color: "#db2777", bg: "#fdf2f8", border: "#fbcfe8", tag: "bg-pink-100 text-pink-800" },
  backtracking:   { icon: GitBranch, color: "#06b6d4", bg: "#f0fdfa", border: "#ccfbf1", tag: "bg-teal-100 text-teal-800" },
  math:           { icon: GraduationCap, color: "#14b8a6", bg: "#f0fdf4", border: "#dcfce7", tag: "bg-emerald-100 text-emerald-800" }
};

const DIFFICULTY_STYLE = {
  Beginner:     { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
  Intermediate: { bg: "bg-amber-50 text-amber-700 border-amber-100", dot: "bg-amber-500" },
  Advanced:     { bg: "bg-rose-50 text-rose-700 border-rose-100", dot: "bg-rose-500" },
  Expert:       { bg: "bg-violet-50 text-violet-700 border-violet-100", dot: "bg-violet-500" },
};

const ALGO_DETAILS = {
  bubble:          { best: "O(n)",       avg: "O(n²)",        worst: "O(n²)",        stable: true,  desc: "Repeatedly compares adjacent elements and swaps them if they are in the wrong order. Simple but inefficient for large datasets." },
  selection:       { best: "O(n²)",      avg: "O(n²)",        worst: "O(n²)",        stable: false, desc: "Finds the minimum element repeatedly from the unsorted portion and places it at the beginning. Always performs O(n²) comparisons." },
  insertion:       { best: "O(n)",       avg: "O(n²)",        worst: "O(n²)",        stable: true,  desc: "Builds the sorted array one element at a time by inserting each element into its correct position. Efficient for small or nearly sorted arrays." },
  merge:           { best: "O(n log n)", avg: "O(n log n)",   worst: "O(n log n)",   stable: true,  desc: "Divides the array into halves, sorts each half recursively, then merges them. Guarantees O(n log n) in all cases. Requires O(n) extra space." },
  quick:           { best: "O(n log n)", avg: "O(n log n)",   worst: "O(n²)",        stable: false, desc: "Picks a pivot, partitions elements around it, and recursively sorts sub-arrays. Very fast in practice. Worst case occurs with already-sorted arrays." },
  heap:            { best: "O(n log n)", avg: "O(n log n)",   worst: "O(n log n)",   stable: false, desc: "Uses a max-heap to sort elements. First builds a heap, then extracts the maximum repeatedly. Guarantees O(n log n) with O(1) space." },
  shell:           { best: "O(n log n)", avg: "O(n log² n)",  worst: "O(n²)",        stable: false, desc: "Generalization of insertion sort that allows exchange of far-apart elements. Uses a gap sequence that reduces to 1 (standard insertion sort)." },
  counting:        { best: "O(n+k)",     avg: "O(n+k)",       worst: "O(n+k)",       stable: true,  desc: "Counts occurrences of each value to determine positions. Not comparison-based. Only works for non-negative integers within a known range k." },
  comb:            { best: "O(n log n)", avg: "O(n²/2ᵖ)",     worst: "O(n²)",        stable: false, desc: "Improvement over Bubble Sort using a shrink factor (~1.3) to eliminate small values near the end (turtles) faster." },
  bfs:             { best: "O(V+E)",     avg: "O(V+E)",       worst: "O(V+E)",       stable: null,  desc: "Explores a graph level by level using a queue. Guarantees shortest path in unweighted graphs. V = vertices, E = edges." },
  dfs:             { best: "O(V+E)",     avg: "O(V+E)",       worst: "O(V+E)",       stable: null,  desc: "Explores as far as possible along each branch before backtracking. Uses a stack (recursion). Used for cycle detection, topological sort." },
  dijkstra:        { best: "O(E)",       avg: "O((V+E)logV)", worst: "O((V+E)logV)", stable: null,  desc: "Finds shortest paths from a source vertex to all others in a weighted graph with non-negative edges. Uses a priority queue (min-heap)." },
  "bst-insert":    { best: "O(log n)",   avg: "O(log n)",     worst: "O(n)",          stable: null,  desc: "Inserts a new key into a BST. Navigate left if smaller, right if larger, insert at the leaf. Worst case is a degenerate (linear) tree." },
  inorder:         { best: "O(n)",       avg: "O(n)",         worst: "O(n)",          stable: null,  desc: "Traverses Left → Root → Right. Produces keys in sorted (ascending) order for a BST. Uses O(h) stack space where h is tree height." },
  preorder:        { best: "O(n)",       avg: "O(n)",         worst: "O(n)",          stable: null,  desc: "Traverses Root → Left → Right. Used to create a copy of the tree or serialize it. The root is always visited first." },
  postorder:       { best: "O(n)",       avg: "O(n)",         worst: "O(n)",          stable: null,  desc: "Traverses Left → Right → Root. Used to delete a tree or evaluate expression trees. Children are processed before parent." },
  fibonacci:       { best: "O(n)",       avg: "O(n)",         worst: "O(n)",          stable: null,  desc: "DP approach: dp[i] = dp[i-1] + dp[i-2]. Reduces from exponential O(2ⁿ) naive recursion to linear O(n) by memoizing subproblems." },
  lcs:             { best: "O(mn)",      avg: "O(mn)",        worst: "O(mn)",         stable: null,  desc: "Finds the longest subsequence common to both sequences. Uses a 2D DP table where dp[i][j] = LCS length of prefixes of length i and j." },
  binary:          { best: "O(1)",       avg: "O(log n)",     worst: "O(log n)",      stable: null,  desc: "Searches a sorted array by repeatedly halving the search space. Requires sorted input. O(1) if element is at the midpoint." },
  kmp:             { best: "O(n+m)",     avg: "O(n+m)",       worst: "O(n+m)",        stable: null,  desc: "Knuth-Morris-Pratt avoids redundant comparisons using a failure function (prefix table) to skip characters on mismatch. Always O(n+m)." },
};

const DEFAULT_DETAIL = (algo) => ({
  best: algo.complexity.time,
  avg:  algo.complexity.time,
  worst: algo.complexity.time,
  stable: null,
  desc: `${algo.name} — ${algo.complexity.time} time, ${algo.complexity.space} space.`,
});

export default function AlgorithmCards({ onSelectAlgorithm, onClose }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedAlgo, setSelectedAlgo] = useState(null);
  const [search, setSearch] = useState("");

  const allAlgos = Object.entries(ALGORITHM_LIBRARY).flatMap(([cat, data]) =>
    data.algorithms.map(algo => ({ ...algo, category: cat, categoryLabel: data.label }))
  );

  const filtered = allAlgos.filter(algo => {
    const matchCat = activeCategory === "all" || algo.category === activeCategory;
    const matchSearch = !search || algo.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#fafafa]">
      <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">DSA Library Catalog</h1>
          <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">{allAlgos.length} Active Algorithms Available</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Quick search..."
              className="pl-9 pr-4 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-52 transition-all"
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 bg-white text-slate-700 hover:text-slate-900"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2 px-6 py-3 border-b border-slate-100 bg-white overflow-x-auto">
        <button
          onClick={() => setActiveCategory("all")}
          className={`shrink-0 px-4 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
            activeCategory === "all"
              ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-200"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          }`}
        >
          All ({allAlgos.length})
        </button>
        {Object.entries(ALGORITHM_LIBRARY).map(([cat, data]) => {
          const meta = CATEGORY_META[cat] || { icon: Layers, color: "#4f46e5" };
          const Icon = meta.icon;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                activeCategory === cat
                  ? "text-white border-transparent shadow-md"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
              style={activeCategory === cat ? { backgroundColor: meta.color, boxShadow: `0 4px 10px ${meta.color}30` } : {}}
            >
              <Icon size={12} />
              {data.label} ({data.algorithms.length})
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((algo) => {
            const meta = CATEGORY_META[algo.category] || { icon: Layers, color: "#4f46e5", bg: "#f5f3ff", border: "#ddd6fe" };
            const Icon = meta.icon;
            const diff = DIFFICULTY_STYLE[algo.difficulty] || DIFFICULTY_STYLE.Beginner;
            return (
              <motion.button
                key={`${algo.category}-${algo.id}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedAlgo({ ...algo, meta })}
                className="text-left bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
                style={{
                  borderLeft: `4px solid ${meta.color}`
                }}
                whileHover={{ scale: 1.015, y: -2 }}
                whileTap={{ scale: 0.985 }}
              >
                <div className="w-full">
                  <div className="flex items-center justify-between mb-3.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center border"
                      style={{ backgroundColor: meta.color + "12", borderColor: meta.color + "25" }}
                    >
                      <Icon size={14} style={{ color: meta.color }} />
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${diff.bg}`}>
                      {algo.difficulty}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-800 text-sm leading-snug mb-3.5 group-hover:text-blue-600 transition-colors">
                    {algo.name}
                  </h3>
                </div>

                <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Clock size={11} className="text-slate-400" />
                      <span className="font-mono">{algo.complexity.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HardDrive size={11} className="text-slate-400" />
                      <span className="font-mono">{algo.complexity.space}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <Search size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-bold text-sm">No algorithms found for "{search}"</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedAlgo && (
          <AlgoDetailModal
            algo={selectedAlgo}
            onClose={() => setSelectedAlgo(null)}
            onVisualize={(cat, id) => { onSelectAlgorithm(cat, id); onClose(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AlgoDetailModal({ algo, onClose, onVisualize }) {
  const detail = ALGO_DETAILS[algo.id] || DEFAULT_DETAIL(algo);
  const diff = DIFFICULTY_STYLE[algo.difficulty] || DIFFICULTY_STYLE.Beginner;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 450, damping: 32 }}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100"
        onClick={e => e.stopPropagation()}
      >
        <div
          className="p-6 pb-5"
          style={{ backgroundColor: algo.meta.bg, borderBottom: `1.5px solid ${algo.meta.border}` }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center border"
                style={{ backgroundColor: algo.meta.color + "20", borderColor: algo.meta.border }}
              >
                <algo.meta.icon size={20} style={{ color: algo.meta.color }} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1.5">{algo.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{algo.categoryLabel}</span>
                  <span className="text-slate-300">·</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${diff.bg}`}>
                    {algo.difficulty}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/5 transition-colors border border-black/10">
              <X size={16} className="text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-xs font-semibold text-slate-600 leading-relaxed">{detail.desc}</p>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Complexity Matrix</div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: "Best Time",    val: detail.best  },
                { label: "Average Time", val: detail.avg   },
                { label: "Worst Time",   val: detail.worst },
              ].map(({ label, val }) => (
                <div key={label} className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{label}</div>
                  <div className="text-xs font-extrabold text-slate-800 font-mono">{val}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Space Complexity</div>
                <div className="text-sm font-extrabold text-slate-800 font-mono">{algo.complexity.space}</div>
              </div>
              <HardDrive size={16} className="text-slate-400" />
            </div>
            {detail.stable !== null && (
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Stable Sort</div>
                  <div className={`text-sm font-extrabold ${detail.stable ? "text-emerald-600" : "text-rose-600"}`}>
                    {detail.stable ? "Yes" : "No"}
                  </div>
                </div>
                <Zap size={16} className="text-slate-400" />
              </div>
            )}
          </div>

          <button
            onClick={() => onVisualize(algo.category, algo.id)}
            className="w-full py-3.5 rounded-xl font-extrabold text-xs text-white transition-all hover:opacity-95 hover:shadow-lg active:scale-98 flex items-center justify-center gap-1.5 uppercase tracking-wider"
            style={{ backgroundColor: algo.meta.color, boxShadow: `0 4px 12px ${algo.meta.color}35` }}
          >
            <Zap size={13} />
            Start Dynamic Visualization
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
