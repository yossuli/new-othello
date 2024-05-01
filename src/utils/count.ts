import type { BoardArray } from '../types';

export const count = (board: BoardArray, color: 1 | 2) =>
  board.flat().filter((c) => c === color).length;
