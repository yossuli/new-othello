import type { BoardArray } from '../types';
import { changeCell3 } from './changeCell3';

export const changeBoard3 = (board: BoardArray, turnColor: number) =>
  board.map((row, y) => row.map((cell, x) => cell + changeCell3(y, x, turnColor, board)));
