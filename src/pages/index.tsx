import type { CSSProperties } from 'react';
import { useState } from 'react';
import styles from './index.module.css';

const stoneStyles: CSSProperties[] = [
  { backgroundColor: 'black' },
  { backgroundColor: 'white' },
  { backgroundColor: 'orange', width: '50%', height: '50%' },
];

type BoardArray = number[][];
type Position = { x: number; y: number };
const dir: { y: -1 | 0 | 1; x: -1 | 0 | 1 }[] = [
  { y: -1, x: 1 },
  { y: -1, x: 0 },
  { y: -1, x: -1 },
  { y: 0, x: -1 },
  { y: 1, x: -1 },
  { y: 1, x: 0 },
  { y: 1, x: 1 },
  { y: 0, x: 1 },
]; //いい感じに0か-1を返す関数
const num0or_1 = (dir: { arr: number[]; y: number; x: number }) =>
  Math.ceil(Math.max(dir.y + 0.5 * dir.x, 0) / 2) - 1;
//ANCHOR - changeBoard
const changeBoard = (y: number, x: number, turnColor: number, type: 0 | 1, board: BoardArray) => {
  let changeTurnColor = 3 - turnColor;
  const dirs1: { arr: number[]; y: number; x: number }[] = dir.map((d) => {
    const arr1 = board //クリックしたところを起点に長方形にboardを切り取る
      .map((row) =>
        row.slice(x + Math.min(0, d.x) * x, x + Math.max(0, d.x) * (board.length - 1 - x) + 1),
      )
      .slice(y + Math.min(0, d.y) * y, y + Math.max(0, d.y) * (board.length - 1 - y) + 1);
    const dxy = d.x * d.y;
    const length: number =
      Math.max(arr1.length, arr1[0].length) - Math.abs(arr1.length - arr1[0].length) * dxy ** 2;
    const arr11 = arr1 //切り取ったboardを正方形にする
      .map((row) =>
        row.slice(
          Math.min(0, Math.min(length, row.length) * d.x),
          (Math.min(Math.min(length, row.length) * d.x, row.length * d.x) * d.x) ** (d.x ** 2),
        ),
      );
    const arr2 = arr11 //切り取ったboardを正方形にする
      .slice(
        Math.min(0, Math.min(length, arr1.length) * d.y),
        (Math.min(Math.min(length, arr1.length) * d.y, arr1.length * d.y) * d.y) ** (d.y ** 2),
      );
    const arr21 = arr2
      .flat()
      .filter((n, i) => i % Math.max(1, arr2.length ** (dxy ** 2) + dxy) === 0); //見る方向に即した１次元配列にする
    const a = Math.min(Math.abs(Math.min(0, dxy)), arr21.length - 1); //左下右上方向の処理と1ｘ1の時の処理
    const arr3 = arr21.slice(a, arr21.length - a); //左下右上方向の時に余計なものが含まれるため取り除く
    return { arr: arr3, y: d.y, x: d.x };
  });
  const dirs2 = dirs1 //クリックしたマスが空白かどうか
    .filter((dir) => dir.arr[(dir.arr.length + num0or_1(dir)) % dir.arr.length] === 0);
  const dirs3 = dirs2 //クリックしたマスからturnColorまでの配列に切り出す
    .map((dir) => {
      return {
        arr: dir.arr.slice(
          Math.max(
            num0or_1(dir) + 1,
            Math.min(
              (dir.arr.lastIndexOf(turnColor) + dir.arr.length) % dir.arr.length, //-1が返ってきたときうまく処理する
              (dir.arr.length + num0or_1(dir)) % dir.arr.length, //方向に応じて最初か最後になる
            ),
          ),
          Math.max(
            num0or_1(dir) + 1,
            Math.max(
              dir.arr.indexOf(turnColor) + 1, //-1が返ってきたときはこっちを通らないためOK
              (dir.arr.length + num0or_1(dir)) % dir.arr.length, //方向に応じて最初か最後になる
            ),
          ),
        ),
        y: dir.y,
        x: dir.x,
      };
    });
  const dirs4 = dirs3.map((dir) => {
    return {
      arr: dir.arr.slice(-num0or_1(dir), dir.arr.length - (num0or_1(dir) + 1)), //最初と最後は自身の色と空マスなため除外
      y: dir.y,
      x: dir.x,
    };
  });
  const dirs5 = dirs4.filter((dir) => dir.arr.every((n) => n === 3 - turnColor)); //配列の中身がすべて3-turnColorか判断
  dirs5.forEach((dir) => {
    dir.arr.forEach((_, n) => {
      board[y + (n + 1) * dir.y * type][x + (n + 1) * dir.x * type] =
        turnColor * type - 3 * (type - 1);
      changeTurnColor = turnColor * type - (3 - turnColor) * (type - 1);
    });
  });
  const controlsTurn = Math.abs(Math.abs(turnColor - changeTurnColor) - 1);
  board[y][x] += turnColor * controlsTurn * type;
  return changeTurnColor;
};
//ANCHOR - changeBoard3
const changeBoard3 = (board: BoardArray, inTurn: number) => {
  board.forEach((row, y) => {
    row.forEach((_, x) => {
      changeBoard(y, x, inTurn, 0, board);
    });
  });
};
//ANCHOR - turn

const pass = (board: number[][]) => Math.min(1, board.flat().filter((n) => n === 3).length); //pass=>0

const getCount = (board: BoardArray): number[] => {
  //ANCHOR - getBoard
  const count = [
    board.flat().filter((n) => n === 2).length,
    board.flat().filter((n) => n === 1).length,
  ];
  return count;
};

const clickBoard = (
  params: Position,
  turnColor: number,
  board: BoardArray,
): { newBoard: BoardArray; turn: number } => {
  //ANCHOR - clickBoard
  let turn = turnColor;
  const clearBoard = board.map((row) => row.map((color) => color % 3));
  turn = 3 - changeBoard(params.y, params.x, turn, 1, clearBoard);
  //test
  changeBoard3(clearBoard, turn);
  turn = turn * pass(clearBoard) - (3 - turn) * (pass(clearBoard) - 1); //pass
  changeBoard3(clearBoard, turn);
  turn = turn * pass(clearBoard) - 3 * (pass(clearBoard) - 1); //end
  return { newBoard: clearBoard, turn };
};

const Home = () => {
  const normalBoard: number[][] = Array(8)
    .fill(0)
    .map(() => Array(8).fill(0));
  normalBoard[3][4] = 1;
  normalBoard[3][3] = 2;
  normalBoard[4][4] = 2;
  normalBoard[4][3] = 1;
  normalBoard[2][3] = 3;
  normalBoard[3][2] = 3;
  normalBoard[4][5] = 3;
  normalBoard[5][4] = 3;
  const [board, setBoard] = useState(normalBoard);
  const [turnColor, setTurnColor] = useState(1);
  const clickHandler = (i: number, j: number) => {
    const clonedBoard = structuredClone(board);
    const { newBoard, turn } = clickBoard({ y: i, x: j }, turnColor, clonedBoard);
    setBoard(newBoard);
    setTurnColor(turn);
  };
  console.log(turnColor);
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div key={`${j}-${i}`} className={styles.cell} onClick={() => clickHandler(i, j)}>
              {cell !== 0 && <div className={styles.stone} style={stoneStyles[cell - 1]} />}
            </div>
          )),
        )}
      </div>
      white {getCount(board)[0]} : {['Black Turn', 'White Turn', 'Game End!'][turnColor - 1]} :{' '}
      {getCount(board)[1]} black
    </div>
  );
};

export default Home;
