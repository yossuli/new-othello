import type { BoardArray } from '../types';
import { toBeChangedCells } from './toBeChangedCells';

export const changeCell3 = (y: number, x: number, turnColor: number, board: BoardArray) =>
  Math.min(
    1,
    toBeChangedCells(y, x, turnColor, board).filter(({ line }) => line.length !== 0).length,
  ) * 3;
