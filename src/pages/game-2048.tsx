import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Trophy,
  ArrowLeft as ArrowBack,
  Gamepad2,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  type Grid,
  type Direction,
  initGrid,
  moveGrid,
  addRandomTile,
  canMove,
  hasWon,
} from "@/lib/game-2048";

const TILE_COLORS: Record<number, { bg: string; text: string; shadow: string }> = {
  0: { bg: "bg-[#cdc1b4]/30", text: "text-transparent", shadow: "" },
  2: { bg: "bg-[#eee4da]", text: "text-[#776e65]", shadow: "shadow-amber-100/50" },
  4: { bg: "bg-[#ede0c8]", text: "text-[#776e65]", shadow: "shadow-amber-200/50" },
  8: { bg: "bg-[#f2b179]", text: "text-white", shadow: "shadow-orange-300/50" },
  16: { bg: "bg-[#f59563]", text: "text-white", shadow: "shadow-orange-400/50" },
  32: { bg: "bg-[#f67c5f]", text: "text-white", shadow: "shadow-orange-500/50" },
  64: { bg: "bg-[#f65e3b]", text: "text-white", shadow: "shadow-red-400/50" },
  128: { bg: "bg-[#edcf72]", text: "text-white", shadow: "shadow-yellow-400/50" },
  256: { bg: "bg-[#edcc61]", text: "text-white", shadow: "shadow-yellow-400/50" },
  512: { bg: "bg-[#edc850]", text: "text-white", shadow: "shadow-yellow-500/50" },
  1024: { bg: "bg-[#edc53f]", text: "text-white", shadow: "shadow-yellow-500/50" },
  2048: { bg: "bg-[#edc22e]", text: "text-white", shadow: "shadow-amber-500/50" },
  4096: { bg: "bg-[#3c3a32]", text: "text-white", shadow: "shadow-gray-600/50" },
  8192: { bg: "bg-[#3c3a32]", text: "text-white", shadow: "shadow-gray-600/50" },
};

function getTileSize(): number {
  if (typeof window === "undefined") return 100;
  const vw = window.innerWidth;
  if (vw < 380) return 60;
  if (vw < 480) return 72;
  if (vw < 640) return 82;
  return 100;
}

function getGap(): number {
  if (typeof window === "undefined") return 8;
  const vw = window.innerWidth;
  if (vw < 380) return 5;
  if (vw < 480) return 6;
  if (vw < 640) return 7;
  return 8;
}

interface TileData {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
}

let tileIdCounter = 0;
function nextTileId() {
  return ++tileIdCounter;
}

function gridToTiles(grid: Grid): TileData[] {
  const tiles: TileData[] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] !== 0) {
        tiles.push({
          id: nextTileId(),
          value: grid[r][c],
          row: r,
          col: c,
        });
      }
    }
  }
  return tiles;
}

function Tile({ tile, cellSize, gap }: { tile: TileData; cellSize: number; gap: number }) {
  const color = TILE_COLORS[tile.value] ?? TILE_COLORS[4096];
  const cellTotal = cellSize + gap;
  const fontSize =
    tile.value >= 1000 ? "text-lg" : tile.value >= 100 ? "text-xl" : "text-2xl";

  return (
    <motion.div
      initial={
        tile.isNew
          ? { scale: 0, opacity: 0 }
          : tile.isMerged
            ? { scale: 1.25, opacity: 0.8 }
            : { scale: 0.95, opacity: 0.8 }
      }
      animate={{
        x: tile.col * cellTotal,
        y: tile.row * cellTotal,
        scale: tile.isMerged ? [1.25, 1] : 1,
        opacity: 1,
      }}
      transition={{
        x: { type: "spring", stiffness: 260, damping: 25, mass: 0.7 },
        y: { type: "spring", stiffness: 260, damping: 25, mass: 0.7 },
        scale: tile.isMerged
          ? { duration: 0.2, ease: "easeOut" }
          : tile.isNew
            ? { type: "spring", stiffness: 400, damping: 18 }
            : { duration: 0.15 },
        opacity: { duration: 0.12 },
      }}
      className={`absolute flex items-center justify-center rounded-lg font-bold drop-shadow-sm select-none ${color.bg} ${color.text} ${fontSize} ${color.shadow}`}
      style={{
        width: cellSize,
        height: cellSize,
        zIndex: tile.isMerged ? 2 : 1,
      }}
    >
      {tile.value !== 0 && tile.value}
    </motion.div>
  );
}

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};

