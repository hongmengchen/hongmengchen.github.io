/**
 * Core 2048 game logic — pure functions, zero dependencies.
 * Can be imported by any framework or website.
 */

export const GRID_SIZE = 4;

export type Grid = number[][];
export type Direction = "up" | "down" | "left" | "right";

export function createEmptyGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row]);
}

export function getEmptyCells(grid: Grid): [number, number][] {
  const cells: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) cells.push([r, c]);
    }
  }
  return cells;
}

export function addRandomTile(grid: Grid): Grid {
  const empty = getEmptyCells(grid);
  if (empty.length === 0) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const g = cloneGrid(grid);
  g[r][c] = Math.random() < 0.9 ? 2 : 4;
  return g;
}

export function initGrid(): Grid {
  let g = createEmptyGrid();
  g = addRandomTile(g);
  g = addRandomTile(g);
  return g;
}

function slideLine(line: number[]): { result: number[]; score: number; moved: boolean } {
  const filtered = line.filter((v) => v !== 0);
  const result: number[] = [];
  let score = 0;
  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      result.push(filtered[i] * 2);
      score += filtered[i] * 2;
      i += 2;
    } else {
      result.push(filtered[i]);
      i++;
    }
  }
  while (result.length < GRID_SIZE) result.push(0);
  const moved = line.some((v, idx) => v !== result[idx]);
  return { result, score, moved };
}

function getCol(grid: Grid, col: number): number[] {
  return grid.map((row) => row[col]);
}

function setCol(grid: Grid, col: number, values: number[]): Grid {
  const g = cloneGrid(grid);
  for (let r = 0; r < GRID_SIZE; r++) g[r][col] = values[r];
  return g;
}

export function moveGrid(
  grid: Grid,
  dir: Direction,
): { grid: Grid; score: number; moved: boolean } {
  let newGrid = cloneGrid(grid);
  let totalScore = 0;
  let moved = false;

  for (let i = 0; i < GRID_SIZE; i++) {
    let r: ReturnType<typeof slideLine>;

    switch (dir) {
      case "left":
        r = slideLine(newGrid[i]);
        if (r.moved) {
          moved = true;
          newGrid[i] = r.result;
        }
        totalScore += r.score;
        break;
      case "right": {
        const line = [...newGrid[i]].reverse();
        r = slideLine(line);
        if (r.moved) {
          moved = true;
          newGrid[i] = r.result.reverse();
        }
        totalScore += r.score;
        break;
      }
      case "up":
        r = slideLine(getCol(newGrid, i));
        if (r.moved) {
          newGrid = setCol(newGrid, i, r.result);
          moved = true;
        }
        totalScore += r.score;
        break;
      case "down": {
        const col = getCol(newGrid, i).reverse();
        r = slideLine(col);
        if (r.moved) {
          newGrid = setCol(newGrid, i, r.result.reverse());
          moved = true;
        }
        totalScore += r.score;
        break;
      }
    }
  }

  return { grid: newGrid, score: totalScore, moved };
}

export function canMove(grid: Grid): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c + 1 < GRID_SIZE && grid[r][c] === grid[r][c + 1]) return true;
      if (r + 1 < GRID_SIZE && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

export function hasWon(grid: Grid): boolean {
  return grid.some((row) => row.some((v) => v >= 2048));
}

export function hasTile(grid: Grid, value: number): boolean {
  return grid.some((row) => row.some((v) => v === value));
}

/**
 * Compare two grids and return:
 *  - newCells: cells that were 0 and now have a value
 *  - mergedCells: cells where the value doubled (2→4, 4→8, etc.) and the previous
 *    value existed elsewhere (meaning a merge happened here)
 */
export function diffGrids(
  prev: Grid,
  curr: Grid,
): { newCells: [number, number][]; mergedCells: [number, number][] } {
  const newCells: [number, number][] = [];
  const mergedCells: [number, number][] = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (prev[r][c] === 0 && curr[r][c] !== 0) {
        // Could be a spawn or a tile that moved here
        // Only mark as "new" if this value doesn't match any neighbor merge
        newCells.push([r, c]);
      }
      if (prev[r][c] !== 0 && curr[r][c] === prev[r][c] * 2) {
        mergedCells.push([r, c]);
      }
    }
  }

  return { newCells, mergedCells };
}
