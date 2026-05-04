(function (root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.NeoTetrisLogic = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : this), function () {
  "use strict";

  const COLS = 10;
  const ROWS = 20;
  const LINE_POINTS = [0, 100, 300, 500, 800];
  const BASE_DROP_INTERVAL = 800;
  const SOFT_DROP_INTERVAL = 50;
  const MIN_DROP_INTERVAL = 80;

  const COLORS = {
    I: "#00FFFF",
    O: "#FFE500",
    T: "#FF00FF",
    S: "#00FF00",
    Z: "#FF3333",
    J: "#3366FF",
    L: "#FF8800"
  };

  const SHAPES = {
    I: [[[0, 0], [0, 1], [0, 2], [0, 3]], [[0, 0], [1, 0], [2, 0], [3, 0]],
      [[0, 0], [0, 1], [0, 2], [0, 3]], [[0, 0], [1, 0], [2, 0], [3, 0]]],
    O: [[[0, 0], [0, 1], [1, 0], [1, 1]], [[0, 0], [0, 1], [1, 0], [1, 1]],
      [[0, 0], [0, 1], [1, 0], [1, 1]], [[0, 0], [0, 1], [1, 0], [1, 1]]],
    T: [[[0, 0], [0, 1], [0, 2], [1, 1]], [[0, 1], [1, 0], [1, 1], [2, 1]],
      [[1, 0], [1, 1], [1, 2], [0, 1]], [[0, 0], [1, 0], [1, 1], [2, 0]]],
    S: [[[0, 1], [0, 2], [1, 0], [1, 1]], [[0, 0], [1, 0], [1, 1], [2, 1]],
      [[0, 1], [0, 2], [1, 0], [1, 1]], [[0, 0], [1, 0], [1, 1], [2, 1]]],
    Z: [[[0, 0], [0, 1], [1, 1], [1, 2]], [[0, 1], [1, 0], [1, 1], [2, 0]],
      [[0, 0], [0, 1], [1, 1], [1, 2]], [[0, 1], [1, 0], [1, 1], [2, 0]]],
    J: [[[0, 0], [1, 0], [1, 1], [1, 2]], [[0, 0], [0, 1], [1, 0], [2, 0]],
      [[0, 0], [0, 1], [0, 2], [1, 2]], [[0, 0], [1, 0], [2, 0], [2, -1]]],
    L: [[[0, 2], [1, 0], [1, 1], [1, 2]], [[0, 0], [1, 0], [2, 0], [2, 1]],
      [[0, 0], [0, 1], [0, 2], [1, 0]], [[0, 0], [0, 1], [1, 1], [2, 1]]]
  };

  const PIECE_TYPES = Object.keys(SHAPES);

  function createBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  }

  function shuffleBag(random = Math.random) {
    const bag = PIECE_TYPES.slice();

    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }

    return bag;
  }

  function nextFromBag(bag, random = Math.random) {
    if (!Array.isArray(bag)) {
      throw new TypeError("bag must be an array");
    }

    if (bag.length === 0) {
      bag.push(...shuffleBag(random));
    }

    return bag.pop();
  }

  function isValid(board, type, rotation, row, col) {
    const shape = SHAPES[type][rotation];

    for (const [dr, dc] of shape) {
      const r = row + dr;
      const c = col + dc;

      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) {
        return false;
      }

      if (board[r][c]) {
        return false;
      }
    }

    return true;
  }

  function spawnPiece(type) {
    const rotation = 0;
    const col = Math.floor((COLS - 4) / 2);
    const shape = SHAPES[type][rotation];
    const minR = Math.min(...shape.map((cell) => cell[0]));

    return { type, rotation, row: minR === 0 ? 0 : -minR, col };
  }

  function computeScoreForLines(count, level) {
    return LINE_POINTS[count] * level;
  }

  function computeDropInterval(level) {
    return Math.max(MIN_DROP_INTERVAL, BASE_DROP_INTERVAL - (level - 1) * 60);
  }

  function clearCompletedLines(board) {
    const clearedRows = [];
    const remainingRows = [];

    for (let row = 0; row < ROWS; row++) {
      if (board[row].every((cell) => cell !== null)) {
        clearedRows.push(row);
      } else {
        remainingRows.push(board[row].slice());
      }
    }

    const nextBoard = Array.from({ length: clearedRows.length }, () => Array(COLS).fill(null)).concat(remainingRows);

    return { board: nextBoard, clearedRows };
  }

  return {
    COLS,
    ROWS,
    LINE_POINTS,
    BASE_DROP_INTERVAL,
    SOFT_DROP_INTERVAL,
    MIN_DROP_INTERVAL,
    COLORS,
    SHAPES,
    PIECE_TYPES,
    createBoard,
    shuffleBag,
    nextFromBag,
    isValid,
    spawnPiece,
    computeScoreForLines,
    computeDropInterval,
    clearCompletedLines
  };
});