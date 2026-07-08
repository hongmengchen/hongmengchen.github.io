/**
 * Gomoku (五子棋) game logic — pure functions, zero dependencies.
 */

export const BOARD_SIZE = 15;
export type Player = 1 | 2; // 1 = black (first), 2 = white
export type Cell = Player | 0;
export type Board = Cell[][];

export interface GomokuState {
  board: Board;
  currentPlayer: Player;
  winner: Player | "draw" | null;
  winningCells: [number, number][] | null;
  lastMove: [number, number] | null;
  moveCount: number;
}

export function createInitialState(): GomokuState {
  const board: Board = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(0),
  );
  return {
    board,
    currentPlayer: 1,
    winner: null,
    winningCells: null,
    lastMove: null,
    moveCount: 0,
  };
}

const DIRECTIONS: [number, number][] = [
  [0, 1],   // horizontal
  [1, 0],   // vertical
  [1, 1],   // diagonal ↘
  [1, -1],  // diagonal ↗
];

function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;
}

function countLine(
  board: Board,
  r: number,
  c: number,
  dr: number,
  dc: number,
  player: Player,
): number {
  let count = 0;
  let nr = r + dr;
  let nc = c + dc;
  while (inBounds(nr, nc) && board[nr][nc] === player) {
    count++;
    nr += dr;
    nc += dc;
  }
  return count;
}

function getWinningCells(
  board: Board,
  r: number,
  c: number,
  player: Player,
): [number, number][] | null {
  for (const [dr, dc] of DIRECTIONS) {
    const count1 = countLine(board, r, c, dr, dc, player);
    const count2 = countLine(board, r, c, -dr, -dc, player);
    if (count1 + count2 + 1 >= 5) {
      const cells: [number, number][] = [[r, c]];
      let nr = r + dr;
      let nc = c + dc;
      while (inBounds(nr, nc) && board[nr][nc] === player) {
        cells.push([nr, nc]);
        nr += dr;
        nc += dc;
      }
      nr = r - dr;
      nc = c - dc;
      while (inBounds(nr, nc) && board[nr][nc] === player) {
        cells.push([nr, nc]);
        nr -= dr;
        nc -= dc;
      }
      return cells;
    }
  }
  return null;
}

export function makeMove(
  state: GomokuState,
  row: number,
  col: number,
): GomokuState {
  if (state.winner) return state;
  if (state.board[row][col] !== 0) return state;

  const newBoard = state.board.map((r) => [...r]);
  newBoard[row][col] = state.currentPlayer;

  const winningCells = getWinningCells(newBoard, row, col, state.currentPlayer);
  const newMoveCount = state.moveCount + 1;

  if (winningCells) {
    return {
      board: newBoard,
      currentPlayer: state.currentPlayer,
      winner: state.currentPlayer,
      winningCells,
      lastMove: [row, col],
      moveCount: newMoveCount,
    };
  }

  if (newMoveCount >= BOARD_SIZE * BOARD_SIZE) {
    return {
      board: newBoard,
      currentPlayer: state.currentPlayer,
      winner: "draw",
      winningCells: null,
      lastMove: [row, col],
      moveCount: newMoveCount,
    };
  }

  return {
    board: newBoard,
    currentPlayer: state.currentPlayer === 1 ? 2 : 1,
    winner: null,
    winningCells: null,
    lastMove: [row, col],
    moveCount: newMoveCount,
  };
}

// ─── AI ─────────────────────────────────────────────────────────────────

// Score patterns
const SCORES = {
  FIVE: 1000000,
  OPEN_FOUR: 100000,
  HALF_FOUR: 10000,
  OPEN_THREE: 10000,
  HALF_THREE: 1000,
  OPEN_TWO: 1000,
  HALF_TWO: 100,
  ONE: 10,
};

function evaluateDirection(
  board: Board,
  r: number,
  c: number,
  dr: number,
  dc: number,
  player: Player,
): number {
  let count = 1;
  let openEnds = 0;

  // Forward
  let nr = r + dr;
  let nc = c + dc;
  while (inBounds(nr, nc) && board[nr][nc] === player) {
    count++;
    nr += dr;
    nc += dc;
  }
  if (inBounds(nr, nc) && board[nr][nc] === 0) openEnds++;

  // Backward
  nr = r - dr;
  nc = c - dc;
  while (inBounds(nr, nc) && board[nr][nc] === player) {
    count++;
    nr -= dr;
    nc -= dc;
  }
  if (inBounds(nr, nc) && board[nr][nc] === 0) openEnds++;

  if (count >= 5) return SCORES.FIVE;
  if (count === 4) {
    if (openEnds === 2) return SCORES.OPEN_FOUR;
    if (openEnds === 1) return SCORES.HALF_FOUR;
    return 0;
  }
  if (count === 3) {
    if (openEnds === 2) return SCORES.OPEN_THREE;
    if (openEnds === 1) return SCORES.HALF_THREE;
    return 0;
  }
  if (count === 2) {
    if (openEnds === 2) return SCORES.OPEN_TWO;
    if (openEnds === 1) return SCORES.HALF_TWO;
    return 0;
  }
  if (count === 1 && openEnds === 2) return SCORES.ONE;
  return 0;
}

