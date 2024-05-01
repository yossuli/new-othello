import type { BoardArray, LineWithVector, Vector } from '../types';
import { cutToLine } from './cutToLine';
import { cutToRectangle } from './cutToRectangle';
import { cutToSquare } from './cutToSquare';
import { filterBlankOrigin } from './filterBlankOrigin';
import { sliceBetweenOriginAndTurnColor } from './sliceBetweenOriginAndTurnColor';
import { sliceOriginToTurnColor } from './sliceOriginToTurnColor';

const dirVectors: Vector[] = [
  { y: -1, x: 1 },
  { y: -1, x: 0 },
  { y: -1, x: -1 },
  { y: 0, x: -1 },
  { y: 1, x: -1 },
  { y: 1, x: 0 },
  { y: 1, x: 1 },
  { y: 0, x: 1 },
];

export const toBeChangedCells = (y: number, x: number, turnColor: number, board: BoardArray) => {
  const target: LineWithVector[] = dirVectors.map((vector) => {
    const rectangleBoard = cutToRectangle(board, vector, x, y);
    const squareBoard = cutToSquare(rectangleBoard, vector);
    const line = cutToLine(squareBoard, vector);
    return { ...vector, line };
  });
  const blankOrigin = target.filter(filterBlankOrigin);
  const originToTurnColor = blankOrigin.map((lwv) => sliceOriginToTurnColor(lwv, turnColor));
  const betweenOriginAndTurnColor = originToTurnColor.map(sliceBetweenOriginAndTurnColor);
  return betweenOriginAndTurnColor.filter((dir) => dir.line.every((n) => n === 3 - turnColor));
};
