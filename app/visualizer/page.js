import { Suspense } from "react";
import VisualizerClient from "@/components/visualizer/VisualizerClient";

export const metadata = {
  title: "Visualizer — YCV | Your Code Visualizer",
  description: "Step-by-step code visualization with AI analysis. Visualize sorting, graph, tree, and 150+ algorithms.",
};

export default function VisualizerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 animate-pulse flex items-center justify-center text-white font-black text-sm">YCV</div>
          <p className="text-slate-500 font-medium">Loading YCV...</p>
        </div>
      </div>
    }>
      <VisualizerClient />
    </Suspense>
  );
}
