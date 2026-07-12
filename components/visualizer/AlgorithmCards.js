"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
 BarChart2, Search, Network, TreePine, Layers, Shuffle,
 Hash, GitBranch, X, ChevronRight, Clock, HardDrive,
 GraduationCap, Code2, Zap, Play, Star, TrendingUp, Link2
} from "lucide-react";
import { ALGORITHM_LIBRARY } from "@/lib/algorithms/index";

const CATEGORY_META = {
 arrays: { icon: Shuffle, color: "#f97316", gradient: "from-orange-500 to-amber-500", bg: "from-orange-50 to-amber-50", border: "#fed7aa", glow: "#f9731620" },
 datastructures: { icon: Hash, color: "#8b5cf6", gradient: "from-violet-500 to-purple-600", bg: "from-violet-50 to-purple-50", border: "#ddd6fe", glow: "#8b5cf620" },
 sorting: { icon: BarChart2, color: "#3b82f6", gradient: "from-blue-500 to-indigo-600", bg: "from-blue-50 to-indigo-50", border: "#bfdbfe", glow: "#3b82f620" },
 searching: { icon: Search, color: "#ec4899", gradient: "from-pink-500 to-rose-500", bg: "from-pink-50 to-rose-50", border: "#fbcfe8", glow: "#ec489920" },
 graph: { icon: Network, color: "#10b981", gradient: "from-emerald-500 to-teal-500", bg: "from-emerald-50 to-teal-50", border: "#a7f3d0", glow: "#10b98120" },
 tree: { icon: TreePine, color: "#f59e0b", gradient: "from-amber-500 to-yellow-500", bg: "from-amber-50 to-yellow-50", border: "#fde68a", glow: "#f59e0b20" },
 dp: { icon: Layers, color: "#ef4444", gradient: "from-red-500 to-rose-600", bg: "from-red-50 to-rose-50", border: "#fecaca", glow: "#ef444420" },
 strings: { icon: Code2, color: "#db2777", gradient: "from-pink-600 to-fuchsia-600", bg: "from-pink-50 to-fuchsia-50", border: "#f9a8d4", glow: "#db277720" },
 backtracking: { icon: GitBranch, color: "#06b6d4", gradient: "from-cyan-500 to-blue-500", bg: "from-cyan-50 to-blue-50", border: "#a5f3fc", glow: "#06b6d420" },
 math: { icon: GraduationCap,color: "#14b8a6", gradient: "from-teal-500 to-emerald-500", bg: "from-teal-50 to-emerald-50", border: "#99f6e4", glow: "#14b8a620" },
};

const DIFFICULTY_CONFIG = {
 Beginner: { label: "Beginner", bg: "bg-emerald-500", text: "text-white", ring: "ring-emerald-200", emoji: "" },
 Intermediate: { label: "Intermediate", bg: "bg-amber-500", text: "text-white", ring: "ring-amber-200", emoji: "" },
 Advanced: { label: "Advanced", bg: "bg-rose-500", text: "text-white", ring: "ring-rose-200", emoji: "" },
 Expert: { label: "Expert", bg: "bg-violet-600", text: "text-white", ring: "ring-violet-200", emoji: "" },
};

