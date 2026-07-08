import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Users, Cpu } from "lucide-react";

import {
  type TicTacToeState,
  createInitialState,
  makeMove,
  getAIMove,
} from "@/lib/game-tictactoe";

type GameMode = "pvp" | "pve";

const X_MARK = (
  <motion.div
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 1 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="relative flex items-center justify-center"
  >
    <svg viewBox="0 0 100 100" className="size-full p-2">
      <motion.line
        x1="20" y1="20" x2="80" y2="80"
        stroke="url(#xg1)" strokeWidth="10" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
      <motion.line
        x1="80" y1="20" x2="20" y2="80"
        stroke="url(#xg2)" strokeWidth="10" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.1 }}
      />
      <defs>
        <linearGradient id="xg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="xg2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
);

const O_MARK = (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="relative flex items-center justify-center"
  >
    <svg viewBox="0 0 100 100" className="size-full p-2">
      <motion.circle
        cx="50" cy="50" r="35"
        fill="none"
        stroke="url(#og)"
        strokeWidth="10"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
      <defs>
        <linearGradient id="og" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
);

export default function GameTicTacToe() {
  const [gameState, setGameState] = useState<TicTacToeState>(createInitialState);
  const [gameMode, setGameMode] = useState<GameMode>("pve");
  const [aiThinking, setAiThinking] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>(() => {
    try {
      const s = localStorage.getItem("tictactoe-stats");
      return s ? JSON.parse(s) : { X: 0, O: 0, draw: 0 };
    } catch {
      return { X: 0, O: 0, draw: 0 };
    }
  });
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trackedWinnerRef = useRef<string | null>(null);

  // AI move
  useEffect(() => {
    if (
      gameMode === "pve" &&
      gameState.currentPlayer === "O" &&
      !gameState.winner &&
      !aiThinking
    ) {
      setAiThinking(true);
      aiTimeoutRef.current = setTimeout(() => {
        const aiIndex = getAIMove(gameState.board, "O");
        setGameState((prev) => makeMove(prev, aiIndex));
        setAiThinking(false);
      }, 400);
    }
    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, [gameState, gameMode, aiThinking]);

  // Track stats
  useEffect(() => {
    if (!gameState.winner) return;
    const key = gameState.winner === "draw" ? "draw" : gameState.winner;
    if (trackedWinnerRef.current === key) return;
    trackedWinnerRef.current = key;
    const next = { ...stats, [key]: (stats[key] || 0) + 1 };
    setStats(next);
    try {
      localStorage.setItem("tictactoe-stats", JSON.stringify(next));
    } catch {
      // localStorage unavailable
    }
  }, [gameState.winner, stats]);

  const handleCellClick = useCallback(
    (index: number) => {
      if (aiThinking) return;
      if (gameMode === "pve" && gameState.currentPlayer === "O") return;
      if (gameState.winner) return;
      setGameState((prev) => makeMove(prev, index));
    },
    [gameState, gameMode, aiThinking],
  );

  function resetGame() {
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    setGameState(createInitialState());
    setAiThinking(false);
  }

  function switchMode(mode: GameMode) {
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    setGameMode(mode);
    setGameState(createInitialState());
    setAiThinking(false);
  }

  // Winning line drawing
  const renderWinLine = () => {
    if (!gameState.winningLine) return null;
    const [a, , c] = gameState.winningLine;
    const positions = [
      [16.67, 16.67], [50, 16.67], [83.33, 16.67],
      [16.67, 50], [50, 50], [83.33, 50],
      [16.67, 83.33], [50, 83.33], [83.33, 83.33],
    ];
    const p1 = positions[a];
    const p2 = positions[c];

    return (
      <svg className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 100 100">
        <motion.line
          x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]}
          stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </svg>
    );
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-6 text-center md:text-left">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          井字<span className="bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">棋</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          三连一线，智取对手 · 点击格子落子
        </p>
      </div>

      {/* Mode & Stats */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-4 md:justify-start">
        <div className="flex gap-2 rounded-lg border border-border/60 bg-muted/40 p-1">
          <button
            onClick={() => switchMode("pve")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              gameMode === "pve"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Cpu className="size-3.5" />
            单人
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

        <button
          onClick={resetGame}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <RotateCcw className="size-3.5" />
          新一局
        </button>
      </div>

      {/* Game Board */}
      <div className="flex justify-center">
        <div className="relative">
          {/* Board */}
          <div className="grid grid-cols-3 gap-2.5 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 p-3 shadow-lg dark:from-slate-800 dark:to-slate-900">
            {gameState.board.map((cell, i) => {
              const isWinCell = gameState.winningLine?.includes(i);

              return (
                <motion.button
                  key={i}
                  onClick={() => handleCellClick(i)}
                  whileTap={{ scale: 0.93 }}
                  whileHover={!cell && !gameState.winner ? { scale: 1.05 } : {}}
                  className={`relative flex size-20 items-center justify-center rounded-xl border bg-white/90 shadow-sm backdrop-blur transition-all sm:size-24 md:size-28 ${
                    isWinCell
                      ? "border-amber-400 ring-2 ring-amber-400/40"
                      : "border-border/60"
                  } ${
                    !cell && !gameState.winner
                      ? "cursor-pointer hover:bg-white hover:shadow-md"
                      : "cursor-default"
                  }`}
                >
                  <AnimatePresence mode="popLayout">
                    {cell && (
                      <motion.div
                        key={cell + i}
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 30 }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 22,
                        }}
                        className={`size-full ${
                          isWinCell ? "animate-pulse" : ""
                        }`}
                      >
                        {cell === "X" ? X_MARK : O_MARK}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
            {renderWinLine()}
          </div>

          {/* Status bar */}
          <motion.div
            layout
            className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-muted/30 px-4 py-3 text-sm font-medium"
          >
            {gameState.winner === "draw" ? (
              <>
                <span className="text-lg">🤝</span>
                <span>平局！势均力敌</span>
              </>
            ) : gameState.winner ? (
              <>
                <Trophy className="size-4 text-amber-500" />
                <span>
                  {gameState.winner === "X" ? "✖" : "⭕"} 获胜！
                </span>
              </>
            ) : gameMode === "pve" && gameState.currentPlayer === "O" ? (
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
                <span className={`inline-block size-3 rounded-full ${gameState.currentPlayer === "X" ? "bg-violet-500" : "bg-cyan-500"}`} />
                <span>{gameState.currentPlayer === "X" ? "✖" : "⭕"} 的回合</span>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground">
            <span>✖ <strong className="text-foreground">{stats.X}</strong></span>
            <span>⭕ <strong className="text-foreground">{stats.O}</strong></span>
            <span>平局 <strong className="text-foreground">{stats.draw}</strong></span>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p className="leading-relaxed">
          点击格子落子，横、竖、斜三连一线即获胜。
          {gameMode === "pve" && "AI 使用极小化极大算法，不会让你轻易取胜。"}
          <br />
          <strong className="text-foreground">简单规则，无穷策略</strong> —— 井字棋的哲学。
        </p>
      </div>
    </div>
  );
}
