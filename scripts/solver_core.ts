import { LevelData, CellType, Direction, Position } from '../src/types/game';
import * as fs from 'fs';

function createRoom(w: number, h: number, extraWalls: [number, number][] = []): CellType[][] {
  const grid: CellType[][] = [];
  for (let y = 0; y < h; y++) {
    const row: CellType[] = [];
    for (let x = 0; x < w; x++) {
      if (x === 0 || x === w - 1 || y === 0 || y === h - 1) {
        row.push('WALL');
      } else {
        row.push('EMPTY');
      }
    }
    grid.push(row);
  }
  for (const [wx, wy] of extraWalls) {
    if (grid[wy] && grid[wy][wx] !== undefined) {
      grid[wy][wx] = 'WALL';
    }
  }
  return grid;
}

export interface SolveResult {
  solved: boolean;
  moves: number;
  steps: {
    standX: number;
    standY: number;
    dir: Direction;
    chipX: number;
    chipY: number;
    chipLevel: number;
    merged: boolean;
  }[];
  statesExplored: number;
}

export function solveLevel(levelData: LevelData): SolveResult {
  const { width, height, grid, chips: initialChips, playerStart, targetLevel } = levelData;

  function isWalkable(x: number, y: number, chips: { x: number; y: number; level: number }[]) {
    if (x < 0 || x >= width || y < 0 || y >= height) return false;
    if (grid[y][x] === 'WALL' || grid[y][x] === 'OBSTACLE') return false;
    if (chips.some((c) => c.x === x && c.y === y)) return false;
    return true;
  }

  function getReachableTiles(
    playerPos: Position,
    chips: { x: number; y: number; level: number }[]
  ) {
    const reachable = new Set<string>();
    const queue = [playerPos];
    reachable.add(`${playerPos.x},${playerPos.y}`);

    const dirs = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];
    while (queue.length > 0) {
      const cur = queue.shift()!;
      for (const [dx, dy] of dirs) {
        const nx = cur.x + dx;
        const ny = cur.y + dy;
        const key = `${nx},${ny}`;
        if (!reachable.has(key) && isWalkable(nx, ny, chips)) {
          reachable.add(key);
          queue.push({ x: nx, y: ny });
        }
      }
    }
    return reachable;
  }

  function simulatePush(
    chip: { x: number; y: number; level: number },
    dir: [number, number],
    chips: { x: number; y: number; level: number }[]
  ) {
    const [dx, dy] = dir;
    let currX = chip.x;
    let currY = chip.y;

    while (true) {
      const nextX = currX + dx;
      const nextY = currY + dy;

      if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) break;
      if (grid[nextY][nextX] === 'WALL' || grid[nextY][nextX] === 'OBSTACLE') break;

      const other = chips.find((c) => c !== chip && c.x === nextX && c.y === nextY);
      if (other) {
        if (other.level === chip.level) {
          // Merge!
          return {
            moved: true,
            merged: true,
            newChips: chips
              .filter((c) => c !== chip)
              .map((c) =>
                c === other ? { x: nextX, y: nextY, level: c.level + 1 } : { ...c }
              ),
          };
        } else {
          break; // Stop in front of different level chip
        }
      }

      currX = nextX;
      currY = nextY;
    }

    if (currX === chip.x && currY === chip.y) {
      return { moved: false, merged: false };
    }

    return {
      moved: true,
      merged: false,
      newChips: chips.map((c) => (c === chip ? { x: currX, y: currY, level: c.level } : { ...c })),
    };
  }

  function stateKey(
    playerPos: Position,
    chips: { x: number; y: number; level: number }[],
    reachable: Set<string>
  ) {
    const sortedChips = [...chips].sort(
      (a, b) => a.x - b.x || a.y - b.y || a.level - b.level
    );
    const chipsStr = sortedChips.map((c) => `${c.x},${c.y},${c.level}`).join('|');
    let minKey = `${playerPos.x},${playerPos.y}`;
    for (const r of reachable) {
      if (r < minKey) minKey = r;
    }
    return `${minKey}#${chipsStr}`;
  }

  const startReachable = getReachableTiles(playerStart, initialChips);
  const startKey = stateKey(playerStart, initialChips, startReachable);

  const queue = [
    {
      playerPos: playerStart,
      chips: initialChips.map((c) => ({ ...c })),
      depth: 0,
      steps: [] as SolveResult['steps'],
    },
  ];

  const visited = new Set<string>();
  visited.add(startKey);

  const dirs: { name: Direction; d: [number, number] }[] = [
    { name: 'UP', d: [0, -1] },
    { name: 'DOWN', d: [0, 1] },
    { name: 'LEFT', d: [-1, 0] },
    { name: 'RIGHT', d: [1, 0] },
  ];

  let statesExplored = 0;
  const MAX_STATES = 60000;

  while (queue.length > 0) {
    const cur = queue.shift()!;
    statesExplored++;

    if (cur.chips.length === 1 && cur.chips[0].level === targetLevel) {
      return {
        solved: true,
        moves: cur.depth,
        steps: cur.steps,
        statesExplored,
      };
    }

    if (statesExplored > MAX_STATES) {
      return { solved: false, moves: 0, steps: [], statesExplored };
    }

    const reachable = getReachableTiles(cur.playerPos, cur.chips);

    for (const rStr of reachable) {
      const [rx, ry] = rStr.split(',').map(Number);

      for (const { name, d } of dirs) {
        const [dx, dy] = d;
        const targetX = rx + dx;
        const targetY = ry + dy;

        const chip = cur.chips.find((c) => c.x === targetX && c.y === targetY);
        if (chip) {
          const pushResult = simulatePush(chip, d, cur.chips);
          if (pushResult.moved && pushResult.newChips) {
            const newPlayerPos = { x: targetX, y: targetY };
            const newReachable = getReachableTiles(newPlayerPos, pushResult.newChips);
            const key = stateKey(newPlayerPos, pushResult.newChips, newReachable);

            if (!visited.has(key)) {
              visited.add(key);
              queue.push({
                playerPos: newPlayerPos,
                chips: pushResult.newChips,
                depth: cur.depth + 1,
                steps: [
                  ...cur.steps,
                  {
                    standX: rx,
                    standY: ry,
                    dir: name,
                    chipX: chip.x,
                    chipY: chip.y,
                    chipLevel: chip.level,
                    merged: pushResult.merged,
                  },
                ],
              });
            }
          }
        }
      }
    }
  }

  return { solved: false, moves: 0, steps: [], statesExplored };
}

export { createRoom };
