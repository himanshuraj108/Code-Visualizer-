"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";

const VAR_COLORS = [
  { bg: "#eff6ff", border: "#bfdbfe", label: "#1d4ed8", value: "#1e40af" },
  { bg: "#f5f3ff", border: "#ddd6fe", label: "#6d28d9", value: "#4c1d95" },
  { bg: "#ecfdf5", border: "#a7f3d0", label: "#065f46", value: "#047857" },
  { bg: "#fffbeb", border: "#fde68a", label: "#92400e", value: "#78350f" },
  { bg: "#fef2f2", border: "#fecaca", label: "#991b1b", value: "#7f1d1d" },
  { bg: "#eef2ff", border: "#c7d2fe", label: "#3730a3", value: "#312e81" },
];

export default function VariableInspector({ variables = {}, currentStep }) {
  const entries = Object.entries(variables).filter(([, v]) => v !== undefined && v !== null);

  return (
    <div className="flex flex-col bg-white border-t border-slate-200 shrink-0">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100 bg-slate-50 shrink-0">
        <Activity size={13} className="text-violet-600" />
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live Variables</span>
        {currentStep >= 0 && (
          <span className="ml-auto text-xs text-slate-400 font-medium">step {currentStep + 1}</span>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="px-4 py-2.5 text-xs text-slate-400 italic">No variables for this step.</div>
      ) : (
        <div className="flex items-center gap-2 px-4 py-2.5 flex-wrap">
          <AnimatePresence mode="popLayout">
            {entries.map(([key, val], i) => {
              const color = VAR_COLORS[i % VAR_COLORS.length];
              const display = Array.isArray(val)
                ? `[${val.join(", ")}]`
                : typeof val === "boolean"
                ? val ? "true" : "false"
                : String(val);
              return (
                <motion.div
                  key={key}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border"
                  style={{ backgroundColor: color.bg, borderColor: color.border }}
                >
                  <span className="text-xs font-bold font-mono" style={{ color: color.label }}>{key}</span>
                  <span className="text-slate-400 text-xs">=</span>
                  <motion.span
                    key={`${key}-${display}`}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-extrabold font-mono"
                    style={{ color: color.value }}
                  >
                    {display}
                  </motion.span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
