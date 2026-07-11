"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp, Network, GitBranch, Layers, Search,
  ChevronLeft, ChevronRight, Code2, Brain, BookOpen,
  Zap, Maximize2, Minimize2, Clock, HardDrive,
  BarChart2, Shuffle, Binary, CheckCircle2, Sparkles
} from "lucide-react";
import { useVisualizerStore } from "@/lib/store/useVisualizerStore";
import { ALGORITHM_LIBRARY, getAlgorithmById } from "@/lib/algorithms/index";
import { generateSortingSteps, generateRandomArray } from "@/lib/algorithms/sorting";
import { generateGraphSteps, generateTreeSteps, generateDPSteps } from "@/lib/algorithms/graphTreeDP";
import SortingVisualizer from "./SortingVisualizer";
import GraphVisualizer from "./GraphVisualizer";
import TreeVisualizer from "./TreeVisualizer";
import DPVisualizer from "./DPVisualizer";
import PlaybackControls from "./PlaybackControls";
import CodeTracer from "./CodeTracer";
import VariableInspector from "./VariableInspector";
import DeepLearnPanel from "./DeepLearnPanel";
import AIPanel from "./AIPanel";
import { generateGenericSteps } from "@/lib/algorithms/genericSteps";
import { tokenizeLine, TOKEN_COLORS, detectLang } from "@/lib/syntax/highlighter";
import ArrayVisualizer from "./ArrayVisualizer";
import CodeEditorPanel from "./CodeEditorPanel";
import StackQueueVisualizer from "./StackQueueVisualizer";
import LinkedListVisualizer from "./LinkedListVisualizer";

const CAT_META = {
  arrays: {
    label: "Arrays & Pointers",
    icon: BarChart2,
    color: "#ea580c",
    bg: "from-orange-50 to-amber-50/30",
    hoverBg: "hover:from-orange-100/50 hover:to-amber-50/50",
    border: "border-orange-100 hover:border-orange-300",
    shadow: "shadow-orange-100/50",
    desc: "Master Sliding Window, Two Pointers, Prefix Sum, and Kadane's algorithm transitions."
  },
  datastructures: {
    label: "Data Structures",
    icon: Layers,
    color: "#6366f1",
    bg: "from-indigo-50 to-blue-50/30",
    hoverBg: "hover:from-indigo-100/50 hover:to-blue-50/50",
    border: "border-indigo-100 hover:border-indigo-300",
    shadow: "shadow-indigo-100/50",
    desc: "Interactive step-by-step simulations of Stacks, Queues, Linked Lists, and Min Heaps."
  },
  sorting: {
    label: "Sorting Algorithms",
    icon: TrendingUp,
    color: "#2563eb",
    bg: "from-blue-50 to-indigo-50/30",
    hoverBg: "hover:from-blue-100/50 hover:to-indigo-50/50",
    border: "border-blue-100 hover:border-blue-300",
    shadow: "shadow-blue-100/50",
    desc: "Compare, swap, and order elements step-by-step with real-time array animations."
  },
  searching: {
    label: "Searching Algorithms",
    icon: Search,
    color: "#dc2626",
    bg: "from-red-50 to-orange-50/30",
    hoverBg: "hover:from-red-100/50 hover:to-orange-50/50",
    border: "border-red-100 hover:border-red-300",
    shadow: "shadow-red-100/50",
    desc: "Master sequential scan and divide-and-conquer binary search on sorted collections."
  },
  graph: {
    label: "Graph Algorithms",
    icon: Network,
    color: "#7c3aed",
    bg: "from-purple-50 to-fuchsia-50/30",
    hoverBg: "hover:from-purple-100/50 hover:to-fuchsia-50/50",
    border: "border-purple-100 hover:border-purple-300",
    shadow: "shadow-purple-100/50",
    desc: "Explore network paths using Breadth-First (BFS) and Depth-First (DFS) traversals."
  },
  tree: {
    label: "Tree Structures",
    icon: GitBranch,
    color: "#059669",
    bg: "from-emerald-50 to-teal-50/30",
    hoverBg: "hover:from-emerald-100/50 hover:to-teal-50/50",
    border: "border-emerald-100 hover:border-emerald-300",
    shadow: "shadow-emerald-100/50",
    desc: "Dive into BST insertion, traversal trees, Trie prefixes, and Segment Trees."
  },
  dp: {
    label: "Dynamic Programming",
    icon: Layers,
    color: "#d97706",
    bg: "from-amber-50 to-yellow-50/30",
    hoverBg: "hover:from-amber-100/50 hover:to-yellow-50/50",
    border: "border-amber-100 hover:border-amber-300",
    shadow: "shadow-amber-100/50",
    desc: "Solve complex tasks using memoization, tabulation, and state transition grids."
  }
};

const DIFF = {
  Beginner:     "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Intermediate: "bg-amber-50 text-amber-700 border border-amber-200",
  Advanced:     "bg-rose-50 text-rose-700 border border-rose-200",
};

