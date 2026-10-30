export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export interface Chip {
  id: string;
  x: number;
  y: number;
  level: number;
  isMerging?: boolean;
  noTransition?: boolean;
}

export type CellType = 'EMPTY' | 'WALL' | 'OBSTACLE';

export interface SolutionStep {
  standX: number;
  standY: number;
  dir: Direction;
  chipX: number;
  chipY: number;
  chipLevel: number;
  merged: boolean;
}

export interface LevelData {
  id: number;
  chapter: number;
  chapterName: string;
  title: string;
  subtitle: string;
  width: number;
  height: number;
  playerStart: Position;
  targetLevel: number;
  parMoves: number; // For 3-star rating
  grid: CellType[][]; // [y][x]
  chips: { x: number; y: number; level: number }[];
  hint?: string;
  solutionSteps?: SolutionStep[];
  wraparound?: boolean;
}

export interface GameSnapshot {
  playerPos: Position;
  playerDir: Direction;
  chips: Chip[];
  moves: number;
  actionDescription: string;
}

export interface ChipDefinition {
  level: number;
  name: string;
  shortName?: string;
  code: string;
  year: string;
  specs: string;
  desc: string;
  pins: number;
  color: string;
  borderColor: string;
  glowColor: string;
  bgGradient: string;
}

export type GameView = 'PLAYING' | 'LEVEL_SELECT' | 'ENCYCLOPEDIA' | 'EDITOR' | 'HELP';
