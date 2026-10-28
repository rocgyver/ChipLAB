import React from 'react';
import { RotateCcw, Undo2, Lightbulb, MapPin, Volume2, VolumeX, Monitor, BookOpen, Edit3, ShieldCheck, Sparkles, Palette, Timer } from 'lucide-react';
import { LevelData } from '../types/game';
import { CHIP_DEFINITIONS } from '../data/chipEncyclopedia';
import { BoardThemeId, BOARD_THEMES } from '../types/theme';

interface GameHUDProps {
  currentLevel: LevelData;
  moves: number;
  canUndo: boolean;
  isMuted: boolean;
  isCrtOn: boolean;
  isAmbientOn: boolean;
  isTimedMode?: boolean;
  timeLeft?: number;
  currentThemeId: BoardThemeId;
  bestMoves: number | null;
  remainingChipsCount: number;
  onUndo: () => void;
  onReset: () => void;
  onToggleSound: () => void;
  onToggleCrt: () => void;
  onToggleAmbient: () => void;
  onToggleTimedMode?: () => void;
  onCycleTheme: () => void;
  onShowHint: () => void;
  onOpenSolution?: () => void;
  onOpenLevelSelect: () => void;
  onOpenEncyclopedia: () => void;
  onOpenEditor: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  currentLevel,
  moves,
  canUndo,
  isMuted,
  isCrtOn,
  isAmbientOn,
  isTimedMode = false,
  timeLeft,
  currentThemeId,
  bestMoves,
  remainingChipsCount,
  onUndo,
  onReset,
  onToggleSound,
  onToggleCrt,
  onToggleAmbient,
  onToggleTimedMode,
  onCycleTheme,
  onShowHint,
  onOpenSolution,
  onOpenLevelSelect,
  onOpenEncyclopedia,
  onOpenEditor,
}) => {
  const currentThemeConfig = BOARD_THEMES[currentThemeId] || BOARD_THEMES['Cyber Green'];
  const targetChipDef = CHIP_DEFINITIONS[currentLevel.targetLevel] || CHIP_DEFINITIONS[8];

  // Calculate stars performance indicator based on par moves
  const starsEarned =
    moves <= currentLevel.parMoves
      ? 3
      : moves <= currentLevel.parMoves + 4
      ? 2
      : 1;

  return (
    <div className="w-full max-w-4xl mx-auto mb-3 flex flex-col gap-2.5">
      {/* Top Bar: Chapter, Level Title, and Target Chip */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/90 rounded-xl border border-slate-800 shadow-md">
        {/* Left: Level Title & Chapter */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <span>{currentLevel.chapterName}</span>
            <span>·</span>
            <span>第 {currentLevel.id} 關</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
            {currentLevel.title}
          </h2>
          <p className="text-xs text-slate-400 truncate hidden sm:block">
            {currentLevel.subtitle}
          </p>
        </div>

        {/* Right: Target Synthesis Goal Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                目標合成晶片
              </span>
              <span
                className="text-xs sm:text-sm font-bold truncate max-w-[150px]"
                style={{ color: targetChipDef.borderColor }}
              >
                {targetChipDef.name}
              </span>
            </div>
            <div
              className="w-7 h-7 rounded flex items-center justify-center font-mono font-black text-xs text-white shadow-inner"
              style={{
                background: targetChipDef.bgGradient,
                border: `1px solid ${targetChipDef.borderColor}`,
              }}
            >
              {currentLevel.targetLevel === 8 ? '★' : currentLevel.targetLevel}
            </div>
          </div>
        </div>
      </div>

      {/* Second Bar: Moves counter, Star ratings, and Quick action tool buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-900/70 rounded-xl border border-slate-800/80">
        {/* Statistics & Star Indicators */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">步數:</span>
            <span className="font-bold text-amber-400 text-sm tabular-nums">{moves}</span>
            <span className="text-slate-500">/ 評級目標: {currentLevel.parMoves}</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-amber-400">
            {[1, 2, 3].map((star) => (
              <span
                key={star}
                className={star <= starsEarned ? 'opacity-100 scale-110' : 'opacity-20'}
              >
                ★
              </span>
            ))}
          </div>

          {/* Timed Mode Countdown Badge */}
          {isTimedMode && timeLeft !== undefined && (
            <div
              title="限時挑戰倒數"
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border font-mono text-xs transition-colors ${
                timeLeft <= 10
                  ? 'bg-rose-950/85 border-rose-500 text-rose-300 animate-pulse font-black shadow-xs ring-1 ring-rose-500/40'
                  : timeLeft <= 20
                  ? 'bg-amber-950/70 border-amber-500/70 text-amber-300 font-bold'
                  : 'bg-slate-950 border-slate-700 text-sky-300'
              }`}
            >
              <Timer className={`w-3.5 h-3.5 ${timeLeft <= 10 ? 'text-rose-400 animate-bounce' : 'text-sky-400'}`} />
              <span className="tabular-nums font-bold">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <span>剩餘晶片:</span>
            <span className="font-bold text-sky-400 tabular-nums">{remainingChipsCount}</span>
          </div>

          {bestMoves !== null && (
            <div className="hidden lg:flex items-center gap-1 text-slate-400">
              <span>歷史最佳:</span>
              <span className="font-bold text-emerald-400 tabular-nums">{bestMoves} 步</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Undo */}
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            title="復原上一步 (快捷鍵: U 或 Z)"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
              canUndo
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95'
                : 'bg-slate-900 text-slate-600 border border-slate-800/50 cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">復原</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={onReset}
            title="重新開始此關 (快捷鍵: R)"
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">重置</span>
          </button>

          {/* Hint */}
          <button
            type="button"
            onClick={onShowHint}
            title="查看提示 (快捷鍵: H)"
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border border-amber-800/50 active:scale-95 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">提示</span>
          </button>

          {/* Solution Walkthrough */}
          {onOpenSolution && (
            <button
              type="button"
              onClick={onOpenSolution}
              title="官方 BFS 驗證解法"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-800/50 active:scale-95 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">解法步驟</span>
            </button>
          )}

          {/* Level Select */}
          <button
            type="button"
            onClick={onOpenLevelSelect}
            title="關卡列表 (快捷鍵: L)"
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-colors flex items-center gap-1"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden md:inline">關卡</span>
          </button>

          {/* Tech Tree Encyclopedia */}
          <button
            type="button"
            onClick={onOpenEncyclopedia}
            title="晶片規格圖鑑"
            className="px-2 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-colors flex items-center"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>

          {/* Level Editor */}
          <button
            type="button"
            onClick={onOpenEditor}
            title="自製實驗室關卡"
            className="px-2 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-colors flex items-center"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {/* CRT Monitor Effect Toggle */}
          <button
            type="button"
            onClick={onToggleCrt}
            title={`CRT 復古映像管濾鏡: ${isCrtOn ? '開啟' : '關閉'}`}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium border active:scale-95 transition-colors flex items-center cursor-pointer ${
              isCrtOn
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700/60'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>

          {/* Ambient Scene Animation Toggle */}
          <button
            type="button"
            onClick={onToggleAmbient}
            title={`背景微粒與電路脈衝動畫: ${isAmbientOn ? '開啟' : '關閉'}`}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium border active:scale-95 transition-colors flex items-center cursor-pointer ${
              isAmbientOn
                ? 'bg-amber-950/60 text-amber-300 border-amber-700/60 shadow-xs'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          {/* Board Theme Switcher Button (Compact, Palette icon with theme color) */}
          <button
            type="button"
            onClick={onCycleTheme}
            title={`切換棋盤主題: 目前為 ${currentThemeConfig.name} (點擊切換，快捷鍵: T)`}
            className="px-2 py-1.5 rounded-lg text-xs font-medium border active:scale-95 transition-all flex items-center cursor-pointer bg-slate-800 hover:bg-slate-700 border-slate-700"
          >
            <Palette className="w-3.5 h-3.5" style={{ color: currentThemeConfig.previewColor }} />
          </button>

          {/* Timed Challenge Mode Toggle */}
          {onToggleTimedMode && (
            <button
              type="button"
              onClick={onToggleTimedMode}
              title={`限時挑戰模式: ${isTimedMode ? '開啟 (挑戰進行中)' : '關閉 (休閒解謎)'}`}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium border active:scale-95 transition-all flex items-center cursor-pointer ${
                isTimedMode
                  ? 'bg-rose-950/80 text-rose-300 border-rose-600 shadow-xs ring-1 ring-rose-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            title={`音效: ${isMuted ? '靜音' : '開啟'}`}
            className="px-2 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-colors flex items-center cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>
    </div>
  );
};
