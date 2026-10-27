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
    <div className="flex md:hidden items-center justify-between gap-4 w-full max-w-sm mx-auto px-4 py-2 mt-2 select-none">
      {/* Undo & Reset buttons */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled={!canUndo}
          onClick={onUndo}
          className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-md active:scale-90 transition-all ${
            canUndo
              ? 'bg-slate-800 text-slate-100 border-slate-700'
              : 'bg-slate-900 text-slate-600 border-slate-800/40 cursor-not-allowed'
          }`}
          title="復原"
        >
          <Undo2 className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-12 h-12 rounded-xl bg-slate-800 text-slate-100 border border-slate-700 shadow-md flex items-center justify-center active:scale-90 transition-all"
          title="重來"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Cross D-Pad */}
      <div className="relative w-36 h-36 flex items-center justify-center bg-slate-900/80 rounded-2xl border border-slate-800 p-1 shadow-lg">
        {/* UP */}
        <button
          type="button"
          onClick={() => onDirectionMove('UP')}
          className="absolute top-1 left-1/2 -translate-x-1/2 w-11 h-11 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-100 border border-slate-700 flex items-center justify-center shadow active:scale-90 transition-all cursor-pointer"
        >
          <ArrowUp className="w-6 h-6" />
        </button>

        {/* LEFT */}
        <button
          type="button"
          onClick={() => onDirectionMove('LEFT')}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-11 h-11 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-100 border border-slate-700 flex items-center justify-center shadow active:scale-90 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Center Indicator */}
        <div className="w-8 h-8 rounded-md bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-mono pointer-events-none">
          PUSH
        </div>

        {/* RIGHT */}
        <button
          type="button"
          onClick={() => onDirectionMove('RIGHT')}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-100 border border-slate-700 flex items-center justify-center shadow active:scale-90 transition-all cursor-pointer"
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        {/* DOWN */}
        <button
          type="button"
          onClick={() => onDirectionMove('DOWN')}
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-11 h-11 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-100 border border-slate-700 flex items-center justify-center shadow active:scale-90 transition-all cursor-pointer"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
