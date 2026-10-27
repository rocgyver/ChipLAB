import { Position, Direction, Chip, CellType } from '../types/game';

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
 * Checks if a cell is inside the board boundaries and is not a wall.
 */
export function isWalkable(grid: CellType[][], x: number, y: number, chips: Chip[]): boolean {
  if (y < 0 || y >= grid.length || x < 0 || x >= grid[0].length) {
    return false;
  }
  if (grid[y][x] === 'WALL' || grid[y][x] === 'OBSTACLE') {
    return false;
  }
  // Cannot walk directly through a chip (walking into it triggers push)
  if (chips.some((c) => c.x === x && c.y === y)) {
    return false;
  }
  return true;
}

/**
 * Breadth-First Search to find shortest walking path from start to target.
 */
export function findPathBFS(
  grid: CellType[][],
  start: Position,
  target: Position,
  chips: Chip[]
): Position[] | null {
  if (start.x === target.x && start.y === target.y) return [];
  if (!isWalkable(grid, target.x, target.y, chips)) return null;

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
      const nx = pos.x + d.dx;
      const ny = pos.y + d.dy;
      const key = `${nx},${ny}`;

      if (nx === target.x && ny === target.y) {
        return [...path, { x: nx, y: ny }];
      }

      if (
        !visited.has(key) &&
        isWalkable(grid, nx, ny, chips)
      ) {
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
 */
export function calculatePush(
  grid: CellType[][],
  chips: Chip[],
  pushOriginChip: Chip,
  dir: Direction
): PushResult {
  const { dx, dy } = getDirectionDelta(dir);
  let currX = pushOriginChip.x;
  let currY = pushOriginChip.y;
  const traveledPath: Position[] = [{ x: currX, y: currY }];

  while (true) {
    const nextX = currX + dx;
    const nextY = currY + dy;

    // Check bounds & wall collision
    if (
      nextY < 0 ||
      nextY >= grid.length ||
      nextX < 0 ||
      nextX >= grid[0].length ||
      grid[nextY][nextX] === 'WALL' ||
      grid[nextY][nextX] === 'OBSTACLE'
    ) {
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

  // Check if totalEnergy is a power of 2
  const isPowerOfTwo = totalEnergy > 0 && (totalEnergy & (totalEnergy - 1)) === 0;
  const targetLevel = isPowerOfTwo ? Math.log2(totalEnergy) + 1 : Math.floor(Math.log2(Math.max(1, totalEnergy))) + 1;

  return {
    isPowerOfTwo,
    targetLevel,
    totalEnergy,
  };
}
