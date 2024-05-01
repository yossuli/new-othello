export type BoardArray = number[][];
export type Vector = { x: -1 | 0 | 1; y: -1 | 0 | 1 };

export type LineWithVector = { line: number[] } & Vector;
