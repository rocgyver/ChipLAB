import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CellType,
  Chip,
  Direction,
  GameSnapshot,
  LevelData,
  Position,
} from './types/game';
import { LEVELS } from './data/levels';
import { CHIP_DEFINITIONS } from './data/chipEncyclopedia';
import {
  calculatePush,
  findPathBFS,
  getDirectionDelta,
  isWalkable,
} from './utils/gameLogic';
import { sounds } from './audio/soundEffects';
import { GameBoard } from './components/GameBoard';
import { GameHUD } from './components/GameHUD';
import { DpadControls } from './components/DpadControls';
import { LevelSelectModal } from './components/LevelSelectModal';
import { EncyclopediaModal } from './components/EncyclopediaModal';
import { LevelEditorModal } from './components/LevelEditorModal';
import { WinModal } from './components/WinModal';
import { HelpModal } from './components/HelpModal';
import { SolutionModal } from './components/SolutionModal';
import { TimeOverModal } from './components/TimeOverModal';
import { BoardThemeId, BOARD_THEMES, THEME_CYCLE_ORDER, DEFAULT_THEME_ID } from './types/theme';
import { Cpu, Terminal, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';

const getLevelTimeLimit = (lvl: LevelData) => Math.max(25, lvl.parMoves * 6 + 15);

export default function App() {
  // Current active level
  const [currentLevel, setCurrentLevel] = useState<LevelData>(LEVELS[0]);

  // Player position & state
  const [playerPos, setPlayerPos] = useState<Position>(LEVELS[0].playerStart);
  const [playerDir, setPlayerDir] = useState<Direction>('DOWN');
  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  // Chips on the board
  const [chips, setChips] = useState<Chip[]>(() =>
    LEVELS[0].chips.map((c, i) => ({
      id: `chip-${i}-${c.x}-${c.y}`,
      x: c.x,
      y: c.y,
      level: c.level,
    }))
  );

  // Moves & Undo history
  const [moves, setMoves] = useState<number>(0);
  const [history, setHistory] = useState<GameSnapshot[]>([]);

  // Sound, CRT, Ambient & Theme states
  const [isMuted, setIsMuted] = useState<boolean>(() => sounds.getMuted());
  const [isCrtOn, setIsCrtOn] = useState<boolean>(() => {
    return localStorage.getItem('lab_game_crt') === 'true';
  });
  const [isAmbientOn, setIsAmbientOn] = useState<boolean>(() => {
    return localStorage.getItem('lab_game_ambient') !== 'false';
  });
  const [currentThemeId, setCurrentThemeId] = useState<BoardThemeId>(() => {
    const saved = localStorage.getItem('lab_game_theme') as BoardThemeId;
    return saved && BOARD_THEMES[saved] ? saved : DEFAULT_THEME_ID;
  });

  // Timed Challenge Mode
  const [isTimedMode, setIsTimedMode] = useState<boolean>(() => {
    return localStorage.getItem('lab_game_timed_mode') === 'true';
  });
  const [timeLeft, setTimeLeft] = useState<number>(() => getLevelTimeLimit(LEVELS[0]));
  const [isTimeOver, setIsTimeOver] = useState<boolean>(false);

  const handleCycleTheme = useCallback(() => {
    setCurrentThemeId((prev) => {
      const idx = THEME_CYCLE_ORDER.indexOf(prev);
      const next = THEME_CYCLE_ORDER[(idx + 1) % THEME_CYCLE_ORDER.length];
      localStorage.setItem('lab_game_theme', next);
      sounds.playStep();
      return next;
    });
  }, []);

  const handleToggleTimedMode = useCallback(() => {
    setIsTimedMode((prev) => {
      const next = !prev;
      localStorage.setItem('lab_game_timed_mode', String(next));
      setTimeLeft(getLevelTimeLimit(currentLevel));
      setIsTimeOver(false);
      sounds.playStep();
      return next;
    });
  }, [currentLevel]);

  // Solved levels records in localStorage
  const [solvedLevels, setSolvedLevels] = useState<
    Record<number, { stars: number; bestMoves: number }>
  >(() => {
    try {
      const saved = localStorage.getItem('lab_game_solved');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Modals
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);
  const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  // Animation lock to prevent double presses during push slide
  const isBusyRef = useRef(false);
  const autoPlayAbortRef = useRef(false);

  // Load level helper
  const loadLevel = useCallback((lvl: LevelData) => {
    setCurrentLevel(lvl);
    setPlayerPos({ ...lvl.playerStart });
    setPlayerDir('DOWN');
    setMoves(0);
    setHistory([]);
    setIsVictory(false);
    setIsPushing(false);
    setIsWalking(false);
    setHintMessage(null);
    setTimeLeft(getLevelTimeLimit(lvl));
    setIsTimeOver(false);
    setChips(
      lvl.chips.map((c, i) => ({
        id: `chip-${lvl.id}-${i}-${Date.now()}`,
        x: c.x,
        y: c.y,
        level: c.level,
      }))
    );
  }, []);

  // Save progress on victory
  useEffect(() => {
    if (isVictory && currentLevel.id <= 24) {
      const stars =
        moves <= currentLevel.parMoves
          ? 3
          : moves <= currentLevel.parMoves + 4
          ? 2
          : 1;

      setSolvedLevels((prev) => {
        const existing = prev[currentLevel.id];
        const updated = {
          stars: Math.max(stars, existing ? existing.stars : 0),
          bestMoves: existing ? Math.min(moves, existing.bestMoves) : moves,
        };
        const next = { ...prev, [currentLevel.id]: updated };
        localStorage.setItem('lab_game_solved', JSON.stringify(next));
        return next;
      });
    }
  }, [isVictory, currentLevel, moves]);

  // Timed challenge countdown effect
  useEffect(() => {
    if (!isTimedMode || isVictory || isTimeOver || isAutoPlaying) return;
    if (isLevelSelectOpen || isEncyclopediaOpen || isEditorOpen || isHelpOpen || isSolutionModalOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimeOver(true);
          sounds.playTimeOver();
          return 0;
        }
        if (prev <= 6) {
          sounds.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    isTimedMode,
    isVictory,
    isTimeOver,
    isAutoPlaying,
    isLevelSelectOpen,
    isEncyclopediaOpen,
    isEditorOpen,
    isHelpOpen,
    isSolutionModalOpen,
  ]);

  // Core movement & push handler
  const handleMove = useCallback(
    (dir: Direction) => {
      if (isBusyRef.current || isVictory || isTimeOver) return;

      const { dx, dy } = getDirectionDelta(dir);
      setPlayerDir(dir);

      const targetX = playerPos.x + dx;
      const targetY = playerPos.y + dy;

      // Check if there is a chip directly in the target cell
      const frontChip = chips.find((c) => c.x === targetX && c.y === targetY);

      if (frontChip) {
        // Attempt to push the chip!
        const pushResult = calculatePush(currentLevel.grid, chips, frontChip, dir);

        if (pushResult.canPush) {
          isBusyRef.current = true;
          setIsPushing(true);
          sounds.playPush();

          // Save history snapshot before moving
          setHistory((prev) => [
            ...prev,
            {
              playerPos: { ...playerPos },
              playerDir: dir,
              chips: chips.map((c) => ({ ...c })),
              moves,
              actionDescription: `向${dir}推動晶片`,
            },
          ]);

          setMoves((m) => m + 1);

          if (pushResult.merged && pushResult.targetChipId) {
            // Chip slides and collides with another chip of the same level
            const targetChipId = pushResult.targetChipId;
            const newLevel = pushResult.newLevel || frontChip.level + 1;

            // Animate moving chip to final position
            setChips((prev) =>
              prev.map((c) =>
                c.id === frontChip.id
                  ? { ...c, x: pushResult.finalX!, y: pushResult.finalY! }
                  : c
              )
            );

            // Move Einstein into the tile previously occupied by frontChip
            setPlayerPos({ x: targetX, y: targetY });

            // After slide completes: fusion merge!
            setTimeout(() => {
              sounds.playMerge(newLevel);

              setChips((prev) => {
                const nextChips = prev
                  .filter((c) => c.id !== frontChip.id)
                  .map((c) =>
                    c.id === targetChipId
                      ? { ...c, level: newLevel, isMerging: true }
                      : c
                  );

                // Check victory condition
                if (
                  nextChips.length === 1 &&
                  nextChips[0].level === currentLevel.targetLevel
                ) {
                  setTimeout(() => {
                    setIsVictory(true);
                    sounds.playVictory();
                  }, 250);
                }

                return nextChips;
              });

              // Remove merging pulse after brief moment
              setTimeout(() => {
                setChips((prev) =>
                  prev.map((c) =>
                    c.id === targetChipId ? { ...c, isMerging: false } : c
                  )
                );
              }, 300);

              setIsPushing(false);
              isBusyRef.current = false;
            }, 140);
          } else {
            // Pure slide without merge
            setChips((prev) =>
              prev.map((c) =>
                c.id === frontChip.id
                  ? { ...c, x: pushResult.finalX!, y: pushResult.finalY! }
                  : c
              )
            );

            // Move Einstein into the previous chip cell
            setPlayerPos({ x: targetX, y: targetY });

            setTimeout(() => {
              setIsPushing(false);
              isBusyRef.current = false;
            }, 140);
          }
        } else {
          // Cannot push (e.g. wall or different level chip immediately behind it)
          sounds.playBump();
        }
        return;
      }

      // Empty floor: Walk forward
      if (isWalkable(currentLevel.grid, targetX, targetY, chips)) {
        // Save history snapshot
        setHistory((prev) => [
          ...prev,
          {
            playerPos: { ...playerPos },
            playerDir: dir,
            chips: chips.map((c) => ({ ...c })),
            moves,
            actionDescription: '移動一步',
          },
        ]);

        setPlayerPos({ x: targetX, y: targetY });
        setIsWalking(true);
        sounds.playStep();
        setTimeout(() => setIsWalking(false), 80);
      } else {
        // Hit a wall
        sounds.playBump();
      }
    },
    [chips, currentLevel, isVictory, moves, playerPos]
  );

  // Undo move
  const handleUndo = useCallback(() => {
    if (history.length === 0 || isBusyRef.current) return;

    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setPlayerPos(previous.playerPos);
    setPlayerDir(previous.playerDir);
    setChips(previous.chips);
    setMoves(previous.moves);
    setIsVictory(false);
    sounds.playUndo();
  }, [history]);

  // Reset current level
  const handleReset = useCallback(() => {
    autoPlayAbortRef.current = true;
    setIsAutoPlaying(false);
    loadLevel(currentLevel);
    sounds.playStep();
  }, [currentLevel, loadLevel]);

  // Auto-play the verified BFS solution
  const handleAutoPlaySolution = useCallback(async () => {
    if (!currentLevel.solutionSteps || currentLevel.solutionSteps.length === 0) return;
    autoPlayAbortRef.current = false;
    setIsAutoPlaying(true);
    setHintMessage('正在自動演示官方最佳解法...');

    // First reset level
    loadLevel(currentLevel);
    await new Promise((r) => setTimeout(r, 300));

    for (let i = 0; i < currentLevel.solutionSteps.length; i++) {
      if (autoPlayAbortRef.current) break;
      const step = currentLevel.solutionSteps[i];

      // Move player to stand position
      setPlayerPos({ x: step.standX, y: step.standY });
      setPlayerDir(step.dir);
      sounds.playStep();
      await new Promise((r) => setTimeout(r, 260));

      if (autoPlayAbortRef.current) break;

      // Push!
      handleMove(step.dir);
      await new Promise((r) => setTimeout(r, 450));
    }

    setIsAutoPlaying(false);
  }, [currentLevel, handleMove, loadLevel]);

  // Click on tile (Pathfinding to walk or direct push)
  const handleTileClick = useCallback(
    (tx: number, ty: number) => {
      if (isBusyRef.current || isVictory || isTimeOver) return;

      // Check if clicking directly adjacent chip in front of Einstein
      const frontX = playerPos.x;
      const frontY = playerPos.y;

      const chipAtClick = chips.find((c) => c.x === tx && c.y === ty);
      if (chipAtClick) {
        // Is it 1 tile away cardinally?
        const dx = tx - frontX;
        const dy = ty - frontY;
        if (Math.abs(dx) + Math.abs(dy) === 1) {
          const dir: Direction =
            dx === 1 ? 'RIGHT' : dx === -1 ? 'LEFT' : dy === 1 ? 'DOWN' : 'UP';
          handleMove(dir);
          return;
        }
      }

      // Else: Empty tile -> BFS pathfinding walk
      const path = findPathBFS(currentLevel.grid, playerPos, { x: tx, y: ty }, chips);
      if (!path || path.length === 0) {
        sounds.playBump();
        return;
      }

      // Walk path sequentially
      isBusyRef.current = true;
      let stepIndex = 0;

      const stepInterval = setInterval(() => {
        if (stepIndex >= path.length) {
          clearInterval(stepInterval);
          isBusyRef.current = false;
          setIsWalking(false);
          return;
        }

        const next = path[stepIndex];
        const cur = stepIndex === 0 ? playerPos : path[stepIndex - 1];
        const dir: Direction =
          next.x > cur.x
            ? 'RIGHT'
            : next.x < cur.x
            ? 'LEFT'
            : next.y > cur.y
            ? 'DOWN'
            : 'UP';

        setPlayerDir(dir);
        setPlayerPos(next);
        sounds.playStep();
        setIsWalking(true);

        stepIndex++;
      }, 75);
    },
    [chips, currentLevel.grid, handleMove, isVictory, playerPos]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs/textareas
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          handleMove('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleMove('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handleMove('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleMove('RIGHT');
          break;
        case 'u':
        case 'U':
        case 'z':
        case 'Z':
          e.preventDefault();
          handleUndo();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleReset();
          break;
        case 'h':
        case 'H':
          e.preventDefault();
          setHintMessage(currentLevel.hint || '運用滑動碰撞，將同級晶片結合！');
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          setIsMuted(sounds.toggleMute());
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          handleToggleAmbient();
          break;
        case 't':
        case 'T':
          e.preventDefault();
          handleCycleTheme();
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          handleToggleTimedMode();
          break;
        case 'l':
        case 'L':
          e.preventDefault();
          setIsLevelSelectOpen((v) => !v);
          break;
        case 'Escape':
          setIsLevelSelectOpen(false);
          setIsEncyclopediaOpen(false);
          setIsEditorOpen(false);
          setIsHelpOpen(false);
          setHintMessage(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLevel.hint, handleCycleTheme, handleMove, handleReset, handleToggleTimedMode, handleUndo, isAmbientOn]);

  const handleNextLevel = () => {
    const nextIdx = LEVELS.findIndex((l) => l.id === currentLevel.id) + 1;
    if (nextIdx < LEVELS.length) {
      loadLevel(LEVELS[nextIdx]);
    }
  };

  const handleToggleCrt = () => {
    const nextState = !isCrtOn;
    setIsCrtOn(nextState);
    localStorage.setItem('lab_game_crt', String(nextState));
  };

  const handleToggleAmbient = () => {
    const nextState = !isAmbientOn;
    setIsAmbientOn(nextState);
    localStorage.setItem('lab_game_ambient', String(nextState));
  };

  const bestRecord = solvedLevels[currentLevel.id]?.bestMoves || null;

  return (
    <div
      className={`min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans relative ${
        isCrtOn ? 'crt-active' : ''
      }`}
    >
      {/* Retro CRT Scanlines & Screen Curvature Overlay */}
      {isCrtOn && (
        <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
          {/* Subtle horizontal phosphor scanlines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px]" />
          {/* CRT Radial Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.6)_100%)]" />
        </div>
      )}

      {/* Top Bar Contract: 1-line Brand wordmark, 4 concise single-line nav links, 1 primary action */}
      <header className="flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xs shrink-0 z-30">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="text-base sm:text-lg font-black tracking-tight font-mono text-emerald-400">
            LAB // 1993 晶片推牌
          </span>
        </div>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-400">
          <button
            type="button"
            onClick={() => setIsHelpOpen(true)}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>操作指南</span>
          </button>
          <button
            type="button"
            onClick={() => setIsLevelSelectOpen(true)}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <span>關卡全覽 (24關)</span>
          </button>
          <button
            type="button"
            onClick={() => setIsEncyclopediaOpen(true)}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <span>晶片科技樹</span>
          </button>
          <button
            type="button"
            onClick={() => setIsEditorOpen(true)}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <span>自製實驗室</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsHelpOpen(true)}
            className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300"
            title="操作指南"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-95 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-sm shadow-emerald-400/20"
          >
            重整實驗室
          </button>
        </div>
      </header>

      {/* Main Game Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 max-w-5xl mx-auto w-full">
        {/* HUD Controls */}
        <GameHUD
          currentLevel={currentLevel}
          moves={moves}
          canUndo={history.length > 0}
          isMuted={isMuted}
          isCrtOn={isCrtOn}
          isAmbientOn={isAmbientOn}
          isTimedMode={isTimedMode}
          timeLeft={timeLeft}
          currentThemeId={currentThemeId}
          bestMoves={bestRecord}
          remainingChipsCount={chips.length}
          onUndo={handleUndo}
          onReset={handleReset}
          onToggleSound={() => setIsMuted(sounds.toggleMute())}
          onToggleCrt={handleToggleCrt}
          onToggleAmbient={handleToggleAmbient}
          onToggleTimedMode={handleToggleTimedMode}
          onCycleTheme={handleCycleTheme}
          onShowHint={() =>
            setHintMessage(currentLevel.hint || '運用滑動碰撞，將同級晶片結合！')
          }
          onOpenSolution={() => setIsSolutionModalOpen(true)}
          onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
          onOpenEncyclopedia={() => setIsEncyclopediaOpen(true)}
          onOpenEditor={() => setIsEditorOpen(true)}
        />

        {/* Hint Toast Banner */}
        {hintMessage && (
          <div className="w-full max-w-2xl mb-3 px-4 py-2.5 rounded-xl bg-amber-950/70 border border-amber-600/50 text-amber-200 text-xs flex items-center justify-between gap-3 shadow-md animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{hintMessage}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSolutionModalOpen(true)}
                className="text-emerald-400 hover:text-emerald-200 font-mono text-xs px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>查看解法</span>
              </button>
              <button
                type="button"
                onClick={() => setHintMessage(null)}
                className="text-amber-400 hover:text-white font-mono text-xs px-2 py-1 rounded bg-amber-900/60 cursor-pointer"
              >
                關閉
              </button>
            </div>
          </div>
        )}

        {/* Game Grid Board */}
        <div className="w-full flex items-center justify-center my-auto">
          <GameBoard
            grid={currentLevel.grid}
            width={currentLevel.width}
            height={currentLevel.height}
            playerPos={playerPos}
            playerDir={playerDir}
            isPushing={isPushing}
            isWalking={isWalking}
            isVictory={isVictory}
            isAmbientOn={isAmbientOn}
            theme={BOARD_THEMES[currentThemeId]}
            chips={chips}
            onTileClick={handleTileClick}
            onPush={handleMove}
          />
        </div>

        {/* Mobile Virtual D-Pad */}
        <DpadControls
          onDirectionMove={handleMove}
          onUndo={handleUndo}
          onReset={handleReset}
          canUndo={history.length > 0}
        />
      </main>

      {/* DOS Terminal Status Bar */}
      <footer className="w-full px-4 py-2 border-t border-slate-800 bg-slate-950 text-slate-500 font-mono text-[11px] flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-500/80">
            <Terminal className="w-3.5 h-3.5" />
            <span>MS-DOS VGA 640×480</span>
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">
            [↑↓←→ / WASD] 移動與推動
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">[U] 復原</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">[R] 重試</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">[H] 提示</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">[B] 動畫</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">[T] 主題色</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">[C] 限時挑戰</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span>博士任務：合成唯一超級電腦</span>
        </div>
      </footer>

      {/* Modals */}
      {isVictory && (
        <WinModal
          level={currentLevel}
          moves={moves}
          bestMoves={bestRecord}
          timeLeft={isTimedMode ? timeLeft : undefined}
          hasNextLevel={currentLevel.id < 24}
          onNextLevel={handleNextLevel}
          onReplay={handleReset}
          onLevelSelect={() => {
            setIsVictory(false);
            setIsLevelSelectOpen(true);
          }}
        />
      )}

      {isLevelSelectOpen && (
        <LevelSelectModal
          currentLevelId={currentLevel.id}
          solvedLevels={solvedLevels}
          onSelectLevel={(id) => {
            const chosen = LEVELS.find((l) => l.id === id);
            if (chosen) loadLevel(chosen);
          }}
          onClose={() => setIsLevelSelectOpen(false)}
        />
      )}

      {isEncyclopediaOpen && (
        <EncyclopediaModal onClose={() => setIsEncyclopediaOpen(false)} />
      )}

      {isEditorOpen && (
        <LevelEditorModal
          onPlayCustomLevel={(customLevel) => loadLevel(customLevel)}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}

      {isSolutionModalOpen && (
        <SolutionModal
          level={currentLevel}
          onAutoPlay={handleAutoPlaySolution}
          onClose={() => setIsSolutionModalOpen(false)}
        />
      )}

      {isTimeOver && (
        <TimeOverModal
          level={currentLevel}
          onRetry={handleReset}
          onExitTimedMode={() => {
            setIsTimedMode(false);
            localStorage.setItem('lab_game_timed_mode', 'false');
            setIsTimeOver(false);
            handleReset();
          }}
        />
      )}
    </div>
  );
}
