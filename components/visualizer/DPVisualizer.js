"use client";
import { motion } from "framer-motion";
import { Layers, Info } from "lucide-react";

export default function DPVisualizer({ stepData, algorithmId, eli5Mode }) {
  if (!stepData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="flex items-center gap-2 text-slate-400">
          <Info size={20} />
          <span className="text-sm">Select a DP algorithm to visualize</span>
        </div>
      </div>
    );
  }

  const { description } = stepData;

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-rose-600" />
          <span className="text-sm font-semibold text-slate-700">Dynamic Programming Visualization</span>
        </div>
      </div>

      {description && (
        <div className={`mx-6 mt-3 px-4 py-2 rounded-xl text-sm font-medium border ${
          eli5Mode ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-rose-50 text-rose-800 border-rose-100"
        }`}>
          {description}
        </div>
      )}

      <div className="flex-1 overflow-auto p-6">
        {(algorithmId === 'fibonacci' || algorithmId === 'climbing-stairs' || algorithmId === 'house-robber') && stepData.table && (
          <FibonacciTable stepData={stepData} algorithmId={algorithmId} />
        )}
        {algorithmId === 'lcs' && stepData.dp && (
          <LCSTable stepData={stepData} />
        )}
        {algorithmId === 'knapsack' && stepData.dp && (
          <KnapsackTable stepData={stepData} />
        )}
        {algorithmId === 'coin-change' && stepData.dp && (
          <CoinChangeTable stepData={stepData} />
        )}
        {!stepData.table && !stepData.dp && (
          <div className="text-center text-slate-400 py-8">
            <Layers size={32} className="mx-auto mb-2" />
            <p className="text-sm">DP visualization loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FibonacciTable({ stepData, algorithmId }) {
  const { table, currentI } = stepData;
  const label = algorithmId === 'climbing-stairs' ? 'Climbing Stairs DP Array' : algorithmId === 'house-robber' ? 'House Robber DP Array' : 'Fibonacci Table';
  return (
    <div>
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{label}</div>
      <div className="flex flex-wrap gap-2">
        {table.map((val, i) => (
          <motion.div
            key={i}
            animate={{
              backgroundColor: currentI === i ? '#f43f5e' : val > 0 ? '#eff6ff' : '#f8fafc',
              scale: currentI === i ? 1.1 : 1,
            }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center rounded-xl border-2 px-4 py-3 min-w-16"
            style={{
              borderColor: currentI === i ? '#f43f5e' : val > 0 ? '#bfdbfe' : '#e2e8f0',
            }}
          >
            <span className="text-[10px] font-bold mb-1" style={{ color: currentI === i ? 'white' : '#94a3b8' }}>i={i}</span>
            <span className="text-lg font-extrabold" style={{ color: currentI === i ? 'white' : '#1e293b' }}>
              {val}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LCSTable({ stepData }) {
  const { dp, currentI, currentJ, s1 = '', s2 = '', match } = stepData;
  return (
    <div className="overflow-auto">
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">LCS DP Table</div>
      <table className="border-collapse text-xs font-mono">
        <thead>
          <tr>
            <th className="w-8 h-8 text-slate-400"></th>
            <th className="w-8 h-8 text-slate-400 text-center"></th>
            {s2.split('').map((c, j) => (
              <th key={j} className="w-8 h-8 text-center font-bold text-blue-600">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dp.map((row, i) => (
            <tr key={i}>
              <td className="w-8 h-8 text-center font-bold text-violet-600">
                {i === 0 ? '' : s1[i - 1]}
              </td>
              {row.map((val, j) => {
                const isCurrent = currentI === i && currentJ === j;
                return (
                  <motion.td
                    key={j}
                    animate={{
                      backgroundColor: isCurrent ? (match ? '#10b981' : '#f43f5e') : val > 0 ? '#eff6ff' : '#f8fafc',
                    }}
                    className="w-8 h-8 text-center font-bold border border-slate-200 rounded"
                    style={{ color: isCurrent ? 'white' : val > 0 ? '#1d4ed8' : '#94a3b8' }}
                  >
                    {val}
                  </motion.td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KnapsackTable({ stepData }) {
  const { dp, currentI, currentW, weights = [], values = [], W } = stepData;
  return (
    <div className="overflow-auto">
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Knapsack DP Table</div>
      <table className="border-collapse text-xs font-mono">
        <thead>
          <tr>
            <th className="w-16 h-8 text-slate-400 text-left pl-1">Item (Wt/Val)</th>
            {Array.from({ length: W + 1 }, (_, w) => (
              <th key={w} className="w-10 h-8 text-center font-bold text-blue-600">w={w}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dp.map((row, i) => (
            <tr key={i}>
              <td className="w-16 h-8 text-left pl-1 font-bold text-violet-600">
                {i === 0 ? 'Base' : `Item ${i} (${weights[i-1]}/${values[i-1]})`}
              </td>
              {row.map((val, w) => {
                const isCurrent = currentI === i && currentW === w;
                return (
                  <motion.td
                    key={w}
                    animate={{
                      backgroundColor: isCurrent ? '#f43f5e' : val > 0 ? '#eff6ff' : '#f8fafc',
                    }}
                    className="w-10 h-8 text-center font-bold border border-slate-200 rounded"
                    style={{ color: isCurrent ? 'white' : val > 0 ? '#1d4ed8' : '#94a3b8' }}
                  >
                    {val}
                  </motion.td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CoinChangeTable({ stepData }) {
  const { dp, currentI, coins = [], amt } = stepData;
  return (
    <div>
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Coin Change DP Array (Amount 0 to {amt})</div>
      <div className="flex flex-wrap gap-2">
        {dp.map((val, i) => {
          const isCurrent = currentI === i;
          const displayVal = val === Infinity ? '∞' : val;
          return (
            <motion.div
              key={i}
              animate={{
                backgroundColor: isCurrent ? '#f43f5e' : val !== Infinity && val > 0 ? '#eff6ff' : '#f8fafc',
                scale: isCurrent ? 1.1 : 1,
              }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center rounded-xl border-2 px-4 py-3 min-w-16"
              style={{
                borderColor: isCurrent ? '#f43f5e' : val !== Infinity && val > 0 ? '#bfdbfe' : '#e2e8f0',
              }}
            >
              <span className="text-[10px] font-bold mb-1" style={{ color: isCurrent ? 'white' : '#94a3b8' }}>Amt={i}</span>
              <span className="text-lg font-extrabold" style={{ color: isCurrent ? 'white' : '#1e293b' }}>
                {displayVal}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
