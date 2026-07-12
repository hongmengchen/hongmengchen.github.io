/**
 * Gomoku (五子棋) game logic — pure functions, zero dependencies.
 */

export const BOARD_SIZE = 15;
export type Player = 1 | 2; // 1 = black (first), 2 = white
export type Cell = Player | 0;
export type Board = Cell[][];

export interface MoveRecord {
  row: number;
  col: number;
  player: Player;
}

export interface GomokuState {
  board: Board;
  currentPlayer: Player;
  winner: Player | "draw" | null;
  winningCells: [number, number][] | null;
  lastMove: [number, number] | null;
  moveCount: number;
  moveHistory: MoveRecord[];
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
    moveHistory: [],
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

  const moveRecord: MoveRecord = { row, col, player: state.currentPlayer };

  if (winningCells) {
    return {
      board: newBoard,
      currentPlayer: state.currentPlayer,
      winner: state.currentPlayer,
      winningCells,
      lastMove: [row, col],
      moveCount: newMoveCount,
      moveHistory: [...state.moveHistory, moveRecord],
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
      moveHistory: [...state.moveHistory, moveRecord],
    };
  }

  return {
    board: newBoard,
    currentPlayer: state.currentPlayer === 1 ? 2 : 1,
    winner: null,
    winningCells: null,
    lastMove: [row, col],
    moveCount: newMoveCount,
    moveHistory: [...state.moveHistory, moveRecord],
  };
}

/**
 * Undo the last move from history.
 * Returns the state as it was before that move.
 */
export function undoMove(state: GomokuState): GomokuState | null {
  if (state.moveHistory.length === 0) return null;

  const newHistory = [...state.moveHistory];
  const undone = newHistory.pop()!;

  const newBoard = state.board.map((r) => [...r]);
  newBoard[undone.row][undone.col] = 0;

  const prevMove = newHistory.length > 0 ? newHistory[newHistory.length - 1] : null;

  return {
    board: newBoard,
    currentPlayer: undone.player, // revert to the player who made that move
    winner: null,
    winningCells: null,
    lastMove: prevMove ? [prevMove.row, prevMove.col] : null,
    moveCount: state.moveCount - 1,
    moveHistory: newHistory,
  };
}

// ─── AI ─────────────────────────────────────────────────────────────────
// Pure greedy heuristic — no tree search, instant moves.

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

/** Count consecutive stones + open ends along one direction. */
function analyzeDirection(
  board: Board,
  r: number,
  c: number,
  dr: number,
  dc: number,
  player: Player,
): { count: number; openEnds: number; gaps: number } {
  let count = 1;
  let openEnds = 0;
  let gaps = 0;

  let nr = r + dr;
  let nc = c + dc;
  while (inBounds(nr, nc) && board[nr][nc] === player) {
    count++;
    nr += dr;
    nc += dc;
  }
  if (inBounds(nr, nc) && board[nr][nc] === 0) openEnds++;

  nr = r - dr;
  nc = c - dc;
  while (inBounds(nr, nc) && board[nr][nc] === player) {
    count++;
    nr -= dr;
    nc -= dc;
  }
  if (inBounds(nr, nc) && board[nr][nc] === 0) openEnds++;

  return { count, openEnds, gaps };
}

function directionScore(
  board: Board,
  r: number,
  c: number,
  dr: number,
  dc: number,
  player: Player,
): number {
  const { count, openEnds } = analyzeDirection(board, r, c, dr, dc, player);

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

function evaluateAttack(board: Board, r: number, c: number, player: Player): number {
  // Sum scores from all 4 directions when placing player's stone here
  const testBoard = board.map((row) => [...row]);
  testBoard[r][c] = player;
  let score = 0;
  for (const [dr, dc] of DIRECTIONS) {
    score += directionScore(testBoard, r, c, dr, dc, player);
  }
  return score;
}

function evaluateDefense(board: Board, r: number, c: number, opponent: Player): number {
  // How dangerous would it be if opponent placed here?
  const testBoard = board.map((row) => [...row]);
  testBoard[r][c] = opponent;
  let score = 0;
  for (const [dr, dc] of DIRECTIONS) {
    score += directionScore(testBoard, r, c, dr, dc, opponent);
  }
  return score;
}

/** Detect if a move creates two separate threats simultaneously (fork). */
function forkBonus(board: Board, r: number, c: number, player: Player): number {
  const testBoard = board.map((row) => [...row]);
  testBoard[r][c] = player;
  let threats = 0;
  for (const [dr, dc] of DIRECTIONS) {
    const { count, openEnds } = analyzeDirection(testBoard, r, c, dr, dc, player);
    if ((count >= 3 && openEnds >= 1) || (count >= 4)) {
      threats++;
    }
  }
  if (threats >= 3) return SCORES.OPEN_FOUR; // double threat = almost guaranteed win
  if (threats >= 2) return SCORES.OPEN_THREE;
  return 0;
}

function getCandidates(board: Board): [number, number][] {
  const seen = new Set<string>();
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== 0) {
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (inBounds(nr, nc) && board[nr][nc] === 0) {
              seen.add(((nr << 8) | nc).toString());
            }
          }
        }
      }
    }
  }
  const result: [number, number][] = [];
  for (const key of seen) {
    const v = Number(key);
    result.push([v >> 8, v & 0xff]);
  }
  return result;
}

export function getAIMove(state: GomokuState): [number, number] | null {
  const { board, currentPlayer } = state;
  const opponent: Player = currentPlayer === 1 ? 2 : 1;

  // First move: center
  if (state.moveCount === 0) {
    return [Math.floor(BOARD_SIZE / 2), Math.floor(BOARD_SIZE / 2)];
  }

  // Second move: near center
  if (state.moveCount === 1) {
    const c = Math.floor(BOARD_SIZE / 2);
    const offsets: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (const [dr, dc] of offsets) {
      const nr = c + dr, nc = c + dc;
      if (inBounds(nr, nc) && board[nr][nc] === 0) return [nr, nc];
    }
  }

  const candidates = getCandidates(board);
  if (candidates.length === 0) return null;

  // 1) Immediate win
  for (const [r, c] of candidates) {
    const testBoard = board.map((row) => [...row]);
    testBoard[r][c] = currentPlayer;
    if (getWinningCells(testBoard, r, c, currentPlayer)) return [r, c];
  }

  // 2) Immediate block
  for (const [r, c] of candidates) {
    const testBoard = board.map((row) => [...row]);
    testBoard[r][c] = opponent;
    if (getWinningCells(testBoard, r, c, opponent)) return [r, c];
  }

  // 3) Score every candidate (pure greedy heuristic)
  let bestScore = -Infinity;
  let bestMove = candidates[0];

  for (const [r, c] of candidates) {
    const attack = evaluateAttack(board, r, c, currentPlayer);
    const defense = evaluateDefense(board, r, c, opponent);
    const fork = forkBonus(board, r, c, currentPlayer) * 1.5;
    const total = attack + defense * 1.05 + fork;

    if (total > bestScore) {
      bestScore = total;
      bestMove = [r, c];
    }

    // Tie-break: prefer center
    const center = Math.floor(BOARD_SIZE / 2);
    const dist = Math.abs(r - center) + Math.abs(c - center);
    if (total === bestScore && dist < Math.abs(bestMove[0] - center) + Math.abs(bestMove[1] - center)) {
      bestMove = [r, c];
    }
  }

  return bestMove;
}
