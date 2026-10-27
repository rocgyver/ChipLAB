import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, ArrowRight, RotateCcw, MapPin, Award } from 'lucide-react';
import { LevelData } from '../types/game';
import { EinsteinSprite } from './EinsteinSprite';
import { CHIP_DEFINITIONS } from '../data/chipEncyclopedia';

interface WinModalProps {
  level: LevelData;
  moves: number;
  bestMoves: number | null;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onLevelSelect: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  level,
  moves,
  bestMoves,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onLevelSelect,
}) => {
  const isGrandFinale = level.id === 24 || level.targetLevel === 8;
  const targetChipDef = CHIP_DEFINITIONS[level.targetLevel] || CHIP_DEFINITIONS[8];

  const stars =
    moves <= level.parMoves
      ? 3
      : moves <= level.parMoves + 4
      ? 2
      : 1;

  useEffect(() => {
    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: isGrandFinale ? 150 : 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#facc15', '#38bdf8', '#4ade80', '#fb923c', '#c084fc'],
      });
    } catch {
      // Confetti fallback
    }
  }, [isGrandFinale]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 bg-slate-900 border-2 border-emerald-500/70 rounded-2xl shadow-2xl flex flex-col items-center text-center overflow-hidden">
        {/* Subtle background glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none"
          style={{ background: targetChipDef.glowColor }}
        />

        {/* Einstein Victory Pose */}
        <div className="w-20 h-20 mb-2 relative">
          <EinsteinSprite
            direction="DOWN"
            isPushing={false}
            isWalking={false}
            isVictory={true}
          />
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-1">
          <Trophy className="w-4 h-4" />
          <span>{isGrandFinale ? '★ 終極目標達成 ★' : '實驗室合成成功！'}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
          {isGrandFinale ? '超級電腦成功組裝！' : `第 ${level.id} 關 通關完畢`}
        </h3>

        <p className="text-xs text-slate-400 max-w-xs mb-4">
          {isGrandFinale
            ? '愛因斯坦博士在無數次推演與碰撞中，終於完成了人類計算史上的至高傑作——超級電腦！'
            : `成功將所有晶片推演融合，獲得單一目標晶片：${targetChipDef.name}！`}
        </p>

        {/* Stars Rating */}
        <div className="flex items-center gap-3 text-3xl text-amber-400 mb-4 animate-bounce">
          <span className={stars >= 1 ? 'opacity-100' : 'opacity-20'}>★</span>
          <span className={stars >= 2 ? 'opacity-100 scale-125' : 'opacity-20'}>★</span>
          <span className={stars >= 3 ? 'opacity-100' : 'opacity-20'}>★</span>
        </div>

        {/* Performance Box */}
        <div className="w-full bg-slate-950/80 rounded-xl border border-slate-800 p-3 mb-5 flex justify-around text-xs font-mono">
          <div className="flex flex-col items-center">
            <span className="text-slate-500">本次步數</span>
            <span className="text-base font-bold text-amber-400 tabular-nums">{moves}</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="flex flex-col items-center">
            <span className="text-slate-500">三星評級標竿</span>
            <span className="text-base font-bold text-slate-300 tabular-nums">{level.parMoves} 步</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="flex flex-col items-center">
            <span className="text-slate-500">最佳紀錄</span>
            <span className="text-base font-bold text-emerald-400 tabular-nums">
              {bestMoves ? Math.min(bestMoves, moves) : moves} 步
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-2">
          {hasNextLevel ? (
            <button
              type="button"
              onClick={onNextLevel}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <span>挑戰下一關</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onLevelSelect}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>全破榮譽榜 · 選擇關卡</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onReplay}
              className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 text-xs font-medium border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重新挑戰</span>
            </button>
            <button
              type="button"
              onClick={onLevelSelect}
              className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 text-xs font-medium border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>關卡選單</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
