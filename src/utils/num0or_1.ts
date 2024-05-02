import type { Vector } from '../types';

export const num0or_1 = ({ x: vx, y: vy }: Vector): 0 | -1 => {
  const array0_1: (0 | -1)[][] = [
    [-1, -1, -1],
    [-1, 0, 0],
    [0, 0, 0],
  ];
  return array0_1[vy + 1][vx + 1];
};
