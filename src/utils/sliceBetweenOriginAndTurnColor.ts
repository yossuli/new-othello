import type { LineWithVector } from './../types';
import { num0or_1 } from './num0or_1';
export const sliceBetweenOriginAndTurnColor = (lwv: LineWithVector) => ({
  ...lwv,
  line: lwv.line.slice(-num0or_1(lwv), lwv.line.length - (num0or_1(lwv) + 1)), //最初と最後は自身の色と空マスなため除外
});