export default function VisualizerClient() {
  const [mode, setMode] = useState(null);
  const [libStep, setLibStep] = useState("categories");
  const [selectedCategory, setSelectedCat] = useState(null);
  const [selectedAlgorithm, setSelectedAlgo] = useState(null);
  const [vizTab, setVizTab] = useState("visualizer");
  const [showCodePanel, setShowCodePanel] = useState(true);
  const [showVarInspector, setShowVarInspector] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState("python");

  const [sortingSteps, setSortingSteps] = useState([]);
  const [graphSteps, setGraphSteps] = useState([]);
  const [treeSteps, setTreeSteps] = useState([]);
  const [dpSteps, setDPSteps] = useState([]);
  const [genericSteps, setGenericSteps] = useState([]);
  const [arraySize, setArraySize] = useState(16);

  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [codeError, setCodeError] = useState(null);

  const containerRef = useRef(null);
  const playTimerRef = useRef(null);

  const { currentStep, isPlaying, playbackSpeed, eli5Mode,
    setCurrentStep, setIsPlaying, toggleELI5, reset } = useVisualizerStore();

  const activeSteps = selectedCategory === "sorting" ? sortingSteps
    : selectedCategory === "graph" ? graphSteps
    : selectedCategory === "tree" ? treeSteps
    : selectedCategory === "dp" ? dpSteps
    : genericSteps;

  const currentSortStep  = sortingSteps[currentStep]  || null;
  const currentGraphStep = graphSteps[currentStep]    || null;
  const currentTreeStep  = treeSteps[currentStep]     || null;
  const currentDPStep    = dpSteps[currentStep]       || null;
  const currentGenericStep = genericSteps[currentStep] || null;

  const activeStep = selectedCategory === "sorting" ? currentSortStep
    : selectedCategory === "graph" ? currentGraphStep
    : selectedCategory === "tree" ? currentTreeStep
    : selectedCategory === "dp" ? currentDPStep
    : currentGenericStep;

  useEffect(() => {
    if (isPlaying && activeSteps.length > 0) {
      const iv = Math.max(100, 1200 / playbackSpeed);
      playTimerRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= activeSteps.length - 1) { setIsPlaying(false); clearInterval(playTimerRef.current); return prev; }
          return prev + 1;
        });
      }, iv);
    } else { clearInterval(playTimerRef.current); }
    return () => clearInterval(playTimerRef.current);
  }, [isPlaying, playbackSpeed, activeSteps.length, setCurrentStep, setIsPlaying]);

  const generateNewArray = useCallback((size = arraySize) => {
    const arr = generateRandomArray(size);
    if (selectedAlgorithm && selectedCategory === "sorting") {
      setSortingSteps(generateSortingSteps(arr, selectedAlgorithm));
      setCurrentStep(0); setIsPlaying(false);
    }
  }, [arraySize, selectedAlgorithm, selectedCategory, setCurrentStep, setIsPlaying]);

  const handleArraySizeChange = useCallback((newSize) => {
    setArraySize(newSize);
    if (selectedAlgorithm && selectedCategory === "sorting") {
      const arr = generateRandomArray(newSize);
      setSortingSteps(generateSortingSteps(arr, selectedAlgorithm));
      setCurrentStep(0); setIsPlaying(false);
    }
  }, [selectedAlgorithm, selectedCategory, setCurrentStep, setIsPlaying]);

  const handleSelectAlgorithm = (category, algoId) => {
    setSelectedCat(category); setSelectedAlgo(algoId);
    reset(); setVizTab("visualizer");

    const algoMeta = getAlgorithmById(algoId);

    if (algoMeta) {
      if (category === "sorting") {
        const arr = generateRandomArray(arraySize);
        setSortingSteps(generateSortingSteps(arr, algoId));
      } else if (category === "graph") {
        const { steps } = generateGraphSteps(algoId);
        setGraphSteps(steps);
      } else if (category === "tree") {
        setTreeSteps(generateTreeSteps(algoId));
      } else if (category === "dp") {
        setDPSteps(generateDPSteps(algoId));
      } else {
        setGenericSteps(generateGenericSteps(algoId));
      }
      setLibStep("language-select");
    } else {
      setLibStep("algorithms");
    }
  };

  const handleAnalyzeCode = async () => {
    if (!code.trim()) return;
    setIsAnalyzing(true); setCodeError(null);
    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const data = await res.json();
      if (data.success) setAnalysis(data.data);
      else setCodeError(data.error || "Analysis failed");
    } catch { setCodeError("Network error. Please check your connection."); }
    finally { setIsAnalyzing(false); }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) { containerRef.current?.requestFullscreen(); setIsFullscreen(true); }
    else { document.exitFullscreen(); setIsFullscreen(false); }
  };

  if (mode === null) return <WelcomeScreen onSelect={setMode} />;

  if (mode === "mycode") return (
    <MyCodeScreen code={code} setCode={setCode} analysis={analysis} isAnalyzing={isAnalyzing} codeError={codeError}
      onAnalyze={handleAnalyzeCode} onBack={() => { setMode(null); setAnalysis(null); setCode(""); setCodeError(null); }} />
  );

  if (libStep === "categories") return (
    <CategoryScreen onBack={() => setMode(null)} onSelect={cat => { setSelectedCat(cat); setLibStep("algorithms"); }} />
  );

  if (libStep === "ai-generating") return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 p-8">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-6 shadow-md shadow-blue-50 animate-pulse">
          <Brain size={32} className="text-blue-600 animate-spin" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">AI Preparing Visualizer...</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">Analyzing code structure, identifying time complexity, and generating interactive visualization steps on-the-fly.</p>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: "70%", animation: "pulse 2s infinite" }} />
        </div>
      </div>
    </div>
  );

  if (libStep === "algorithms") return (
    <AlgorithmScreen category={selectedCategory} onBack={() => setLibStep("categories")}
      onSelect={algoId => handleSelectAlgorithm(selectedCategory, algoId)} />
  );

  if (libStep === "language-select") return (
    <LanguageSelectScreen
      onBack={() => setLibStep("algorithms")}
      onSelect={lang => {
        setPreferredLanguage(lang);
        setLibStep("visualizing");
      }}
    />
  );

  const algoMeta = ALGORITHM_LIBRARY[selectedCategory]?.algorithms.find(a => a.id === selectedAlgorithm);
  const algoName = algoMeta?.name || selectedAlgorithm;

  return (
    <div ref={containerRef} className="h-screen flex flex-col bg-white overflow-hidden">
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => setLibStep("algorithms")}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100">
            <ChevronLeft size={14} /> Back
          </button>
          <div className="w-px h-4 bg-slate-200" />
          <button onClick={() => setLibStep("categories")} className="text-xs text-slate-400 hover:text-slate-600 transition-colors capitalize">{selectedCategory}</button>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-sm font-bold text-slate-900">{algoName}</span>
          {algoMeta?.difficulty && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${DIFF[algoMeta.difficulty] || DIFF.Beginner}`}>{algoMeta.difficulty}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
            {["visualizer", "learn"].map(tab => (
              <button key={tab} onClick={() => setVizTab(tab)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all capitalize ${vizTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <button onClick={() => setShowCodePanel(v => !v)}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${showCodePanel ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-slate-500 border-slate-200"}`}>
            <Code2 size={12} /> Code
          </button>
          <button onClick={() => setShowVarInspector(v => !v)}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${showVarInspector ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-slate-500 border-slate-200"}`}>
            <Zap size={12} /> Vars
          </button>
          <button onClick={toggleELI5}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${eli5Mode ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-white text-slate-500 border-slate-200"}`}>
            <BookOpen size={12} /> ELI5
          </button>
          <div className="w-px h-4 bg-slate-200" />
          <button onClick={toggleFullscreen} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </header>

      {vizTab === "learn" ? (
        <DeepLearnPanel algorithmId={selectedAlgorithm} selectedCategory={selectedCategory} preferredLanguage={preferredLanguage} />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {selectedCategory === "sorting" && <SortingVisualizer steps={sortingSteps} currentStep={currentStep} currentStepData={currentSortStep} eli5Mode={eli5Mode} />}
            {selectedCategory === "graph"   && <GraphVisualizer stepData={currentGraphStep} eli5Mode={eli5Mode} />}
            {selectedCategory === "tree"    && <TreeVisualizer stepData={currentTreeStep} eli5Mode={eli5Mode} />}
            {selectedCategory === "dp"      && <DPVisualizer stepData={currentDPStep} algorithmId={selectedAlgorithm} eli5Mode={eli5Mode} />}
            {(selectedCategory === "arrays" || selectedCategory === "searching") && (
              <ArrayVisualizer stepData={currentGenericStep} algorithmId={selectedAlgorithm} eli5Mode={eli5Mode} />
            )}
            {selectedCategory === "datastructures" && (["stack","queue","min-stack","circular-queue"].includes(selectedAlgorithm)) && (
              <StackQueueVisualizer stepData={currentGenericStep} algorithmId={selectedAlgorithm} eli5Mode={eli5Mode} />
            )}
            {selectedCategory === "datastructures" && (["linked-list","doubly-linked-list","floyd-cycle"].includes(selectedAlgorithm)) && (
              <LinkedListVisualizer stepData={currentGenericStep} algorithmId={selectedAlgorithm} eli5Mode={eli5Mode} />
            )}
            {selectedCategory === "datastructures" && !["stack","queue","min-stack","circular-queue","linked-list","doubly-linked-list","floyd-cycle"].includes(selectedAlgorithm) && (
              <ArrayVisualizer stepData={currentGenericStep} algorithmId={selectedAlgorithm} eli5Mode={eli5Mode} />
            )}
            {!["sorting","graph","tree","dp","arrays","searching","datastructures"].includes(selectedCategory) && (
              <GenericStepView stepData={currentGenericStep} analysis={null} eli5={eli5Mode} currentStep={currentStep} total={activeSteps.length} algorithmId={selectedAlgorithm} preferredLanguage={preferredLanguage} />
            )}

            {showVarInspector && activeStep && (activeStep.variables || activeStep.state) && Object.keys(activeStep.variables || activeStep.state || {}).length > 0 && (
              <VariableInspector variables={activeStep.variables || activeStep.state || {}} currentStep={currentStep} />
            )}

            <PlaybackControls
              currentStep={currentStep} totalSteps={activeSteps.length}
              isPlaying={isPlaying} playbackSpeed={playbackSpeed}
              onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}
              onPrev={() => { setIsPlaying(false); setCurrentStep(Math.max(0, currentStep - 1)); }}
              onNext={() => { setIsPlaying(false); setCurrentStep(Math.min(activeSteps.length - 1, currentStep + 1)); }}
              onReset={() => { setIsPlaying(false); setCurrentStep(0); }}
              onSpeedChange={s => useVisualizerStore.getState().setPlaybackSpeed(s)}
              onNewArray={generateNewArray} arraySize={arraySize} onArraySizeChange={handleArraySizeChange}
              selectedAlgorithm={selectedAlgorithm} showArrayControls={selectedCategory === "sorting"}
              currentDescription={currentSortStep?.description || currentGraphStep?.description || currentTreeStep?.description || currentDPStep?.description || currentGenericStep?.description}
            />
          </div>

          <AnimatePresence>
            {showCodePanel && (
              <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 360, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="shrink-0 border-l border-slate-200 bg-white flex flex-col overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100 shrink-0">
                  <Code2 size={13} className="text-blue-600" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Algorithm Code</span>
                  <span className="ml-auto text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Read-only</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <CodeTracer algorithmId={selectedAlgorithm} currentLine={activeStep?.line || 0} currentStep={currentStep} language={preferredLanguage} embedded />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function WelcomeScreen({ onSelect }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 p-8 relative">
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-900 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow transition-all">
        <ChevronLeft size={16} /> Back to Home
      </Link>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <BarChart2 size={24} className="text-white" />
          </div>
          <span className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">CodeViz</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3 font-display leading-tight">
          Learn Any Algorithm.<br />
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Visually.</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-md mx-auto">
          Step-by-step visualization of 150+ algorithms — from Bubble Sort to Dijkstra's.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <motion.button
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          onClick={() => onSelect("library")}
          className="group relative overflow-hidden rounded-3xl border-2 border-blue-100 bg-white p-8 text-left shadow-xl shadow-blue-100 hover:shadow-2xl hover:shadow-blue-200 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 opacity-0 group-hover:opacity-5 transition-opacity" />
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-5 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
            <TrendingUp size={26} className="text-white" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Algorithm Library</h2>
          <p className="text-slate-500 text-sm mb-5 leading-relaxed">
            Browse 150+ pre-built algorithms. Watch them execute step-by-step with live code tracing and variable tracking.
          </p>
          <div className="flex items-center gap-4 mb-5">
            {["Sorting", "Graph", "Tree", "DP"].map(tag => (
              <span key={tag} className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">{tag}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:gap-3 transition-all">
            Explore Library <ChevronRight size={16} />
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          onClick={() => onSelect("mycode")}
          className="group relative overflow-hidden rounded-3xl border-2 border-violet-100 bg-white p-8 text-left shadow-xl shadow-violet-100 hover:shadow-2xl hover:shadow-violet-200 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-violet-700 opacity-0 group-hover:opacity-5 transition-opacity" />
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center mb-5 shadow-lg shadow-violet-200 group-hover:scale-110 transition-transform">
            <Brain size={26} className="text-white" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">My Code Visualizer</h2>
          <p className="text-slate-500 text-sm mb-5 leading-relaxed">
            Paste any code — broken, partial, or complete. AI detects language, algorithms, errors, complexity and explains everything.
          </p>
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={14} className="text-violet-500" />
            <span className="text-xs font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2.5 py-1 rounded-full">AI-Powered Analysis</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-violet-600 group-hover:gap-3 transition-all">
            Start Analyzing <ChevronRight size={16} />
          </div>
        </motion.button>
      </div>
    </div>
  );
}

function CategoryScreen({ onBack, onSelect }) {
  const categories = Object.keys(ALGORITHM_LIBRARY).filter(k => ALGORITHM_LIBRARY[k]?.algorithms?.length > 0);
  const totalAlgos = Object.values(ALGORITHM_LIBRARY).reduce((acc, cat) => acc + (cat.algorithms?.length || 0), 0);

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all">
          <ChevronLeft size={15} /> Back
        </button>
        <div className="w-px h-5 bg-slate-200" />
        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Algorithm Library</h1>
        <span className="text-xs text-slate-400 font-medium">— Choose a category to begin</span>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 shadow-sm">
            {totalAlgos} Active DSA Visualizers
          </span>
          <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100 shadow-sm">
            100% Final & Verified
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => {
            const meta = CAT_META[cat] || {
              label: cat.charAt(0).toUpperCase() + cat.slice(1),
              icon: Code2,
              color: "#475569",
              bg: "from-slate-50 to-slate-100/30",
              hoverBg: "hover:from-slate-100/50 hover:to-slate-200/50",
              border: "border-slate-200",
              shadow: "shadow-slate-100",
              desc: ""
            };
            const Icon = meta.icon;
            const count = ALGORITHM_LIBRARY[cat]?.algorithms?.length || 0;
            return (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 25 }}
                onClick={() => onSelect(cat)}
                className={`group flex flex-col justify-between p-6 bg-gradient-to-br ${meta.bg} ${meta.hoverBg} rounded-3xl border-2 ${meta.border} hover:shadow-xl hover:${meta.shadow} transition-all duration-300 text-left hover:-translate-y-1.5`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-white shadow-md shadow-slate-100/50 group-hover:scale-110 transition-transform">
                    <Icon size={22} style={{ color: meta.color }} />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-2 tracking-tight group-hover:text-slate-800 transition-colors">
                    {meta.label.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-5 min-h-[40px]">
                    {meta.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between w-full border-t border-slate-100/80 pt-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white shadow-sm" style={{ color: meta.color }}>
                    {count} Algorithms
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold transition-all" style={{ color: meta.color }}>
                    Explore <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AlgorithmScreen({ category, onBack, onSelect }) {
  const meta = CAT_META[category] || {
    label: category.charAt(0).toUpperCase() + category.slice(1),
    icon: Code2,
    color: "#475569",
    bg: "from-slate-50 to-slate-100/30",
    hoverBg: "hover:from-slate-100/50 hover:to-slate-200/50",
    border: "border-slate-200",
    shadow: "shadow-slate-100"
  };
  const Icon = meta.icon;
  const algorithms = ALGORITHM_LIBRARY[category]?.algorithms || [];

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all">
          <ChevronLeft size={15} /> All Categories
        </button>
        <div className="w-px h-5 bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white shadow-sm" style={{ color: meta.color }}>
            <Icon size={16} />
          </div>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {meta.label.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </h1>
        </div>
        <span className="text-xs text-slate-400 font-medium ml-1">— Pick an algorithm to visualize</span>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {algorithms.map((algo, i) => (
            <motion.button
              key={algo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 25 }}
              onClick={() => onSelect(algo.id)}
              className="group flex flex-col justify-between p-6 bg-white rounded-3xl border-2 border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/40 transition-all duration-300 text-left hover:-translate-y-1.5"
            >
              <div>
                <h3 className="text-base font-extrabold text-slate-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                  {algo.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </h3>
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center justify-between text-xs bg-slate-50 px-3 py-2 rounded-xl">
                    <span className="text-slate-400">Time Complexity</span>
                    <span className="font-extrabold text-slate-700 font-mono">{algo.complexity?.time || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-slate-50 px-3 py-2 rounded-xl">
                    <span className="text-slate-400">Space Complexity</span>
                    <span className="font-extrabold text-slate-700 font-mono">{algo.complexity?.space || "—"}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-slate-50 pt-4 w-full">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${DIFF[algo.difficulty] || DIFF.Beginner}`}>
                  {algo.difficulty.charAt(0).toUpperCase() + algo.difficulty.slice(1)}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-blue-600">
                  Visualize <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MyCodeScreen({ code, setCode, analysis, isAnalyzing, codeError, onAnalyze, onBack }) {
  const [myStep, setMyStep] = useState(0);
  const [myPlaying, setMyPlaying] = useState(false);
  const [mySpeed, setMySpeed] = useState(1);
  const [showCode, setShowCode] = useState(true);
  const [eli5, setEli5] = useState(false);
  const playRef = useRef(null);

  const steps = analysis?.steps || [];
  const total = steps.length;
  const stepData = steps[myStep] || null;

  useEffect(() => { setMyStep(0); setMyPlaying(false); }, [analysis]);

  useEffect(() => {
    if (myPlaying && total > 0) {
      const iv = Math.max(200, 1500 / mySpeed);
      playRef.current = setInterval(() => {
        setMyStep(prev => {
          if (prev >= total - 1) { setMyPlaying(false); clearInterval(playRef.current); return prev; }
          return prev + 1;
        });
      }, iv);
    } else { clearInterval(playRef.current); }
    return () => clearInterval(playRef.current);
  }, [myPlaying, mySpeed, total]);

  function aiToSortStep(s) {
    if (!s) return null;
    return {
      array:       s.state?.array       || [],
      comparing:   s.state?.comparing   || [],
      swapped:     s.state?.swapped     || [],
      sorted:      s.state?.sorted      || [],
      highlight:   s.state?.highlight   || [],
      pivot:       s.state?.pivot !== undefined ? [s.state.pivot] : [],
      description: s.description        || "",
      line:        s.highlight?.[0]     || 0,
      variables:   Object.fromEntries(
        Object.entries(s.state || {}).filter(([k]) => !["array","comparing","swapped","sorted","highlight","pivot"].includes(k))
      ),
    };
  }

  const allSortSteps = steps.map(aiToSortStep);
  const currentSortStep = aiToSortStep(stepData);
  const isSorting = analysis?.visualizationType === "sorting" && currentSortStep?.array?.length > 0;
  const isGraphViz = analysis?.visualizationType === "graph";
  const isTreeViz = analysis?.visualizationType === "tree";
  const isDPViz = analysis?.visualizationType === "dp";

  // Extract any array from state to display in ArrayVisualizer
  let activeArray = null;
  if (stepData?.state) {
    const keys = ["array", "nums", "arr", "list", "stack", "queue", "dp", "prefix"];
    for (const k of keys) {
      if (Array.isArray(stepData.state[k])) { activeArray = stepData.state[k]; break; }
    }
    if (!activeArray) {
      const foundK = Object.keys(stepData.state).find(k => Array.isArray(stepData.state[k]) && stepData.state[k].length > 0);
      if (foundK) activeArray = stepData.state[foundK];
    }
  }
  const isArrayViz = !isSorting && !isGraphViz && !isTreeViz && !isDPViz && activeArray !== null && activeArray.length > 0;

  const liveVars = stepData ? Object.fromEntries(
    Object.entries(stepData.state || {}).filter(([k]) => !["array","comparing","swapped","sorted","highlight","pivot"].includes(k))
  ) : {};

  if (!analysis) {
    return (
      <div className="h-screen flex flex-col bg-white overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-3.5 bg-white border-b border-slate-200 shrink-0">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all">
            <ChevronLeft size={15} /> Back
          </button>
          <div className="w-px h-5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
              <Brain size={15} className="text-violet-600" />
            </div>
            <h1 className="text-base font-extrabold text-slate-900">My Code Visualizer</h1>
            <span className="text-xs font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles size={10} /> AI-Powered
            </span>
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-200">
            <CodeEditorPanel
              code={code}
              onCodeChange={setCode}
              onAnalyze={onAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>
          <div className="w-80 xl:w-96 shrink-0 bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mb-4">
              <Brain size={28} className="text-violet-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">AI Analysis Results</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Paste your code and click <strong className="text-slate-600">Analyze with AI</strong>. Results appear here and the full visualizer launches automatically.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => { setMyStep(0); setMyPlaying(false); }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-all" title="Edit code again">
            <ChevronLeft size={13} /> Edit Code
          </button>
          <div className="w-px h-4 bg-slate-200" />
          <span className="text-xs text-slate-400 capitalize font-medium">{analysis.language}</span>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-sm font-bold text-slate-900">{analysis.algorithms?.[0] || analysis.summary || "Code Analysis"}</span>
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">{analysis.complexity?.time || "—"}</span>
          {analysis.errors?.length > 0 && (
            <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">{analysis.errors.length} error{analysis.errors.length > 1 ? "s" : ""}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={onAnalyze} disabled={isAnalyzing}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700 transition-all">
            <Sparkles size={11} /> Re-analyze
          </button>
          <div className="w-px h-4 bg-slate-200" />
          <button onClick={() => setShowCode(v => !v)}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${showCode ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-slate-500 border-slate-200"}`}>
            <Code2 size={12} /> Code
          </button>
          <button onClick={() => setEli5(v => !v)}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${eli5 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-white text-slate-500 border-slate-200"}`}>
            <BookOpen size={12} /> ELI5
          </button>
          <button onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 transition-all">
            <ChevronLeft size={12} /> Home
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {isSorting ? (
            <SortingVisualizer steps={allSortSteps} currentStep={myStep} currentStepData={currentSortStep} eli5Mode={eli5} />
          ) : isGraphViz ? (
            <GraphVisualizer stepData={stepData} eli5Mode={eli5} />
          ) : isTreeViz ? (
            <TreeVisualizer stepData={stepData} eli5Mode={eli5} />
          ) : isDPViz ? (
            <DPVisualizer stepData={stepData} algorithmId={analysis.algorithms?.[0]?.toLowerCase() || "custom"} eli5Mode={eli5} />
          ) : isArrayViz ? (
            <ArrayVisualizer
              stepData={{
                ...stepData,
                state: {
                  ...stepData?.state,
                  array: activeArray
                }
              }}
              algorithmId={analysis.algorithms?.[0]?.toLowerCase() || "custom"}
              eli5Mode={eli5}
            />
          ) : (
            <GenericStepView stepData={stepData} analysis={analysis} eli5={eli5} currentStep={myStep} total={total} />
          )}

          {Object.keys(liveVars).length > 0 && (
            <VariableInspector variables={liveVars} currentStep={myStep} />
          )}

          <div className="shrink-0 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
              <div className="flex items-center gap-1">
                <button onClick={() => { setMyPlaying(false); setMyStep(0); }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                </button>
                <button onClick={() => { setMyPlaying(false); setMyStep(s => Math.max(0, s - 1)); }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
                </button>
                <button onClick={() => setMyPlaying(v => !v)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md transition-all ${myPlaying ? "bg-rose-500 hover:bg-rose-600" : "bg-blue-600 hover:bg-blue-700"}`}>
                  {myPlaying
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
                </button>
                <button onClick={() => { setMyPlaying(false); setMyStep(s => Math.min(total - 1, s + 1)); }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
                </button>
              </div>
              <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                Step {myStep + 1} / {total || 1}
              </div>
              <input type="range" min={0} max={Math.max(0, total - 1)} value={myStep}
                onChange={e => { setMyPlaying(false); setMyStep(Number(e.target.value)); }}
                className="flex-1 min-w-24 h-1.5 rounded-full accent-blue-600" />
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-xs text-slate-400">Speed</span>
                {[0.5, 1, 2, 4].map(s => (
                  <button key={s} onClick={() => setMySpeed(s)}
                    className={`text-xs font-bold px-2 py-1 rounded-md transition-all ${mySpeed === s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showCode && (
            <motion.div
              initial={{ width: 0, opacity: 0 }} animate={{ width: 380, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="shrink-0 border-l border-slate-200 bg-white flex flex-col overflow-hidden"
            >
              <UserCodeViewer
                code={code}
                language={analysis.language}
                highlightLines={stepData?.highlight || []}
                eli5={eli5}
                analysis={analysis}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function UserCodeViewer({ code, language, highlightLines, eli5, analysis }) {
  const lines = (code || "").split("\n");
  const highlightSet = new Set((highlightLines || []).map(Number));
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <Code2 size={13} className="text-violet-600" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Code</span>
          {highlightLines?.length > 0 && (
            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
              Line{highlightLines.length > 1 ? "s" : ""} {highlightLines.join(", ")} active
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400 capitalize font-mono">{language}</span>
      </div>
      <div className="flex-1 overflow-x-auto font-mono bg-[#fafafa]">
        {lines.map((lineText, idx) => {
          const lineNum = idx + 1;
          const isActive = highlightSet.has(lineNum);
          const tokens = tokenizeLine(lineText, language);
          return (
            <div key={idx}
              className="flex items-stretch min-w-0 transition-colors duration-150"
              style={{
                backgroundColor: isActive ? '#fef3c7' : 'transparent',
                borderLeft: isActive ? '3px solid #f59e0b' : '3px solid transparent',
              }}>
              <div
                className="w-10 shrink-0 flex items-center justify-end pr-3 text-xs select-none py-0.5 border-r mr-3"
                style={{
                  color: isActive ? '#d97706' : '#d1d5db',
                  borderColor: isActive ? '#fde68a' : '#f3f4f6',
                  fontFamily: 'monospace',
                  minWidth: 40,
                }}>{lineNum}</div>
              <code className="flex-1 text-xs leading-6 py-0.5 pr-4 whitespace-pre font-mono overflow-x-auto">
                {tokens.length === 0 ? <span>&#8203;</span> : tokens.map((tok, ti) => {
                  const col = TOKEN_COLORS[tok.type] || TOKEN_COLORS.default;
                  return (
                    <span key={ti} style={{
                      color: isActive ? (col.active || col.normal) : col.normal,
                      fontStyle: col.italic ? 'italic' : 'normal',
                      fontWeight: col.bold ? 700 : isActive ? 500 : 400,
                    }}>{tok.text}</span>
                  );
                })}
              </code>
            </div>
          );
        })}
      </div>
      <div className="border-t border-slate-100 bg-white shrink-0">
        {analysis?.errors?.length > 0 && (
          <div className="px-4 py-2 border-b border-rose-100 bg-rose-50">
            <div className="text-xs font-bold text-rose-700 mb-1">Errors detected</div>
            {analysis.errors.slice(0, 3).map((err, i) => (
              <div key={i} className="text-xs text-rose-600">Line {err.line}: {err.message}</div>
            ))}
          </div>
        )}
        {analysis?.complexity && (
          <div className="flex items-center gap-3 px-4 py-2 text-xs">
            <div><span className="text-slate-400">Time</span> <span className="font-bold text-blue-700 font-mono">{analysis.complexity.time}</span></div>
            <div className="w-px h-3 bg-slate-200" />
            <div><span className="text-slate-400">Space</span> <span className="font-bold text-emerald-700 font-mono">{analysis.complexity.space}</span></div>
          </div>
        )}
        {eli5 && analysis?.eli5 && (
          <div className="px-4 py-3 bg-amber-50 border-t border-amber-100">
            <div className="text-xs font-bold text-amber-700 mb-1">ELI5</div>
            <p className="text-xs text-amber-900 leading-relaxed">{analysis.eli5}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function GenericStepView({ stepData, analysis, eli5, currentStep, total, algorithmId, preferredLanguage }) {
  const algoMeta = getAlgorithmById(algorithmId);
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-6 overflow-y-auto">
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-blue-600 text-white font-bold px-3 py-1 rounded-full text-sm">Step {currentStep + 1}</span>
          <span className="text-xs text-slate-400">of {total}</span>
          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${total > 1 ? (currentStep / (total - 1)) * 100 : 100}%` }} />
          </div>
        </div>
        <motion.div key={currentStep} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-base font-semibold text-slate-800 leading-relaxed">
            {stepData?.description || "Waiting for step..."}
          </p>
          {stepData?.state && Object.keys(stepData.state).filter(k => k !== "array").length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(stepData.state).filter(([k]) => k !== "array").map(([k, v]) => (
                <div key={k} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                  <span className="text-xs font-bold text-blue-700 font-mono">{k}</span>
                  <span className="text-slate-400 text-xs">=</span>
                  <span className="text-xs font-extrabold text-slate-900 font-mono">{Array.isArray(v) ? `[${v.join(", ")}]` : String(v)}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
        {eli5 && analysis?.eli5 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">ELI5</div>
            <p className="text-sm text-amber-900 leading-relaxed">{analysis.eli5}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-xs text-slate-400 mb-1">Algorithm</div>
            <div className="text-sm font-bold text-slate-900">{algoMeta?.name || analysis?.algorithms?.join(", ") || "Unknown"}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-xs text-slate-400 mb-1">Language</div>
            <div className="text-sm font-bold text-slate-900 capitalize">{preferredLanguage || analysis?.language || "Auto-detected"}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-xs text-slate-400 mb-1">Time Complexity</div>
            <div className="text-sm font-bold text-blue-700 font-mono">{algoMeta?.complexity?.time || analysis?.complexity?.time || "—"}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-xs text-slate-400 mb-1">Space Complexity</div>
            <div className="text-sm font-bold text-emerald-700 font-mono">{algoMeta?.complexity?.space || analysis?.complexity?.space || "—"}</div>
          </div>
        </div>
        {analysis?.errors?.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
            <div className="text-xs font-bold text-rose-700 mb-2">Errors Found</div>
            {analysis.errors.map((e, i) => (
              <div key={i} className="text-sm text-rose-800 mb-1">Line {e.line}: {e.message}</div>
            ))}
            {analysis.fixSuggestion && (
              <div className="mt-3 p-3 bg-white border border-rose-100 rounded-lg">
                <div className="text-xs font-bold text-slate-600 mb-1">Suggested Fix</div>
                <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">{analysis.fixSuggestion}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LanguageSelectScreen({ onBack, onSelect }) {
  const options = [
    { id: "python", name: "Python", desc: "Pythonic, readable, clean & beginner-friendly syntax.", color: "#3776ab", bg: "from-blue-50 to-amber-50/20", border: "border-blue-100 hover:border-blue-300", shadow: "shadow-blue-100" },
    { id: "cpp", name: "C++", desc: "Highly optimized, native compiler, and raw performance.", color: "#00599c", bg: "from-sky-50 to-indigo-50/20", border: "border-sky-100 hover:border-sky-300", shadow: "shadow-sky-100" },
    { id: "java", name: "Java", desc: "Robust, object-oriented, strictly-typed enterprise standard.", color: "#ea2d2e", bg: "from-red-50 to-orange-50/20", border: "border-red-100 hover:border-red-300", shadow: "shadow-red-100" },
    { id: "javascript", name: "JavaScript", desc: "Web native language, dynamic typing, and event-driven.", color: "#f7df1e", bg: "from-yellow-50 to-amber-50/20", border: "border-yellow-200 hover:border-yellow-400", shadow: "shadow-yellow-100" }
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all">
          <ChevronLeft size={15} /> Back
        </button>
        <div className="w-px h-5 bg-slate-200" />
        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Select Code Language</h1>
        <span className="text-xs text-slate-400 font-medium">— Customize trace visualization</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-8 max-w-md">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Choose your language</h2>
          <p className="text-sm text-slate-500 leading-relaxed">The code trace execution, variable tracing, and inline descriptions will adjust dynamically to your selection.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
          {options.map((opt, i) => (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 25 }}
              onClick={() => onSelect(opt.id)}
              className={`group flex flex-col justify-between p-6 bg-gradient-to-br ${opt.bg} rounded-3xl border-2 ${opt.border} hover:shadow-xl hover:${opt.shadow} transition-all duration-300 text-left hover:-translate-y-1`}
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-black text-slate-800 tracking-tight">{opt.name}</span>
                  <div className="w-2 h-2 rounded-full ml-auto" style={{ backgroundColor: opt.color }} />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{opt.desc}</p>
              </div>
              <div className="flex items-center justify-between w-full border-t border-slate-100/80 pt-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white shadow-sm" style={{ color: opt.color }}>
                  {opt.id.toUpperCase()}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-slate-600">
                  Select <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}


