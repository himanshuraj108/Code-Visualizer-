"use client";
import { motion } from "framer-motion";
import { Info, ArrowDown } from "lucide-react";

export default function ArrayVisualizer({ stepData, algorithmId, eli5Mode }) {
  if (!stepData || !stepData.state) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400">
        <Info size={20} className="mr-2" />
        <span className="text-sm">No visualization data available for this step.</span>
      </div>
    );
  }

  const {
    array = [], left, right, i, k, window_sum, max_sum, curr_sum, target, prefix = [], curr_max, max_so_far,
    low, mid, high, slow, fast, candidate, count, val, check_idx, mid1, mid2, found
  } = stepData.state;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-slate-50 shrink-0">
        <span className="text-sm font-semibold text-slate-700 capitalize">
          {algorithmId.replace("-", " ")} Visualizer
        </span>
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {algorithmId === "two-pointers" && (
            <>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-blue-500" /><span>Left</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-rose-500" /><span>Right</span></div>
            </>
          )}
          {algorithmId === "dutch-national-flag" && (
            <>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-blue-500" /><span>Low</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-emerald-500" /><span>Mid</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-rose-500" /><span>High</span></div>
            </>
          )}
          {algorithmId === "floyd-cycle" && (
            <>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-blue-500" /><span>Slow</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-rose-500" /><span>Fast</span></div>
            </>
          )}
          {algorithmId === "sliding-window" && (
            <>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded border border-dashed border-amber-500 bg-amber-50" /><span>Active Window</span></div>
            </>
          )}
          {algorithmId.includes("search") && (
            <>
              {left !== undefined && <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-blue-500" /><span>Left</span></div>}
              {right !== undefined && <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-rose-500" /><span>Right</span></div>}
              {check_idx !== undefined && <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-emerald-500" /><span>Mid</span></div>}
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 overflow-y-auto">
        {stepData.description && (
          <motion.div
            key={stepData.description}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-4 py-2.5 rounded-2xl text-sm font-semibold border ${
              eli5Mode ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-blue-50 text-blue-800 border-blue-100"
            } max-w-xl text-center`}
          >
            {stepData.description}
          </motion.div>
        )}

        <div className="relative flex flex-col items-center py-12 w-full max-w-3xl">
          <div className="flex items-center justify-center gap-3 w-full">
            {array.map((elementVal, idx) => {
              let isLeft = (left !== undefined && idx === left) ||
                           (low !== undefined && idx === low) ||
                           (slow !== undefined && idx === slow);

              let isRight = (right !== undefined && idx === right) ||
                            (high !== undefined && idx === high) ||
                            (fast !== undefined && idx === fast);

              let isMid = (mid !== undefined && idx === mid) ||
                          (mid1 !== undefined && idx === mid1) ||
                          (check_idx !== undefined && idx === check_idx);

              let isMid2 = (mid2 !== undefined && idx === mid2);

              let isWindow = (algorithmId === "sliding-window" && idx >= i && idx < i + k);

              let isIndexActive = (idx === i) &&
                                  !isLeft && !isRight && !isMid && !isMid2 &&
                                  algorithmId !== "sliding-window";

              let blockBg = "bg-white border-slate-200 text-slate-700";
              let shadow = "shadow-sm";

              if (isLeft) {
                blockBg = "bg-blue-500 border-blue-600 text-white";
                shadow = "shadow-md shadow-blue-200";
              } else if (isRight) {
                blockBg = "bg-rose-500 border-rose-600 text-white";
                shadow = "shadow-md shadow-rose-200";
              } else if (isMid) {
                blockBg = "bg-emerald-500 border-emerald-600 text-white";
                shadow = "shadow-md shadow-emerald-200";
              } else if (isMid2) {
                blockBg = "bg-violet-500 border-violet-600 text-white";
                shadow = "shadow-md shadow-violet-200";
              } else if (isWindow) {
                blockBg = "bg-amber-50 border-amber-400 text-amber-900";
              } else if (isIndexActive) {
                blockBg = "bg-violet-500 border-violet-600 text-white";
                shadow = "shadow-md shadow-violet-200";
              }

              // Determine Arrow label dynamically based on state properties
              let arrowLabel = "";
              if (isLeft) {
                arrowLabel = (slow !== undefined && idx === slow) ? "Slow" : (low !== undefined && idx === low) ? "Low" : "Left";
              } else if (isRight) {
                arrowLabel = (fast !== undefined && idx === fast) ? "Fast" : (high !== undefined && idx === high) ? "High" : "Right";
              } else if (isMid) {
                arrowLabel = (mid1 !== undefined && idx === mid1) ? "Mid1" : (check_idx !== undefined && idx === check_idx) ? "Check" : "Mid";
              } else if (isMid2) {
                arrowLabel = "Mid2";
              } else if (isIndexActive) {
                arrowLabel = "Idx";
              }

               return (
                <div key={idx} className="relative flex flex-col items-center">
                  {arrowLabel && (
                    <motion.div
                      layoutId={`arrow-${arrowLabel}`}
                      className="absolute -top-10 flex flex-col items-center"
                      initial={{ y: -5 }}
                      animate={{ y: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        {arrowLabel}
                      </span>
                      <ArrowDown size={12} className="text-slate-400 mt-0.5 animate-bounce" />
                    </motion.div>
                  )}

                  <motion.div
                    layout
                    animate={{ scale: (isLeft || isRight || isMid || isMid2 || isIndexActive) ? 1.1 : 1.0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-lg font-black transition-all ${blockBg} ${shadow}`}
                  >
                    {elementVal}
                  </motion.div>
                  <span className="text-[10px] font-bold text-slate-400 mt-1.5">Idx {idx}</span>
                </div>
              );
            })}
          </div>

          {algorithmId === "sliding-window" && i !== undefined && (
            <motion.div
              layout
              className="absolute top-10 border-2 border-dashed border-amber-500 bg-amber-500/5 rounded-3xl pointer-events-none"
              style={{
                height: 64,
                left: `calc(50% - ${(array.length * 68) / 2}px + ${i * 68}px)`,
                width: k * 68 - 12,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
        </div>

        <div className="w-full max-w-xl grid grid-cols-2 gap-4 shrink-0">
          {algorithmId === "two-pointers" && (
            <>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">Target sum</span>
                <span className="text-lg font-extrabold text-slate-800 font-mono">{target}</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">Current Sum</span>
                <span className="text-lg font-extrabold text-blue-600 font-mono">
                  {curr_sum !== undefined ? `${curr_sum}` : "—"}
                </span>
              </div>
            </>
          )}

          {algorithmId === "dutch-national-flag" && (
            <>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">Pointers (Low / Mid / High)</span>
                <span className="text-lg font-extrabold text-slate-800 font-mono">
                  {low !== undefined ? `${low} / ${mid} / ${high}` : "—"}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">Active Value (nums[mid])</span>
                <span className="text-lg font-extrabold text-emerald-600 font-mono">
                  {mid !== undefined ? array[mid] : "—"}
                </span>
              </div>
            </>
          )}

          {algorithmId === "moores-voting" && (
            <>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">Candidate</span>
                <span className="text-lg font-extrabold text-slate-800 font-mono">
                  {candidate !== null && candidate !== undefined ? candidate : "None"}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">Candidate Count</span>
                <span className="text-lg font-extrabold text-blue-600 font-mono">
                  {count !== undefined ? count : "—"}
                </span>
              </div>
            </>
          )}

          {algorithmId === "floyd-cycle" && (
            <>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">Slow Pointer Index</span>
                <span className="text-lg font-extrabold text-blue-600 font-mono">
                  {slow !== undefined ? slow : "—"}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">Fast Pointer Index</span>
                <span className="text-lg font-extrabold text-rose-600 font-mono">
                  {fast !== undefined ? fast : "—"}
                </span>
              </div>
            </>
          )}

          {algorithmId === "sliding-window" && (
            <>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">Window Sum</span>
                <span className="text-lg font-extrabold text-amber-600 font-mono">{window_sum || 0}</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">Maximum Sum Seen</span>
                <span className="text-lg font-extrabold text-emerald-600 font-mono">{max_sum || 0}</span>
              </div>
            </>
          )}

          {algorithmId.includes("search") && (
            <>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">Target Element</span>
                <span className="text-lg font-extrabold text-slate-800 font-mono">{target}</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">Checking Status</span>
                <span className="text-lg font-extrabold text-emerald-600 font-mono">
                  {found === "true" ? "Target Found!" : check_idx !== undefined ? `Inspecting Idx ${check_idx}` : mid1 !== undefined ? `Inspecting Mid1, Mid2` : "Searching..."}
                </span>
              </div>
            </>
          )}

          {algorithmId === "prefix-sum" && prefix.length > 0 && (
            <div className="col-span-2 bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <span className="text-xs text-slate-400 block mb-3 text-center">Accumulating Prefix Sums</span>
              <div className="flex justify-center gap-2">
                {prefix.map((pVal, pIdx) => (
                  <div key={pIdx} className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                      {pVal}
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 mt-1">P[{pIdx}]</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {algorithmId === "kadane" && (
            <>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">Local Max (curr_max)</span>
                <span className="text-lg font-extrabold text-blue-600 font-mono">{curr_max}</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">Global Max (max_so_far)</span>
                <span className="text-lg font-extrabold text-emerald-600 font-mono">{max_so_far}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
