import React, { useMemo } from 'react';
import { CellType, Chip, Direction, Position } from '../types/game';
import { BoardThemeConfig, BOARD_THEMES } from '../types/theme';
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
  isKnockedOut?: boolean;
  isAmbientOn?: boolean;
  isWraparound?: boolean;
  isPlayerNoTransition?: boolean;
  theme?: BoardThemeConfig;
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
  isKnockedOut = false,
  isAmbientOn = true,
  isWraparound = false,
  isPlayerNoTransition = false,
  theme = BOARD_THEMES['Cyber Green'],
  chips,
  onTileClick,
  onPush,
}) => {
  // Check which chip Einstein is directly facing and can push
  const pushableChipsMap = useMemo(() => {
    const map = new Map<string, Direction[]>();

    // The push button should ONLY appear on the chip Einstein is truly facing
    const { dx, dy } = getDirectionDelta(playerDir);
    const frontX = isWraparound ? ((playerPos.x + dx) % width + width) % width : playerPos.x + dx;
    const frontY = isWraparound ? ((playerPos.y + dy) % height + height) % height : playerPos.y + dy;

    const frontChip = chips.find((c) => c.x === frontX && c.y === frontY);
    if (frontChip) {
      // Can Einstein push it in direction `playerDir`?
      const result = calculatePush(grid, chips, frontChip, playerDir, isWraparound);
      if (result.canPush) {
        map.set(frontChip.id, [playerDir]);
      }
    }

    return map;
  }, [chips, playerPos, playerDir, grid, isWraparound, width, height]);

  // Compute laser trajectory preview for the chip immediately in front of Einstein
  const laserTrajectory = useMemo(() => {
    const { dx, dy } = getDirectionDelta(playerDir);
    const frontX = isWraparound ? ((playerPos.x + dx) % width + width) % width : playerPos.x + dx;
    const frontY = isWraparound ? ((playerPos.y + dy) % height + height) % height : playerPos.y + dy;
    const frontChip = chips.find((c) => c.x === frontX && c.y === frontY);

    if (!frontChip) return null;
    const result = calculatePush(grid, chips, frontChip, playerDir, isWraparound);
    if (!result.canPush || !result.traveledPath || result.traveledPath.length < 2) return null;

    return {
      path: result.traveledPath,
      merged: result.merged,
    };
  }, [playerPos, playerDir, chips, grid, isWraparound, width, height]);

  return (
    <div
      className={`relative inline-block p-3 sm:p-5 rounded-none border-2 shadow-2xl overflow-hidden max-w-full transition-all duration-300 ${
        isWraparound
          ? `${theme.containerClass} ring-1 ring-cyan-500/50 shadow-[0_12px_40px_rgba(6,182,212,0.25)]`
          : theme.containerClass
      }`}
    >
      {/* Background Lab Grid Circuit Pattern */}
      <div
        className="absolute inset-0 [background-size:16px_16px] opacity-40 pointer-events-none transition-all duration-300"
        style={{
          backgroundImage: `radial-gradient(${theme.gridRadialDotColor} 1px, transparent 1px)`,
        }}
      />

      {/* Dynamic Background Atmosphere: Digital Dust & Flickering Circuit Pulses (Toggleable) */}
      {isAmbientOn && <LabAtmosphere theme={theme} />}

      {/* Wraparound continuous space edge portal boundary frame */}
      {isWraparound && (
        <div className="absolute inset-0 pointer-events-none rounded-none border border-dashed border-cyan-400/30 shadow-[inset_0_0_14px_rgba(34,211,238,0.10)] z-10" />
      )}



      {/* Grid Container */}
      <div
        className="relative grid select-none touch-manipulation mx-auto overflow-hidden rounded-none"
        style={{
          gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${height}, minmax(0, 1fr))`,
          width: `min(92vw, min(60vh, ${width * 52}px))`,
          height: `min(${92 * (height / width)}vw, min(${60 * (height / width)}vh, ${height * 52}px))`,
          maxWidth: `${width * 56}px`,
          maxHeight: `${height * 56}px`,
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
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-200 ${
                  isWall
                    ? theme.wallClass
                    : isObstacle
                    ? theme.obstacleClass
                    : theme.emptyTileClass
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
                    <div className="w-full h-1 bg-slate-700 rounded-none" />
                    <div className="w-full h-1 bg-slate-700 rounded-none" />
                  </div>
                )}

                {/* Empty Floor Decals (Coordinate markings) */}
                {!isWall && !isObstacle && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
                    <div className={`w-1 h-1 rounded-full ${theme.rivetClass}`} />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Laser Slide Trajectory Preview: Pink dots, half-size, sequentially lighting up forward */}
        {laserTrajectory && (
          <div className="absolute inset-0 pointer-events-none z-15">
            {laserTrajectory.path.slice(1).map((pt, idx) => {
              const isCollisionEnd =
                laserTrajectory.merged && idx === laserTrajectory.path.length - 2;

              return (
                <div
                  key={`laser-dot-${idx}`}
                  className={`absolute rounded-full animate-trajectory-flow ${
                    isCollisionEnd
                      ? 'w-2 h-2 bg-pink-200 shadow-[0_0_8px_rgba(244,114,182,1)] ring-1 ring-pink-300'
                      : 'w-1 h-1 bg-pink-300 shadow-[0_0_6px_rgba(244,114,182,0.9)]'
                  }`}
                  style={{
                    left: `${((pt.x + 0.5) / width) * 100}%`,
                    top: `${((pt.y + 0.5) / height) * 100}%`,
                    animationDelay: `${idx * 0.12}s`,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Chips Layer (Continuous subpixel sliding + portal clone rendering) */}
        {chips.map((chip) => {
          const pushableDirs = pushableChipsMap.get(chip.id) || [];
          const clones: { x: number; y: number }[] = [];
          const isDenseBoard = width >= 10 || height >= 10;

          if (isWraparound && chip.noTransition) {
            if (chip.x < 1.0) clones.push({ x: chip.x + width, y: chip.y });
            if (chip.x > width - 2.0) clones.push({ x: chip.x - width, y: chip.y });
            if (chip.y < 1.0) clones.push({ x: chip.x, y: chip.y + height });
            if (chip.y > height - 2.0) clones.push({ x: chip.x, y: chip.y - height });
          }

          const renderChipElement = (px: number, py: number, isClone: boolean) => (
            <div
              key={isClone ? `${chip.id}-clone` : chip.id}
              className={`absolute z-20 ${
                chip.noTransition
                  ? 'transition-none'
                  : 'transition-all duration-140 ease-out'
              }`}
              style={{
                width: `${100 / width}%`,
                height: `${100 / height}%`,
                left: `${(px / width) * 100}%`,
                top: `${(py / height) * 100}%`,
              }}
            >
              <ChipCard
                level={chip.level}
                isMerging={chip.isMerging}
                pushableDirections={isClone ? [] : pushableDirs}
                onDirectPush={isClone ? undefined : (d) => onPush(d)}
                numberOnly={isDenseBoard}
              />
            </div>
          );

          return (
            <React.Fragment key={chip.id}>
              {renderChipElement(chip.x, chip.y, false)}
              {clones.map((c, i) => renderChipElement(c.x, c.y, true))}
            </React.Fragment>
          );
        })}

        {/* Einstein Scientist Sprite Layer */}
        <div
          className={`absolute z-25 pointer-events-none ${
            isPlayerNoTransition
              ? 'transition-none'
              : 'transition-all duration-120 ease-out'
          }`}
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
            isKnockedOut={isKnockedOut}
          />
        </div>
      </div>
    </div>
  );
};
