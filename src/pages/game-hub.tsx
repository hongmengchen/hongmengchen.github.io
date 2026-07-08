import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { Gamepad2, Swords, Combine, Grid3x3 } from "lucide-react";

const games = [
  {
    id: "2048",
    title: "秩序合成",
    subtitle: "合并数字，创造秩序",
    description: "经典2048，用方向键合并相同数字，最终合成2048。每一步都是秩序的建立。",
    path: "/game/2048",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    icon: <Combine className="size-6" />,
    emoji: "2K",
    gradient: "#f59e0b",
  },
  {
    id: "snake",
    title: "贪吃蛇",
    subtitle: "吃食物，变长，别撞墙",
    description: "经典贪吃蛇玩法，滑动或方向键控制。吃食物会变长，撞墙或撞到自己则游戏结束。",
    path: "/game/snake",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    icon: <Gamepad2 className="size-6" />,
    emoji: "🐍",
    gradient: "#10b981",
  },
  {
    id: "tictactoe",
    title: "井字棋",
    subtitle: "三连一线，智取对手",
    description: "经典井字棋，可选择双人模式或挑战AI。三连一线即获胜，简单但充满策略。",
    path: "/game/tictactoe",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
    icon: <Swords className="size-6" />,
    emoji: "✖️",
    gradient: "#8b5cf6",
  },
  {
    id: "gomoku",
    title: "五子棋",
    subtitle: "五子连珠，智胜对手",
    description: "经典五子棋，双人或挑战AI。在15x15棋盘上连成五子即获胜，深不见底的策略游戏。",
    path: "/game/gomoku",
    color: "from-rose-500 to-purple-600",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    icon: <Grid3x3 className="size-6" />,
    emoji: "⚫",
    gradient: "#e11d48",
  },
];

const stagger: Variants = {
  animate: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const fadeUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const cardVariants: Variants = {
  initial: { opacity: 0, y: 30, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
  hover: {
    y: -6,
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function GameHub() {

  return (
    <div className="relative min-h-[70vh]">
      {/* Background ambient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 size-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 size-80 rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={stagger}
        className="mx-auto max-w-5xl px-4 py-12 md:py-16"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary"
          >
            <Gamepad2 className="size-4" />
            <span>休闲一刻</span>
          </motion.div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            小游戏合集
          </h1>
          <p className="mt-3 max-w-lg mx-auto text-muted-foreground">
            闲暇时刻，放松一下。每个游戏都适配移动端，触屏可玩。
          </p>
        </motion.div>

        {/* Game cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {games.map((game) => (
            <motion.div
              key={game.id}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <Link
                to={game.path}
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 ${game.bgColor} transition-shadow duration-300 hover:shadow-lg`}
              >
                {/* Gradient top bar */}
                <div
                  className={`h-2 w-full bg-gradient-to-r ${game.color}`}
                />

                {/* Icon + Title */}
                <div className="flex flex-col items-start gap-4 p-6">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex size-12 items-center justify-center rounded-xl text-lg font-bold text-white shadow-sm`}
                      style={{ background: game.gradient }}
                    >
                      {game.emoji}
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold">{game.title}</h2>
                      <p className="text-xs text-muted-foreground">
                        {game.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {game.description}
                  </p>
                </div>

                {/* Hover indicator */}
                <div className="mt-auto flex items-center gap-1 border-t border-border/40 px-6 py-3 text-xs font-medium text-muted-foreground transition-all group-hover:text-foreground">
                  <span>开始游戏</span>
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    className="inline-block"
                  >
                    →
                  </motion.span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