export default function Game2048() {
  const [grid, setGrid] = useState<Grid>(initGrid);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    try {
      return Number(localStorage.getItem("game2048-best")) || 0;
    } catch {
      return 0;
    }
  });
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [tiles, setTiles] = useState<TileData[]>(() => gridToTiles(initGrid()));
  const [keepPlaying, setKeepPlaying] = useState(false);
  const [cellSize, setCellSize] = useState(100);
  const [gap, setGap] = useState(8);
  const prevGridRef = useRef<Grid>(grid);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      setCellSize(getTileSize());
      setGap(getGap());
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleMove = useCallback(
    (dir: Direction) => {
      if (gameOver || (won && !keepPlaying)) return;

      const { grid: newGrid, score: addScore, moved } = moveGrid(grid, dir);
      if (!moved) return;

      const withSpawn = addRandomTile(newGrid);
      const newScore = score + addScore;

      setGrid(withSpawn);
      setScore(newScore);
      prevGridRef.current = grid;

      if (addScore > 0 && newScore > bestScore) {
        setBestScore(newScore);
        try {
          localStorage.setItem("game2048-best", String(newScore));
        } catch {}
      }

      const tileData = gridToTiles(withSpawn);
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          if (grid[r][c] !== 0 && withSpawn[r][c] === grid[r][c] * 2) {
            const t = tileData.find(
              (td) => td.row === r && td.col === c && td.value === grid[r][c] * 2,
            );
            if (t) t.isMerged = true;
          }
          if (grid[r][c] === 0 && withSpawn[r][c] !== 0) {
            const t = tileData.find(
              (td) => td.row === r && td.col === c && td.value === withSpawn[r][c],
            );
            if (t && (withSpawn[r][c] === 2 || withSpawn[r][c] === 4)) {
              let isSpawn = false;
              if (dir === "left" || dir === "right") {
                const srcCol = dir === "left" ? c - 1 : c + 1;
                if (srcCol < 0 || srcCol >= 4 || grid[r][srcCol] !== withSpawn[r][c]) {
                  isSpawn = true;
                }
              } else {
                const srcRow = dir === "up" ? r - 1 : r + 1;
                if (srcRow < 0 || srcRow >= 4 || grid[srcRow][c] !== withSpawn[r][c]) {
                  isSpawn = true;
                }
              }
              if (isSpawn) t.isNew = true;
            }
          }
        }
      }
      setTiles(tileData);

      if (!hasWon(withSpawn) && !canMove(withSpawn)) {
        setGameOver(true);
      }
      if (hasWon(withSpawn) && !keepPlaying) {
        setWon(true);
      }
    },
    [grid, score, bestScore, gameOver, won, keepPlaying],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const dir = KEY_MAP[e.key];
      if (dir) {
        e.preventDefault();
        handleMove(dir);
      }
      if (e.key === "r" || e.key === "R") {
        resetGame();
      }
    },
    [handleMove],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) < 30) return;

    if (absDx > absDy) {
      handleMove(dx > 0 ? "right" : "left");
    } else {
      handleMove(dy > 0 ? "down" : "up");
    }
    touchStartRef.current = null;
  };

  function resetGame() {
    const newGrid = initGrid();
    setGrid(newGrid);
    setTiles(gridToTiles(newGrid));
    setScore(0);
    setGameOver(false);
    setWon(false);
    setKeepPlaying(false);
    prevGridRef.current = newGrid;
    tileIdCounter = 0;
  }

  function continueGame() {
    setKeepPlaying(true);
    setWon(false);
  }

  const cellTotal = cellSize + gap;
  const boardSize = cellTotal * 4 + gap;

  return (
    <div className="relative min-h-screen">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-[600px] rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 size-[500px] rounded-full bg-orange-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6 md:py-10">
        {/* Back to games */}
        <Link
          to="/game"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowBack className="size-3.5" />
          <Gamepad2 className="size-3" />
          <span>返回游戏列表</span>
        </Link>

        {/* Header */}
        <div className="mb-6 text-center md:text-left">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            秩序<span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">合成</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            合并数字，创造秩序 · <kbd className="rounded border bg-muted px-1.5 py-0.5 text-xs">←↑↓→</kbd> 方向键 / 滑动手势
          </p>
        </div>

        {/* Score & Controls */}
        <div className="mb-5 flex flex-wrap items-center justify-center gap-4 md:justify-start">
          <div className="flex gap-3">
            <div className="rounded-xl border border-border/50 bg-gradient-to-b from-background to-muted/30 px-4 py-2 text-center shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                分数
              </div>
              <motion.div
                key={score}
                initial={{ scale: 1.3, color: "#f59e0b" }}
                animate={{ scale: 1, color: "inherit" }}
                transition={{ duration: 0.3 }}
                className="text-xl font-bold tabular-nums"
              >
                {score}
              </motion.div>
            </div>
            <div className="rounded-xl border border-border/50 bg-gradient-to-b from-background to-muted/30 px-4 py-2 text-center shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                最高分
              </div>
              <div className="text-xl font-bold tabular-nums">{bestScore}</div>
            </div>
          </div>

          <button
            onClick={resetGame}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-gradient-to-b from-background to-muted/30 px-4 py-2 text-sm font-medium shadow-sm transition-all hover:bg-muted hover:shadow-md active:scale-95"
          >
            <RotateCcw className="size-3.5" />
            新游戏
          </button>
        </div>

        {/* Game Board */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div
              ref={containerRef}
              className="relative rounded-2xl bg-gradient-to-br from-[#bbada0] to-[#a39485] shadow-xl"
              style={{ width: boardSize, height: boardSize }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Background cells */}
              <div
                className="absolute inset-0 grid p-0"
                style={{
                  gridTemplateColumns: `repeat(4, ${cellSize}px)`,
                  gridTemplateRows: `repeat(4, ${cellSize}px)`,
                  gap,
                  padding: gap,
                }}
              >
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-[#cdc1b4]/40 shadow-inner"
                    style={{ width: cellSize, height: cellSize }}
                  />
                ))}
              </div>

              {/* Animated tiles */}
              <AnimatePresence mode="popLayout">
                {tiles.map((tile) => (
                  <Tile key={tile.id} tile={tile} cellSize={cellSize} gap={gap} />
                ))}
              </AnimatePresence>

              {/* Overlay */}
              <AnimatePresence>
                {(gameOver || (won && !keepPlaying)) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-[#bbada0]/90 backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ scale: 0.8, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                      className="flex flex-col items-center gap-4"
                    >
                      {won ? (
                        <>
                          <motion.div
                            initial={{ rotate: -20, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <Trophy className="size-12 text-yellow-500 drop-shadow-lg" />
                          </motion.div>
                          <span className="text-2xl font-bold text-white drop-shadow">
                            你赢了！🎉
                          </span>
                          <div className="flex gap-3">
                            <button
                              onClick={continueGame}
                              className="rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/30 active:scale-95"
                            >
                              继续挑战
                            </button>
                            <button
                              onClick={resetGame}
                              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#776e65] shadow-md transition-all hover:bg-white/90 active:scale-95"
                            >
                              再来一局
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-2xl font-bold text-white drop-shadow">
                            游戏结束
                          </span>
                          <span className="text-sm text-white/80">
                            得分：{score}
                          </span>
                          <button
                            onClick={resetGame}
                            className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#776e65] shadow-md transition-all hover:bg-white/90 active:scale-95"
                          >
                            再来一局
                          </button>
                        </>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Mobile buttons */}
        <div className="mt-6 flex justify-center md:hidden">
          <div className="grid grid-cols-3 gap-2">
            <div />
            <button
              onTouchStart={(e) => { e.preventDefault(); handleMove("up"); }}
              className="flex size-13 items-center justify-center rounded-xl border border-border bg-gradient-to-b from-background to-muted/30 shadow-sm transition-all active:scale-90 active:bg-muted"
            >
              <ArrowUp className="size-5" />
            </button>
            <div />
            <button
              onTouchStart={(e) => { e.preventDefault(); handleMove("left"); }}
              className="flex size-13 items-center justify-center rounded-xl border border-border bg-gradient-to-b from-background to-muted/30 shadow-sm transition-all active:scale-90 active:bg-muted"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              onTouchStart={(e) => { e.preventDefault(); handleMove("down"); }}
              className="flex size-13 items-center justify-center rounded-xl border border-border bg-gradient-to-b from-background to-muted/30 shadow-sm transition-all active:scale-90 active:bg-muted"
            >
              <ArrowDown className="size-5" />
            </button>
            <button
              onTouchStart={(e) => { e.preventDefault(); handleMove("right"); }}
              className="flex size-13 items-center justify-center rounded-xl border border-border bg-gradient-to-b from-background to-muted/30 shadow-sm transition-all active:scale-90 active:bg-muted"
            >
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>

        {/* Rules */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p className="leading-relaxed">
            用方向键移动所有方块。相同数字相遇会合并，最终合成 <strong className="text-foreground">2048</strong>。
            <br />
            每一次移动都是秩序的建立 —— 从混沌中创造有序。
          </p>
        </div>
      </div>
    </div>
  );
}
