import React from 'react';
import { RotateCcw, AlertTriangle, TimerOff, ArrowRight } from 'lucide-react';
import { LevelData } from '../types/game';

interface TimeOverModalProps {
  level: LevelData;
  onRetry: () => void;
  onExitTimedMode: () => void;
}

export const TimeOverModal: React.FC<TimeOverModalProps> = ({
  level,
  onRetry,
  onExitTimedMode,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border-2 border-rose-600/80 rounded-2xl shadow-2xl overflow-hidden p-6 text-center">
        {/* Pulsing Hazard Glow Background */}
        <div className="absolute inset-0 bg-radial from-rose-500/10 via-transparent to-transparent pointer-events-none" />

        {/* Warning Icon Badge */}
        <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-rose-500/15 border-2 border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-950">
          <AlertTriangle className="w-7 h-7 animate-bounce" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-white tracking-tight font-mono mb-1">
          時限已到 · 挑戰失敗！
        </h3>
        <p className="text-xs text-rose-400 font-mono mb-4">
          OVERCLOCK HAZARD // 晶片冷卻過熱
        </p>

        {/* Level Info */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 font-mono mb-5 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">目前關卡:</span>
            <span className="text-white font-bold">Lab.{level.id} · {level.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">建議步數:</span>
            <span className="text-amber-400 font-bold">{level.parMoves} 步</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onRetry}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新挑戰此關 (Retry)</span>
          </button>

          <button
            type="button"
            onClick={onExitTimedMode}
            className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <TimerOff className="w-3.5 h-3.5 text-slate-400" />
            <span>切換回休閒模式 (Exit Timed Mode)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
