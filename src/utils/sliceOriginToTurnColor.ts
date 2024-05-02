import type { LineWithVector } from '../types';
import { num0or_1 } from './num0or_1';
import { overflow } from './overflow';

export const sliceOriginToTurnColor = (
  { line, ...vec }: LineWithVector,
  turnColor: number,
): LineWithVector => {
  const n0or_1 = num0or_1(vec);
  const n1or0 = num0or_1(vec) + 1;
  return {
    ...vec,
    line: line.slice(
      Math.max(
        n1or0,
        Math.min(overflow(line.length, line.lastIndexOf(turnColor)), overflow(line.length, n0or_1)),
      ),
      Math.max(n1or0, Math.max(line.indexOf(turnColor) + 1, overflow(line.length, n0or_1))),
    ),
  };
};
