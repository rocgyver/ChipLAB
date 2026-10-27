import { createRoom, solveLevel, SolveResult } from './solver_core';
import { LevelData } from '../src/types/game';
import * as fs from 'fs';

export interface VerifiedLevel extends LevelData {
  solutionSteps?: {
    standX: number;
    standY: number;
    dir: string;
    chipX: number;
    chipY: number;
    chipLevel: number;
    merged: boolean;
  }[];
}

const levelsCandidate: LevelData[] = [
  // ================= Chapter 1: 基礎合成室 =================
  {
    id: 1,
    chapter: 1,
    chapterName: '第一章：基礎合成室',
    title: '首次通電 (First Contact)',
    subtitle: '將兩個 7400 閘晶片撞擊合併為 1 個 SRAM',
    width: 7,
    height: 5,
    playerStart: { x: 1, y: 2 },
    targetLevel: 2,
    parMoves: 1,
    grid: createRoom(7, 5),
    chips: [
      { x: 2, y: 2, level: 1 },
      { x: 5, y: 2, level: 1 },
    ],
    hint: '走到左側晶片左方，向右推動！晶片會一路滑行並撞擊右側晶片合成。',
  },
  {
    id: 2,
    chapter: 1,
    chapterName: '第一章：基礎合成室',
    title: '垂直匯流排 (Vertical Bus)',
    subtitle: '利用上下推動完成垂直軸的碰撞升級',
    width: 6,
    height: 7,
    playerStart: { x: 2, y: 1 },
    targetLevel: 2,
    parMoves: 1,
    grid: createRoom(6, 7),
    chips: [
      { x: 3, y: 2, level: 1 },
      { x: 3, y: 5, level: 1 },
    ],
    hint: '移動到上方晶片上方 (3, 1)，向下推動進行縱向碰撞！',
  },
  {
    id: 3,
    chapter: 1,
    chapterName: '第一章：基礎合成室',
    title: '三角校準 (Triangle Fusion)',
    subtitle: '四顆基礎晶片，兩兩合成為二級，最終合成為三級微處理器',
    width: 8,
    height: 6,
    playerStart: { x: 1, y: 1 },
    targetLevel: 3,
    parMoves: 3,
    grid: createRoom(8, 6),
    chips: [
      { x: 2, y: 2, level: 1 },
      { x: 5, y: 2, level: 1 },
      { x: 2, y: 4, level: 1 },
      { x: 5, y: 4, level: 1 },
    ],
    hint: '先推動水平方向合成兩個綠色 SRAM，再將它們推向同一垂直軌道合成 8086 CPU！',
  },
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
    parMoves: 2,
    grid: createRoom(8, 7, [[3, 4]]),
    chips: [
      { x: 1, y: 3, level: 1 },
      { x: 3, y: 1, level: 1 },
    ],
    hint: '先將左側晶片向上推到角落，再將上方晶片向左推動，兩者將在轉角猛烈撞擊合成！',
  },
  {
    id: 5,
    chapter: 1,
    chapterName: '第一章：基礎合成室',
    title: '轉角對齊 (Corner Alignment)',
    subtitle: '利用角落與邊緣將晶片聚集在同一條軌道上',
    width: 7,
    height: 7,
    playerStart: { x: 3, y: 3 },
    targetLevel: 2,
    parMoves: 2,
    grid: createRoom(7, 7),
    chips: [
      { x: 2, y: 1, level: 1 },
      { x: 5, y: 4, level: 1 },
    ],
    hint: '將上方晶片推到右側邊緣，使其與下方的晶片處於同一垂直列！',
  },
  {
    id: 6,
    chapter: 1,
    chapterName: '第一章：基礎合成室',
    title: 'SRAM 全面封裝 (SRAM Assembly)',
    subtitle: '掌握在開放區域中的連續推移與位移',
    width: 8,
    height: 7,
    playerStart: { x: 1, y: 1 },
    targetLevel: 3,
    parMoves: 4,
    grid: createRoom(8, 7),
    chips: [
      { x: 2, y: 2, level: 1 },
      { x: 3, y: 5, level: 1 },
      { x: 5, y: 2, level: 1 },
      { x: 6, y: 5, level: 1 },
    ],
    hint: '依序推動水平與垂直軸，先在上下各合成一顆 Level 2，最後完成最終合併。',
  },

  // ================= Chapter 2: 電路迴廊 =================
  {
    id: 7,
    chapter: 2,
    chapterName: '第二章：電路迴廊',
    title: '長廊測試 (The Corridor)',
    subtitle: '在有立柱緩衝的通道中精確調度兩顆晶片',
    width: 9,
    height: 6,
    playerStart: { x: 1, y: 1 },
    targetLevel: 2,
    parMoves: 3,
    grid: createRoom(9, 6, [
      [3, 2], [5, 3],
    ]),
    chips: [
      { x: 2, y: 1, level: 1 },
      { x: 6, y: 4, level: 1 },
    ],
    hint: '利用中間立柱作為滑動煞車，將晶片調度到同一水平通道進行對撞！',
  },
  {
    id: 8,
    chapter: 2,
    chapterName: '第二章：電路迴廊',
    title: '隔間試驗 (Chamber Partition)',
    subtitle: '穿梭於兩個實驗隔間之間，通過中間通道完成合成',
    width: 9,
    height: 7,
    playerStart: { x: 2, y: 3 },
    targetLevel: 3,
    parMoves: 5,
    grid: createRoom(9, 7, [
      [4, 1], [4, 2], [4, 4], [4, 5],
    ]),
    chips: [
      { x: 2, y: 2, level: 1 },
      { x: 2, y: 4, level: 1 },
      { x: 6, y: 3, level: 2 },
    ],
    hint: '左室有兩顆 Level 1！先將它們縱向撞擊合成為 Level 2，再穿過門推向右室的 Level 2 合成為 Level 3！',
  },
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
      [4, 1], [4, 5],
    ]),
    chips: [
      { x: 2, y: 2, level: 3 },
      { x: 6, y: 2, level: 3 },
      { x: 2, y: 4, level: 2 },
      { x: 6, y: 4, level: 2 },
    ],
    hint: '下面兩顆 2 級撞擊合成 3 級，再與上方合成的 3 級合為 4 級！',
  },
  {
    id: 10,
    chapter: 2,
    chapterName: '第二章：電路迴廊',
    title: '迴轉避險 (Turnabout Maneuver)',
    subtitle: '利用中央立柱避免晶片貼在邊緣死角',
    width: 8,
    height: 7,
    playerStart: { x: 1, y: 1 },
    targetLevel: 3,
    parMoves: 4,
    grid: createRoom(8, 7, [
      [3, 3], [4, 3],
    ]),
    chips: [
      { x: 2, y: 2, level: 2 },
      { x: 5, y: 2, level: 1 },
      { x: 5, y: 4, level: 1 },
    ],
    hint: '右側兩顆 1 級先縱向撞擊合成為 2 級，再與左側 2 級對撞！',
  },
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
      [3, 1], [3, 2], [3, 3],
      [5, 3], [5, 4], [5, 5],
    ]),
    chips: [
      { x: 1, y: 4, level: 2 },
      { x: 7, y: 2, level: 2 },
    ],
    hint: '晶片滑行會撞到 S 型中央隔板停下，把握停靠點完成變軌！',
  },
  {
    id: 12,
    chapter: 2,
    chapterName: '第二章：電路迴廊',
    title: '十字交會 (Cross Intersection)',
    subtitle: '十字路口的四星大會師，誕生 Level 4 晶片',
    width: 9,
    height: 9,
    playerStart: { x: 4, y: 4 },
    targetLevel: 4,
    parMoves: 3,
    grid: createRoom(9, 9, [
      [2, 2], [6, 2],
      [2, 6], [6, 6],
    ]),
    chips: [
      { x: 4, y: 2, level: 3 },
      { x: 4, y: 6, level: 3 },
    ],
    hint: '兩顆 8086 微處理器在垂直中軸線上，向下推動直接撞擊升級！',
  },

  // ================= Chapter 3: 多階處理器 =================
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
      [3, 3], [5, 3],
    ]),
    chips: [
      { x: 1, y: 2, level: 1 },
      { x: 7, y: 2, level: 1 },
      { x: 7, y: 4, level: 2 },
      { x: 1, y: 4, level: 3 },
    ],
    hint: '上方的 1 級晶片相撞升為 2 級，再一路向下連環觸發！',
  },
  {
    id: 14,
    chapter: 3,
    chapterName: '第三章：多階處理器',
    title: '對稱機房 (Symmetric Hub)',
    subtitle: '對稱佈局中的多步對撞',
    width: 9,
    height: 8,
    playerStart: { x: 4, y: 3 },
    targetLevel: 4,
    parMoves: 4,
    grid: createRoom(9, 8, [
      [4, 2], [4, 5],
    ]),
    chips: [
      { x: 2, y: 3, level: 2 },
      { x: 6, y: 3, level: 2 },
      { x: 2, y: 4, level: 2 },
      { x: 6, y: 4, level: 2 },
    ],
    hint: '左右兩側分別進行縱向合成，最後在中路匯合！',
  },
  {
    id: 15,
    chapter: 3,
    chapterName: '第三章：多階處理器',
    title: '486 世代降臨 (486 DX2 Revolution)',
    subtitle: '邁入 32 位元時代！合成出橘色 486 DX2 (Level 5)',
    width: 9,
    height: 8,
    playerStart: { x: 1, y: 1 },
    targetLevel: 5,
    parMoves: 5,
    grid: createRoom(9, 8, [
      [4, 2], [4, 5],
    ]),
    chips: [
      { x: 2, y: 2, level: 3 },
      { x: 6, y: 2, level: 3 },
      { x: 2, y: 5, level: 3 },
      { x: 6, y: 5, level: 3 },
    ],
    hint: '四枚金色的 8086 處理器！兩兩組裝成 80387，最後合體昇華為 486 DX2！',
  },
  {
    id: 16,
    chapter: 3,
    chapterName: '第三章：多階處理器',
    title: '窄口效應 (Chokepoint)',
    subtitle: '穿過單格走廊，進行隔室升級',
    width: 10,
    height: 7,
    playerStart: { x: 1, y: 3 },
    targetLevel: 4,
    parMoves: 4,
    grid: createRoom(10, 7, [
      [5, 1], [5, 2], [5, 4], [5, 5],
    ]),
    chips: [
      { x: 2, y: 3, level: 3 },
      { x: 7, y: 3, level: 3 },
    ],
    hint: '中央通道是唯一貫通處，將左室的 8086 直接向右推過門完成合併！',
  },
  {
    id: 17,
    chapter: 3,
    chapterName: '第三章：多階處理器',
    title: '階層金字塔 (The Hierarchy Pyramid)',
    subtitle: '連續升階矩陣：兩顆 3 級合併為 4 級，再與現有 4 級合併為 5 級',
    width: 9,
    height: 7,
    playerStart: { x: 4, y: 1 },
    targetLevel: 5,
    parMoves: 2,
    grid: createRoom(9, 7, [
      [4, 3],
    ]),
    chips: [
      { x: 2, y: 2, level: 3 },
      { x: 6, y: 2, level: 3 },
      { x: 4, y: 5, level: 4 },
    ],
    hint: '上方兩顆 8086 水平相撞為 80387，再向下推動與底部的 80387 融合！',
  },
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
      [3, 3], [4, 3], [5, 3],
      [3, 4], [5, 4],
      [3, 5], [4, 5], [5, 5],
    ]),
    chips: [
      { x: 1, y: 2, level: 4 },
      { x: 7, y: 2, level: 4 },
    ],
    hint: '避開中央大型控制台，在頂部走廊直線對撞！',
  },

  // ================= Chapter 4: 超級電腦誕生 =================
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
      [3, 3], [6, 3],
      [3, 4], [6, 4],
    ]),
    chips: [
      { x: 1, y: 2, level: 5 },
      { x: 8, y: 2, level: 5 },
    ],
    hint: '兩顆 486 DX2 高速處理器在上方長廊對撞，直接誕生 Pentium MMX！',
  },
  {
    id: 20,
    chapter: 4,
    chapterName: '第四章：超級電腦誕生',
    title: '光子晶片 (Photonic Core)',
    subtitle: '兩組 4 級晶片逐步推展，在精密立柱間合成出 Pentium (Level 6)',
    width: 9,
    height: 8,
    playerStart: { x: 4, y: 1 },
    targetLevel: 6,
    parMoves: 4,
    grid: createRoom(9, 8, [
      [3, 3], [5, 3],
      [3, 4], [5, 4],
    ]),
    chips: [
      { x: 2, y: 2, level: 5 },
      { x: 6, y: 2, level: 4 },
      { x: 6, y: 5, level: 4 },
    ],
    hint: '右側兩顆 80387 先縱向碰撞為 486 DX2，再與左側 486 對撞成就 Pentium！',
  },
  {
    id: 21,
    chapter: 4,
    chapterName: '第四章：超級電腦誕生',
    title: '量子神經元 (Quantum Entanglement)',
    subtitle: '兩顆 Pentium MMX 相互糾纏，突破物理限制誕生量子 QPU (Level 7)',
    width: 10,
    height: 8,
    playerStart: { x: 4, y: 4 },
    targetLevel: 7,
    parMoves: 3,
    grid: createRoom(10, 8, [
      [2, 2], [7, 2],
      [2, 5], [7, 5],
    ]),
    chips: [
      { x: 3, y: 3, level: 5 },
      { x: 6, y: 3, level: 5 },
      { x: 3, y: 4, level: 5 },
      { x: 6, y: 4, level: 5 },
    ],
    hint: '將這四顆 486 DX2 精準對撞，合成兩枚 Pentium，最後撞出水藍色量子 QPU！',
  },
  {
    id: 22,
    chapter: 4,
    chapterName: '第四章：超級電腦誕生',
    title: '大腦風暴 (Brainstorm Nexus)',
    subtitle: '在狹窄矩陣中調度，推升出量子晶片 QPU (Level 7)',
    width: 9,
    height: 8,
    playerStart: { x: 1, y: 1 },
    targetLevel: 7,
    parMoves: 3,
    grid: createRoom(9, 8, [
      [4, 3], [4, 4],
    ]),
    chips: [
      { x: 2, y: 2, level: 6 },
      { x: 6, y: 2, level: 6 },
    ],
    hint: '兩顆 Pentium MMX 處理器在中軸上方對撞，光芒四射的量子 QPU 瞬間成型！',
  },
  {
    id: 23,
    chapter: 4,
    chapterName: '第四章：超級電腦誕生',
    title: '超級電腦前夕 (Eve of Supercomputing)',
    subtitle: '階梯連鎖：由 5 級、6 級一路推動合成至 7 級量子核心',
    width: 10,
    height: 8,
    playerStart: { x: 1, y: 1 },
    targetLevel: 7,
    parMoves: 3,
    grid: createRoom(10, 8, [
      [4, 3], [5, 3],
    ]),
    chips: [
      { x: 2, y: 2, level: 5 },
      { x: 7, y: 2, level: 5 },
      { x: 7, y: 5, level: 6 },
    ],
    hint: '先在上方走廊將兩顆 486 撞為 Pentium，再垂直向下與另一枚 Pentium 融合！',
  },
  {
    id: 24,
    chapter: 4,
    chapterName: '第四章：超級電腦誕生',
    title: '終極超級電腦！(The Grand Supercomputer)',
    subtitle: '全劇終極殿堂：推動兩座量子核心，合成無上榮耀的超級電腦 (Level 8)！',
    width: 11,
    height: 9,
    playerStart: { x: 5, y: 4 },
    targetLevel: 8,
    parMoves: 4,
    grid: createRoom(11, 9, [
      [3, 3], [7, 3],
      [3, 5], [7, 5],
    ]),
    chips: [
      { x: 2, y: 2, level: 6 },
      { x: 8, y: 2, level: 6 },
      { x: 2, y: 6, level: 6 },
      { x: 8, y: 6, level: 6 },
    ],
    hint: '四座 Pentium MMX 巨塔！上下兩對分別對撞為量子 QPU，最後在中央通道相撞，超級電腦誕生！',
  },
];

console.log('Testing candidates...');
let allSolved = true;
const verifiedList: VerifiedLevel[] = [];

for (const lvl of levelsCandidate) {
  const res = solveLevel(lvl);
  if (res.solved) {
    console.log(`Level ${lvl.id} [${lvl.title}]: SOLVED in ${res.moves} moves! (Par was ${lvl.parMoves})`);
    verifiedList.push({
      ...lvl,
      parMoves: res.moves,
      solutionSteps: res.steps,
    });
  } else {
    console.error(`Level ${lvl.id} [${lvl.title}]: FAILED! States explored: ${res.statesExplored}`);
    allSolved = false;
  }
}

if (allSolved) {
  console.log('\n===========================================');
  console.log('SUCCESS! ALL 24 LEVELS 100% SOLVED & VERIFIED!');
  console.log('===========================================\n');
} else {
  console.error('\nSOME LEVELS STILL FAILED!\n');
}
