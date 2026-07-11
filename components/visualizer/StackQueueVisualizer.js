"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ArrowDown, ArrowUp, ArrowRight, ArrowLeft, Info } from "lucide-react";

// ─── Stack Visualizer ───────────────────────────────────────────────────────
function StackPanel({ stack = [], operation, value, description, eli5Mode }) {
  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-indigo-600" />
          <span className="text-sm font-bold text-slate-700">Stack Visualization</span>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">LIFO — Last In, First Out</span>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-violet-400" />
            <span className="text-xs text-slate-500">Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-blue-400" />
            <span className="text-xs text-slate-500">In Stack</span>
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className={`mx-6 mt-3 shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border self-center text-center max-w-2xl ${
          eli5Mode ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-indigo-50 text-indigo-800 border-indigo-100"
        }`}>
          {description}
        </div>
      )}

      {/* Main visual */}
      <div className="flex-1 flex items-end justify-center gap-16 pb-8 px-8 overflow-hidden">
        {/* Stack tower — bottom of screen = bottom of stack */}
        <div className="flex flex-col items-center gap-0">
          <div className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">TOP</div>
          <div className="flex flex-col-reverse items-center gap-1.5" style={{ minHeight: 220 }}>
            <AnimatePresence>
              {stack.map((val, i) => {
                const isTop = i === stack.length - 1;
                return (
                  <motion.div
                    key={`stack-${val}-${i}`}
                    initial={{ opacity: 0, scale: 0.5, y: -30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -40 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className={`relative flex items-center justify-center rounded-xl font-black text-lg border-2 transition-all ${
                      isTop
                        ? "bg-violet-500 text-white border-violet-600 shadow-lg shadow-violet-200 w-20 h-14"
                        : "bg-blue-100 text-blue-800 border-blue-300 w-20 h-12"
                    }`}
                  >
                    {val}
                    {isTop && (
                      <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute -right-14 text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200"
                      >
                        TOP
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {stack.length === 0 && (
              <div className="text-slate-300 text-sm font-semibold italic">Stack is empty</div>
            )}
          </div>
          {/* Stack base plate */}
          <div className="w-24 h-3 bg-slate-300 rounded-b-xl mt-1" />
          <div className="text-xs text-slate-400 mt-2 font-semibold uppercase tracking-wider">BOTTOM</div>
        </div>

        {/* Operation indicator */}
        <div className="flex flex-col items-center gap-3 mb-8">
          {operation === "push" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-14 h-14 rounded-xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-emerald-700 font-black text-xl">
                {value}
              </div>
              <ArrowDown size={24} className="text-emerald-500" />
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">PUSH({value})</span>
            </motion.div>
          )}
          {operation === "pop" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <ArrowUp size={24} className="text-rose-500" />
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">POP → {value}</span>
            </motion.div>
          )}
          {!operation && (
            <div className="text-slate-300 text-xs font-semibold italic text-center w-24">
              Operations appear here
            </div>
          )}
        </div>

        {/* ELI5 panel */}
        {eli5Mode && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-4 max-w-xs">
            <p className="text-sm font-bold text-amber-800 mb-1">🍽️ Think of it like a plate stack!</p>
            <p className="text-xs text-amber-700">
              You can only add (PUSH) or remove (POP) from the TOP — just like stacking plates at a restaurant. The last plate you put on is the first one you take off!
            </p>
          </div>
        )}
      </div>

      {/* Size badge */}
      <div className="shrink-0 px-6 pb-4 flex items-center gap-3 border-t border-slate-100 pt-3">
        <span className="text-xs font-bold text-slate-500">Stack size:</span>
        <span className="text-sm font-black text-indigo-700">{stack.length}</span>
        {stack.length > 0 && <>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs font-bold text-slate-500">Top value:</span>
          <span className="text-sm font-black text-violet-700">{stack[stack.length - 1]}</span>
        </>}
      </div>
    </div>
  );
}

// ─── Queue Visualizer ────────────────────────────────────────────────────────
function QueuePanel({ queue = [], operation, value, description, eli5Mode }) {
  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-emerald-600" />
          <span className="text-sm font-bold text-slate-700">Queue Visualization</span>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">FIFO — First In, First Out</span>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-emerald-400" />
            <span className="text-xs text-slate-500">Front (Dequeue)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-blue-300" />
            <span className="text-xs text-slate-500">In Queue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-violet-400" />
            <span className="text-xs text-slate-500">Rear (Enqueue)</span>
          </div>
        </div>
      </div>

      {description && (
        <div className={`mx-6 mt-3 shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border self-center text-center max-w-2xl ${
          eli5Mode ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-emerald-50 text-emerald-800 border-emerald-100"
        }`}>
          {description}
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 overflow-hidden">
        {/* Queue row */}
        <div className="flex items-center gap-2">
          {/* Enqueue arrow */}
          <div className="flex flex-col items-center gap-1">
            {operation === "enqueue" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-100 border-2 border-violet-300 flex items-center justify-center text-violet-700 font-black text-lg">{value}</div>
                <ArrowRight size={20} className="text-violet-500" />
              </motion.div>
            )}
            <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200 mt-1">REAR ←</span>
          </div>

          {/* Queue items */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center" style={{ minWidth: 200, minHeight: 64 }}>
            <AnimatePresence>
              {queue.map((val, i) => {
                const isFront = i === 0;
                const isRear = i === queue.length - 1;
                return (
                  <motion.div
                    key={`q-${val}-${i}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -40, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className={`relative flex items-center justify-center rounded-xl font-black text-base border-2 transition-all ${
                      isFront
                        ? "bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-200 w-14 h-14"
                        : isRear
                        ? "bg-violet-400 text-white border-violet-500 w-14 h-12"
                        : "bg-blue-100 text-blue-800 border-blue-300 w-14 h-12"
                    }`}
                  >
                    {val}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {queue.length === 0 && (
              <div className="text-slate-300 text-sm font-semibold italic">Queue is empty</div>
            )}
          </div>

          {/* Dequeue arrow */}
          <div className="flex flex-col items-center gap-1">
            {operation === "dequeue" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-center gap-1"
              >
                <ArrowRight size={20} className="text-emerald-500" />
                <div className="w-12 h-12 rounded-xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-emerald-700 font-black text-lg">{value}</div>
              </motion.div>
            )}
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1">→ FRONT</span>
          </div>
        </div>

        {/* ELI5 */}
        {eli5Mode && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 max-w-sm">
            <p className="text-sm font-bold text-amber-800 mb-1">🎟️ Think of a movie ticket line!</p>
            <p className="text-xs text-amber-700">
              People join at the REAR and leave from the FRONT. First person to arrive is first to get their ticket — fair and square!
            </p>
          </div>
        )}
      </div>

      <div className="shrink-0 px-6 pb-4 flex items-center gap-3 border-t border-slate-100 pt-3">
        <span className="text-xs font-bold text-slate-500">Queue size:</span>
        <span className="text-sm font-black text-emerald-700">{queue.length}</span>
        {queue.length > 0 && <>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs font-bold text-slate-500">Front:</span>
          <span className="text-sm font-black text-emerald-700">{queue[0]}</span>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs font-bold text-slate-500">Rear:</span>
          <span className="text-sm font-black text-violet-700">{queue[queue.length - 1]}</span>
        </>}
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function StackQueueVisualizer({ stepData, algorithmId, eli5Mode }) {
  if (!stepData) {
    return (
      <div className="flex-1 flex flex-col bg-white items-center justify-center">
        <Info size={20} className="text-slate-400 mb-2" />
        <span className="text-sm text-slate-400">Select an algorithm and press Play</span>
      </div>
    );
  }

  const state = stepData.state || {};
  const description = stepData.description || "";

  // Stack
  const isStack = algorithmId === "stack" || algorithmId === "min-stack" || state.stack !== undefined;
  if (isStack) {
    const stack = Array.isArray(state.stack) ? state.stack : (Array.isArray(state.items) ? state.items : []);
    const operation = state.operation || stepData.operation;
    const value = state.value ?? stepData.value;
    return <StackPanel stack={stack} operation={operation} value={value} description={description} eli5Mode={eli5Mode} />;
  }

  // Queue
  const isQueue = algorithmId === "queue" || algorithmId === "circular-queue" || state.queue !== undefined;
  if (isQueue) {
    const queue = Array.isArray(state.queue) ? state.queue : (Array.isArray(state.items) ? state.items : []);
    const operation = state.operation || stepData.operation;
    const value = state.value ?? stepData.value;
    return <QueuePanel queue={queue} operation={operation} value={value} description={description} eli5Mode={eli5Mode} />;
  }

  // Fallback to stack-looking at items
  const items = Array.isArray(state.items) ? state.items : [];
  return <StackPanel stack={items} description={description} eli5Mode={eli5Mode} />;
}
