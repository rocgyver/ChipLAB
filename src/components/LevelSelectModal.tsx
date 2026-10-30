import React, { useState } from 'react';
import { X, Star, Lock, CheckCircle2 } from 'lucide-react';
import { LEVELS } from '../data/levels';
import { CHIP_DEFINITIONS } from '../data/chipEncyclopedia';

interface LevelSelectModalProps {
  currentLevelId: number;
  solvedLevels: Record<number, { stars: number; bestMoves: number }>;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  currentLevelId,
  solvedLevels,
  onSelectLevel,
  onClose,
}) => {
  const [activeChapter, setActiveChapter] = useState<number>(() => {
    const cur = LEVELS.find((l) => l.id === currentLevelId);
    return cur ? cur.chapter : 0;
  });

  const chapters = [
    { id: 0, name: 'Level.0：晶片工廠', range: 'Fab.0', minStarsToUnlock: 0 },
    { id: 1, name: 'Level.1：基礎合成室', range: 'Lab.1-6', minStarsToUnlock: 0 },
    { id: 2, name: 'Level.2：電路迴廊', range: 'Lab.7-12', minStarsToUnlock: 6 },
    { id: 3, name: 'Level.3：多階處理器', range: 'Lab.13-18', minStarsToUnlock: 18 },
    { id: 4, name: 'Level.4：超級電腦誕生', range: 'Lab.19-24', minStarsToUnlock: 32 },
  ];

  // Calculate total stars collected
  const totalStars = Object.values(solvedLevels).reduce((acc, cur) => acc + (cur.stars || 0), 0);
  const totalSolved = Object.keys(solvedLevels).length;

  const currentChapterLevels = LEVELS.filter((l) => l.chapter === activeChapter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-white tracking-tight">
              實驗大樓關卡選單
            </h3>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{totalStars} / {LEVELS.length * 3} 星</span>
              <span>·</span>
              <span>{totalSolved} / {LEVELS.length} 通關</span>
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

        {/* Chapter Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto no-scrollbar">
          {chapters.map((ch) => {
            const isUnlocked = totalStars >= ch.minStarsToUnlock || ch.id <= 1;
            const isActive = activeChapter === ch.id;

            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => setActiveChapter(ch.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {!isUnlocked && <Lock className="w-3 h-3 text-slate-500" />}
                <span>{ch.name}</span>
              </button>
            );
          })}
        </div>

        {/* Level Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentChapterLevels.map((lvl) => {
            const record = solvedLevels[lvl.id];
            const isSolved = !!record;
            const isCurrent = lvl.id === currentLevelId;
            const targetDef = CHIP_DEFINITIONS[lvl.targetLevel] || CHIP_DEFINITIONS[1];

            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => {
                  onSelectLevel(lvl.id);
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group ${
                  isCurrent
                    ? 'bg-slate-800/90 border-emerald-400 ring-1 ring-emerald-400/50 shadow-md'
                    : isSolved
                    ? 'bg-slate-900/90 border-slate-700 hover:border-slate-500'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Top Row: Level number & Target chip mini icon */}
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {lvl.id === 0 ? 'Fab.0' : `Lab.${lvl.id}`}
                    </span>
                    {isSolved && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>

                  {/* Target Mini Chip Tag */}
                  <span
                    className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                    style={{
                      background: targetDef.bgGradient,
                      color: targetDef.borderColor,
                      border: `1px solid ${targetDef.borderColor}`,
                    }}
                  >
                    Chip.{lvl.targetLevel} {lvl.targetLevel === 8 ? '★' : ''}
                  </span>
                </div>

                {/* Level Title */}
                <h4 className="text-sm font-bold text-white tracking-tight truncate w-full mb-1">
                  {lvl.title}
                </h4>

                {/* Par info & Subtitle */}
                <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                  {lvl.subtitle}
                </p>

                {/* Bottom Row: Stars & Best Moves */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 w-full">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3].map((star) => (
                      <span
                        key={star}
                        className={
                          record && record.stars >= star
                            ? 'opacity-100'
                            : 'opacity-20'
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <span>
                    {record ? `最佳: ${record.bestMoves}步` : `標竿: ${lvl.parMoves}步`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
