const test = require("node:test");
const assert = require("node:assert/strict");

const logic = require("../tetris-logic");

test("createBoard returns an empty 20x10 board", () => {
  const board = logic.createBoard();

  assert.equal(board.length, logic.ROWS);
  assert.equal(board[0].length, logic.COLS);
  assert.equal(board[19].length, logic.COLS);
  assert.equal(board[0].every((cell) => cell === null), true);
  assert.notEqual(board[0], board[1]);
});

test("shuffleBag returns each piece type exactly once", () => {
  const bag = logic.shuffleBag(() => 0);

  assert.equal(bag.length, logic.PIECE_TYPES.length);
  assert.deepEqual([...bag].sort(), [...logic.PIECE_TYPES].sort());
});

test("nextFromBag refills and drains the bag", () => {
  const bag = ["I"];

  assert.equal(logic.nextFromBag(bag), "I");
  assert.equal(bag.length, 0);

  const firstRefillDraw = logic.nextFromBag(bag, () => 0);
  assert.equal(logic.PIECE_TYPES.includes(firstRefillDraw), true);
  assert.equal(bag.length, logic.PIECE_TYPES.length - 1);
});

test("spawnPiece centers pieces at the top", () => {
  assert.deepEqual(logic.spawnPiece("O"), { type: "O", rotation: 0, row: 0, col: 3 });
  assert.deepEqual(logic.spawnPiece("I"), { type: "I", rotation: 0, row: 0, col: 3 });
});

test("isValid rejects walls and collisions", () => {
  const board = logic.createBoard();
  board[19][0] = "Z";

  assert.equal(logic.isValid(board, "O", 0, 0, 0), true);
  assert.equal(logic.isValid(board, "O", 0, 0, -1), false);
  assert.equal(logic.isValid(board, "O", 0, 18, 0), false);
});

test("clearCompletedLines removes full rows and pads at the top", () => {
  const board = logic.createBoard();

  board[18] = Array(logic.COLS).fill("I");
  board[19] = Array(logic.COLS).fill("T");
  board[17][0] = "L";

  const result = logic.clearCompletedLines(board);

  assert.equal(result.clearedRows.length, 2);
  assert.deepEqual(result.clearedRows, [18, 19]);
  assert.equal(result.board.length, logic.ROWS);
  assert.equal(result.board[0].every((cell) => cell === null), true);
  assert.equal(result.board[1].every((cell) => cell === null), true);
  assert.equal(result.board[19][0], "L");
});

test("score and speed helpers match the architecture", () => {
  assert.equal(logic.computeScoreForLines(1, 4), 400);
  assert.equal(logic.computeScoreForLines(4, 3), 2400);
  assert.equal(logic.computeDropInterval(1), logic.BASE_DROP_INTERVAL);
  assert.equal(logic.computeDropInterval(20), logic.MIN_DROP_INTERVAL);
});