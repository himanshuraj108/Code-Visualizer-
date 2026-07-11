"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code2, Zap, Brain, Play, ChevronRight, Star, Shield,
  GitBranch, Layers, BarChart2, Network, Search, TreePine,
  Shuffle, Hash, ArrowRight, CheckCircle2, Globe, Users,
  Sparkles, BookOpen, Terminal, Cpu, TrendingUp, Award
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.4, 0, 0.2, 1] }
  })
};

const ALGO_CATEGORIES = [
  { icon: BarChart2, label: "Sorting", count: 15, color: "bg-blue-50 text-blue-600 border-blue-100", desc: "Bubble, Merge, Quick, Heap, Radix & more" },
  { icon: Search, label: "Searching", count: 10, color: "bg-violet-50 text-violet-600 border-violet-100", desc: "Binary, Jump, Fibonacci, Interpolation" },
  { icon: Network, label: "Graph", count: 20, color: "bg-emerald-50 text-emerald-600 border-emerald-100", desc: "BFS, DFS, Dijkstra, A*, MST & more" },
  { icon: TreePine, label: "Trees", count: 20, color: "bg-amber-50 text-amber-600 border-amber-100", desc: "BST, AVL, Red-Black, Trie, Segment Tree" },
  { icon: Layers, label: "Dynamic Prog.", count: 15, color: "bg-rose-50 text-rose-600 border-rose-100", desc: "Knapsack, LCS, Edit Distance, DP on Trees" },
  { icon: Hash, label: "Hashing", count: 8, color: "bg-indigo-50 text-indigo-600 border-indigo-100", desc: "Open/Closed Hashing, Bloom Filter" },
  { icon: GitBranch, label: "Backtracking", count: 10, color: "bg-cyan-50 text-cyan-600 border-cyan-100", desc: "N-Queens, Sudoku, Permutations" },
  { icon: Shuffle, label: "Strings", count: 15, color: "bg-pink-50 text-pink-600 border-pink-100", desc: "KMP, Rabin-Karp, Aho-Corasick, Z-Algo" },
];

const FEATURES = [
  { icon: Brain, title: "AI-Powered Analysis", desc: "Groq LLM analyzes your code instantly — broken, partial, or perfect. Get fixes, completions, and explanations in real time.", color: "text-violet-600", bg: "bg-violet-50" },
  { icon: Zap, title: "Lightning Fast", desc: "500+ tokens/second via Groq inference. Near-instant analysis, zero waiting. Your code visualized before you blink.", color: "text-amber-600", bg: "bg-amber-50" },
  { icon: Code2, title: "Any Code Works", desc: "Paste anything — full programs, snippets, broken code, partial functions, pseudocode. We handle every case intelligently.", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: BookOpen, title: "ELI5 Mode", desc: "Made for everyone from 1st graders to senior engineers. Switch to child-friendly mode with simple visuals and plain English.", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: Globe, title: "20+ Languages", desc: "Python, JavaScript, TypeScript, Java, C++, C, Go, Rust, Kotlin, Swift, Ruby, PHP, and many more.", color: "text-indigo-600", bg: "bg-indigo-50" },
  { icon: TrendingUp, title: "Big-O Auto-Detection", desc: "Automatic time and space complexity analysis for any code you paste. Understand performance at a glance.", color: "text-rose-600", bg: "bg-rose-50" },
];

const STATS = [
  { value: "150+", label: "Algorithms", icon: Cpu },
  { value: "20+", label: "Languages", icon: Globe },
  { value: "100%", label: "Free Forever", icon: Star },
  { value: "0ms", label: "Setup Required", icon: Zap },
];

const CODE_PREVIEW = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

