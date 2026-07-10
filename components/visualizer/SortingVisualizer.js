"use client";
import { motion } from "framer-motion";
import { TrendingUp, Info } from "lucide-react";

const PALETTE = {
  default:   { bg: "#e2e8f0", border: "#94a3b8", label: "#64748b" },
  comparing: { bg: "#3b82f6", border: "#1d4ed8", label: "#1e40af" },
  swapped:   { bg: "#8b5cf6", border: "#6d28d9", label: "#4c1d95" },
  sorted:    { bg: "#10b981", border: "#059669", label: "#065f46" },
  pivot:     { bg: "#f59e0b", border: "#d97706", label: "#92400e" },
  highlight: { bg: "#f43f5e", border: "#e11d48", label: "#881337" },
};

function resolveColor(index, step) {
  if (!step) return PALETTE.default;
  const sorted    = step.sorted    || [];
  const swapped   = step.swapped   || [];
  const comparing = step.comparing || [];
  const highlight = step.highlight || [];
  if (sorted.includes(index))    return PALETTE.sorted;
  if (swapped.includes(index))   return PALETTE.swapped;
  if (comparing.includes(index)) return PALETTE.comparing;
  if (highlight.includes(index)) return PALETTE.highlight;
  return PALETTE.default;
}

const LEGEND = [
  { key: "comparing", label: "Comparing" },
  { key: "swapped",   label: "Swapping"  },
  { key: "sorted",    label: "Sorted"    },
  { key: "highlight", label: "Pivot"     },
];

const VIZ_HEIGHT = 300;

export default function SortingVisualizer({ steps, currentStep, currentStepData, eli5Mode }) {
  const array  = currentStepData?.array ?? [];
  const maxVal = array.length > 0 ? Math.max(...array, 1) : 100;
  const hasData = array.length > 0;

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden select-none">

      <div className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2.5">
          <TrendingUp size={16} className="text-blue-600" />
          <span className="text-sm font-bold text-slate-700">Sorting Visualization</span>
          {steps.length > 0 && (
            <span className="text-xs text-slate-400 font-medium">
              · Step {currentStep + 1} of {steps.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-5">
          {LEGEND.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="w-3.5 h-3.5 rounded-sm shadow-sm"
                style={{ backgroundColor: PALETTE[key].bg }}
              />
              <span className="text-xs font-medium text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-4 pb-3 overflow-hidden">
        {!hasData ? (
          <div className="flex-1 flex items-center justify-center gap-2 text-slate-400">
            <Info size={18} />
            <span className="text-sm">Select an algorithm — bars will appear here</span>
          </div>
        ) : (
          <>
            {currentStepData?.description && (
              <div
                className={`mb-4 px-5 py-2 rounded-xl text-sm font-semibold border shrink-0 max-w-2xl text-center ${
                  eli5Mode
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-blue-50 text-blue-800 border-blue-100"
                }`}
              >
                {currentStepData.description}
              </div>
            )}

            <div
              className="w-full shrink-0 flex items-end justify-center"
              style={{
                height: VIZ_HEIGHT,
                gap: Math.max(2, Math.min(6, Math.floor(500 / array.length) - 4)) + "px",
              }}
            >
              {array.map((val, i) => {
                const color     = resolveColor(i, currentStepData);
                const barPx     = Math.max(4, Math.round((val / maxVal) * (VIZ_HEIGHT - 36)));
                const barWidth  = Math.max(10, Math.min(52, Math.floor(660 / array.length) - 4));
                const showLabel = array.length <= 32;

                return (
                  <motion.div
                    key={val}
                    layout
                    className="flex flex-col items-center"
                    style={{ width: barWidth }}
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  >
                    {showLabel && (
                      <span
                        className="leading-none font-bold mb-1 tabular-nums transition-colors duration-150"
                        style={{
                          fontSize: array.length > 22 ? 8 : array.length > 16 ? 10 : 12,
                          color: color.label,
                        }}
                      >
                        {val}
                      </span>
                    )}
                    <motion.div
                      animate={{ height: barPx }}
                      transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.6 }}
                      style={{
                        width: "100%",
                        minHeight: 4,
                        borderRadius: "5px 5px 2px 2px",
                        backgroundColor: color.bg,
                        border: `2px solid ${color.border}`,
                        boxShadow: color === PALETTE.default ? "none" : `0 2px 8px ${color.bg}66`,
                        transition: "background-color 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease",
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-3 shrink-0 flex items-center gap-3 text-xs text-slate-400 font-medium">
              <span>{array.length} elements</span>
              <span>·</span>
              <span>Step {currentStep + 1} / {steps.length}</span>
              {(currentStepData?.sorted?.length ?? 0) > 0 && (
                <>
                  <span>·</span>
                  <span style={{ color: PALETTE.sorted.label }}>
                    {currentStepData.sorted.length} sorted
                  </span>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
