import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Trophy } from "lucide-react";

import {
  type SnakeState,
  type Direction,
  GRID_SIZE,
  createInitialState,
  changeDirection,
  tick,
} from "@/lib/game-snake";

function getCellSize(): number {
  if (typeof window === "undefined") return 20;
  const vw = window.innerWidth;
  if (vw < 380) return 16;
  if (vw < 480) return 18;
  if (vw < 640) return 20;
  return 22;
}

function getGap(): number {
  if (typeof window === "undefined") return 1.5;
  const vw = window.innerWidth;
  if (vw < 380) return 1;
  if (vw < 480) return 1;
  return 1.5;
}

const FOOD_COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
];

export default function GameSnake() {
  const [state, setState] = useState<SnakeState>(createInitialState);
  const [bestScore, setBestScore] = useState(() => {
    try {
      return Number(localStorage.getItem("snake-best")) || 0;
    } catch {
      return 0;
    }
  });
  const [cellSize, setCellSize] = useState(20);
  const [gap, setGap] = useState(1.5);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const update = () => {
      setCellSize(getCellSize());
      setGap(getGap());
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setState((prev) => {
        const next = tick(prev);
        return next;
      });
    }, 130);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Track best score
  useEffect(() => {
    if (state.score > bestScore) {
      setBestScore(state.score);
      try {
        localStorage.setItem("snake-best", String(state.score));
      } catch {}
    }
  }, [state.score, bestScore]);

  const handleDirection = useCallback((dir: Direction) => {
    setState((prev) => changeDirection(prev, dir));
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const keyMap: Record<string, Direction> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };
      const dir = keyMap[e.key];
      if (dir) {
        e.preventDefault();
        handleDirection(dir);
      }
      if (e.key === "r" || e.key === "R") {
        resetGame();
      }
    },
    [handleDirection],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Touch handling for swipe
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
      handleDirection(dx > 0 ? "right" : "left");
    } else {
      handleDirection(dy > 0 ? "down" : "up");
    }
    touchStartRef.current = null;
  };

  function resetGame() {
    setState(createInitialState());
  }

  const boardSize = cellSize * GRID_SIZE + gap * (GRID_SIZE + 1);
  const foodColor = FOOD_COLORS[state.food.value === 10 ? 0 : state.food.value % FOOD_COLORS.length];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-6 text-center md:text-left">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          贪吃<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">蛇</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          吃食物，变长，别撞墙 · <kbd className="rounded border bg-muted px-1.5 py-0.5 text-xs">←↑↓→</kbd> 方向键 / 滑动手势
        </p>
      </div>

      {/* Score & Controls */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-4 md:justify-start">
        <div className="flex gap-3">
          <div className="rounded-lg bg-muted px-4 py-2 text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              分数
            </div>
            <div className="text-xl font-bold tabular-nums">{state.score}</div>
          </div>
          <div className="rounded-lg bg-muted px-4 py-2 text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              最高分
            </div>
            <div className="text-xl font-bold tabular-nums">{bestScore}</div>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <RotateCcw className="size-3.5" />
          新游戏
        </button>
      </div>

      {/* Game Board */}
      <div className="flex justify-center">
        <div
          className="relative rounded-xl bg-[#1a1a2e] shadow-lg"
          style={{ width: boardSize, height: boardSize }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 grid"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${cellSize}px)`,
              gap,
              padding: gap,
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
              <div
                key={i}
                className="rounded-sm bg-[#16213e]/60"
                style={{ width: cellSize, height: cellSize }}
              />
            ))}
          </div>

          {/* Food */}
          {!state.gameOver && (
            <motion.div
              key={`food-${state.food.x}-${state.food.y}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className={`absolute rounded-full shadow-sm ${foodColor}`}
              style={{
                width: cellSize - 2,
                height: cellSize - 2,
                left: gap + state.food.x * (cellSize + gap) + 1,
                top: gap + state.food.y * (cellSize + gap) + 1,
                zIndex: 5,
              }}
            />
          )}

          {/* Snake body */}
          <AnimatePresence>
            {state.body.map((seg, idx) => {
              const isHead = idx === 0;
              const size = isHead ? cellSize - 2 : cellSize - 3;
              return (
                <motion.div
                  key={`snake-${state.gameOver ? "over-" : ""}${idx}`}
                  initial={false}
                  animate={{
                    left: gap + seg.x * (cellSize + gap) + (cellSize - size) / 2,
                    top: gap + seg.y * (cellSize + gap) + (cellSize - size) / 2,
                    scale: 1,
                    opacity: state.gameOver ? 0.6 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    mass: 0.5,
                  }}
                  className={`absolute rounded-md shadow-sm ${
                    isHead
                      ? "bg-emerald-400 z-10"
                      : "bg-emerald-500/80 z-5"
                  }`}
                  style={{ width: size, height: size }}
                />
              );
            })}
          </AnimatePresence>

          {/* Game Over Overlay */}
          <AnimatePresence>
            {state.gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-[#1a1a2e]/90 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Trophy className="size-10 text-yellow-500" />
                  <span className="text-2xl font-bold text-white">
                    游戏结束
                  </span>
                  <span className="text-sm text-white/70">
                    得分：{state.score}
                  </span>
                  <span className="text-xs text-white/50">
                    蛇长：{state.body.length}
                  </span>
                  <button
                    onClick={resetGame}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#1a1a2e] transition-colors hover:bg-white/90"
                  >
                    再来一局
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile controls */}
      <div className="mt-6 flex justify-center md:hidden">
        <div className="grid grid-cols-3 gap-2">
          <div />
          <button
            onTouchStart={(e) => { e.preventDefault(); handleDirection("up"); }}
            className="flex size-12 items-center justify-center rounded-xl border border-border bg-background transition-colors active:bg-muted"
          >
            <ArrowUp className="size-5" />
          </button>
          <div />
          <button
            onTouchStart={(e) => { e.preventDefault(); handleDirection("left"); }}
            className="flex size-12 items-center justify-center rounded-xl border border-border bg-background transition-colors active:bg-muted"
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); handleDirection("down"); }}
            className="flex size-12 items-center justify-center rounded-xl border border-border bg-background transition-colors active:bg-muted"
          >
            <ArrowDown className="size-5" />
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); handleDirection("right"); }}
            className="flex size-12 items-center justify-center rounded-xl border border-border bg-background transition-colors active:bg-muted"
          >
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>

      {/* Rules */}
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p className="leading-relaxed">
          滑动或按方向键控制蛇移动。吃食物会变长，撞墙或撞到自己则游戏结束。<br />
          <strong className="text-foreground">贪吃是动力，克制是智慧</strong> —— 蛇的哲学。
        </p>
      </div>
    </div>
  );
}
