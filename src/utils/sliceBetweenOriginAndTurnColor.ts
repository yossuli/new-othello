import type { LineWithVector } from './../types';
import { num0or_1 } from './num0or_1';
export const sliceBetweenOriginAndTurnColor = ({
  line,
  ...vec
}: LineWithVector): LineWithVector => ({
  ...vec,
  line: line.slice(-num0or_1(vec), line.length - (num0or_1(vec) + 1)),
});
