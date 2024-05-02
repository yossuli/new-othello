import type { LineWithVector } from '../types';
import { num0or_1 } from './num0or_1';

export const filterBlankOrigin = ({ line, ...vec }: LineWithVector) =>
  line[(line.length + num0or_1(vec)) % line.length] === 0;
