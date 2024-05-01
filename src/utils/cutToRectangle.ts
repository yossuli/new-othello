import type { BoardArray, Vector } from './../types';
export const cutToRectangle = (board: BoardArray, vector: Vector, x: number, y: number) =>
  board //クリックしたところを起点に長方形にboardを切り取る
    .map((row) =>
      row.slice(
        x + Math.min(0, vector.x) * x,
        x + Math.max(0, vector.x) * (board.length - 1 - x) + 1,
      ),
    )
    .slice(y + Math.min(0, vector.y) * y, y + Math.max(0, vector.y) * (board.length - 1 - y) + 1);
