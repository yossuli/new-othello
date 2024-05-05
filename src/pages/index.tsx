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
  ['Winner is white!', 'draw', 'Winner is black!'][
    Math.sign(count(board, 1) - count(board, 2)) + 1
  ];

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
    const toBeChangeCellsSet = new Set(
      lwvs
        .map(({ line, x: vx, y: vy }) =>
          line.map((_, n) => `${y + (n + 1) * vy}-${x + (n + 1) * vx}`),
        )
        .flat(),
    );
    const changedBoard = clearBoard.map((row, y) =>
      row.map((cell, x) => [cell, 3 - cell][+toBeChangeCellsSet.has(`${y}-${x}`)]),
    );
    const changeTurnColor = [3 - turnColor, turnColor][
      Math.min(lwvs.filter(({ line }) => line.length > 0).length, 1)
    ];
    const controlsTurn = Math.abs(Math.abs(turnColor - changeTurnColor) - 1);
    changedBoard[y][x] += (turnColor * controlsTurn) % 6;
    //pass
    const candidateBoard = changeBoard3(changedBoard, 3 - changeTurnColor);
    const notPass = numOfIsNotPass(candidateBoard);
    const nextTurn = (3 - changeTurnColor) * notPass - changeTurnColor * (notPass - 1);
    //end
    const nextCandidateBoard = changeBoard3(candidateBoard, nextTurn);
    const nextNotPass = numOfIsNotPass(nextCandidateBoard);
    const nextNextTurn = nextTurn * nextNotPass - 3 * (nextNotPass - 1);
    setBoard(nextCandidateBoard);
    setTurnColor(nextNextTurn);
  };
  const restart = () => {
    setTimeout(() => {
      setBoard(normalBoard);
      setTurnColor(1);
    }, 500);
  };
  const leave = () => {
    window.close();
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
              {['Black Turn', 'White Turn', 'Game End !'][turnColor - 1]}
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
        <div className={`${{ 3: styles.flex }[turnColor]} ${styles.result}`}>
          <h1>Game End !</h1>
          <h2>{gameEndHandler(board)}</h2>
          <h2>
            black {count(board, 1)} - {count(board, 2)} white
          </h2>
          <h3 className={styles.restart} onClick={restart}>
            restart
          </h3>
          <h3 className={styles.leave} onClick={leave}>
            leave
          </h3>
        </div>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`${styles.cell} ${cellClassHandler(cell, turnColor)}`}
              onClick={() => clickHandler(y, x)}
            >
              <div
                className={`${styles.stone} ${
                  {
                    1: styles.black,
                    2: styles.white,
                  }[cell]
                }`}
              />
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export default Home;
