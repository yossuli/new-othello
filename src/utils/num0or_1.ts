import type { Vector } from '../types';

export const num0or_1 = (dir: Vector): 0 | -1 => {
  const array0_1: (0 | -1)[][] = [
    [-1, -1, -1],
    [-1, 0, 0],
    [0, 0, 0],
  ];
  return array0_1[dir.y + 1][dir.x + 1];
};
