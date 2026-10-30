import React, { useState } from 'react';
import { X, Play, Copy, Check, Download, Upload, AlertCircle, Sparkles } from 'lucide-react';
import { CellType, Chip, LevelData, Position } from '../types/game';
import { evaluateChipBalance } from '../utils/gameLogic';
import { CHIP_DEFINITIONS } from '../data/chipEncyclopedia';
import { EinsteinSprite } from './EinsteinSprite';
import { ChipCard } from './ChipCard';

interface LevelEditorModalProps {
  onPlayCustomLevel: (level: LevelData) => void;
  onClose: () => void;
}

type ToolMode = 'WALL' | 'EMPTY' | 'PLAYER' | number; // number = chip level 1..8

export const LevelEditorModal: React.FC<LevelEditorModalProps> = ({
  onPlayCustomLevel,
  onClose,
}) => {
  const [width, setWidth] = useState(8);
  const [height, setHeight] = useState(7);
  const [activeTool, setActiveTool] = useState<ToolMode>('WALL');
  const [playerStart, setPlayerStart] = useState<Position>({ x: 1, y: 1 });
  const [title, setTitle] = useState('自製實驗大樓關卡');
  const [copied, setCopied] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [showJsonBox, setShowJsonBox] = useState(false);

  // Initialize board with outer walls
  const [grid, setGrid] = useState<CellType[][]>(() => {
    const g: CellType[][] = [];
    for (let y = 0; y < 7; y++) {
      const row: CellType[] = [];
      for (let x = 0; x < 8; x++) {
        row.push(x === 0 || x === 7 || y === 0 || y === 6 ? 'WALL' : 'EMPTY');
      }
      g.push(row);
    }
    return g;
  });

  const [editorChips, setEditorChips] = useState<{ x: number; y: number; level: number }[]>([
    { x: 2, y: 2, level: 1 },
    { x: 5, y: 2, level: 1 },
  ]);

  // Check balance
  const balance = evaluateChipBalance(editorChips);

  const handleCellClick = (x: number, y: number) => {
    // If painting player
    if (activeTool === 'PLAYER') {
      if (grid[y][x] === 'WALL') return;
      // Remove any chip here
      setEditorChips((prev) => prev.filter((c) => !(c.x === x && c.y === y)));
      setPlayerStart({ x, y });
      return;
    }

    // If painting wall or empty
    if (activeTool === 'WALL') {
      if (playerStart.x === x && playerStart.y === y) return;
      setEditorChips((prev) => prev.filter((c) => !(c.x === x && c.y === y)));
      setGrid((prev) => {
        const next = prev.map((r) => [...r]);
        next[y][x] = next[y][x] === 'WALL' ? 'EMPTY' : 'WALL';
        return next;
      });
      return;
    }

    if (activeTool === 'EMPTY') {
      // Clear cell
      setEditorChips((prev) => prev.filter((c) => !(c.x === x && c.y === y)));
      setGrid((prev) => {
        const next = prev.map((r) => [...r]);
        next[y][x] = 'EMPTY';
        return next;
      });
      return;
    }

    // Painting Chip (activeTool is 1..8)
    if (typeof activeTool === 'number') {
      if (grid[y][x] === 'WALL') {
        // Clear wall first
        setGrid((prev) => {
          const next = prev.map((r) => [...r]);
          next[y][x] = 'EMPTY';
          return next;
        });
      }
      if (playerStart.x === x && playerStart.y === y) return;

      setEditorChips((prev) => {
        const filtered = prev.filter((c) => !(c.x === x && c.y === y));
        return [...filtered, { x, y, level: activeTool }];
      });
    }
  };

  const handleStartPlay = () => {
    if (editorChips.length < 2) {
      alert('請至少在實驗室中放置 2 顆晶片！');
      return;
    }

    const customLevel: LevelData = {
      id: 999,
      chapter: 99,
      chapterName: '自訂實驗室',
      title: title || '自製實驗大樓關卡',
      subtitle: `自製挑戰 · 目標等級 Chip.${balance.targetLevel}`,
      width,
      height,
      playerStart,
      targetLevel: balance.targetLevel,
      parMoves: editorChips.length * 3,
      grid,
      chips: editorChips,
      hint: '運用推動與合併，嘗試將所有晶片合成為單一終極晶片！',
    };

    onPlayCustomLevel(customLevel);
    onClose();
  };

  const handleExportJSON = () => {
    const data = {
      title,
      width,
      height,
      playerStart,
      grid,
      chips: editorChips,
      targetLevel: balance.targetLevel,
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed.width && parsed.height && parsed.grid && parsed.chips) {
        setWidth(parsed.width);
        setHeight(parsed.height);
        setGrid(parsed.grid);
        setEditorChips(parsed.chips);
        if (parsed.playerStart) setPlayerStart(parsed.playerStart);
        if (parsed.title) setTitle(parsed.title);
        setShowJsonBox(false);
      } else {
        alert('無效的關卡資料格式！');
      }
    } catch {
      alert('JSON 解析失敗，請確認格式正確。');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-bold text-white tracking-tight">
              實驗大樓關卡編輯器
            </h3>
            <span className="text-xs text-slate-400 hidden sm:inline">
              設計專屬 IC 晶片推牌謎題
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-3 bg-slate-950/50 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Brush Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono text-slate-400 mr-1">筆刷:</span>

            {/* Wall */}
            <button
              type="button"
              onClick={() => setActiveTool('WALL')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1 cursor-pointer transition-colors ${
                activeTool === 'WALL'
                  ? 'bg-slate-600 text-white border-slate-400 shadow-sm'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <div className="w-2.5 h-2.5 bg-slate-500 rounded-xs" />
              <span>牆壁</span>
            </button>

            {/* Empty floor */}
            <button
              type="button"
              onClick={() => setActiveTool('EMPTY')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1 cursor-pointer transition-colors ${
                activeTool === 'EMPTY'
                  ? 'bg-slate-700 text-white border-slate-400 shadow-sm'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <span>清除</span>
            </button>

            {/* Player Start */}
            <button
              type="button"
              onClick={() => setActiveTool('PLAYER')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1 cursor-pointer transition-colors ${
                activeTool === 'PLAYER'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <span>博士起點</span>
            </button>

            {/* Chips 1..8 */}
            <div className="h-5 w-px bg-slate-700 mx-1" />
            {[1, 2, 3, 4, 5, 6, 7].map((lvl) => {
              const def = CHIP_DEFINITIONS[lvl];
              const isActive = activeTool === lvl;

              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setActiveTool(lvl)}
                  className={`px-2 py-1 rounded-none text-xs font-mono font-bold border transition-colors cursor-pointer ${
                    isActive ? 'ring-2 ring-white scale-105 shadow-md' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{
                    background: def.bgGradient,
                    color: def.borderColor,
                    borderColor: def.borderColor,
                  }}
                >
                  Chip.{lvl}
                </button>
              );
            })}
          </div>

          {/* Balance Warning / Indicator */}
          <div className="flex items-center gap-2 text-xs font-mono">
            {balance.isPowerOfTwo ? (
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>能量完美平衡 · 可合成為 Chip.{balance.targetLevel}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>能量非 2 的次方 · 最終可能有晶片無法消除</span>
              </div>
            )}
          </div>
        </div>

        {/* Editor Board View */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950">
          <div
            className="grid select-none border-2 border-slate-700 rounded-none bg-slate-900 p-2 shadow-2xl relative"
            style={{
              gridTemplateColumns: `repeat(${width}, 46px)`,
              gridTemplateRows: `repeat(${height}, 46px)`,
            }}
          >
            {grid.map((row, y) =>
              row.map((cell, x) => {
                const isWall = cell === 'WALL';
                const isPlayer = playerStart.x === x && playerStart.y === y;
                const chip = editorChips.find((c) => c.x === x && c.y === y);

                return (
                  <div
                    key={`ed-${x}-${y}`}
                    onClick={() => handleCellClick(x, y)}
                    className={`relative w-[46px] h-[46px] border border-slate-800 flex items-center justify-center cursor-pointer hover:border-slate-500 transition-colors ${
                      isWall
                        ? 'bg-slate-700'
                        : 'bg-slate-950/80 hover:bg-slate-800/40'
                    }`}
                  >
                    {isPlayer && (
                      <div className="w-9 h-9 pointer-events-none">
                        <EinsteinSprite direction="DOWN" isPushing={false} isWalking={false} />
                      </div>
                    )}
                    {chip && (
                      <div className="w-10 h-10 pointer-events-none">
                        <ChipCard level={chip.level} size="compact" showDetails={false} />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* JSON Import/Export Drawer (Toggleable) */}
        {showJsonBox && (
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-col gap-2">
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="在此貼上關卡 JSON 代碼..."
              className="w-full h-20 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-200"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleImportJSON}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                確認載入
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已複製 JSON' : '複製關卡代碼'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowJsonBox(!showJsonBox)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>匯入代碼</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartPlay}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>進入實驗室試玩！</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
