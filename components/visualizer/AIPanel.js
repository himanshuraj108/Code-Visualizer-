"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Zap, AlertCircle, CheckCircle2, Lightbulb, TrendingUp,
  Clock, HardDrive, Sparkles, ChevronDown, ChevronUp, BookOpen,
  Code2, RefreshCw, Wand2, MessageSquare
} from "lucide-react";

export default function AIPanel({
  analysis, code, currentStep, eli5Mode, isAnalyzing,
  onAnalyze, selectedAlgorithm, selectedCategory
}) {
  const [showFixSuggestion, setShowFixSuggestion] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [stepExplanation, setStepExplanation] = useState("");
  const [isExplaining, setIsExplaining] = useState(false);

  const handleExplainStep = async () => {
    if (!code || currentStep === undefined) return;
    setIsExplaining(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, step: currentStep + 1, mode: eli5Mode ? "eli5" : "dev" }),
      });
      const data = await res.json();
      setStepExplanation(data.explanation || "");
    } catch {}
    setIsExplaining(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-violet-600" />
          <h2 className="text-sm font-bold text-slate-900">AI Assistant</h2>
        </div>
        {isAnalyzing && (
          <div className="flex items-center gap-1.5 text-xs text-violet-600">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            Analyzing
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!analysis && !isAnalyzing && (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-3">
              <Wand2 size={22} className="text-violet-600" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">AI Code Analysis</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Paste code in the Code tab and click Analyze to get AI-powered insights
            </p>
            <button
              onClick={onAnalyze}
              disabled={!code}
              className="btn-primary text-xs px-4 py-2 rounded-lg flex items-center gap-2 mx-auto disabled:opacity-40"
            >
              <Sparkles size={12} />
              Analyze Code
            </button>
          </div>
        )}

        {isAnalyzing && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {analysis && !isAnalyzing && (
          <>
            <div className="glass-card rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span className="text-xs font-bold text-slate-800">Analysis Complete</span>
              </div>
              <p className="text-xs text-slate-600">{analysis.summary}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                  {analysis.language}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                  analysis.codeState === 'full' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  analysis.codeState === 'broken' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                  'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                  {analysis.codeState}
                </span>
              </div>
            </div>

            {analysis.complexity && (
              <div className="glass-card rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} className="text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">Complexity</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <div className="text-sm font-bold text-blue-700 font-mono">{analysis.complexity.time}</div>
                    <div className="text-xs text-blue-500">Time</div>
                  </div>
                  <div className="bg-violet-50 rounded-lg p-2 text-center">
                    <div className="text-sm font-bold text-violet-700 font-mono">{analysis.complexity.space}</div>
                    <div className="text-xs text-violet-500">Space</div>
                  </div>
                </div>
                {analysis.complexity.explanation && (
                  <p className="text-xs text-slate-500 mt-2">{analysis.complexity.explanation}</p>
                )}
              </div>
            )}

            {analysis.errors && analysis.errors.length > 0 && (
              <div className="glass-card rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={14} className="text-rose-500" />
                  <span className="text-xs font-bold text-slate-800">Issues Found ({analysis.errors.length})</span>
                </div>
                <div className="space-y-1.5">
                  {analysis.errors.slice(0, 3).map((err, i) => (
                    <div key={i} className={`text-xs px-2.5 py-2 rounded-lg border ${
                      err.severity === 'error'
                        ? 'bg-rose-50 text-rose-700 border-rose-100'
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      <span className="font-semibold">Line {err.line}:</span> {err.message}
                    </div>
                  ))}
                </div>
                {analysis.fixSuggestion && (
                  <button
                    onClick={() => setShowFixSuggestion(!showFixSuggestion)}
                    className="mt-2 w-full text-xs font-semibold text-rose-600 flex items-center justify-center gap-1 hover:text-rose-700 transition-colors"
                  >
                    {showFixSuggestion ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {showFixSuggestion ? "Hide Fix" : "View Suggested Fix"}
                  </button>
                )}
                <AnimatePresence>
                  {showFixSuggestion && analysis.fixSuggestion && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2"
                    >
                      <pre className="text-xs bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto font-mono">
                        {analysis.fixSuggestion}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {eli5Mode && analysis.eli5 && (
              <div className="glass-card rounded-xl p-3 border-l-4 border-amber-400">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={14} className="text-amber-600" />
                  <span className="text-xs font-bold text-amber-700">ELI5 Explanation</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{analysis.eli5}</p>
              </div>
            )}

            {analysis.algorithms && analysis.algorithms.length > 0 && (
              <div className="glass-card rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 size={14} className="text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">Detected Algorithms</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.algorithms.map((algo, i) => (
                    <span key={i} className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">
                      {algo}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleExplainStep}
              disabled={isExplaining}
              className="w-full btn-secondary text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold"
            >
              {isExplaining ? (
                <><RefreshCw size={12} className="animate-spin" /> Explaining...</>
              ) : (
                <><MessageSquare size={12} /> Explain Current Step</>
              )}
            </button>

            {stepExplanation && (
              <div className="glass-card rounded-xl p-3">
                <p className="text-xs text-slate-700 leading-relaxed">{stepExplanation}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
