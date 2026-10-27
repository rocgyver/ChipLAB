import { createRoom, solveLevel } from './solver_core';
import { LevelData } from '../src/types/game';

const tests: LevelData[] = [
  // 9: Four Level 2 chips merging into two Level 3s, then one Level 4 (80387)
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
      [2, 3], [6, 3], // Pillars separating rows
    ]),
    chips: [
      { x: 3, y: 2, level: 2 },
      { x: 5, y: 2, level: 2 },
      { x: 3, y: 4, level: 2 },
      { x: 5, y: 4, level: 2 },
    ],
  },
  // 11: S-Curve with multi-move alignment
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
      [3, 2], [3, 3],
      [5, 3], [5, 4],
    ]),
    chips: [
      { x: 2, y: 4, level: 2 },
      { x: 6, y: 2, level: 2 },
    ],
  },
  // 13: 3 chips: two Level 2s, one Level 3 -> merge to 3, then merge to 4!
  {
    id: 13,
    chapter: 3,
    chapterName: '第三章：多階處理器',
    title: '跨代合成 (Cross-Gen Fusion)',
    subtitle: '梯級骨牌連鎖：兩顆 2 級合成 3 級，再與現存 3 級合成 4 級！',
    width: 9,
    height: 7,
    playerStart: { x: 1, y: 1 },
    targetLevel: 4,
    parMoves: 3,
    grid: createRoom(9, 7, [
      [3, 3], [5, 3],
    ]),
    chips: [
      { x: 2, y: 2, level: 2 },
      { x: 6, y: 2, level: 2 },
      { x: 6, y: 4, level: 3 },
    ],
  },
  // 18: Ring around central block
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
    parMoves: 4,
    grid: createRoom(9, 9, [
      [4, 3], [4, 5],
      [3, 4], [5, 4],
    ]),
    chips: [
      { x: 2, y: 2, level: 4 },
      { x: 6, y: 6, level: 4 },
    ],
  },
  // 19: Four Level 4 chips -> two Level 5s -> one Level 6 (Pentium)!
  {
    id: 19,
    chapter: 4,
    chapterName: '第四章：超級電腦誕生',
    title: '奔騰年代 (Pentium Dawn)',
    subtitle: '兩兩撞擊誕生紅色 Pentium MMX (Level 6)',
    width: 10,
    height: 8,
    playerStart: { x: 1, y: 1 },
    targetLevel: 6,
    parMoves: 3,
    grid: createRoom(10, 8, [
      [4, 3], [5, 4],
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
  if (res.solved) {
    console.log(res.steps.map(s => `Stand(${s.standX},${s.standY}) Push ${s.dir} (Merged: ${s.merged})`));
  }
}
