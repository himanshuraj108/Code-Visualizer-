"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, BarChart2, Search, Network, TreePine, Layers, Shuffle, Hash, GitBranch, CheckCircle2 } from "lucide-react";
import { ALGORITHM_LIBRARY } from "@/lib/algorithms/index";

const CATEGORY_ICONS = {
  sorting: BarChart2,
  searching: Search,
  graph: Network,
  tree: TreePine,
  dp: Layers,
  strings: Shuffle,
  datastructures: Hash,
  backtracking: GitBranch,
};

const CATEGORY_COLORS = {
  sorting: "text-blue-600 bg-blue-50",
  searching: "text-violet-600 bg-violet-50",
  graph: "text-emerald-600 bg-emerald-50",
  tree: "text-amber-600 bg-amber-50",
  dp: "text-rose-600 bg-rose-50",
  strings: "text-pink-600 bg-pink-50",
  datastructures: "text-indigo-600 bg-indigo-50",
  backtracking: "text-cyan-600 bg-cyan-50",
};

const DIFFICULTY_COLORS = {
  Beginner: "text-emerald-600 bg-emerald-50",
  Intermediate: "text-amber-600 bg-amber-50",
  Advanced: "text-rose-600 bg-rose-50",
  Expert: "text-violet-600 bg-violet-50",
};

export default function AlgorithmSidebar({ onSelectAlgorithm, selectedCategory, selectedAlgorithm }) {
  const [openCategories, setOpenCategories] = useState({ [selectedCategory]: true });

  const toggleCategory = (cat) => {
    setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Algorithm Library</h2>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {Object.entries(ALGORITHM_LIBRARY).map(([cat, data]) => {
          const Icon = CATEGORY_ICONS[cat] || BarChart2;
          const colorClass = CATEGORY_COLORS[cat] || "text-slate-600 bg-slate-50";
          const isOpen = openCategories[cat];

          return (
            <div key={cat}>
              <button
                onClick={() => toggleCategory(cat)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition-colors group ${
                  selectedCategory === cat ? "bg-slate-50" : ""
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colorClass}`}>
                    <Icon size={14} />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-700">{data.label}</span>
                    <span className="text-xs text-slate-400 ml-1.5">{data.algorithms.length}</span>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ChevronRight size={14} className="text-slate-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-1">
                      {data.algorithms.map((algo) => (
                        <button
                          key={algo.id}
                          onClick={() => onSelectAlgorithm(cat, algo.id)}
                          className={`w-full flex items-center justify-between pl-10 pr-3 py-2 text-left text-xs transition-all group ${
                            selectedAlgorithm === algo.id && selectedCategory === cat
                              ? "bg-blue-50 text-blue-700"
                              : "hover:bg-slate-50 text-slate-600"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {selectedAlgorithm === algo.id && selectedCategory === cat ? (
                              <CheckCircle2 size={12} className="text-blue-500 shrink-0" />
                            ) : (
                              <div className="w-3 h-3 rounded-full border-2 border-slate-200 group-hover:border-blue-300 transition-colors shrink-0" />
                            )}
                            <span className="font-medium truncate">{algo.name}</span>
                          </div>
                          <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded-md font-medium ml-1 ${DIFFICULTY_COLORS[algo.difficulty]}`}>
                            {algo.difficulty.charAt(0)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
