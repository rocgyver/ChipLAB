import React, { useState } from 'react';
import { X, Cpu, ArrowRight, Sparkles } from 'lucide-react';
import { CHIP_DEFINITIONS } from '../data/chipEncyclopedia';
import { ChipCard } from './ChipCard';

interface EncyclopediaModalProps {
  onClose: () => void;
}

export const EncyclopediaModal: React.FC<EncyclopediaModalProps> = ({ onClose }) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const levels = [1, 2, 3, 4, 5, 6, 7, 8];

  const selectedDef = CHIP_DEFINITIONS[selectedLevel] || CHIP_DEFINITIONS[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                IC 晶片科技樹與歷史圖鑑
              </h3>
              <p className="text-xs text-slate-400">
                推動相同等級晶片相撞，升級合成更高階處理架構
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

        {/* Content: Left Tier List, Right Detailed Specs */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col md:flex-row gap-4">
          {/* Left: Quick List of All 8 Tiers */}
          <div className="w-full md:w-56 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 shrink-0">
            {levels.map((lvl) => {
              const def = CHIP_DEFINITIONS[lvl];
              const isSelected = selectedLevel === lvl;

              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer whitespace-nowrap md:whitespace-normal shrink-0 ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-400 ring-1 ring-emerald-400/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-9 h-9 shrink-0">
                    <ChipCard level={lvl} size="compact" showDetails={false} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono font-bold" style={{ color: def.borderColor }}>
                      {lvl === 8 ? '★ 終極目標' : `Chip.${lvl}`}
                    </div>
                    <div className="text-xs font-bold text-white truncate max-w-[120px]">
                      {def.code}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Chip Card & Synthesis Formula */}
          <div className="flex-1 bg-slate-950/80 rounded-xl border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              {/* Chip Visual Display */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-800">
                <div className="w-20 h-20 shrink-0">
                  <ChipCard level={selectedLevel} size="large" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                      style={{
                        background: selectedDef.bgGradient,
                        color: selectedDef.borderColor,
                        border: `1px solid ${selectedDef.borderColor}`,
                      }}
                    >
                      {selectedLevel === 8 ? '★ SUPERCOMPUTER' : `Chip.${selectedLevel}`}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      發表年代: {selectedDef.year}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white tracking-tight">
                    {selectedDef.name}
                  </h4>
                  <div className="text-xs font-mono text-emerald-400 mt-0.5">
                    規格: {selectedDef.specs}
                  </div>
                </div>
              </div>

              {/* Historical Lore */}
              <div className="mb-4">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>歷史架構與背景</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                  {selectedDef.desc}
                </p>
              </div>

              {/* Pinout specs */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 block mb-0.5">封裝引腳數</span>
                  <span className="text-white font-bold">{selectedDef.pins} Pins</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 block mb-0.5">運算核心代號</span>
                  <span className="text-amber-400 font-bold">{selectedDef.code}</span>
                </div>
              </div>
            </div>

            {/* Synthesis Formula Bar */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                合成進化公式
              </span>
              {selectedLevel === 1 ? (
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span>2× [Chip.1 7400 閘]</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">1× [Chip.2 64K SRAM]</span>
                </div>
              ) : selectedLevel < 8 ? (
                <div className="flex flex-col gap-1.5 text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span>2× [Chip.{selectedLevel - 1} {CHIP_DEFINITIONS[selectedLevel - 1].code}]</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-amber-400 font-bold">1× [Chip.{selectedLevel} {selectedDef.code}]</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 px-1 text-[11px]">
                    <span>再收集 2× 本晶片</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span>可升級為 Chip.{selectedLevel + 1} {CHIP_DEFINITIONS[selectedLevel + 1]?.name}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-950/30 border border-amber-500/40 p-3 rounded-lg text-amber-300 text-xs font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    2× [Chip.7 量子運算單元] 撞擊融合 ➔ 誕生本超級電腦！至尊完成狀態！
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