result = bubble_sort([64, 34, 25, 12, 22, 11, 90])`;

const HOW_IT_WORKS = [
  { step: "01", title: "Paste Any Code", desc: "Drop in your code — working, broken, partial, or pseudocode. Any language, any state.", icon: Terminal },
  { step: "02", title: "AI Analyzes Instantly", desc: "Groq AI detects language, finds issues, suggests fixes, and prepares the visualization engine.", icon: Brain },
  { step: "03", title: "Watch It Come Alive", desc: "Step through animated visualizations with full control. Play, pause, rewind at any speed.", icon: Play },
];

function AnimatedBars() {
  const heights = [40, 72, 28, 88, 52, 64, 36, 96, 44, 68];
  const highlighted = [3, 4];
  return (
    <div className="flex items-end gap-2 h-24">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ delay: i * 0.08, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className={`flex-1 rounded-t-lg ${
            highlighted.includes(i)
              ? "bg-gradient-to-t from-blue-600 to-violet-500 shadow-lg shadow-blue-200"
              : "bg-gradient-to-t from-slate-200 to-slate-100 border border-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

function FloatingCodeCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-2xl blur-2xl" />
      <div className="relative glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-mono text-slate-400 ml-2">bubble_sort.py</span>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Python</span>
          </div>
        </div>
        <div className="p-4 font-mono text-xs leading-relaxed">
          {CODE_PREVIEW.split("\n").map((line, i) => (
            <div key={i} className={`px-2 rounded ${i === 4 ? "line-highlight" : ""}`}>
              <span className="text-slate-400 select-none mr-3">{String(i + 1).padStart(2, "0")}</span>
              <span className={
                line.includes("def ") ? "code-token-keyword" :
                line.includes("for ") || line.includes("if ") || line.includes("return") ? "code-token-keyword" :
                line.includes('"') || line.includes("'") ? "code-token-string" :
                "text-slate-700"
              }>{line}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 px-4 py-3 bg-slate-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Visualization</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-blue-600 font-medium">Step 4 / 7</span>
            </div>
          </div>
          <AnimatedBars />
        </div>
      </div>
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-3 -right-3 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-2"
      >
        <CheckCircle2 size={14} className="text-emerald-500" />
        <span className="text-xs font-semibold text-slate-700">O(n²) detected</span>
      </motion.div>
      <motion.div
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-3 -left-3 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-2"
      >
        <Brain size={14} className="text-violet-500" />
        <span className="text-xs font-semibold text-slate-700">AI-powered</span>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 glass border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="YCV Logo" className="w-14 h-14" />
              <div className="flex flex-col">
                <span className="text-lg font-black font-display text-slate-900 leading-none">YCV</span>
                <span className="text-[10px] font-extrabold text-slate-500 tracking-wide mt-0.5 uppercase">Your Code Visualizer</span>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full ml-1">BETA</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {["Features", "Algorithms", "How It Works"].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                  {item}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link href="/visualizer"
                className="btn-primary text-sm px-5 py-2 rounded-lg flex items-center gap-2">
                <Play size={15} />
                Try Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden gradient-hero pt-20 pb-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl animate-pulse-slow delay-300" />
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl animate-pulse-slow delay-500" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <motion.div
                variants={fadeUp} initial="hidden" animate="visible" custom={0}
                className="inline-flex items-center gap-2 bg-white border border-blue-100 px-4 py-2 rounded-full shadow-sm"
              >
                <Sparkles size={14} className="text-blue-500" />
                <span className="text-sm font-semibold text-slate-700">AI-Powered • 150+ Algorithms • 100% Free</span>
              </motion.div>

              <motion.h1
                variants={fadeUp} initial="hidden" animate="visible" custom={1}
                className="text-5xl sm:text-6xl font-extrabold font-display leading-tight text-slate-900"
              >
                Visualize
                <span className="block gradient-text">Any Algorithm</span>
                Instantly
              </motion.h1>

              <motion.p
                variants={fadeUp} initial="hidden" animate="visible" custom={2}
                className="text-xl text-slate-600 max-w-lg leading-relaxed"
              >
                Paste any code — broken, partial, or perfect. Our AI understands it,
                fixes issues, and creates stunning step-by-step visualizations. Built for
                everyone from beginners to FAANG engineers.
              </motion.p>

              <motion.div
                variants={fadeUp} initial="hidden" animate="visible" custom={3}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/visualizer"
                  className="btn-primary text-base px-7 py-3.5 rounded-xl flex items-center justify-center gap-2.5 font-semibold">
                  <Play size={18} />
                  Start Visualizing Free
                  <ArrowRight size={16} />
                </Link>
                <a href="#how-it-works"
                  className="btn-secondary text-base px-7 py-3.5 rounded-xl flex items-center justify-center gap-2.5">
                  <BookOpen size={18} />
                  See How It Works
                </a>
              </motion.div>

              <motion.div
                variants={fadeUp} initial="hidden" animate="visible" custom={4}
                className="flex items-center gap-6 pt-2"
              >
                {[
                  { icon: CheckCircle2, text: "No signup required" },
                  { icon: CheckCircle2, text: "Zero installation" },
                  { icon: CheckCircle2, text: "Free forever" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon size={15} className="text-emerald-500" />
                    <span className="text-sm text-slate-600">{text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="relative">
              <FloatingCodeCard />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-y border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm mb-3 mx-auto">
                  <Icon size={20} className="text-blue-600" />
                </div>
                <div className="text-3xl font-extrabold font-display gradient-text">{value}</div>
                <div className="text-sm font-medium text-slate-500 mt-1">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-bold text-blue-600 tracking-widest uppercase">Features</span>
            <h2 className="text-4xl font-extrabold font-display text-slate-900 mt-3 mb-4">
              Built to Beat Every Tool Out There
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Not just another visualizer. YCV (Your Code Visualizer) is a complete learning platform powered by AI.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <motion.div
                key={title}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="glass-card algo-card card-hover rounded-2xl p-6"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${bg} mb-4`}>
                  <Icon size={22} className={color} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="algorithms" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-bold text-violet-600 tracking-widest uppercase">Algorithm Library</span>
            <h2 className="text-4xl font-extrabold font-display text-slate-900 mt-3 mb-4">
              150+ Algorithms, All Visualized
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Every algorithm that exists in computer science, from basic sorting to advanced graph theory.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ALGO_CATEGORIES.map(({ icon: Icon, label, count, color, desc }, i) => (
              <motion.div
                key={label}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.5}
              >
                <Link href={`/visualizer?category=${label.toLowerCase()}`}
                  className={`glass-card algo-card card-hover rounded-2xl p-5 border block ${color}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border ${color}`}>
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full border">{count}+</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{label}</h3>
                  <p className="text-xs text-slate-500">{desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/visualizer"
              className="btn-primary text-base px-8 py-3.5 rounded-xl inline-flex items-center gap-2.5 font-semibold">
              <Play size={18} />
              Explore All Algorithms
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-bold text-emerald-600 tracking-widest uppercase">How It Works</span>
            <h2 className="text-4xl font-extrabold font-display text-slate-900 mt-3 mb-4">
              Three Steps to Understanding
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }, i) => (
              <motion.div
                key={step}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="relative text-center"
              >
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-violet-200 transform -translate-y-1/2 z-0" />
                )}
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 border-2 border-blue-100 mb-5 mx-auto">
                    <Icon size={30} className="text-blue-600" />
                  </div>
                  <div className="text-xs font-black text-blue-400 tracking-widest mb-2">{step}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-blue-600 via-violet-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-8">
              <Award size={16} className="text-amber-300" />
              <span className="text-sm font-semibold text-white">#1 Code Visualizer — Free Forever</span>
            </div>
            <h2 className="text-5xl font-extrabold font-display text-white mb-6">
              Ready to Understand Code Like Never Before?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of developers and students who visualize code instead of just reading it.
            </p>
            <Link href="/visualizer"
              className="inline-flex items-center gap-3 bg-white text-blue-700 font-bold text-lg px-10 py-4 rounded-2xl shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-200">
              <Play size={22} />
              Start Visualizing Free
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="YCV Logo" className="w-16 h-16" />
              <div className="flex flex-col">
                <span className="text-lg font-black font-display text-white leading-none">YCV</span>
                <span className="text-xs font-bold text-slate-400 mt-1">Your Code Visualizer</span>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              The world's most advanced code visualizer. Built with passion. Free forever.
            </p>
            <div className="flex items-center gap-6">
              {["Features", "Algorithms", "How It Works"].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  className="text-sm hover:text-white transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
