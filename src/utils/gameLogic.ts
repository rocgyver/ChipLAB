import { Position, Direction, Chip, CellType, LevelData } from '../types/game';

export interface PushResult {
  canPush: boolean;
  moved: boolean;
  merged: boolean;
  movingChipId?: string;
  targetChipId?: string;
  finalX?: number;
  finalY?: number;
  newLevel?: number;
  traveledPath?: Position[];
}

export function getDirectionDelta(dir: Direction): { dx: number; dy: number } {
  switch (dir) {
    case 'UP':
      return { dx: 0, dy: -1 };
    case 'DOWN':
      return { dx: 0, dy: 1 };
    case 'LEFT':
      return { dx: -1, dy: 0 };
    case 'RIGHT':
      return { dx: 1, dy: 0 };
  }
}

/**
 * Checks whether a level uses Wraparound (torus topology) movement.
 * Active for any level with `wraparound: true` or Level 7 and above.
 */
export function isLevelWraparound(level?: { id: number; wraparound?: boolean }): boolean {
  if (!level) return false;
  return Boolean(level.wraparound ?? level.id >= 7);
}

/**
 * Returns the effective grid for a level.
 * When wraparound is active, outer boundary walls are open (EMPTY) so entities wrap seamlessly.
 */
export function getEffectiveGrid(level: LevelData): CellType[][] {
  const isWrap = isLevelWraparound(level);
  if (!isWrap) return level.grid;

  const h = level.grid.length;
  const w = level.grid[0].length;
  return level.grid.map((row, y) =>
    row.map((cell, x) => {
      // Remove outer perimeter boundary walls in wraparound levels
      if (x === 0 || x === w - 1 || y === 0 || y === h - 1) {
        return 'EMPTY';
      }
      return cell;
    })
  );
}

/**
 * Checks if a cell is inside the board boundaries and is not a wall.
 * Supports wraparound coordinates if active.
 */
export function isWalkable(
  grid: CellType[][],
  x: number,
  y: number,
  chips: Chip[],
  wraparound = false
): boolean {
  const h = grid.length;
  const w = grid[0].length;

  if (!wraparound && (y < 0 || y >= h || x < 0 || x >= w)) {
    return false;
  }

  const wx = ((x % w) + w) % w;
  const wy = ((y % h) + h) % h;

  if (grid[wy][wx] === 'WALL' || grid[wy][wx] === 'OBSTACLE') {
    return false;
  }
  // Cannot walk directly through a chip (walking into it triggers push)
  if (chips.some((c) => c.x === wx && c.y === wy)) {
    return false;
  }
  return true;
}

/**
 * Breadth-First Search to find shortest walking path from start to target.
 * Supports seamless border crossing when wraparound is active.
 */
export function findPathBFS(
  grid: CellType[][],
  start: Position,
  target: Position,
  chips: Chip[],
  wraparound = false
): Position[] | null {
  const h = grid.length;
  const w = grid[0].length;
  const targetX = wraparound ? ((target.x % w) + w) % w : target.x;
  const targetY = wraparound ? ((target.y % h) + h) % h : target.y;

  if (start.x === targetX && start.y === targetY) return [];
  if (!isWalkable(grid, targetX, targetY, chips, wraparound)) return null;

  const queue: { pos: Position; path: Position[] }[] = [{ pos: start, path: [] }];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.y}`);

  const directions = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ];

  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;

    for (const d of directions) {
      const nx = wraparound ? ((pos.x + d.dx) % w + w) % w : pos.x + d.dx;
      const ny = wraparound ? ((pos.y + d.dy) % h + h) % h : pos.y + d.dy;
      const key = `${nx},${ny}`;

      if (nx === targetX && ny === targetY) {
        return [...path, { x: nx, y: ny }];
      }

      if (!visited.has(key) && isWalkable(grid, nx, ny, chips, wraparound)) {
        visited.add(key);
        queue.push({
          pos: { x: nx, y: ny },
          path: [...path, { x: nx, y: ny }],
        });
      }
    }
  }

  return null;
}

/**
 * Calculates the full sliding behavior when the scientist pushes a chip.
 * When wraparound is active, moving out of one edge wraps to the opposite edge and continues!
 */
export function calculatePush(
  grid: CellType[][],
  chips: Chip[],
  pushOriginChip: Chip,
  dir: Direction,
  wraparound = false
): PushResult {
  const h = grid.length;
  const w = grid[0].length;
  const { dx, dy } = getDirectionDelta(dir);
  let currX = pushOriginChip.x;
  let currY = pushOriginChip.y;
  const traveledPath: Position[] = [{ x: currX, y: currY }];
  let steps = 0;
  const maxSteps = dx !== 0 ? w : h;

  while (true) {
    steps++;
    // In wraparound, chip travels up to 2 full laps (first lap normal speed, second lap friction deceleration)
    // and comes to rest back at starting position if no obstacles are met
    if (wraparound && steps > 2 * maxSteps) {
      return {
        canPush: true,
        moved: true,
        merged: false,
        movingChipId: pushOriginChip.id,
        finalX: pushOriginChip.x,
        finalY: pushOriginChip.y,
        traveledPath,
      };
    }

    const nextX = wraparound ? ((currX + dx) % w + w) % w : currX + dx;
    const nextY = wraparound ? ((currY + dy) % h + h) % h : currY + dy;

    // Check bounds & wall collision
    if (!wraparound && (nextY < 0 || nextY >= h || nextX < 0 || nextX >= w)) {
      break;
    }
    if (grid[nextY][nextX] === 'WALL' || grid[nextY][nextX] === 'OBSTACLE') {
      break;
    }

    // Check if another chip is at next position
    const otherChip = chips.find(
      (c) => c.id !== pushOriginChip.id && c.x === nextX && c.y === nextY
    );

    if (otherChip) {
      if (otherChip.level === pushOriginChip.level) {
        // Merge!
        traveledPath.push({ x: nextX, y: nextY });
        return {
          canPush: true,
          moved: true,
          merged: true,
          movingChipId: pushOriginChip.id,
          targetChipId: otherChip.id,
          finalX: nextX,
          finalY: nextY,
          newLevel: pushOriginChip.level + 1,
          traveledPath,
        };
      } else {
        // Different level chip stops the slide right in front of it
        break;
      }
    }

    // Path is empty floor, keep sliding!
    currX = nextX;
    currY = nextY;
    traveledPath.push({ x: currX, y: currY });
  }

  const hasMoved = currX !== pushOriginChip.x || currY !== pushOriginChip.y;

  return {
    canPush: hasMoved,
    moved: hasMoved,
    merged: false,
    movingChipId: pushOriginChip.id,
    finalX: currX,
    finalY: currY,
    traveledPath,
  };
}

/**
 * Evaluates whether custom chip collection can merge down to a single chip.
 */
export function evaluateChipBalance(chips: { level: number }[]): {
  isPowerOfTwo: boolean;
  targetLevel: number;
  totalEnergy: number;
} {
  let totalEnergy = 0;
  for (const c of chips) {
    totalEnergy += Math.pow(2, c.level - 1);
  }

  const isPowerOfTwo = totalEnergy > 0 && (totalEnergy & (totalEnergy - 1)) === 0;
  const targetLevel = isPowerOfTwo ? Math.log2(totalEnergy) + 1 : Math.floor(Math.log2(Math.max(1, totalEnergy))) + 1;

  return {
    isPowerOfTwo,
    targetLevel,
    totalEnergy,
  };
}
