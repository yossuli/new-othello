import type { BoardArray } from '../types';

export const numOfIsNotPass = (board: BoardArray) =>
  Math.min(1, board.flat().filter((n) => n === 3).length);
