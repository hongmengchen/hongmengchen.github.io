import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Trophy,
  Users,
  Cpu,
  ArrowLeft as ArrowBack,
  Gamepad2,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  type GomokuState,
  type Player,
  BOARD_SIZE,
  createInitialState,
  makeMove,
  getAIMove,
} from "@/lib/game-gomoku";

type GameMode = "pvp" | "pve";
type Difficulty = "easy" | "medium" | "hard";

const PLAYER_NAMES: Record<Player, string> = { 1: "黑棋", 2: "白棋" };

const CELL_SIZE = 32;
const GAP = 2;
const BOARD_PX = CELL_SIZE * (BOARD_SIZE - 1) + GAP * 2;
const PADDING = GAP + 16;
const BOARD_VISUAL = BOARD_PX + PADDING * 2;

export default function GameGomoku() {
  const [gameState, setGameState] = useState<GomokuState>(createInitialState);
  const [gameMode, setGameMode] = useState<GameMode>("pve");
  const [difficulty] = useState<Difficulty>("medium");
  const [aiThinking, setAiThinking] = useState(false);
  const [hoverPos, setHoverPos] = useState<[number, number] | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [stats, setStats] = useState<Record<string, number>>(() => {
    try {
      const s = localStorage.getItem("gomoku-stats");
      return s ? JSON.parse(s) : { black: 0, white: 0, draw: 0 };
    } catch {
      return { black: 0, white: 0, draw: 0 };
    }
  });
  const trackedWinnerRef = useRef<string | null>(null);

  // AI move
  useEffect(() => {
    if (
      gameMode === "pve" &&
      gameState.currentPlayer === 2 &&
      !gameState.winner &&
      !aiThinking
    ) {
      setAiThinking(true);
      const delay = 80; // Tiny delay for visual feedback only (AI is instant)
      aiTimeoutRef.current = setTimeout(() => {
        const move = getAIMove(gameState);
        if (move) {
          const [r, c] = move;
          setGameState((prev) => makeMove(prev, r, c));
        }
        setAiThinking(false);
      }, delay);
    }
    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, [gameState, gameMode, difficulty, aiThinking]);

  // Track stats
  useEffect(() => {
    if (!gameState.winner) return;
    const key = gameState.winner === "draw" ? "draw" : gameState.winner === 1 ? "black" : "white";
    if (trackedWinnerRef.current === key) return;
    trackedWinnerRef.current = key;
    const next = { ...stats, [key]: (stats[key] || 0) + 1 };
    setStats(next);
    try {
      localStorage.setItem("gomoku-stats", JSON.stringify(next));
    } catch {
      // ignore
    }
  }, [gameState.winner, stats]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (aiThinking) return;
      if (gameMode === "pve" && gameState.currentPlayer === 2) return;
      if (gameState.winner) return;
      if (gameState.board[row][col] !== 0) return;
      setGameState((prev) => makeMove(prev, row, col));
    },
    [gameState, gameMode, aiThinking],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!boardRef.current || gameState.winner) return;
      const rect = boardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - PADDING;
      const y = e.clientY - rect.top - PADDING;
      const col = Math.round(x / CELL_SIZE);
      const row = Math.round(y / CELL_SIZE);
      if (
        row >= 0 &&
        row < BOARD_SIZE &&
        col >= 0 &&
        col < BOARD_SIZE &&
        gameState.board[row][col] === 0
      ) {
        setHoverPos([row, col]);
      } else {
        setHoverPos(null);
      }
    },
    [gameState.board, gameState.winner],
  );

  const handleMouseLeave = useCallback(() => {
    setHoverPos(null);
  }, []);

  function resetGame() {
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    setGameState(createInitialState());
    setAiThinking(false);
    setHoverPos(null);
  }

  function switchMode(mode: GameMode) {
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    setGameMode(mode);
    setGameState(createInitialState());
    setAiThinking(false);
    setHoverPos(null);
  }

  const isWinCell = (r: number, c: number) =>
    gameState.winningCells?.some(([wr, wc]) => wr === r && wc === c) ?? false;

  return (
    <div className="relative min-h-screen">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-[600px] rounded-full bg-rose-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 size-[500px] rounded-full bg-purple-500/5 blur-3xl" />
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
            五子<span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">棋</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            五子连珠，智胜对手 · 点击棋盘落子 / 拖动查看
          </p>
        </div>

        {/* Mode & Controls */}
        <div className="mb-5 flex flex-wrap items-center justify-center gap-3 md:justify-start">
          <div className="flex gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5">
            <button
              onClick={() => switchMode("pve")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                gameMode === "pve"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Cpu className="size-3.5" />
              人机
            </button>
            <button
              onClick={() => switchMode("pvp")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                gameMode === "pvp"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="size-3.5" />
              双人
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetGame}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-gradient-to-b from-background to-muted/30 px-4 py-2 text-sm font-medium shadow-sm transition-all hover:bg-muted hover:shadow-md active:scale-95"
            >
              <RotateCcw className="size-3.5" />
              新一局
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
            <span>
              黑 <strong className="text-foreground">{stats.black}</strong>
            </span>
            <span className="text-border">|</span>
            <span>
              白 <strong className="text-foreground">{stats.white}</strong>
            </span>
            <span className="text-border">|</span>
            <span>
              平 <strong className="text-foreground">{stats.draw}</strong>
            </span>
          </div>
        </div>

        {/* Game Board */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative">
              {/* Board container */}
              <div
                ref={boardRef}
                className="relative select-none overflow-hidden rounded-2xl shadow-xl ring-1 ring-border/20"
                style={{
                  width: BOARD_VISUAL,
                  maxWidth: "92vw",
                  height: BOARD_VISUAL,
                  background: "linear-gradient(135deg, #dcb35c 0%, #c9a34a 50%, #b8913a 100%)",
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Board inner area */}
                <div
                  className="absolute"
                  style={{
                    left: PADDING,
                    top: PADDING,
                    width: BOARD_PX,
                    height: BOARD_PX,
                  }}
                >
                  {/* Grid lines */}
                  <svg
                    className="pointer-events-none absolute inset-0"
                    style={{ width: BOARD_PX, height: BOARD_PX }}
                    viewBox={`0 0 ${BOARD_PX} ${BOARD_PX}`}
                  >
                    {Array.from({ length: BOARD_SIZE }).map((_, i) => (
                      <g key={`line-${i}`}>
                        <line
                          x1={i * CELL_SIZE}
                          y1={0}
                          x2={i * CELL_SIZE}
                          y2={BOARD_PX}
                          stroke="rgba(0,0,0,0.3)"
                          strokeWidth={i === 0 || i === BOARD_SIZE - 1 ? 1.5 : 0.8}
                        />
                        <line
                          x1={0}
                          y1={i * CELL_SIZE}
                          x2={BOARD_PX}
                          y2={i * CELL_SIZE}
                          stroke="rgba(0,0,0,0.3)"
                          strokeWidth={i === 0 || i === BOARD_SIZE - 1 ? 1.5 : 0.8}
                        />
                      </g>
                    ))}
                    {/* Star points */}
                    {[3, 7, 11].map((r) =>
                      [3, 7, 11].map((c) => (
                        <circle
                          key={`star-${r}-${c}`}
                          cx={c * CELL_SIZE}
                          cy={r * CELL_SIZE}
                          r={3.5}
                          fill="rgba(0,0,0,0.45)"
                        />
                      )),
                    )}
                  </svg>

                  {/* Stones & hover indicator */}
                  {Array.from({ length: BOARD_SIZE }).map((_, r) =>
                    Array.from({ length: BOARD_SIZE }).map((_, c) => {
                      const cell = gameState.board[r][c];
                      const isWin = isWinCell(r, c);
                      const isLast = gameState.lastMove?.[0] === r && gameState.lastMove?.[1] === c;
                      const isHover =
                        hoverPos?.[0] === r && hoverPos?.[1] === c && !cell && !gameState.winner;

                      return (
                        <div
                          key={`cell-${r}-${c}`}
                          className="absolute cursor-pointer"
                          style={{
                            left: c * CELL_SIZE - CELL_SIZE / 2,
                            top: r * CELL_SIZE - CELL_SIZE / 2,
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            zIndex: cell ? 10 : isHover ? 5 : 1,
                          }}
                          onClick={() => handleCellClick(r, c)}
                        >
                          {cell !== 0 && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{
                                scale: 1,
                                opacity: 1,
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                              }}
                              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg ${
                                isWin ? "ring-2 ring-amber-400 ring-offset-1 ring-offset-transparent" : ""
                              } ${isLast && !isWin ? "ring-1 ring-red-400/50" : ""}`}
                              style={{
                                width: CELL_SIZE - 6,
                                height: CELL_SIZE - 6,
                                background:
                                  cell === 1
                                    ? "radial-gradient(circle at 35% 35%, #555, #111 60%, #000)"
                                    : "radial-gradient(circle at 35% 35%, #fff, #eee 60%, #ccc)",
                                boxShadow:
                                  cell === 1
                                    ? "2px 2px 6px rgba(0,0,0,0.4), inset -1px -1px 3px rgba(0,0,0,0.3)"
                                    : "2px 2px 6px rgba(0,0,0,0.25), inset -1px -1px 3px rgba(0,0,0,0.1)",
                              }}
                            >
                              {isLast && (
                                <div
                                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500"
                                  style={{
                                    width: 5,
                                    height: 5,
                                    opacity: 0.85,
                                  }}
                                />
                              )}
                            </motion.div>
                          )}

                          {/* Hover indicator */}
                          <AnimatePresence>
                            {isHover && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 0.5 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                style={{
                                  width: CELL_SIZE - 10,
                                  height: CELL_SIZE - 10,
                                  background:
                                    gameState.currentPlayer === 1
                                      ? "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.3), rgba(0,0,0,0.1))"
                                      : "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4), rgba(255,255,255,0.1))",
                                }}
                              />
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }),
                  )}
                </div>

                {/* Win overlay */}
                <AnimatePresence>
                  {gameState.winner && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-black/60 backdrop-blur-sm"
                    >
                      <motion.div
                        initial={{ scale: 0.8, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 22 }}
                        className="flex flex-col items-center gap-4"
                      >
                        {gameState.winner === "draw" ? (
                          <>
                            <span className="text-3xl">🤝</span>
                            <span className="text-xl font-bold text-white drop-shadow">
                              平局！
                            </span>
                            <span className="text-sm text-white/70">
                              棋盘已满，势均力敌
                            </span>
                          </>
                        ) : (
                          <>
                            <motion.div
                              initial={{ rotate: -20, scale: 0 }}
                              animate={{ rotate: 0, scale: 1 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              <Trophy className="size-12 text-yellow-500 drop-shadow-lg" />
                            </motion.div>
                            <span className="text-xl font-bold text-white drop-shadow">
                              {PLAYER_NAMES[gameState.winner]} 获胜！
                            </span>
                            <span className="text-sm text-white/70">
                              共 {gameState.moveCount} 步
                            </span>
                          </>
                        )}
                        <button
                          onClick={resetGame}
                          className="mt-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 shadow-md transition-all hover:bg-white/90 active:scale-95"
                        >
                          再来一局
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status bar */}
              <motion.div
                layout
                className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-muted/30 px-4 py-3 text-sm font-medium"
              >
                {gameState.winner === "draw" ? (
                  <span>🤝 棋盘已满，平局！</span>
                ) : gameState.winner ? (
                  <span>
                    🏆 {PLAYER_NAMES[gameState.winner]} 获胜！共 {gameState.moveCount} 步
                  </span>
                ) : gameMode === "pve" && gameState.currentPlayer === 2 && aiThinking ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      🤖
                    </motion.span>
                    <span>AI 思考中...</span>
                  </>
                ) : (
                  <>
                    <span
                      className="inline-block size-3 rounded-full shadow-inner"
                      style={{
                        background:
                          gameState.currentPlayer === 1
                            ? "radial-gradient(circle at 35% 35%, #555, #111)"
                            : "radial-gradient(circle at 35% 35%, #fff, #eee)",
                        border: "1px solid rgba(0,0,0,0.15)",
                      }}
                    />
                    <span>{PLAYER_NAMES[gameState.currentPlayer]} 落子</span>
                    {gameState.moveCount > 0 && (
                      <span className="text-muted-foreground">
                        · 第 {gameState.moveCount + 1} 手
                      </span>
                    )}
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Rules */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p className="leading-relaxed">
            点击棋盘交叉点落子。横、竖、斜任意方向五子连珠即获胜。
            {gameMode === "pve" && " AI 会尽力阻挡你，并寻找自己的五连机会。"}
            <br />
            <strong className="text-foreground">五子连珠，智者为王</strong> —— 五子棋的哲学。
          </p>
        </div>
      </div>
    </div>
  );
}
