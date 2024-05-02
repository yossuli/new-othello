import { useState } from 'react';
import styles from './index.module.css';
import { count } from '../utils/count';
import { numOfIsNotPass } from '../utils/numOfIsNotPass';
import { toBeChangedCells } from '../utils/toBeChangedCells';
import { changeBoard3 } from '../utils/changeBoard3';
import type { BoardArray } from '../types';
const cellClassHandler = (cell: number, turnColor: number) =>
  ({
    10: `${styles.candidate} ${styles.candidateBlack}`,
    11: `${styles.candidate} ${styles.candidateWhite}`,
  })[cell ** 2 + turnColor];
const gameEndHandler = (board: BoardArray) =>
  ['winner is white!', 'draw', 'winner is black!'][
    Math.sign(count(board, 1) - count(board, 2)) + 1
  ];

const stoneClassHandler = (cell: number) =>
  ({
    0: styles.black,
    1: styles.black,
    2: styles.white,
    3: styles.black,
  })[cell];

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
    const lwvs = toBeChangedCells(y, x, turnColor, clearBoard);
    lwvs
      .map(({ line, x: vx, y: vy }) => line.map((_, n) => [y + (n + 1) * vy, x + (n + 1) * vx]))
      .flat()
      .forEach(([y, x]) => {
        clearBoard[y][x] = turnColor;
      });
    const changeTurnColor = [3 - turnColor, turnColor][
      Math.min(lwvs.filter(({ line }) => line.length > 0).length, 1)
    ];
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
      <div className={styles.score}>
        <div className={`${styles.cell} ${styles.black} ${{ 1: styles.turn }[turnColor]}`}>
          {count(board, 1)}
        </div>
        <div className={styles.scoreBar}>
          <div className={styles.description}>
            <div className={styles.descriptionInner}>
              {['Black Turn', 'White Turn', `Game End! ${gameEndHandler(board)}`][turnColor - 1]}
            </div>
          </div>
          <div
            className={`${styles.scoreBarGraph} ${styles.black}`}
            style={{ width: `${(count(board, 1) / (count(board, 1) + count(board, 2))) * 100}%` }}
          />
          <div
            className={`${styles.scoreBarGraph} ${styles.white}`}
            style={{ width: `${(count(board, 2) / (count(board, 1) + count(board, 2))) * 100}%` }}
          />
        </div>
        <div className={`${styles.cell} ${styles.white} ${{ 2: styles.turn }[turnColor]}`}>
          {count(board, 2)}
        </div>
      </div>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`${styles.cell} ${cellClassHandler(cell, turnColor)}`}
              onClick={() => clickHandler(y, x)}
            >
              <div className={`${styles.stone} ${stoneClassHandler(cell)}`} />
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export default Home;
