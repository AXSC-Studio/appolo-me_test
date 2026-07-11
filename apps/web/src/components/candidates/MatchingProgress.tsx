// spec: specs/002-candidate-extraction.md § Screen / MatchingProgress
// プログレスバー: 0→95% を約2秒（80ms × 25ステップ）でアニメーション

import { useState, useEffect } from "react";

const INTERVAL_MS = 80;
const MAX_PROGRESS = 95;
const STEP = MAX_PROGRESS / 25; // ~3.8 per step

export function MatchingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + STEP;
        if (next >= MAX_PROGRESS) {
          clearInterval(timer);
          return MAX_PROGRESS;
        }
        return next;
      });
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6">
      <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      <div className="text-center space-y-1">
        <p className="text-sm font-extrabold text-brand-dark">AIマッチング中...</p>
        <p className="text-xs text-gray-400">出張条件に最適な候補者を分析しています</p>
      </div>
      <div className="w-full max-w-xs space-y-1">
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-brand-orange rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <p className="text-[10px] text-gray-400 text-right font-mono">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
