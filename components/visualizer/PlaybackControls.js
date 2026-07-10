"use client";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Gauge, RefreshCw, ChevronDown } from "lucide-react";
import { useState } from "react";

const SPEEDS = [0.25, 0.5, 1, 1.5, 2, 3, 5];

export default function PlaybackControls({
  currentStep, totalSteps, isPlaying, playbackSpeed,
  onPlay, onPause, onPrev, onNext, onReset, onSpeedChange,
  onNewArray, arraySize, onArraySizeChange, selectedAlgorithm,
  showArrayControls = true, currentDescription
}) {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const hasSteps = totalSteps > 0;
  const progress = hasSteps ? (currentStep / Math.max(totalSteps - 1, 1)) * 100 : 0;

  return (
    <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3">
      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={onReset}
            disabled={!hasSteps}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Reset"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={onPrev}
            disabled={!hasSteps || currentStep === 0}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Previous Step"
          >
            <SkipBack size={16} />
          </button>
          <button
            onClick={isPlaying ? onPause : onPlay}
            disabled={!hasSteps}
            className="p-2 rounded-xl gradient-primary text-white shadow-md shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-300 transition-all"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={onNext}
            disabled={!hasSteps || currentStep >= totalSteps - 1}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Next Step"
          >
            <SkipForward size={16} />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs text-slate-500 font-medium">
            {hasSteps ? `Step ${currentStep + 1} / ${totalSteps}` : "No algorithm selected"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {showArrayControls && selectedAlgorithm && (
            <>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500">Size:</span>
                <input
                  type="range"
                  min="6"
                  max="40"
                  value={arraySize}
                  onChange={(e) => onArraySizeChange(Number(e.target.value))}
                  className="w-16 h-1 rounded-full accent-blue-500"
                />
                <span className="text-xs font-medium text-slate-700 w-5">{arraySize}</span>
              </div>

              <button
                onClick={onNewArray}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                <RefreshCw size={12} />
                New Array
              </button>
            </>
          )}

          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              <Gauge size={12} />
              {playbackSpeed}x
              <ChevronDown size={10} />
            </button>
            {showSpeedMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-50">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    onClick={() => { onSpeedChange(s); setShowSpeedMenu(false); }}
                    className={`w-full text-xs font-medium px-4 py-2 rounded-lg text-left transition-colors ${
                      playbackSpeed === s ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {s}x {s === 1 ? "(Normal)" : s < 1 ? "(Slow)" : "(Fast)"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
