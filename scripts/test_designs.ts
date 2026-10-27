import { createRoom, solveLevel } from './solver_core';
import { LevelData } from '../src/types/game';

const testLevels: LevelData[] = [
  // Level 4 fix test:
  {
    id: 4,
    chapter: 1,
    chapterName: '第一章：基礎合成室',
    title: '阻擋牆運用 (Wall Bounce)',
    subtitle: '利用立柱阻擋晶片滑行並在十字路口相撞',
    width: 8,
    height: 7,
    playerStart: { x: 2, y: 2 },
    targetLevel: 2,
    parMoves: 3,
    grid: createRoom(8, 7, [
      [3, 4], // Stopper pillar
    ]),
    chips: [
      { x: 1, y: 3, level: 1 }, // Pushed right -> stops at (2, 3) if wall, or place at (2, 3)?
      { x: 3, y: 1, level: 1 },
    ],
  },
];

for (const lvl of testLevels) {
  const res = solveLevel(lvl);
  console.log(`Level ${lvl.id}: Solved = ${res.solved}, Moves = ${res.moves}`);
  if (res.solved) {
    console.log('Steps:', res.steps);
  }
}
