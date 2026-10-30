import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  isLevelWraparound,
  getEffectiveGrid,
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

  // Wraparound calculation & Effective Grid (outer walls removed for Level 7+)
  const isWraparound = isLevelWraparound(currentLevel);
  const effectiveGrid = useMemo(() => getEffectiveGrid(currentLevel), [currentLevel]);

  // Player position & state
  const [playerPos, setPlayerPos] = useState<Position>(LEVELS[0].playerStart);
  const [playerDir, setPlayerDir] = useState<Direction>('DOWN');
  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isPlayerNoTransition, setIsPlayerNoTransition] = useState<boolean>(false);

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
  const [isKnockedOut, setIsKnockedOut] = useState<boolean>(false);
  const [catchMessage, setCatchMessage] = useState<string | null>(null);

  // Real-time synchronization refs for live collision detection during sliding
  const playerPosRef = useRef<Position>(playerPos);
  playerPosRef.current = playerPos;
  const playerDirRef = useRef<Direction>(playerDir);
  playerDirRef.current = playerDir;
  const chipsRef = useRef<Chip[]>(chips);
  chipsRef.current = chips;
  const slidingChipIdRef = useRef<string | null>(null);
  const slidingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

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
    if (slidingTimerRef.current) {
      clearTimeout(slidingTimerRef.current);
      slidingTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    slidingChipIdRef.current = null;
    setIsKnockedOut(false);
    setCatchMessage(null);
    setCurrentLevel(lvl);
    setPlayerPos({ ...lvl.playerStart });
    playerPosRef.current = { ...lvl.playerStart };
    setPlayerDir('DOWN');
    playerDirRef.current = 'DOWN';
    setMoves(0);
    setHistory([]);
    setIsVictory(false);
    setIsPushing(false);
    setIsWalking(false);
    setHintMessage(null);
    setTimeLeft(getLevelTimeLimit(lvl));
    setIsTimeOver(false);
    const initialChips = lvl.chips.map((c, i) => ({
      id: `chip-${lvl.id}-${i}-${Date.now()}`,
      x: c.x,
      y: c.y,
      level: c.level,
    }));
    setChips(initialChips);
    chipsRef.current = initialChips;
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
    (dir: Direction, forceAction = false) => {
      if (isVictory || isTimeOver || isKnockedOut) return;

      // 1. If changing direction, turn in place first to face dir without stepping forward
      if (!forceAction && playerDirRef.current !== dir) {
        setPlayerDir(dir);
        playerDirRef.current = dir;
        sounds.playStep();
        return;
      }

      setPlayerDir(dir);
      playerDirRef.current = dir;

      const { dx, dy } = getDirectionDelta(dir);
      const w = currentLevel.width;
      const h = currentLevel.height;

      const targetX = isWraparound
        ? ((playerPosRef.current.x + dx) % w + w) % w
        : playerPosRef.current.x + dx;
      const targetY = isWraparound
        ? ((playerPosRef.current.y + dy) % h + h) % h
        : playerPosRef.current.y + dy;

      // Check if there is a chip directly in the target cell
      const frontChip = chipsRef.current.find((c) => c.x === targetX && c.y === targetY);

      if (frontChip) {
        // If a chip is already sliding, cannot start a second push
        if (slidingChipIdRef.current !== null) {
          sounds.playBump();
          return;
        }

        // Check if cell behind frontChip in direction dir is walkable or mergeable
        const nextX = isWraparound ? ((frontChip.x + dx) % w + w) % w : frontChip.x + dx;
        const nextY = isWraparound ? ((frontChip.y + dy) % h + h) % h : frontChip.y + dy;

        let isBlocked = false;
        if (!isWraparound && (nextX < 0 || nextX >= w || nextY < 0 || nextY >= h)) {
          isBlocked = true;
        } else if (effectiveGrid[nextY][nextX] === 'WALL' || effectiveGrid[nextY][nextX] === 'OBSTACLE') {
          isBlocked = true;
        } else {
          const blocker = chipsRef.current.find(
            (c) => c.id !== frontChip.id && c.x === nextX && c.y === nextY
          );
          if (blocker && blocker.level !== frontChip.level) {
            isBlocked = true;
          }
        }

        // 2. Both hands push animation regardless of whether chip can slide!
        setIsPushing(true);
        setTimeout(() => setIsPushing(false), 240);

        if (isBlocked) {
          sounds.playBump();
          return;
        }

        // 3. Einstein STAYS in place! Do not advance forward.
        setHistory((prev) => [
          ...prev,
          {
            playerPos: { ...playerPosRef.current },
            playerDir: dir,
            chips: chipsRef.current.map((c) => ({
              ...c,
              x: Math.round(c.x),
              y: Math.round(c.y),
              noTransition: false,
              isMerging: false,
            })),
            moves,
            actionDescription: `向${dir}推動晶片`,
          },
        ]);
        setMoves((m) => m + 1);
        sounds.playPush();

        // Start continuous, completely smooth sliding physics loop for frontChip
        slidingChipIdRef.current = frontChip.id;
        const chipId = frontChip.id;
        const startX = frontChip.x;
        const startY = frontChip.y;
        const slideDir = dir;

        // 1 lap distance D = width or height
        const D = isWraparound
          ? (dx !== 0 ? w : h)
          : (dx !== 0 ? (dx > 0 ? w - 1 - startX : startX) : (dy > 0 ? h - 1 - startY : startY));

        // In wraparound: exactly 2 full laps (Lap 1 normal speed, Lap 2 friction deceleration)
        const Smax = isWraparound ? 2 * D : D;

        // Initial speed matching walking pace (5.5 tiles/sec)
        const v0 = 5.5; // tiles/sec
        // Time for Lap 1 (constant speed v0 over distance D):
        const T1 = (D / v0) * 1000; // ms
        // Time for Lap 2 (constant deceleration from v0 to 0 over distance D):
        const T2 = ((2 * D) / v0) * 1000; // ms (= 2 * T1)
        // Total duration for sliding:
        const Ttotal = isWraparound ? T1 + T2 : (D / v0) * 1000;

        const startTime = performance.now();
        let lastCheckedTileIndex = 0;

        const stopAndSnapChip = (finalTileX: number, finalTileY: number) => {
          slidingChipIdRef.current = null;
          if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
          }
          setChips((prev) =>
            prev.map((c) =>
              c.id === chipId
                ? { ...c, x: finalTileX, y: finalTileY, noTransition: false }
                : c
            )
          );
          chipsRef.current = chipsRef.current.map((c) =>
            c.id === chipId ? { ...c, x: finalTileX, y: finalTileY, noTransition: false } : c
          );
        };

        const updatePhysicsFrame = (now: number) => {
          const elapsed = now - startTime;
          let s: number;

          if (isWraparound) {
            if (elapsed <= T1) {
              // Lap 1: constant normal speed v0
              const p1 = Math.min(1.0, elapsed / T1);
              s = D * p1;
            } else {
              // Lap 2: kinetic friction deceleration from v0 to 0 over distance D
              const elapsed2 = elapsed - T1;
              const p2 = Math.min(1.0, elapsed2 / T2);
              s = D + D * (2 * p2 - p2 * p2);
            }
          } else {
            const p = Math.min(1.0, elapsed / Ttotal);
            s = D * p;
          }

          // Check collisions as leading edge enters new tiles
          const currentTileIdx = Math.min(Smax, Math.floor(s + 0.5));

          while (lastCheckedTileIndex < currentTileIdx) {
            const k = lastCheckedTileIndex + 1;
            const tkX = isWraparound ? (((startX + dx * k) % w) + w) % w : startX + dx * k;
            const tkY = isWraparound ? (((startY + dy * k) % h) + h) % h : startY + dy * k;
            const prevX = isWraparound ? (((startX + dx * (k - 1)) % w) + w) % w : startX + dx * (k - 1);
            const prevY = isWraparound ? (((startY + dy * (k - 1)) % h) + h) % h : startY + dy * (k - 1);

            // 1. Wall or Obstacle Check
            if (!isWraparound && (tkX < 0 || tkX >= w || tkY < 0 || tkY >= h)) {
              stopAndSnapChip(prevX, prevY);
              sounds.playBump();
              return;
            }
            if (effectiveGrid[tkY][tkX] === 'WALL' || effectiveGrid[tkY][tkX] === 'OBSTACLE') {
              stopAndSnapChip(prevX, prevY);
              sounds.playBump();
              return;
            }

            // 2. Collision with Other Chip
            const other = chipsRef.current.find(
              (c) => c.id !== chipId && c.x === tkX && c.y === tkY
            );
            if (other) {
              const movingChip = chipsRef.current.find((c) => c.id === chipId);
              if (movingChip && movingChip.level === other.level) {
                // FUSION MERGE!
                const newLevel = movingChip.level + 1;
                slidingChipIdRef.current = null;
                if (animFrameRef.current) {
                  cancelAnimationFrame(animFrameRef.current);
                  animFrameRef.current = null;
                }
                sounds.playMerge(newLevel);
                setChips((prev) => {
                  const nextChips = prev
                    .filter((c) => c.id !== chipId)
                    .map((c) =>
                      c.id === other.id
                        ? { ...c, level: newLevel, isMerging: true, noTransition: false }
                        : c
                    );
                  chipsRef.current = nextChips;
                  if (
                    nextChips.length === 1 &&
                    nextChips[0].level === currentLevel.targetLevel
                  ) {
                    setTimeout(() => {
                      setIsVictory(true);
                      sounds.playVictory();
                    }, 200);
                  }
                  return nextChips;
                });
                setTimeout(() => {
                  setChips((prev) =>
                    prev.map((c) => (c.id === other.id ? { ...c, isMerging: false } : c))
                  );
                }, 300);
                return;
              } else {
                // Stopped by different level chip in front of it
                stopAndSnapChip(prevX, prevY);
                sounds.playBump();
                return;
              }
            }

            // 3. Collision with Einstein!
            const curP = playerPosRef.current;
            const curD = playerDirRef.current;
            if (curP.x === tkX && curP.y === tkY) {
              const oppositeDir: Record<Direction, Direction> = {
                UP: 'DOWN',
                DOWN: 'UP',
                LEFT: 'RIGHT',
                RIGHT: 'LEFT',
              };

              if (curD === oppositeDir[slideDir]) {
                // EINSTEIN FACES CHIP HEAD-ON: CATCH & BLOCK!
                stopAndSnapChip(prevX, prevY);
                setIsPushing(true);
                sounds.playCatch();
                setCatchMessage('✋ 成功防禦！博士及時轉身將迎面而來的晶片穩穩擋下！');
                setTimeout(() => {
                  setIsPushing(false);
                  setCatchMessage(null);
                }, 2200);
                return;
              } else {
                // EINSTEIN CAUGHT OFF-GUARD: KNOCKOUT!
                stopAndSnapChip(tkX, tkY);
                setIsKnockedOut(true);
                sounds.playKnockout();
                return;
              }
            }

            // Tile is clear, advance check index
            lastCheckedTileIndex = k;
          }

          // 4. If full sliding completed (elapsed >= Ttotal or s >= Smax)
          if (elapsed >= Ttotal || s >= Smax) {
            // Friction smoothly brought chip to rest right back at start position!
            stopAndSnapChip(startX, startY);
            sounds.playBump();
            return;
          }

          // 5. Continuous Sub-Pixel Visual Coordinate Calculation
          const rawX = startX + dx * s;
          const rawY = startY + dy * s;

          let renderX: number;
          let renderY: number;

          if (isWraparound) {
            renderX = ((rawX % w) + w) % w;
            renderY = ((rawY % h) + h) % h;
          } else {
            renderX = rawX;
            renderY = rawY;
          }

          // Update position at 60fps without CSS transition
          setChips((prev) =>
            prev.map((c) =>
              c.id === chipId
                ? { ...c, x: renderX, y: renderY, noTransition: true }
                : c
            )
          );

          // Request next frame
          animFrameRef.current = requestAnimationFrame(updatePhysicsFrame);
        };

        animFrameRef.current = requestAnimationFrame(updatePhysicsFrame);
        return;
      }

      // Empty floor: Walk forward
      if (isWalkable(effectiveGrid, targetX, targetY, chipsRef.current, isWraparound)) {
        // ONLY record walk step into history when NOT actively sliding!
        // While a chip is sliding, Einstein is dodging/reacting to the in-flight push turn;
        // recording intermediate states would capture floating subpixel positions into history.
        if (slidingChipIdRef.current === null) {
          setHistory((prev) => [
            ...prev,
            {
              playerPos: { ...playerPosRef.current },
              playerDir: dir,
              chips: chipsRef.current.map((c) => ({
                ...c,
                x: Math.round(c.x),
                y: Math.round(c.y),
                noTransition: false,
                isMerging: false,
              })),
              moves,
              actionDescription: '移動一步',
            },
          ]);
        }

        const playerWrapped =
          Math.abs(targetX - playerPosRef.current.x) > 1 ||
          Math.abs(targetY - playerPosRef.current.y) > 1;

        if (playerWrapped) {
          isBusyRef.current = true;
          setIsWalking(true);
          sounds.playStep();

          const exitP: Position = { x: playerPosRef.current.x + dx, y: playerPosRef.current.y + dy };
          let entryP: Position;
          if (dx === 1) entryP = { x: -1, y: targetY };
          else if (dx === -1) entryP = { x: w, y: targetY };
          else if (dy === 1) entryP = { x: targetX, y: -1 };
          else entryP = { x: targetX, y: h };

          setIsPlayerNoTransition(false);
          setPlayerPos(exitP);

          setTimeout(() => {
            setIsPlayerNoTransition(true);
            setPlayerPos(entryP);

            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setIsPlayerNoTransition(false);
                setPlayerPos({ x: targetX, y: targetY });
                playerPosRef.current = { x: targetX, y: targetY };

                setTimeout(() => {
                  setIsWalking(false);
                  isBusyRef.current = false;
                }, 60);
              });
            });
          }, 60);
        } else {
          setPlayerPos({ x: targetX, y: targetY });
          playerPosRef.current = { x: targetX, y: targetY };
          setIsWalking(true);
          sounds.playStep();
          setTimeout(() => setIsWalking(false), 70);
        }
      } else {
        // Bump against wall/obstacle
        sounds.playBump();
      }
    },
    [currentLevel, effectiveGrid, isKnockedOut, isTimeOver, isVictory, isWraparound, moves]
  );

  // Undo move
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    if (slidingTimerRef.current) {
      clearTimeout(slidingTimerRef.current);
      slidingTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    slidingChipIdRef.current = null;
    setIsKnockedOut(false);
    setIsPushing(false);
    setCatchMessage(null);

    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setPlayerPos(previous.playerPos);
    playerPosRef.current = previous.playerPos;
    setPlayerDir(previous.playerDir);
    playerDirRef.current = previous.playerDir;

    // Ensure all restored chips have pristine integer grid coordinates and reset flags
    const cleanChips = previous.chips.map((c) => ({
      ...c,
      x: Math.round(c.x),
      y: Math.round(c.y),
      noTransition: false,
      isMerging: false,
    }));
    setChips(cleanChips);
    chipsRef.current = cleanChips;
    setMoves(previous.moves);
    setIsVictory(false);
    sounds.playUndo();
  }, [history]);

  // Reset current level
  const handleReset = useCallback(() => {
    autoPlayAbortRef.current = true;
    setIsAutoPlaying(false);
    if (slidingTimerRef.current) {
      clearTimeout(slidingTimerRef.current);
      slidingTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    slidingChipIdRef.current = null;
    setIsKnockedOut(false);
    setCatchMessage(null);
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
      if (isBusyRef.current || isVictory || isTimeOver || isKnockedOut) return;

      const w = currentLevel.width;
      const h = currentLevel.height;

      // Check if clicking directly adjacent chip in front of Einstein
      const chipAtClick = chips.find((c) => c.x === tx && c.y === ty);
      if (chipAtClick) {
        let isAdjacent = false;
        let dir: Direction = 'RIGHT';

        if (isWraparound) {
          if ((playerPos.x + 1) % w === tx && playerPos.y === ty) {
            isAdjacent = true;
            dir = 'RIGHT';
          } else if (((playerPos.x - 1 + w) % w) === tx && playerPos.y === ty) {
            isAdjacent = true;
            dir = 'LEFT';
          } else if (playerPos.x === tx && (playerPos.y + 1) % h === ty) {
            isAdjacent = true;
            dir = 'DOWN';
          } else if (playerPos.x === tx && ((playerPos.y - 1 + h) % h) === ty) {
            isAdjacent = true;
            dir = 'UP';
          }
        } else {
          const dx = tx - playerPos.x;
          const dy = ty - playerPos.y;
          if (Math.abs(dx) + Math.abs(dy) === 1) {
            isAdjacent = true;
            dir = dx === 1 ? 'RIGHT' : dx === -1 ? 'LEFT' : dy === 1 ? 'DOWN' : 'UP';
          }
        }

        if (isAdjacent) {
          handleMove(dir);
          return;
        }
      }

      // Else: Empty tile -> BFS pathfinding walk
      const path = findPathBFS(effectiveGrid, playerPos, { x: tx, y: ty }, chips, isWraparound);
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

        let dir: Direction = 'DOWN';
        if (next.x === (cur.x + 1) % w) dir = 'RIGHT';
        else if (next.x === (cur.x - 1 + w) % w) dir = 'LEFT';
        else if (next.y === (cur.y + 1) % h) dir = 'DOWN';
        else if (next.y === (cur.y - 1 + h) % h) dir = 'UP';

        const isWrap =
          Math.abs(next.x - cur.x) > 1 || Math.abs(next.y - cur.y) > 1;

        setPlayerDir(dir);
        sounds.playStep();
        setIsWalking(true);

        if (isWrap) {
          const { dx: ddx, dy: ddy } = getDirectionDelta(dir);
          const exitP: Position = { x: cur.x + ddx, y: cur.y + ddy };
          let entryP: Position;
          if (ddx === 1) entryP = { x: -1, y: next.y };
          else if (ddx === -1) entryP = { x: w, y: next.y };
          else if (ddy === 1) entryP = { x: next.x, y: -1 };
          else entryP = { x: next.x, y: h };

          setIsPlayerNoTransition(false);
          setPlayerPos(exitP);

          setTimeout(() => {
            setIsPlayerNoTransition(true);
            setPlayerPos(entryP);

            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setIsPlayerNoTransition(false);
                setPlayerPos(next);
              });
            });
          }, 35);
        } else {
          setIsPlayerNoTransition(false);
          setPlayerPos(next);
        }

        stepIndex++;
      }, 85);
    },
    [chips, currentLevel.height, currentLevel.width, effectiveGrid, handleMove, isTimeOver, isVictory, isWraparound, playerPos]
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
            <span>關卡全覽 ({LEVELS.length}關)</span>
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

        {/* Catch / Block Toast Banner */}
        {catchMessage && (
          <div className="w-full max-w-2xl mb-3 px-4 py-2.5 rounded-xl bg-cyan-950/90 border border-cyan-400/80 text-cyan-200 text-xs flex items-center justify-between gap-3 shadow-lg shadow-cyan-950/50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2">
              <span className="text-base">✋</span>
              <span className="font-bold">{catchMessage}</span>
            </div>
          </div>
        )}

        {/* Game Grid Board */}
        <div className="w-full flex items-center justify-center my-auto">
          <GameBoard
            grid={effectiveGrid}
            width={currentLevel.width}
            height={currentLevel.height}
            isWraparound={isWraparound}
            isPlayerNoTransition={isPlayerNoTransition}
            playerPos={playerPos}
            playerDir={playerDir}
            isPushing={isPushing}
            isWalking={isWalking}
            isVictory={isVictory}
            isKnockedOut={isKnockedOut}
            isAmbientOn={isAmbientOn}
            theme={BOARD_THEMES[currentThemeId]}
            chips={chips}
            onTileClick={handleTileClick}
            onPush={(d) => handleMove(d, true)}
          />
        </div>

        {/* Lower Control & Failure Alert Section (Below GameBoard) */}
        <div className="relative w-full max-w-sm sm:max-w-2xl mx-auto mt-2 min-h-[96px] md:min-h-0 flex items-center justify-center">
          {/* Mobile Virtual D-Pad */}
          <DpadControls
            onDirectionMove={handleMove}
            onUndo={handleUndo}
            onReset={handleReset}
            canUndo={history.length > 0}
          />

          {/* Knocked Out Failure Alert Banner (Placed below GameBoard, covers virtual controls when knocked out) */}
          {isKnockedOut && (
            <div className="absolute inset-0 md:static z-30 flex items-center justify-center animate-in zoom-in-95 duration-200">
              <div className="w-full h-full md:h-auto p-3.5 sm:p-4 rounded-xl bg-red-950/95 border-2 border-red-500 text-red-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl shadow-red-950/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-900/80 border border-red-400 flex items-center justify-center shrink-0 text-xl shadow-inner">
                    💥
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-red-200 flex items-center gap-2">
                      <span>挑戰失敗：博士被高速晶片撞倒！</span>
                    </h4>
                    <p className="text-xs text-red-300/90 mt-0.5 line-clamp-2 sm:line-clamp-none">
                      晶片在環狀空間中高速折返！請及時閃開跳至鄰格，或轉身面對晶片伸手擋下！
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto mt-1 sm:mt-0">
                  {history.length > 0 && (
                    <button
                      type="button"
                      onClick={handleUndo}
                      className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs cursor-pointer shadow-sm transition-all whitespace-nowrap"
                    >
                      復原上一步 (U)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 active:scale-95 text-slate-950 font-bold text-xs cursor-pointer shadow-sm transition-all whitespace-nowrap"
                  >
                    重新挑戰 (R)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
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
          hasNextLevel={LEVELS.findIndex((l) => l.id === currentLevel.id) < LEVELS.length - 1}
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
