import type { Vector } from './../types';
import type { BoardArray } from '../types';

export const cutToSquare = (board: BoardArray, { x: vx, y: vy }: Vector) => {
  const shortSideLength = (length: number) =>
    Math.min(
      Math.max(board.length, board[0].length) -
        Math.abs(board.length - board[0].length) * (vx * vy) ** 2,
      length,
    );
  return board
    .map((row) =>
      row.slice(
        Math.min(0, shortSideLength(row.length) * vx),
        (Math.min(shortSideLength(row.length) * vx, row.length * vx) * vx) ** (vx ** 2),
      ),
    )
    .slice(
      Math.min(0, shortSideLength(board.length) * vy),
      (Math.min(shortSideLength(board.length) * vy, board.length * vy) * vy) ** (vy ** 2),
    );
};