function evaluateCell(
  board: Board,
  r: number,
  c: number,
  player: Player,
): number {
  let score = 0;
  for (const [dr, dc] of DIRECTIONS) {
    score += evaluateDirection(board, r, c, dr, dc, player);
  }
  return score;
}

function evaluateBoard(
  board: Board,
  aiPlayer: Player,
): number {
  const opponent: Player = aiPlayer === 1 ? 2 : 1;
  let score = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === aiPlayer) {
        score += evaluateCell(board, r, c, aiPlayer);
      } else if (board[r][c] === opponent) {
        score -= evaluateCell(board, r, c, opponent);
      }
    }
  }
  return score;
}

function getCandidates(board: Board): [number, number][] {
  const candidates = new Set<string>();

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== 0) {
        // Add empty neighbors within distance 2
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (inBounds(nr, nc) && board[nr][nc] === 0) {
              candidates.add(`${nr},${nc}`);
            }
          }
        }
      }
    }
  }

  return Array.from(candidates).map((s) => {
    const [r, c] = s.split(",").map(Number);
    return [r, c] as [number, number];
  });
}

function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player,
): number {
  if (depth === 0) {
    return evaluateBoard(board, aiPlayer);
  }

  const opponent: Player = aiPlayer === 1 ? 2 : 1;
  const currentPlayer = isMaximizing ? aiPlayer : opponent;
  const candidates = getCandidates(board);

  if (candidates.length === 0) return 0;

  // Score candidates by quick eval for better ordering
  const scored = candidates.map(([r, c]) => {
    const testBoard = board.map((row) => [...row]);
    testBoard[r][c] = currentPlayer;
    const score = evaluateCell(testBoard, r, c, currentPlayer);
    return { r, c, score };
  });

  // Check for immediate win/block
  for (const { r, c } of scored) {
    const testBoard = board.map((row) => [...row]);
    testBoard[r][c] = aiPlayer;
    if (getWinningCells(testBoard, r, c, aiPlayer)) {
      return isMaximizing ? SCORES.FIVE : -SCORES.FIVE;
    }
    testBoard[r][c] = opponent;
    if (getWinningCells(testBoard, r, c, opponent)) {
      return isMaximizing ? -SCORES.FIVE : SCORES.FIVE;
    }
  }

  // Sort candidates by score for better pruning
  scored.sort((a, b) => isMaximizing ? b.score - a.score : a.score - b.score);

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const { r, c } of scored.slice(0, 15)) {
      const newBoard = board.map((row) => [...row]);
      newBoard[r][c] = aiPlayer;
      const score = minimax(newBoard, depth - 1, alpha, beta, false, aiPlayer);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const { r, c } of scored.slice(0, 15)) {
      const newBoard = board.map((row) => [...row]);
      newBoard[r][c] = opponent;
      const score = minimax(newBoard, depth - 1, alpha, beta, true, aiPlayer);
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return minScore;
  }
}

export function getAIMove(state: GomokuState): [number, number] | null {
  const { board, currentPlayer } = state;
  const candidates = getCandidates(board);

  if (candidates.length === 0) return null;

  // First move: play center
  if (state.moveCount === 0) {
    const center = Math.floor(BOARD_SIZE / 2);
    return [center, center];
  }

  // Second move: play near center
  if (state.moveCount === 1) {
    const center = Math.floor(BOARD_SIZE / 2);
    const offsets = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (const [dr, dc] of offsets) {
      const nr = center + dr;
      const nc = center + dc;
      if (inBounds(nr, nc) && board[nr][nc] === 0) return [nr, nc];
    }
  }

  const opponent: Player = currentPlayer === 1 ? 2 : 1;

  // Check for immediate win
  for (const [r, c] of candidates) {
    const testBoard = board.map((row) => [...row]);
    testBoard[r][c] = currentPlayer;
    if (getWinningCells(testBoard, r, c, currentPlayer)) return [r, c];
  }

  // Check for immediate block
  for (const [r, c] of candidates) {
    const testBoard = board.map((row) => [...row]);
    testBoard[r][c] = opponent;
    if (getWinningCells(testBoard, r, c, opponent)) return [r, c];
  }

  // Score each candidate and use minimax
  const scored = candidates.map(([r, c]) => {
    const testBoard = board.map((row) => [...row]);
    testBoard[r][c] = currentPlayer;
    const attackScore = evaluateCell(testBoard, r, c, currentPlayer);
    testBoard[r][c] = opponent;
    const defenseScore = evaluateCell(testBoard, r, c, opponent);
    return { r, c, score: attackScore + defenseScore * 1.1 };
  });

  // Sort by combined score
  scored.sort((a, b) => b.score - a.score);

  // Try top candidates with minimax
  const topCandidates = scored.slice(0, 10);
  const depth = state.moveCount < 6 ? 2 : 1;

  let bestScore = -Infinity;
  let bestMove = [topCandidates[0].r, topCandidates[0].c] as [number, number];

  for (const { r, c } of topCandidates) {
    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = currentPlayer;
    const score = minimax(newBoard, depth, -Infinity, Infinity, false, currentPlayer);
    if (score > bestScore) {
      bestScore = score;
      bestMove = [r, c];
    }
  }

  return bestMove;
}