const ALGO_DETAILS = {
 bubble: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", stable: true, desc: "Repeatedly compares adjacent elements and swaps them if they are in the wrong order. Simple but inefficient for large datasets." },
 selection: { best: "O(n²)", avg: "O(n²)", worst: "O(n²)", stable: false, desc: "Finds the minimum element repeatedly from the unsorted portion and places it at the beginning. Always performs O(n²) comparisons." },
 insertion: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", stable: true, desc: "Builds the sorted array one element at a time by inserting each element into its correct position. Efficient for small or nearly sorted arrays." },
 merge: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", stable: true, desc: "Divides the array into halves, sorts each half recursively, then merges them. Guarantees O(n log n) in all cases. Requires O(n) extra space." },
 quick: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", stable: false, desc: "Picks a pivot, partitions elements around it, and recursively sorts sub-arrays. Very fast in practice. Worst case occurs with already-sorted arrays." },
 heap: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", stable: false, desc: "Uses a max-heap to sort elements. First builds a heap, then extracts the maximum repeatedly. Guarantees O(n log n) with O(1) space." },
 shell: { best: "O(n log n)", avg: "O(n log² n)", worst: "O(n²)", stable: false, desc: "Generalization of insertion sort that allows exchange of far-apart elements. Uses a gap sequence that reduces to 1 (standard insertion sort)." },
 counting: { best: "O(n+k)", avg: "O(n+k)", worst: "O(n+k)", stable: true, desc: "Counts occurrences of each value to determine positions. Not comparison-based. Only works for non-negative integers within a known range k." },
 comb: { best: "O(n log n)", avg: "O(n²/2ᵖ)", worst: "O(n²)", stable: false, desc: "Improvement over Bubble Sort using a shrink factor (~1.3) to eliminate small values near the end (turtles) faster." },
 bfs: { best: "O(V+E)", avg: "O(V+E)", worst: "O(V+E)", stable: null, desc: "Explores a graph level by level using a queue. Guarantees shortest path in unweighted graphs. V = vertices, E = edges." },
 dfs: { best: "O(V+E)", avg: "O(V+E)", worst: "O(V+E)", stable: null, desc: "Explores as far as possible along each branch before backtracking. Uses a stack (recursion). Used for cycle detection, topological sort." },
 dijkstra: { best: "O(E)", avg: "O((V+E)logV)", worst: "O((V+E)logV)", stable: null, desc: "Finds shortest paths from a source vertex to all others in a weighted graph with non-negative edges. Uses a priority queue (min-heap)." },
 "bst-insert": { best: "O(log n)", avg: "O(log n)", worst: "O(n)", stable: null, desc: "Inserts a new key into a BST. Navigate left if smaller, right if larger, insert at the leaf. Worst case is a degenerate (linear) tree." },
 inorder: { best: "O(n)", avg: "O(n)", worst: "O(n)", stable: null, desc: "Traverses Left → Root → Right. Produces keys in sorted (ascending) order for a BST. Uses O(h) stack space where h is tree height." },
 preorder: { best: "O(n)", avg: "O(n)", worst: "O(n)", stable: null, desc: "Traverses Root → Left → Right. Used to create a copy of the tree or serialize it. The root is always visited first." },
 postorder: { best: "O(n)", avg: "O(n)", worst: "O(n)", stable: null, desc: "Traverses Left → Right → Root. Used to delete a tree or evaluate expression trees. Children are processed before parent." },
 fibonacci: { best: "O(n)", avg: "O(n)", worst: "O(n)", stable: null, desc: "DP approach: dp[i] = dp[i-1] + dp[i-2]. Reduces from exponential O(2ⁿ) naive recursion to linear O(n) by memoizing subproblems." },
 lcs: { best: "O(mn)", avg: "O(mn)", worst: "O(mn)", stable: null, desc: "Finds the longest subsequence common to both sequences. Uses a 2D DP table where dp[i][j] = LCS length of prefixes of length i and j." },
 binary: { best: "O(1)", avg: "O(log n)", worst: "O(log n)", stable: null, desc: "Searches a sorted array by repeatedly halving the search space. Requires sorted input. O(1) if element is at the midpoint." },
 kmp: { best: "O(n+m)", avg: "O(n+m)", worst: "O(n+m)", stable: null, desc: "Knuth-Morris-Pratt avoids redundant comparisons using a failure function (prefix table) to skip characters on mismatch. Always O(n+m)." },
};

