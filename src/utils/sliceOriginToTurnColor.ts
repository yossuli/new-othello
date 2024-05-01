import type { LineWithVector } from '../types';
import { num0or_1 } from './num0or_1';
import { overflow } from './overflow';

export const sliceOriginToTurnColor = (dir: LineWithVector, turnColor: number): LineWithVector => {
  const n0or_1 = num0or_1(dir);
  const line = dir.line;
  return {
    ...dir,
    line: line.slice(
      Math.max(
        n0or_1 + 1,
        Math.min(overflow(line.length, line.lastIndexOf(turnColor)), overflow(line.length, n0or_1)),
      ),
      Math.max(n0or_1 + 1, Math.max(line.indexOf(turnColor) + 1, overflow(line.length, n0or_1))),
    ),
  };
};
