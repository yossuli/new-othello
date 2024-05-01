import type { CSSProperties } from 'react';
import { useState } from 'react';
import styles from './index.module.css';
import type { BoardArray } from '../types';
import { count } from '../utils/count';
import { numOfIsNotPass } from '../utils/numOfIsNotPass';
import { toBeChangedCells } from '../utils/toBeChangedCells';

const stoneStyles: Record<number, CSSProperties> = {
  1: { backgroundColor: 'black' },
  2: { backgroundColor: 'white' },
  3: { backgroundColor: 'orange', width: '50%', height: '50%' },
};

const changeBoard = (y: number, x: number, turnColor: number, board: BoardArray) => {
  const newBoard = structuredClone(board);
  const lwv = toBeChangedCells(y, x, turnColor, newBoard);
  lwv.forEach(({ line, x, y }) => {
    line.forEach((_, n) => {
      newBoard[y + (n + 1) * y][x + (n + 1) * x] = turnColor;
    });
  });
  const changeTurnColor = [3 - turnColor, turnColor][Math.min(lwv.length, 1)];
  const controlsTurn = Math.abs(Math.abs(turnColor - changeTurnColor) - 1);
  newBoard[y][x] += turnColor * controlsTurn;
  return { changeTurnColor, changedBoard: newBoard };
};

const changeCell3 = (y: number, x: number, turnColor: number, board: BoardArray) =>
  Math.min(
    1,
    toBeChangedCells(y, x, turnColor, board).filter((dir) => dir.line.length !== 0).length,
  ) * 3;

const changeBoard3 = (board: BoardArray, inTurn: number) =>
  board.map((row, y) => row.map((cell, x) => cell + changeCell3(y, x, inTurn, board)));

const clickBoard = (
  y: number,
  x: number,
  turnColor: number,
  board: BoardArray,
): { newBoard: BoardArray; turn: number } => {
  const clearBoard = board.map((row) => row.map((color) => color % 3));
  const { changeTurnColor, changedBoard } = changeBoard(y, x, turnColor, clearBoard);
  const turn = 3 - changeTurnColor;
  //pass
  const candidateBoard = changeBoard3(changedBoard, turn);
  const notPass = numOfIsNotPass(candidateBoard);
  const nextTurn = turn * notPass - (3 - turn) * (notPass - 1);
  //end
  const nextCandidateBoard = changeBoard3(candidateBoard, nextTurn);
  const nextNotPass = numOfIsNotPass(nextCandidateBoard);
  const nextNextTurn = nextTurn * nextNotPass - 3 * (nextNotPass - 1);
  return { newBoard: nextCandidateBoard, turn: nextNextTurn };
};

const Home = () => {
  const normalBoard: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 3, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 0, 0],
    [0, 0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  const [board, setBoard] = useState(normalBoard);
  const [turnColor, setTurnColor] = useState(1);
  const clickHandler = (i: number, j: number) => {
    const clonedBoard = structuredClone(board);
    const { newBoard, turn } = clickBoard(i, j, turnColor, clonedBoard);
    setBoard(newBoard);
    setTurnColor(turn);
  };
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div key={`${j}-${i}`} className={styles.cell} onClick={() => clickHandler(i, j)}>
              {cell !== 0 && <div className={styles.stone} style={stoneStyles[cell]} />}
            </div>
          )),
        )}
      </div>
      white {count(board, 2)} : {['Black Turn', 'White Turn', 'Game End!'][turnColor - 1]} :{' '}
      {count(board, 1)} black
    </div>
  );
};

export default Home;
