import type { BoardArray, Vector } from '../types';

export const cutToLine = (board: BoardArray, { x: vx, y: vy }: Vector) => {
  const dxy = vx * vy;
  const line = board
    .flat()
    .filter((_, i) => i % Math.max(1, board.length ** (dxy ** 2) + dxy) === 0);
  const a = Math.min(Math.abs(Math.min(0, dxy)), line.length - 1);
  return line.slice(a, line.length - a);
};