const DEFAULT_DETAIL = (algo) => ({
 best: algo.complexity.time, avg: algo.complexity.time, worst: algo.complexity.time, stable: null,
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
 <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }}>

 {/* ── Top Header ──────────────────────────────────────────────────────── */}
 <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/10" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}>
 <div className="flex items-center gap-3">
 {/* YCV Logo */}
 <img src="/logo.svg" alt="YCV Logo" className="w-14 h-14" />
 <div>
 <h1 className="text-xl font-black text-white tracking-tight">Algorithm Library</h1>
 <p className="text-xs text-white/50 font-medium">{allAlgos.length} algorithms · Your Code Visualizer</p>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <div className="relative">
 <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
 <input
 value={search}
 onChange={e => setSearch(e.target.value)}
 placeholder="Search algorithms..."
 className="pl-9 pr-4 py-2 text-xs font-semibold rounded-xl w-52 transition-all outline-none text-white placeholder-white/30"
 style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
 />
 </div>
 <button
 onClick={onClose}
 className="p-2 rounded-xl transition-colors text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
 >
 <X size={18} />
 </button>
 </div>
 </div>

 {/* ── Category Filter Pills ────────────────────────────────────────────── */}
 <div className="shrink-0 flex items-center gap-2 px-6 py-3 overflow-x-auto border-b border-white/10" style={{ background: "rgba(255,255,255,0.02)" }}>
 <button
 onClick={() => setActiveCategory("all")}
 className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-extrabold border transition-all ${
 activeCategory === "all"
 ? "bg-white text-slate-900 border-white shadow-lg"
 : "text-white/60 border-white/15 hover:border-white/30 hover:text-white/80"
 }`}
 >
 All ({allAlgos.length})
 </button>
 {Object.entries(ALGORITHM_LIBRARY).map(([cat, data]) => {
 const meta = CATEGORY_META[cat] || { icon: Layers, color: "#6366f1", gradient: "from-indigo-500 to-purple-500" };
 const Icon = meta.icon;
 const active = activeCategory === cat;
 return (
 <motion.button
 key={cat}
 onClick={() => setActiveCategory(cat)}
 whileHover={{ scale: 1.04 }}
 whileTap={{ scale: 0.96 }}
 className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold border transition-all ${
 active ? "text-white border-transparent shadow-lg" : "text-white/60 border-white/15 hover:border-white/30 hover:text-white/80"
 }`}
 style={active ? { background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)`, boxShadow: `0 4px 14px ${meta.color}50` } : {}}
 >
 <Icon size={11} />
 {data.label} ({data.algorithms.length})
 </motion.button>
 );
 })}
 </div>

 {/* ── Cards Grid ──────────────────────────────────────────────────────── */}
 <div className="flex-1 overflow-y-auto p-6">
 <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
 {filtered.map((algo, idx) => {
 const meta = CATEGORY_META[algo.category] || { icon: Layers, color: "#6366f1", gradient: "from-indigo-500 to-purple-500", glow: "#6366f120" };
 const Icon = meta.icon;
 const diff = DIFFICULTY_CONFIG[algo.difficulty] || DIFFICULTY_CONFIG.Beginner;
 return (
 <motion.button
 key={`${algo.category}-${algo.id}`}
 layout
 initial={{ opacity: 0, y: 16, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 transition={{ delay: idx * 0.02, type: "spring", stiffness: 300, damping: 24 }}
 onClick={() => setSelectedAlgo({ ...algo, meta })}
 whileHover={{ y: -5, scale: 1.02 }}
 whileTap={{ scale: 0.97 }}
 className="text-left rounded-2xl p-0 transition-all duration-300 relative overflow-hidden group flex flex-col"
 style={{
 background: "rgba(255,255,255,0.06)",
 border: "1px solid rgba(255,255,255,0.1)",
 boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
 }}
 >
 {/* Top gradient accent bar */}
 <div
 className="w-full h-1.5 rounded-t-2xl"
 style={{ background: `linear-gradient(90deg, ${meta.color}, ${meta.color}80)` }}
 />

 <div className="p-4 flex flex-col gap-3 flex-1">
 {/* Icon + Difficulty row */}
 <div className="flex items-center justify-between">
 <div
 className="w-9 h-9 rounded-xl flex items-center justify-center"
 style={{ background: `${meta.color}20`, border: `1px solid ${meta.color}40` }}
 >
 <Icon size={16} style={{ color: meta.color }} />
 </div>
 <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ring-1 ${diff.bg} ${diff.text} ${diff.ring}`}>
 {diff.emoji} {diff.label}
 </span>
 </div>

 {/* Name */}
 <div>
 <h3
 className="font-extrabold text-sm leading-snug text-white group-hover:text-opacity-90 transition-colors"
 style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
 >
 {algo.name}
 </h3>
 <p className="text-[10px] text-white/40 font-semibold mt-0.5">{algo.categoryLabel}</p>
 </div>

 {/* Complexity chips */}
 <div className="flex items-center gap-1.5 flex-wrap">
 <div
 className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black"
 style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
 >
 <Clock size={9} />
 <span className="font-mono">{algo.complexity.time}</span>
 </div>
 <div
 className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black"
 style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
 >
 <HardDrive size={9} />
 <span className="font-mono">{algo.complexity.space}</span>
 </div>
 </div>
 </div>

 {/* Bottom CTA */}
 <div
 className="px-4 py-3 flex items-center justify-between border-t transition-all"
 style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.15)" }}
 >
 <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Visualize</span>
 <motion.div
 className="w-6 h-6 rounded-lg flex items-center justify-center"
 style={{ background: `${meta.color}30` }}
 whileHover={{ scale: 1.2 }}
 >
 <Play size={10} style={{ color: meta.color }} fill={meta.color} />
 </motion.div>
 </div>

 {/* Hover glow */}
 <div
 className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
 style={{ boxShadow: `inset 0 0 0 1px ${meta.color}60, 0 0 30px ${meta.color}20` }}
 />
 </motion.button>
 );
 })}
 </motion.div>

 {filtered.length === 0 && (
 <div className="text-center py-24">
 <div className="text-5xl mb-4"></div>
 <p className="text-white/50 font-bold text-sm">No algorithms match "{search}"</p>
 <p className="text-white/30 text-xs mt-1">Try a different search term</p>
 </div>
 )}
 </div>

 {/* ── Detail Modal ────────────────────────────────────────────────────── */}
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
 const diff = DIFFICULTY_CONFIG[algo.difficulty] || DIFFICULTY_CONFIG.Beginner;

 return (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[60] flex items-center justify-center p-4"
 style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)" }}
 onClick={onClose}
 >
 <motion.div
 initial={{ scale: 0.85, opacity: 0, y: 20 }}
 animate={{ scale: 1, opacity: 1, y: 0 }}
 exit={{ scale: 0.9, opacity: 0, y: 10 }}
 transition={{ type: "spring", stiffness: 420, damping: 30 }}
 className="max-w-lg w-full overflow-hidden rounded-3xl"
 style={{
 background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
 border: "1px solid rgba(255,255,255,0.12)",
 boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px ${algo.meta.color}30`,
 }}
 onClick={e => e.stopPropagation()}
 >
 {/* Modal Header */}
 <div className="relative overflow-hidden px-6 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
 {/* Background gradient blob */}
 <div
 className="absolute -right-8 -top-8 w-40 h-40 rounded-full blur-3xl opacity-30"
 style={{ background: `radial-gradient(circle, ${algo.meta.color}, transparent)` }}
 />
 <div className="flex items-start justify-between relative">
 <div className="flex items-center gap-3">
 <div
 className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
 style={{ background: `linear-gradient(135deg, ${algo.meta.color}, ${algo.meta.color}cc)`, boxShadow: `0 8px 20px ${algo.meta.color}50` }}
 >
 <algo.meta.icon size={22} className="text-white" />
 </div>
 <div>
 <h2 className="text-lg font-black text-white tracking-tight leading-none mb-1">{algo.name}</h2>
 <div className="flex items-center gap-2">
 <span className="text-[11px] font-bold text-white/50 uppercase tracking-wide">{algo.categoryLabel}</span>
 <span className="text-white/20">·</span>
 <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ring-1 ${diff.bg} ${diff.text} ${diff.ring}`}>
 {diff.emoji} {diff.label}
 </span>
 </div>
 </div>
 </div>
 <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white">
 <X size={16} />
 </button>
 </div>
 </div>

 {/* Modal Body */}
 <div className="p-6 space-y-4">
 {/* Description */}
 <p className="text-xs font-semibold text-white/70 leading-relaxed bg-white/5 rounded-xl p-3 border border-white/5">
 {detail.desc}
 </p>

 {/* Complexity Matrix */}
 <div>
 <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2.5">⏱ Complexity Matrix</div>
 <div className="grid grid-cols-3 gap-2">
 {[
 { label: "Best Case", val: detail.best },
 { label: "Average", val: detail.avg },
 { label: "Worst Case", val: detail.worst },
 ].map(({ label, val }) => (
 <div key={label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
 <div className="text-[9px] text-white/40 font-bold uppercase mb-1">{label}</div>
 <div className="text-xs font-extrabold text-white font-mono">{val}</div>
 </div>
 ))}
 </div>
 </div>

 {/* Space + Stable */}
 <div className="grid grid-cols-2 gap-2">
 <div className="rounded-xl p-3 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
 <div>
 <div className="text-[9px] font-bold text-white/40 uppercase mb-0.5">Space</div>
 <div className="text-sm font-extrabold text-white font-mono">{algo.complexity.space}</div>
 </div>
 <HardDrive size={16} className="text-white/20" />
 </div>
 {detail.stable !== null && (
 <div className="rounded-xl p-3 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
 <div>
 <div className="text-[9px] font-bold text-white/40 uppercase mb-0.5">Stable Sort</div>
 <div className={`text-sm font-extrabold ${detail.stable ? "text-emerald-400" : "text-rose-400"}`}>
 {detail.stable ? " Yes" : " No"}
 </div>
 </div>
 <Star size={16} className="text-white/20" />
 </div>
 )}
 </div>

 {/* CTA Button */}
 <motion.button
 onClick={() => onVisualize(algo.category, algo.id)}
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.97 }}
 className="w-full py-4 rounded-2xl font-extrabold text-sm text-white transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
 style={{
 background: `linear-gradient(135deg, ${algo.meta.color}, ${algo.meta.color}cc)`,
 boxShadow: `0 8px 24px ${algo.meta.color}50`,
 }}
 >
 <Play size={15} fill="white" />
 Launch Visualizer
 </motion.button>
 </div>
 </motion.div>
 </motion.div>
 );
}
