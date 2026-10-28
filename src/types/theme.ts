export type BoardThemeId = 'Classic Amber' | 'IBM Blue' | 'Cyber Green';

export interface BoardThemeConfig {
  id: BoardThemeId;
  name: string;
  badgeLabel: string;
  description: string;
  previewColor: string;
  accentTextColor: string;
  
  // Tailwind injected classes
  containerClass: string;
  wallClass: string;
  obstacleClass: string;
  emptyTileClass: string;
  rivetClass: string;
  gridRadialDotColor: string;
  decalTextClass: string;
  laserDotClass: string;

  // Atmosphere particle & circuit colors
  particleColors: string[];
  circuitLineColor1: string;
  circuitLineColor2: string;
}

export const BOARD_THEMES: Record<BoardThemeId, BoardThemeConfig> = {
  'Cyber Green': {
    id: 'Cyber Green',
    name: '賽博霓光綠 (Cyber Green)',
    badgeLabel: 'Cyber Green',
    description: '經典駭客矩陣與綠色磷光 CRT 終端機色調',
    previewColor: '#10b981',
    accentTextColor: 'text-emerald-400',
    containerClass: 'bg-slate-900 border-emerald-700/70 shadow-[0_12px_35px_rgba(16,185,129,0.18)]',
    wallClass: 'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border border-slate-600/60 shadow-inner',
    obstacleClass: 'bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-600/60',
    emptyTileClass: 'bg-slate-950/70 border border-slate-800/60 hover:bg-emerald-950/20',
    rivetClass: 'bg-emerald-500/30',
    gridRadialDotColor: '#064e3b',
    decalTextClass: 'text-emerald-500/70',
    laserDotClass: 'bg-emerald-400/80 shadow-[0_0_8px_#34d399]',
    particleColors: ['#34d399', '#10b981', '#38bdf8'],
    circuitLineColor1: '#34d399',
    circuitLineColor2: '#059669',
  },
  'Classic Amber': {
    id: 'Classic Amber',
    name: '經典琥珀金 (Classic Amber)',
    badgeLabel: 'Classic Amber',
    description: '70~80 年代主機與琥珀單色磷光螢幕風格',
    previewColor: '#f59e0b',
    accentTextColor: 'text-amber-400',
    containerClass: 'bg-[#140e06] border-amber-600/70 shadow-[0_12px_35px_rgba(245,158,11,0.2)]',
    wallClass: 'bg-gradient-to-b from-amber-950/90 via-[#261708] to-[#120a03] border border-amber-700/60 shadow-inner',
    obstacleClass: 'bg-gradient-to-br from-amber-950 to-stone-900 border border-amber-500/70',
    emptyTileClass: 'bg-[#1a1207]/80 border border-amber-900/40 hover:bg-amber-950/30',
    rivetClass: 'bg-amber-500/30',
    gridRadialDotColor: '#78350f',
    decalTextClass: 'text-amber-500/75',
    laserDotClass: 'bg-amber-400/85 shadow-[0_0_8px_#fbbf24]',
    particleColors: ['#fbbf24', '#f59e0b', '#d97706'],
    circuitLineColor1: '#fbbf24',
    circuitLineColor2: '#d97706',
  },
  'IBM Blue': {
    id: 'IBM Blue',
    name: 'IBM 傳奇藍 (IBM Blue)',
    badgeLabel: 'IBM Blue',
    description: '經典 MS-DOS / Norton Commander 與 IBM PC 5150 色彩',
    previewColor: '#3b82f6',
    accentTextColor: 'text-blue-400',
    containerClass: 'bg-[#081022] border-blue-600/70 shadow-[0_12px_35px_rgba(59,130,246,0.2)]',
    wallClass: 'bg-gradient-to-b from-slate-800 via-blue-950 to-[#070e1e] border border-blue-600/60 shadow-inner',
    obstacleClass: 'bg-gradient-to-br from-blue-950 to-indigo-950 border border-blue-500/70',
    emptyTileClass: 'bg-[#0b152d]/80 border border-blue-900/40 hover:bg-blue-950/30',
    rivetClass: 'bg-blue-400/30',
    gridRadialDotColor: '#1e3a8a',
    decalTextClass: 'text-blue-400/75',
    laserDotClass: 'bg-sky-400/85 shadow-[0_0_8px_#38bdf8]',
    particleColors: ['#60a5fa', '#38bdf8', '#93c5fd'],
    circuitLineColor1: '#38bdf8',
    circuitLineColor2: '#2563eb',
  },
};

export const DEFAULT_THEME_ID: BoardThemeId = 'Cyber Green';

export const THEME_CYCLE_ORDER: BoardThemeId[] = [
  'Cyber Green',
  'Classic Amber',
  'IBM Blue',
];
