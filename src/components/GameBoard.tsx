import React, { useMemo } from 'react';
import { CellType, Chip, Direction, Position } from '../types/game';
import { EinsteinSprite } from './EinsteinSprite';
import { ChipCard } from './ChipCard';
import { LabAtmosphere } from './LabAtmosphere';
import { calculatePush, getDirectionDelta } from '../utils/gameLogic';

interface GameBoardProps {
  grid: CellType[][];
  width: number;
  height: number;
  playerPos: Position;
  playerDir: Direction;
  isPushing: boolean;
  isWalking: boolean;
  isVictory: boolean;
  isAmbientOn?: boolean;
  chips: Chip[];
  onTileClick: (x: number, y: number) => void;
  onPush: (dir: Direction) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  width,
  height,
  playerPos,
  playerDir,
  isPushing,
  isWalking,
  isVictory,
  isAmbientOn = true,
  chips,
  onTileClick,
  onPush,
}) => {
  // Check which chips are adjacent to Einstein and in what direction they can be pushed
  const pushableChipsMap = useMemo(() => {
    const map = new Map<string, Direction[]>();
    const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

    dirs.forEach((d) => {
      const { dx, dy } = getDirectionDelta(d);
      const adjX = playerPos.x + dx;
      const adjY = playerPos.y + dy;

      const chip = chips.find((c) => c.x === adjX && c.y === adjY);
      if (chip) {
        // Can Einstein push it in direction `d`?
        const result = calculatePush(grid, chips, chip, d);
        if (result.canPush) {
          const list = map.get(chip.id) || [];
          list.push(d);
          map.set(chip.id, list);
        }
      }
    });

    return map;
  }, [chips, playerPos, grid]);

  // Compute laser trajectory preview for the chip immediately in front of Einstein
  const laserTrajectory = useMemo(() => {
    const { dx, dy } = getDirectionDelta(playerDir);
    const frontX = playerPos.x + dx;
    const frontY = playerPos.y + dy;
    const frontChip = chips.find((c) => c.x === frontX && c.y === frontY);

    if (!frontChip) return null;
    const result = calculatePush(grid, chips, frontChip, playerDir);
    if (!result.canPush || !result.traveledPath || result.traveledPath.length < 2) return null;

    return {
      path: result.traveledPath,
      merged: result.merged,
    };
  }, [playerPos, playerDir, chips, grid]);

  return (
    <div className="relative inline-block p-3 sm:p-5 rounded-2xl bg-slate-900 border-2 border-slate-700/80 shadow-2xl overflow-hidden max-w-full">
      {/* Background Lab Grid Circuit Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      {/* Dynamic Background Atmosphere: Digital Dust & Flickering Circuit Pulses (Toggleable) */}
      {isAmbientOn && <LabAtmosphere />}

      {/* Outer Lab Frame Decal */}
      <div className="absolute top-1 left-2 text-[9px] font-mono text-emerald-500/60 uppercase tracking-widest pointer-events-none">
        LAB MATRIX // SECTOR-VGA
      </div>
      <div className="absolute top-1 right-2 text-[9px] font-mono text-slate-500 pointer-events-none">
        DIM: {width}×{height}
      </div>

      {/* Grid Container */}
      <div
        className="relative grid select-none touch-manipulation mx-auto"
        style={{
          gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${height}, minmax(0, 1fr))`,
          width: `min(90vw, ${width * 56}px)`,
          height: `min(${90 * (height / width)}vw, ${height * 56}px)`,
          maxWidth: `${width * 60}px`,
          maxHeight: `${height * 60}px`,
        }}
      >
        {/* Tiles Rendering */}
        {grid.map((row, y) =>
          row.map((cell, x) => {
            const isWall = cell === 'WALL';
            const isObstacle = cell === 'OBSTACLE';
            const isPlayerHere = playerPos.x === x && playerPos.y === y;

            return (
              <div
                key={`tile-${x}-${y}`}
                onClick={() => onTileClick(x, y)}
                className={`relative flex items-center justify-center cursor-pointer transition-colors ${
                  isWall
                    ? 'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border border-slate-600/60 shadow-inner'
                    : isObstacle
                    ? 'bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-700/60'
                    : 'bg-slate-950/70 border border-slate-800/60 hover:bg-slate-800/40'
                }`}
              >
                {/* Wall Details */}
                {isWall && (
                  <div className="w-full h-full flex flex-col items-center justify-center p-1 opacity-70">
                    <div className="w-full h-0.5 bg-slate-500/40 mb-auto" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400/40 shadow-xs" />
                    <div className="w-full h-0.5 bg-slate-950/60 mt-auto" />
                  </div>
                )}

                {/* Obstacle (Server Rack / Terminal) */}
                {isObstacle && (
                  <div className="w-full h-full flex flex-col items-center justify-between p-1.5 opacity-90">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    </div>
                    <div className="w-full h-1 bg-slate-700 rounded-sm" />
                    <div className="w-full h-1 bg-slate-700 rounded-sm" />
                  </div>
                )}

                {/* Empty Floor Decals (Coordinate markings) */}
                {!isWall && !isObstacle && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
                    <div className="w-1 h-1 rounded-full bg-slate-400" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Laser Slide Trajectory Preview */}
        {laserTrajectory && (
          <div className="absolute inset-0 pointer-events-none z-15">
            {laserTrajectory.path.slice(1).map((pt, idx) => (
              <div
                key={`laser-dot-${idx}`}
                className={`absolute rounded-full -translate-x-1/2 -translate-y-1/2 ${
                  laserTrajectory.merged && idx === laserTrajectory.path.length - 2
                    ? 'w-4 h-4 bg-amber-400/80 animate-ping'
                    : 'w-2 h-2 bg-emerald-400/70 shadow-[0_0_8px_#34d399]'
                }`}
                style={{
                  left: `${((pt.x + 0.5) / width) * 100}%`,
                  top: `${((pt.y + 0.5) / height) * 100}%`,
                }}
              />
            ))}
          </div>
        )}

        {/* Chips Layer (Smooth CSS translation) */}
        {chips.map((chip) => {
          const pushableDirs = pushableChipsMap.get(chip.id) || [];

          return (
            <div
              key={chip.id}
              className="absolute transition-all duration-150 ease-out z-20"
              style={{
                width: `${100 / width}%`,
                height: `${100 / height}%`,
                left: `${(chip.x / width) * 100}%`,
                top: `${(chip.y / height) * 100}%`,
              }}
            >
              <ChipCard
                level={chip.level}
                isMerging={chip.isMerging}
                pushableDirections={pushableDirs}
                onDirectPush={(d) => onPush(d)}
              />
            </div>
          );
        })}

        {/* Einstein Scientist Sprite Layer */}
        <div
          className="absolute transition-all duration-120 ease-out z-25 pointer-events-none"
          style={{
            width: `${100 / width}%`,
            height: `${100 / height}%`,
            left: `${(playerPos.x / width) * 100}%`,
            top: `${(playerPos.y / height) * 100}%`,
          }}
        >
          <EinsteinSprite
            direction={playerDir}
            isPushing={isPushing}
            isWalking={isWalking}
            isVictory={isVictory}
          />
        </div>
      </div>
    </div>
  );
};
