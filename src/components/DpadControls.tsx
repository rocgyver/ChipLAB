import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Undo2, RotateCcw } from 'lucide-react';
import { Direction } from '../types/game';

interface DpadControlsProps {
  onDirectionMove: (dir: Direction) => void;
  onUndo: () => void;
  onReset: () => void;
  canUndo: boolean;
}

export const DpadControls: React.FC<DpadControlsProps> = ({
  onDirectionMove,
  onUndo,
  onReset,
  canUndo,
}) => {
  return (
    <div className="flex md:hidden items-center justify-between gap-4 w-full max-w-sm mx-auto px-4 py-2 select-none">
      {/* Reset & Undo buttons: horizontally aligned, Reset on left, Undo on right */}
      <div className="flex flex-row items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="w-12 h-12 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:bg-rose-900/60 text-slate-100 border border-slate-700 shadow-md flex flex-col items-center justify-center active:scale-90 transition-all cursor-pointer"
          title="重新挑戰 (Reset)"
        >
          <RotateCcw className="w-5 h-5 text-rose-400" />
          <span className="text-[9px] font-mono text-slate-400 mt-0.5">重整</span>
        </button>

        <button
          type="button"
          disabled={!canUndo}
          onClick={onUndo}
          className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border shadow-md active:scale-90 transition-all ${
            canUndo
              ? 'bg-slate-800/90 hover:bg-slate-700 active:bg-amber-900/60 text-slate-100 border-slate-700 cursor-pointer'
              : 'bg-slate-900/60 text-slate-600 border-slate-800/40 cursor-not-allowed opacity-50'
          }`}
          title="復原上一步 (Undo)"
        >
          <Undo2 className={`w-5 h-5 ${canUndo ? 'text-amber-400' : 'text-slate-600'}`} />
          <span className="text-[9px] font-mono text-slate-400 mt-0.5">復原</span>
        </button>
      </div>

      {/* Inverted-T D-Pad (Up on top, Left - Down - Right below, replacing Push) */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-lg">
        {/* Row 1: empty, UP, empty */}
        <div />
        <button
          type="button"
          onClick={() => onDirectionMove('UP')}
          className="w-11 h-11 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-100 border border-slate-700 flex items-center justify-center shadow active:scale-90 transition-all cursor-pointer"
          title="向上"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div />

        {/* Row 2: LEFT, DOWN (promoted to replace Push), RIGHT */}
        <button
          type="button"
          onClick={() => onDirectionMove('LEFT')}
          className="w-11 h-11 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-100 border border-slate-700 flex items-center justify-center shadow active:scale-90 transition-all cursor-pointer"
          title="向左"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={() => onDirectionMove('DOWN')}
          className="w-11 h-11 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-100 border border-slate-700 flex items-center justify-center shadow active:scale-90 transition-all cursor-pointer"
          title="向下"
        >
          <ArrowDown className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={() => onDirectionMove('RIGHT')}
          className="w-11 h-11 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-100 border border-slate-700 flex items-center justify-center shadow active:scale-90 transition-all cursor-pointer"
          title="向右"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
