import type { BoardArray, Vector } from './../types';
export const cutToRectangle = (board: BoardArray, { x: vx, y: vy }: Vector, x: number, y: number) =>
  board
    .map((row) =>
      row.slice(x + Math.min(0, vx) * x, x + Math.max(0, vx) * (board.length - 1 - x) + 1),
    )
    .slice(y + Math.min(0, vy) * y, y + Math.max(0, vy) * (board.length - 1 - y) + 1);
