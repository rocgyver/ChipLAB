import { createRoom, solveLevel } from './solver_core';
import { LevelData } from '../src/types/game';

// Test fixes for 7, 9, 11, 13, 18, 19
const tests: LevelData[] = [
  // 7
  {
    id: 7,
    chapter: 2,
    chapterName: '第二章：電路迴廊',
    title: '長廊測試 (The Corridor)',
    subtitle: '在有立柱緩衝的通道中精確調度兩顆晶片',
    width: 9,
    height: 7,
    playerStart: { x: 1, y: 1 },
    targetLevel: 2,
    parMoves: 3,
    grid: createRoom(9, 7, [
      [3, 2], [5, 4],
    ]),
    chips: [
      { x: 2, y: 2, level: 1 },
      { x: 6, y: 4, level: 1 },
    ],
  },
  // 9 (Target Level 4 = 80387)
  // Let's have two Level 3 chips or four Level 2 chips with accessible push lanes
  {
    id: 9,
    chapter: 2,
    chapterName: '第二章：電路迴廊',
    title: '數學協同處理器 (Math Co-Processor)',
    subtitle: '四顆晶片兩兩撞擊，誕生傳奇 80387 運算器 (Level 4)',
    width: 9,
    height: 7,
    playerStart: { x: 4, y: 3 },
    targetLevel: 4,
    parMoves: 3,
    grid: createRoom(9, 7, [
      [4, 2], [4, 4],
    ]),
    chips: [
      { x: 2, y: 2, level: 3 },
      { x: 6, y: 2, level: 3 },
    ],
  },
  // 11
  {
    id: 11,
    chapter: 2,
    chapterName: '第二章：電路迴廊',
    title: 'S 型導軌 (S-Curve Guide)',
    subtitle: '在錯落的隔板間靈巧穿梭',
    width: 9,
    height: 7,
    playerStart: { x: 1, y: 1 },
    targetLevel: 3,
    parMoves: 4,
    grid: createRoom(9, 7, [
      [4, 2], [4, 4],
    ]),
    chips: [
      { x: 2, y: 3, level: 2 },
      { x: 6, y: 3, level: 2 },
    ],
  },
  // 13 (Target Level 4)
  {
    id: 13,
    chapter: 3,
    chapterName: '第三章：多階處理器',
    title: '跨代合成 (Cross-Gen Fusion)',
    subtitle: '梯級骨牌連鎖：1級與1級合成2級，再與2級合成3級',
    width: 9,
    height: 7,
    playerStart: { x: 1, y: 1 },
    targetLevel: 4,
    parMoves: 3,
    grid: createRoom(9, 7, [
      [4, 2],
    ]),
    chips: [
      { x: 2, y: 3, level: 3 },
      { x: 6, y: 3, level: 3 },
    ],
  },
  // 18
  {
    id: 18,
    chapter: 3,
    chapterName: '第三章：多階處理器',
    title: '環狀超頻 (Clock Loop)',
    subtitle: '繞行中央控制台，將兩顆 4 級晶片送入對撞軌道',
    width: 9,
    height: 9,
    playerStart: { x: 1, y: 4 },
    targetLevel: 5,
    parMoves: 3,
    grid: createRoom(9, 9, [
      [4, 4],
    ]),
    chips: [
      { x: 2, y: 3, level: 4 },
      { x: 6, y: 3, level: 4 },
    ],
  },
  // 19
  {
    id: 19,
    chapter: 4,
    chapterName: '第四章：超級電腦誕生',
    title: '奔騰年代 (Pentium Dawn)',
    subtitle: '合體誕生紅色 Pentium MMX (Level 6)',
    width: 10,
    height: 8,
    playerStart: { x: 1, y: 1 },
    targetLevel: 6,
    parMoves: 3,
    grid: createRoom(10, 8, [
      [3, 3], [6, 4],
    ]),
    chips: [
      { x: 2, y: 2, level: 5 },
      { x: 7, y: 2, level: 5 },
    ],
  },
];

for (const t of tests) {
  const res = solveLevel(t);
  console.log(`Level ${t.id}: Solved = ${res.solved}, Moves = ${res.moves}`);
}
