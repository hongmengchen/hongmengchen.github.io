/**
 * Snake game logic — pure functions, zero dependencies.
 */

export const GRID_SIZE = 15;

export type Position = { x: number; y: number };
export type Food = Position & { value: number };
export type Direction = "up" | "down" | "left" | "right";

export interface SnakeState {
  body: Position[];
  direction: Direction;
  nextDirection: Direction;
  food: Food;
  score: number;
  gameOver: boolean;
}

function randomFood(body: Position[]): Food {
  const occupied = new Set(body.map((p) => `${p.x},${p.y}`));
  const empty: Position[] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (!occupied.has(`${x},${y}`)) empty.push({ x, y });
    }
  }
  if (empty.length === 0) return { x: -1, y: -1, value: 0 };
  const pos = empty[Math.floor(Math.random() * empty.length)];
  return { ...pos, value: 10 };
}

export function createInitialState(): SnakeState {
  const center = Math.floor(GRID_SIZE / 2);
  const body: Position[] = [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ];
  return {
    body,
    direction: "right",
    nextDirection: "right",
    food: randomFood(body),
    score: 0,
    gameOver: false,
  };
}

const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const DIRECTION_DELTA: Record<Direction, Position> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function changeDirection(
  state: SnakeState,
  dir: Direction,
): SnakeState {
  // Prevent reversing into self
  if (dir === OPPOSITE[state.direction]) return state;
  return { ...state, nextDirection: dir };
}

export function tick(state: SnakeState): SnakeState {
  if (state.gameOver) return state;

  const direction = state.nextDirection;
  const delta = DIRECTION_DELTA[direction];
  const head = state.body[0];
  const newHead: Position = { x: head.x + delta.x, y: head.y + delta.y };

  // Wall collision
  if (
    newHead.x < 0 ||
    newHead.x >= GRID_SIZE ||
    newHead.y < 0 ||
    newHead.y >= GRID_SIZE
  ) {
    return { ...state, direction, gameOver: true };
  }

  // Self collision (check against all body except the tail that will be removed later)
  const willEat = newHead.x === state.food.x && newHead.y === state.food.y;
  const selfCollisionCheck = willEat ? state.body : state.body.slice(0, -1);
  if (selfCollisionCheck.some((p) => p.x === newHead.x && p.y === newHead.y)) {
    return { ...state, direction, gameOver: true };
  }

  if (willEat) {
    // Grow: don't remove the tail
    const newBody = [newHead, ...state.body];
    const newScore = state.score + state.food.value;
    return {
      direction,
      nextDirection: direction,
      body: newBody,
      food: randomFood(newBody),
      score: newScore,
      gameOver: false,
    };
  }

  // Normal move: remove the tail
  const newBody = [newHead, ...state.body.slice(0, -1)];
  return {
    ...state,
    direction,
    nextDirection: direction,
    body: newBody,
  };
}
