import React from 'react';
import { X, CheckCircle2, Play, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { SolutionStep, LevelData } from '../types/game';
import { CHIP_DEFINITIONS } from '../data/chipEncyclopedia';

interface SolutionModalProps {
  level: LevelData;
  onAutoPlay: () => void;
  onClose: () => void;
}

export const SolutionModal: React.FC<SolutionModalProps> = ({
  level,
  onAutoPlay,
  onClose,
}) => {
  const steps: SolutionStep[] = level.solutionSteps || [];
  const targetChip = CHIP_DEFINITIONS[level.targetLevel];

  const getDirText = (dir: string) => {
    switch (dir) {
      case 'UP':
        return '向上 ▲';
      case 'DOWN':
        return '向下 ▼';
      case 'LEFT':
        return '向左 ◀';
      case 'RIGHT':
        return '向右 ▶';
      default:
        return dir;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-emerald-500/70 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Lab.{level.id} · 官方 BFS 驗證解法</span>
              </h3>
              <p className="text-xs text-emerald-400/90 font-mono">
                ✓ 經圖論廣度優先搜尋（BFS）100% 證明可行
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {/* Summary Box */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-400 block mb-0.5">關卡目標</span>
              <span className="text-white font-bold text-sm">
                合成單一 {targetChip?.name || `Chip.${level.targetLevel}`}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block mb-0.5">最少推動步數</span>
              <span className="text-amber-400 font-bold text-base tabular-nums">
                {steps.length} 步
              </span>
            </div>
          </div>

          {/* Hint text if present */}
          {level.hint && (
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
              <span className="text-emerald-400 font-bold mr-1">提示思維：</span>
              {level.hint}
            </div>
          )}

          {/* Steps List */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              推動推演步驟清單 ({steps.length} 步)
            </span>

            {steps.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-xs font-mono">
                暫無步驟紀錄
              </div>
            ) : (
              steps.map((st, idx) => {
                const chipDef = CHIP_DEFINITIONS[st.chipLevel];
                return (
                  <div
                    key={`step-${idx}`}
                    className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs font-mono gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-slate-400">
                        站在 ({st.standX}, {st.standY})
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-600" />
                      <span className="text-amber-400 font-bold">
                        {getDirText(st.dir)}
                      </span>
                      <span className="text-slate-400">推動</span>
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                        style={{
                          background: chipDef?.bgGradient || '#1e293b',
                          color: chipDef?.borderColor || '#cbd5e1',
                        }}
                      >
                        Chip.{st.chipLevel}
                      </span>
                    </div>

                    {st.merged && (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold whitespace-nowrap">
                        ★ 碰撞合成
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            關閉
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onAutoPlay();
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>自動演示最佳解法 (Auto-Play)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
