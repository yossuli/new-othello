import type { CSSProperties } from 'react';
import { useState } from 'react';
import styles from './index.module.css';
import { count } from '../utils/count';
import { numOfIsNotPass } from '../utils/numOfIsNotPass';
import { toBeChangedCells } from '../utils/toBeChangedCells';
import { changeBoard3 } from '../utils/changeBoard3';

const stoneStyles: Record<number, CSSProperties> = {
  1: { backgroundColor: 'black' },
  2: { backgroundColor: 'white' },
  3: { backgroundColor: 'orange', width: '50%', height: '50%' },
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
  const clickHandler = (y: number, x: number) => {
    const clonedBoard = structuredClone(board);
    const clearBoard = clonedBoard.map((row) => row.map((color) => color % 3));
    const lwv = toBeChangedCells(y, x, turnColor, clearBoard);
    lwv.forEach(({ line, ...vec }) => {
      line.forEach((_, n) => {
        clearBoard[y + (n + 1) * vec.y][x + (n + 1) * vec.x] = turnColor;
      });
    });
    const changeTurnColor = [3 - turnColor, turnColor][Math.min(lwv.length, 1)];
    const controlsTurn = Math.abs(Math.abs(turnColor - changeTurnColor) - 1);
    clearBoard[y][x] += turnColor * controlsTurn;
    //pass
    const candidateBoard = changeBoard3(clearBoard, 3 - changeTurnColor);
    const notPass = numOfIsNotPass(candidateBoard);
    const nextTurn = (3 - changeTurnColor) * notPass - changeTurnColor * (notPass - 1);
    //end
    const nextCandidateBoard = changeBoard3(candidateBoard, nextTurn);
    const nextNotPass = numOfIsNotPass(nextCandidateBoard);
    const nextNextTurn = nextTurn * nextNotPass - 3 * (nextNotPass - 1);
    setBoard(nextCandidateBoard);
    setTurnColor(nextNextTurn);
  };
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div key={`${x}-${y}`} className={styles.cell} onClick={() => clickHandler(y, x)}>
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
