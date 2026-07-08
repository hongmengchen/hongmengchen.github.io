/**
 * Tic-Tac-Toe game logic — pure functions, zero dependencies.
 */

export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = Cell[];

export interface TicTacToeState {
  board: Board;
  currentPlayer: Player;
  winner: Player | "draw" | null;
  winningLine: number[] | null;
}

const WINNING_LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
];

export function createInitialState(): TicTacToeState {
  return {
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
    winningLine: null,
  };
}

export function makeMove(state: TicTacToeState, index: number): TicTacToeState {
  if (state.winner || state.board[index] !== null) return state;

  const newBoard = [...state.board];
  newBoard[index] = state.currentPlayer;

  // Check winner
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
      return {
        board: newBoard,
        currentPlayer: state.currentPlayer,
        winner: state.currentPlayer,
        winningLine: line,
      };
    }
  }

  // Check draw
  if (newBoard.every((cell) => cell !== null)) {
    return {
      board: newBoard,
      currentPlayer: state.currentPlayer,
      winner: "draw",
      winningLine: null,
    };
  }

  return {
    board: newBoard,
    currentPlayer: state.currentPlayer === "X" ? "O" : "X",
    winner: null,
    winningLine: null,
  };
}

export function getAIMove(board: Board, aiPlayer: Player): number {
  const opponent: Player = aiPlayer === "X" ? "O" : "X";

  // Minimax algorithm
  function minimax(
    b: Board,
    depth: number,
    isMaximizing: boolean,
    alpha: number,
    beta: number,
  ): number {
    const result = evaluateBoard(b, aiPlayer, opponent);
    if (result !== null) return result - (isMaximizing ? depth : -depth) * 0.1;

    const available = b
      .map((cell, i) => (cell === null ? i : -1))
      .filter((i) => i >= 0);

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (const i of available) {
        const testBoard = [...b];
        testBoard[i] = aiPlayer;
        const score = minimax(testBoard, depth + 1, false, alpha, beta);
        bestScore = Math.max(bestScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break;
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (const i of available) {
        const testBoard = [...b];
        testBoard[i] = opponent;
        const score = minimax(testBoard, depth + 1, true, alpha, beta);
        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break;
      }
      return bestScore;
    }
  }

  const available = board
    .map((cell, i) => (cell === null ? i : -1))
    .filter((i) => i >= 0);

  // Try to win immediately
  for (const i of available) {
    const testBoard = [...board];
    testBoard[i] = aiPlayer;
    const res = evaluateBoard(testBoard, aiPlayer, opponent);
    if (res === 100) return i;
  }

  // Block opponent's win
  for (const i of available) {
    const testBoard = [...board];
    testBoard[i] = opponent;
    const res = evaluateBoard(testBoard, aiPlayer, opponent);
    if (res === -100) return i;
  }

  // Center
  if (board[4] === null) return 4;

  // Use minimax for best move
  let bestScore = -Infinity;
  let bestMove = available[0];

  for (const i of available) {
    const testBoard = [...board];
    testBoard[i] = aiPlayer;
    const score = minimax(testBoard, 0, false, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }

  return bestMove;
}

function evaluateBoard(
  board: Board,
  aiPlayer: Player,
  _opponent: Player,
): number | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] === aiPlayer ? 100 : -100;
    }
  }
  if (board.every((cell) => cell !== null)) return 0;
  return null;
}
