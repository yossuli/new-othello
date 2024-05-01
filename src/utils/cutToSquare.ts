import type { Vector } from './../types';
import type { BoardArray } from '../types';

export const cutToSquare = (board: BoardArray, vector: Vector) => {
  const length: number =
    Math.max(board.length, board[0].length) -
    Math.abs(board.length - board[0].length) * (vector.x * vector.y) ** 2;
  return board
    .map((row) =>
      row.slice(
        Math.min(0, Math.min(length, row.length) * vector.x),
        (Math.min(Math.min(length, row.length) * vector.x, row.length * vector.x) * vector.x) **
          (vector.x ** 2),
      ),
    )
    .slice(
      Math.min(0, Math.min(length, board.length) * vector.y),
      (Math.min(Math.min(length, board.length) * vector.y, board.length * vector.y) * vector.y) **
        (vector.y ** 2),
    );
};
