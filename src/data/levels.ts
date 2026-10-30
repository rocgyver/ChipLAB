import { LevelData, CellType } from '../types/game';

// Helper to construct a room with outer perimeter walls
function createEmptyRoom(w: number, h: number, extraWalls: [number, number][] = []): CellType[][] {
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

export interface LevelSolutionStep {
  standX: number;
  standY: number;
  dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  chipX: number;
  chipY: number;
  chipLevel: number;
  merged: boolean;
}

export interface VerifiedLevelData extends LevelData {
  solutionSteps?: LevelSolutionStep[];
}

export const LEVELS: VerifiedLevelData[] = [
  {
    "id": 1,
    "chapter": 1,
    "chapterName": "Level.1：基礎合成室",
    "title": "首次通電 (First Contact)",
    "subtitle": "將兩個 7400 閘晶片撞擊合併為 1 個 SRAM",
    "width": 7,
    "height": 5,
    "playerStart": {
      "x": 1,
      "y": 2
    },
    "targetLevel": 2,
    "parMoves": 1,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 2,
        "y": 2,
        "level": 1
      },
      {
        "x": 5,
        "y": 2,
        "level": 1
      }
    ],
    "hint": "走到左側晶片左方 (1, 2)，向右推動！晶片會一路滑行並撞擊右側晶片合成。",
    "solutionSteps": [
      {
        "standX": 1,
        "standY": 2,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 2,
        "chipLevel": 1,
        "merged": true
      }
    ]
  },
  {
    "id": 2,
    "chapter": 1,
    "chapterName": "Level.1：基礎合成室",
    "title": "垂直匯流排 (Vertical Bus)",
    "subtitle": "利用上下推動完成垂直軸的碰撞升級",
    "width": 6,
    "height": 7,
    "playerStart": {
      "x": 2,
      "y": 1
    },
    "targetLevel": 2,
    "parMoves": 1,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 3,
        "y": 2,
        "level": 1
      },
      {
        "x": 3,
        "y": 5,
        "level": 1
      }
    ],
    "hint": "移動到上方晶片上方 (3, 1)，向下推動進行縱向碰撞！",
    "solutionSteps": [
      {
        "standX": 3,
        "standY": 1,
        "dir": "DOWN",
        "chipX": 3,
        "chipY": 2,
        "chipLevel": 1,
        "merged": true
      }
    ]
  },
  {
    "id": 3,
    "chapter": 1,
    "chapterName": "Level.1：基礎合成室",
    "title": "三角校準 (Triangle Fusion)",
    "subtitle": "四顆基礎晶片，兩兩合成為二級，最終合成為三級微處理器",
    "width": 8,
    "height": 6,
    "playerStart": {
      "x": 1,
      "y": 1
    },
    "targetLevel": 3,
    "parMoves": 3,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 2,
        "y": 2,
        "level": 1
      },
      {
        "x": 5,
        "y": 2,
        "level": 1
      },
      {
        "x": 2,
        "y": 4,
        "level": 1
      },
      {
        "x": 5,
        "y": 4,
        "level": 1
      }
    ],
    "hint": "先推動水平方向合成兩個綠色 SRAM，再將它們推向同一垂直軌道合成 8086 CPU！",
    "solutionSteps": [
      {
        "standX": 1,
        "standY": 2,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 2,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 1,
        "standY": 4,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 4,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 1,
        "dir": "DOWN",
        "chipX": 5,
        "chipY": 2,
        "chipLevel": 2,
        "merged": true
      }
    ]
  },
  {
    "id": 4,
    "chapter": 1,
    "chapterName": "Level.1：基礎合成室",
    "title": "阻擋牆運用 (Wall Bounce)",
    "subtitle": "利用立柱阻擋晶片滑行並在十字路口相撞",
    "width": 8,
    "height": 7,
    "playerStart": {
      "x": 2,
      "y": 2
    },
    "targetLevel": 2,
    "parMoves": 2,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 1,
        "y": 3,
        "level": 1
      },
      {
        "x": 3,
        "y": 1,
        "level": 1
      }
    ],
    "hint": "先走到 (1, 4) 將左側晶片向上推到角落 (1, 1)，再繞到 (4, 1) 將上方晶片向左推動，兩者將在轉角猛烈撞擊合成！",
    "solutionSteps": [
      {
        "standX": 1,
        "standY": 4,
        "dir": "UP",
        "chipX": 1,
        "chipY": 3,
        "chipLevel": 1,
        "merged": false
      },
      {
        "standX": 4,
        "standY": 1,
        "dir": "LEFT",
        "chipX": 3,
        "chipY": 1,
        "chipLevel": 1,
        "merged": true
      }
    ]
  },
  {
    "id": 5,
    "chapter": 1,
    "chapterName": "Level.1：基礎合成室",
    "title": "轉角對齊 (Corner Alignment)",
    "subtitle": "利用角落與邊緣將晶片聚集在同一條軌道上",
    "width": 7,
    "height": 7,
    "playerStart": {
      "x": 3,
      "y": 3
    },
    "targetLevel": 2,
    "parMoves": 2,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 2,
        "y": 1,
        "level": 1
      },
      {
        "x": 5,
        "y": 4,
        "level": 1
      }
    ],
    "hint": "走到 (1, 1) 將上方晶片向右推到右壁 (5, 1)，再走到 (5, 5) 將下方晶片向上推動對撞！",
    "solutionSteps": [
      {
        "standX": 5,
        "standY": 5,
        "dir": "UP",
        "chipX": 5,
        "chipY": 4,
        "chipLevel": 1,
        "merged": false
      },
      {
        "standX": 1,
        "standY": 1,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 1,
        "chipLevel": 1,
        "merged": true
      }
    ]
  },
  {
    "id": 6,
    "chapter": 1,
    "chapterName": "Level.1：基礎合成室",
    "title": "SRAM 全面封裝 (SRAM Assembly)",
    "subtitle": "掌握在開放區域中的連續推移與位移",
    "width": 8,
    "height": 7,
    "playerStart": {
      "x": 1,
      "y": 1
    },
    "targetLevel": 3,
    "parMoves": 4,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 2,
        "y": 2,
        "level": 1
      },
      {
        "x": 3,
        "y": 5,
        "level": 1
      },
      {
        "x": 5,
        "y": 2,
        "level": 1
      },
      {
        "x": 6,
        "y": 5,
        "level": 1
      }
    ],
    "hint": "先推 (2, 2) 向右撞擊 (5, 2) 合成 Chip.2，再推 (3, 5) 向右撞擊 (6, 5) 合成 Chip.2，最後垂直對撞！",
    "solutionSteps": [
      {
        "standX": 1,
        "standY": 2,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 2,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 4,
        "standY": 2,
        "dir": "RIGHT",
        "chipX": 5,
        "chipY": 2,
        "chipLevel": 2,
        "merged": false
      },
      {
        "standX": 2,
        "standY": 5,
        "dir": "RIGHT",
        "chipX": 3,
        "chipY": 5,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 1,
        "dir": "DOWN",
        "chipX": 6,
        "chipY": 2,
        "chipLevel": 2,
        "merged": true
      }
    ]
  },
  {
    "id": 7,
    "chapter": 2,
    "chapterName": "Level.2：電路迴廊",
    "title": "環狀長廊 (The Torus Corridor)",
    "subtitle": "空間邊界已解鎖！向左滑出邊界，將從右側邊緣高速折返！",
    "width": 9,
    "height": 7,
    "wraparound": true,
    "playerStart": {
      "x": 3,
      "y": 3
    },
    "targetLevel": 2,
    "parMoves": 1,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 2,
        "y": 3,
        "level": 1
      },
      {
        "x": 7,
        "y": 3,
        "level": 1
      }
    ],
    "hint": "站在 (3, 3) 向左推動！晶片滑出左側邊界後，將以環狀空間從最右側邊緣飛出，並撞擊右方晶片！",
    "solutionSteps": [
      {
        "standX": 3,
        "standY": 3,
        "dir": "LEFT",
        "chipX": 2,
        "chipY": 3,
        "chipLevel": 1,
        "merged": true
      }
    ]
  },
  {
    "id": 8,
    "chapter": 2,
    "chapterName": "Level.2：電路迴廊",
    "title": "隔間穿梭 (Chamber Warp)",
    "subtitle": "穿越中央隔間，或利用左右邊界環狀折返進行空間包抄！",
    "width": 9,
    "height": 7,
    "playerStart": {
      "x": 2,
      "y": 3
    },
    "targetLevel": 3,
    "parMoves": 4,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 2,
        "y": 2,
        "level": 1
      },
      {
        "x": 2,
        "y": 4,
        "level": 1
      },
      {
        "x": 6,
        "y": 3,
        "level": 2
      }
    ],
    "hint": "在左室將兩顆 Chip.1 縱向相撞合為 Chip.2，接著向左滑出邊界（或向右穿過隔間門）與右室晶片完美結合！",
    "solutionSteps": [
      {
        "standX": 2,
        "standY": 5,
        "dir": "UP",
        "chipX": 2,
        "chipY": 4,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 2,
        "dir": "LEFT",
        "chipX": 2,
        "chipY": 2,
        "chipLevel": 2,
        "merged": false
      },
      {
        "standX": 7,
        "standY": 3,
        "dir": "LEFT",
        "chipX": 6,
        "chipY": 3,
        "chipLevel": 2,
        "merged": false
      },
      {
        "standX": 1,
        "standY": 4,
        "dir": "UP",
        "chipX": 1,
        "chipY": 3,
        "chipLevel": 2,
        "merged": true
      }
    ]
  },
  {
    "id": 9,
    "chapter": 2,
    "chapterName": "Level.2：電路迴廊",
    "title": "數學協同處理器 (Math Co-Processor)",
    "subtitle": "四顆晶片兩兩撞擊，誕生傳奇 80387 運算器 (Chip.4)",
    "width": 9,
    "height": 7,
    "playerStart": {
      "x": 4,
      "y": 3
    },
    "targetLevel": 4,
    "parMoves": 3,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 3,
        "y": 2,
        "level": 2
      },
      {
        "x": 5,
        "y": 2,
        "level": 2
      },
      {
        "x": 3,
        "y": 4,
        "level": 2
      },
      {
        "x": 5,
        "y": 4,
        "level": 2
      }
    ],
    "hint": "先推 (5, 5) 向上撞擊 (5, 2) 合成 Chip.3，再推 (3, 5) 向上撞擊 (3, 2) 合成 Chip.3，最後水平對撞！",
    "solutionSteps": [
      {
        "standX": 5,
        "standY": 5,
        "dir": "UP",
        "chipX": 5,
        "chipY": 4,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 5,
        "dir": "UP",
        "chipX": 3,
        "chipY": 4,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 2,
        "standY": 2,
        "dir": "RIGHT",
        "chipX": 3,
        "chipY": 2,
        "chipLevel": 3,
        "merged": true
      }
    ]
  },
  {
    "id": 10,
    "chapter": 2,
    "chapterName": "Level.2：電路迴廊",
    "title": "迴轉避險 (Turnabout Maneuver)",
    "subtitle": "利用中央立柱避免晶片貼在邊緣死角",
    "width": 8,
    "height": 7,
    "playerStart": {
      "x": 1,
      "y": 1
    },
    "targetLevel": 3,
    "parMoves": 2,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 2,
        "y": 2,
        "level": 2
      },
      {
        "x": 5,
        "y": 2,
        "level": 1
      },
      {
        "x": 5,
        "y": 4,
        "level": 1
      }
    ],
    "hint": "先走到 (5, 5) 將下方 1 級晶片向上推，撞擊 (5, 2) 合成為 2 級，隨後直接向左推撞擊 (2, 2) 升為 3 級！",
    "solutionSteps": [
      {
        "standX": 5,
        "standY": 5,
        "dir": "UP",
        "chipX": 5,
        "chipY": 4,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 2,
        "dir": "LEFT",
        "chipX": 5,
        "chipY": 2,
        "chipLevel": 2,
        "merged": true
      }
    ]
  },
  {
    "id": 11,
    "chapter": 2,
    "chapterName": "Level.2：電路迴廊",
    "title": "S 型導軌 (S-Curve Guide)",
    "subtitle": "在錯落的隔板間靈巧穿梭",
    "width": 9,
    "height": 7,
    "playerStart": {
      "x": 1,
      "y": 1
    },
    "targetLevel": 3,
    "parMoves": 3,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 2,
        "y": 4,
        "level": 2
      },
      {
        "x": 6,
        "y": 2,
        "level": 2
      }
    ],
    "hint": "走到 (1, 4) 將左下晶片向右推撞柱停在 (4, 4)，走到 (7, 2) 將右上晶片向左推撞柱停在 (4, 2)，最後垂直對撞！",
    "solutionSteps": [
      {
        "standX": 1,
        "standY": 4,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 4,
        "chipLevel": 2,
        "merged": false
      },
      {
        "standX": 7,
        "standY": 2,
        "dir": "LEFT",
        "chipX": 6,
        "chipY": 2,
        "chipLevel": 2,
        "merged": false
      },
      {
        "standX": 4,
        "standY": 1,
        "dir": "DOWN",
        "chipX": 4,
        "chipY": 2,
        "chipLevel": 2,
        "merged": true
      }
    ]
  },
  {
    "id": 12,
    "chapter": 2,
    "chapterName": "Level.2：電路迴廊",
    "title": "十字交會 (Cross Intersection)",
    "subtitle": "兩顆 8086 微處理器在垂直中軸線上撞擊升級",
    "width": 9,
    "height": 9,
    "playerStart": {
      "x": 4,
      "y": 4
    },
    "targetLevel": 4,
    "parMoves": 1,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 4,
        "y": 2,
        "level": 3
      },
      {
        "x": 4,
        "y": 6,
        "level": 3
      }
    ],
    "hint": "走到 (4, 1)，直接向下推動 (4, 2)，直線撞擊 (4, 6) 升級為紫色 80387！",
    "solutionSteps": [
      {
        "standX": 4,
        "standY": 7,
        "dir": "UP",
        "chipX": 4,
        "chipY": 6,
        "chipLevel": 3,
        "merged": true
      }
    ]
  },
  {
    "id": 13,
    "chapter": 3,
    "chapterName": "Level.3：多階處理器",
    "title": "跨代合成 (Cross-Gen Fusion)",
    "subtitle": "梯級骨牌連鎖：兩顆 2 級合成 3 級，再與現存 3 級合成 4 級！",
    "width": 9,
    "height": 7,
    "playerStart": {
      "x": 1,
      "y": 1
    },
    "targetLevel": 4,
    "parMoves": 2,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 2,
        "y": 2,
        "level": 2
      },
      {
        "x": 6,
        "y": 2,
        "level": 2
      },
      {
        "x": 6,
        "y": 4,
        "level": 3
      }
    ],
    "hint": "走到 (1, 2) 向右推 (2, 2)，撞擊 (6, 2) 合成 Chip.3；再走到 (6, 1) 向下推，撞擊 (6, 4) 誕生 4 級！",
    "solutionSteps": [
      {
        "standX": 1,
        "standY": 2,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 2,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 1,
        "dir": "DOWN",
        "chipX": 6,
        "chipY": 2,
        "chipLevel": 3,
        "merged": true
      }
    ]
  },
  {
    "id": 14,
    "chapter": 3,
    "chapterName": "Level.3：多階處理器",
    "title": "對稱機房 (Symmetric Hub)",
    "subtitle": "對稱佈局中的多步對撞",
    "width": 9,
    "height": 8,
    "playerStart": {
      "x": 4,
      "y": 3
    },
    "targetLevel": 4,
    "parMoves": 3,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 2,
        "y": 3,
        "level": 2
      },
      {
        "x": 6,
        "y": 3,
        "level": 2
      },
      {
        "x": 2,
        "y": 4,
        "level": 2
      },
      {
        "x": 6,
        "y": 4,
        "level": 2
      }
    ],
    "hint": "左側縱向對撞合為 Chip.3，右側縱向對撞合為 Chip.3，最後水平對撞！",
    "solutionSteps": [
      {
        "standX": 6,
        "standY": 2,
        "dir": "DOWN",
        "chipX": 6,
        "chipY": 3,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 2,
        "standY": 2,
        "dir": "DOWN",
        "chipX": 2,
        "chipY": 3,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 1,
        "standY": 4,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 4,
        "chipLevel": 3,
        "merged": true
      }
    ]
  },
  {
    "id": 15,
    "chapter": 3,
    "chapterName": "Level.3：多階處理器",
    "title": "486 世代降臨 (486 DX2 Revolution)",
    "subtitle": "邁入 32 位元時代！合成出橘色 486 DX2 (Chip.5)",
    "width": 9,
    "height": 8,
    "playerStart": {
      "x": 1,
      "y": 1
    },
    "targetLevel": 5,
    "parMoves": 5,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 2,
        "y": 2,
        "level": 3
      },
      {
        "x": 6,
        "y": 2,
        "level": 3
      },
      {
        "x": 2,
        "y": 5,
        "level": 3
      },
      {
        "x": 6,
        "y": 5,
        "level": 3
      }
    ],
    "hint": "四枚金色的 8086 處理器！兩兩組裝成 80387，最後合體昇華為 486 DX2！",
    "solutionSteps": [
      {
        "standX": 2,
        "standY": 1,
        "dir": "DOWN",
        "chipX": 2,
        "chipY": 2,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 2,
        "standY": 4,
        "dir": "DOWN",
        "chipX": 2,
        "chipY": 5,
        "chipLevel": 4,
        "merged": false
      },
      {
        "standX": 6,
        "standY": 4,
        "dir": "DOWN",
        "chipX": 6,
        "chipY": 5,
        "chipLevel": 3,
        "merged": false
      },
      {
        "standX": 6,
        "standY": 1,
        "dir": "DOWN",
        "chipX": 6,
        "chipY": 2,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 6,
        "dir": "LEFT",
        "chipX": 6,
        "chipY": 6,
        "chipLevel": 4,
        "merged": true
      }
    ]
  },
  {
    "id": 16,
    "chapter": 3,
    "chapterName": "Level.3：多階處理器",
    "title": "窄口效應 (Chokepoint)",
    "subtitle": "穿過單格走廊，進行隔室升級",
    "width": 10,
    "height": 7,
    "playerStart": {
      "x": 1,
      "y": 3
    },
    "targetLevel": 4,
    "parMoves": 1,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 2,
        "y": 3,
        "level": 3
      },
      {
        "x": 7,
        "y": 3,
        "level": 3
      }
    ],
    "hint": "走到 (1, 3)，向右推動 (2, 3)，穿過門槽 (5, 3) 一路滑行撞擊右室 (7, 3) 完成升級！",
    "solutionSteps": [
      {
        "standX": 1,
        "standY": 3,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 3,
        "chipLevel": 3,
        "merged": true
      }
    ]
  },
  {
    "id": 17,
    "chapter": 3,
    "chapterName": "Level.3：多階處理器",
    "title": "階層金字塔 (The Hierarchy Pyramid)",
    "subtitle": "連續升階矩陣：兩顆 3 級合併為 4 級，再與現有 4 級合併為 5 級",
    "width": 9,
    "height": 7,
    "playerStart": {
      "x": 4,
      "y": 1
    },
    "targetLevel": 5,
    "parMoves": 3,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 2,
        "y": 2,
        "level": 3
      },
      {
        "x": 6,
        "y": 2,
        "level": 3
      },
      {
        "x": 4,
        "y": 5,
        "level": 4
      }
    ],
    "hint": "先將頂部兩顆 3 級晶片相撞合為 4 級，再向下推動撞擊底部的 4 級晶片，5 級 486 誕生！",
    "solutionSteps": [
      {
        "standX": 7,
        "standY": 2,
        "dir": "LEFT",
        "chipX": 6,
        "chipY": 2,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 2,
        "standY": 1,
        "dir": "DOWN",
        "chipX": 2,
        "chipY": 2,
        "chipLevel": 4,
        "merged": false
      },
      {
        "standX": 1,
        "standY": 5,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 5,
        "chipLevel": 4,
        "merged": true
      }
    ]
  },
  {
    "id": 18,
    "chapter": 3,
    "chapterName": "Level.3：多階處理器",
    "title": "環狀超頻 (Clock Loop)",
    "subtitle": "繞行中央控制台，將兩顆 4 級晶片送入對撞軌道",
    "width": 9,
    "height": 9,
    "playerStart": {
      "x": 1,
      "y": 4
    },
    "targetLevel": 5,
    "parMoves": 3,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 2,
        "y": 2,
        "level": 4
      },
      {
        "x": 6,
        "y": 6,
        "level": 4
      }
    ],
    "hint": "推動 (2, 2) 向右撞壁，推動 (6, 6) 向右撞壁，隨後在右側邊緣縱向相撞！",
    "solutionSteps": [
      {
        "standX": 1,
        "standY": 2,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 2,
        "chipLevel": 4,
        "merged": false
      },
      {
        "standX": 5,
        "standY": 6,
        "dir": "RIGHT",
        "chipX": 6,
        "chipY": 6,
        "chipLevel": 4,
        "merged": false
      },
      {
        "standX": 7,
        "standY": 7,
        "dir": "UP",
        "chipX": 7,
        "chipY": 6,
        "chipLevel": 4,
        "merged": true
      }
    ]
  },
  {
    "id": 19,
    "chapter": 4,
    "chapterName": "Level.4：超級電腦誕生",
    "title": "奔騰年代 (Pentium Dawn)",
    "subtitle": "四核協同處理器兩兩對撞，誕生紅色 Pentium MMX (Chip.6)",
    "width": 10,
    "height": 8,
    "playerStart": {
      "x": 1,
      "y": 1
    },
    "targetLevel": 6,
    "parMoves": 4,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 3,
        "y": 2,
        "level": 4
      },
      {
        "x": 6,
        "y": 2,
        "level": 4
      },
      {
        "x": 3,
        "y": 5,
        "level": 5
      }
    ],
    "hint": "先推 (3, 2) 向右撞擊 (6, 2) 升為 5 級，隨後兩顆 5 級在右側軌道相撞，誕生 Pentium MMX！",
    "solutionSteps": [
      {
        "standX": 2,
        "standY": 2,
        "dir": "RIGHT",
        "chipX": 3,
        "chipY": 2,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 2,
        "dir": "RIGHT",
        "chipX": 6,
        "chipY": 2,
        "chipLevel": 5,
        "merged": false
      },
      {
        "standX": 2,
        "standY": 5,
        "dir": "RIGHT",
        "chipX": 3,
        "chipY": 5,
        "chipLevel": 5,
        "merged": false
      },
      {
        "standX": 8,
        "standY": 6,
        "dir": "UP",
        "chipX": 8,
        "chipY": 5,
        "chipLevel": 5,
        "merged": true
      }
    ]
  },
  {
    "id": 20,
    "chapter": 4,
    "chapterName": "Level.4：超級電腦誕生",
    "title": "光子晶片 (Photonic Core)",
    "subtitle": "兩組高階晶片逐步推展，在精密立柱間合成出 Pentium (Chip.6)",
    "width": 9,
    "height": 8,
    "playerStart": {
      "x": 4,
      "y": 1
    },
    "targetLevel": 6,
    "parMoves": 2,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 2,
        "y": 2,
        "level": 5
      },
      {
        "x": 6,
        "y": 2,
        "level": 4
      },
      {
        "x": 6,
        "y": 5,
        "level": 4
      }
    ],
    "hint": "右側兩顆 80387 先縱向碰撞為 486 DX2，再與左側 486 對撞成就 Pentium！",
    "solutionSteps": [
      {
        "standX": 6,
        "standY": 6,
        "dir": "UP",
        "chipX": 6,
        "chipY": 5,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 2,
        "dir": "LEFT",
        "chipX": 6,
        "chipY": 2,
        "chipLevel": 5,
        "merged": true
      }
    ]
  },
  {
    "id": 21,
    "chapter": 4,
    "chapterName": "Level.4：超級電腦誕生",
    "title": "量子神經元 (Quantum Entanglement)",
    "subtitle": "兩顆 Pentium MMX 相互糾纏，突破物理限制誕生量子 QPU (Chip.7)",
    "width": 10,
    "height": 8,
    "playerStart": {
      "x": 4,
      "y": 4
    },
    "targetLevel": 7,
    "parMoves": 3,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 3,
        "y": 3,
        "level": 5
      },
      {
        "x": 6,
        "y": 3,
        "level": 5
      },
      {
        "x": 3,
        "y": 4,
        "level": 5
      },
      {
        "x": 6,
        "y": 4,
        "level": 5
      }
    ],
    "hint": "將這四顆 486 DX2 精準對撞，合成兩枚 Pentium，最後撞出水藍色量子 QPU！",
    "solutionSteps": [
      {
        "standX": 3,
        "standY": 5,
        "dir": "UP",
        "chipX": 3,
        "chipY": 4,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 5,
        "dir": "UP",
        "chipX": 6,
        "chipY": 4,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 3,
        "dir": "LEFT",
        "chipX": 6,
        "chipY": 3,
        "chipLevel": 6,
        "merged": true
      }
    ]
  },
  {
    "id": 22,
    "chapter": 4,
    "chapterName": "Level.4：超級電腦誕生",
    "title": "大腦風暴 (Brainstorm Nexus)",
    "subtitle": "在狹窄矩陣中調度，推升出量子晶片 QPU (Chip.7)",
    "width": 9,
    "height": 8,
    "playerStart": {
      "x": 1,
      "y": 1
    },
    "targetLevel": 7,
    "parMoves": 1,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 2,
        "y": 2,
        "level": 6
      },
      {
        "x": 6,
        "y": 2,
        "level": 6
      }
    ],
    "hint": "走到 (1, 2) 向右推動，兩顆 Pentium MMX 處理器對撞，量子 QPU 瞬間成型！",
    "solutionSteps": [
      {
        "standX": 1,
        "standY": 2,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 2,
        "chipLevel": 6,
        "merged": true
      }
    ]
  },
  {
    "id": 23,
    "chapter": 4,
    "chapterName": "Level.4：超級電腦誕生",
    "title": "超級電腦前夕 (Eve of Supercomputing)",
    "subtitle": "階梯連鎖：由 5 級、6 級一路推動合成至 7 級量子核心",
    "width": 10,
    "height": 8,
    "playerStart": {
      "x": 1,
      "y": 1
    },
    "targetLevel": 7,
    "parMoves": 2,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 2,
        "y": 2,
        "level": 5
      },
      {
        "x": 7,
        "y": 2,
        "level": 5
      },
      {
        "x": 7,
        "y": 5,
        "level": 6
      }
    ],
    "hint": "先在上方走廊將兩顆 486 撞為 Pentium，再垂直向下與另一枚 Pentium 融合！",
    "solutionSteps": [
      {
        "standX": 1,
        "standY": 2,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 2,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 1,
        "dir": "DOWN",
        "chipX": 7,
        "chipY": 2,
        "chipLevel": 6,
        "merged": true
      }
    ]
  },
  {
    "id": 24,
    "chapter": 4,
    "chapterName": "Level.4：超級電腦誕生",
    "title": "終極超級電腦！(The Grand Supercomputer)",
    "subtitle": "全劇終極殿堂：推動兩座量子核心，合成無上榮耀的超級電腦 (Chip.8)！",
    "width": 11,
    "height": 9,
    "playerStart": {
      "x": 5,
      "y": 4
    },
    "targetLevel": 8,
    "parMoves": 3,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 2,
        "y": 2,
        "level": 6
      },
      {
        "x": 8,
        "y": 2,
        "level": 6
      },
      {
        "x": 2,
        "y": 6,
        "level": 6
      },
      {
        "x": 8,
        "y": 6,
        "level": 6
      }
    ],
    "hint": "四座 Pentium MMX 巨塔！上下兩對分別對撞為量子 QPU，最後在中央通道相撞，超級電腦誕生！",
    "solutionSteps": [
      {
        "standX": 8,
        "standY": 7,
        "dir": "UP",
        "chipX": 8,
        "chipY": 6,
        "chipLevel": 6,
        "merged": true
      },
      {
        "standX": 2,
        "standY": 7,
        "dir": "UP",
        "chipX": 2,
        "chipY": 6,
        "chipLevel": 6,
        "merged": true
      },
      {
        "standX": 1,
        "standY": 2,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 2,
        "chipLevel": 7,
        "merged": true
      }
    ]
  }
];
