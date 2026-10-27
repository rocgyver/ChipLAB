import { createRoom, solveLevel } from './solver_core';
import { LevelData } from '../src/types/game';

const lvl19: LevelData = {
  id: 19,
  chapter: 4,
  chapterName: '第四章：超級電腦誕生',
  title: '奔騰年代 (Pentium Dawn)',
  subtitle: '四核協同處理器兩兩對撞，誕生紅色 Pentium MMX (Level 6)',
  width: 10,
  height: 8,
  playerStart: { x: 1, y: 1 },
  targetLevel: 6,
  parMoves: 3,
  grid: createRoom(10, 8, [
    [3, 3], [6, 4],
  ]),
  chips: [
    { x: 3, y: 2, level: 4 },
    { x: 6, y: 2, level: 4 },
    { x: 3, y: 5, level: 5 },
  ],
};

const res = solveLevel(lvl19);
console.log('Level 19:', res.solved, res.moves, res.steps);
