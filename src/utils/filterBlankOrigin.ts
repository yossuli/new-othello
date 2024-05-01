import type { LineWithVector } from '../types';
import { num0or_1 } from './num0or_1';

export const filterBlankOrigin = (lwv: LineWithVector) =>
  lwv.line[(lwv.line.length + num0or_1(lwv)) % lwv.line.length] === 0;
