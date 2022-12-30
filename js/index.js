let start = false;

let boxes = document.getElementsByClassName("box");
var board = [
  [" ", " ", " "],
  [" ", " ", " "],
  [" ", " ", " "],
];

let human = "X";
let Computer = "O";

let turn = Math.random() < 0.5;

let startButton = document.getElementById("start");
let resetButton = document.getElementById("reset");

let turnText = document.getElementById("turnText");
let winText = document.getElementById("winText");

let level = null;

startButton.onclick = function () {
  level = getCheckedButton();
  if (level === undefined) {
    alert("Please select the level and then Press start button");
    return;
  }
  if (!start) {
    reset();
    start = true;
    if (turn) {
      turnText.textContent = "It's Your Turn";
    } else {
      computerPlay();
    }
  }
};
resetButton.addEventListener("click", reset);

function reset() {
  start = false;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      board[i][j] = " ";
    }
    turn = Math.random() < 0.5;
    renderBoard();
    turnText.textContent = "";
    turn = Math.random() < 0.5;
    winText.textContent = "";
  }
}

function renderBoard() {
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].textContent = board[Math.floor(i / 3)][i % 3];
  }
}
for (let i = 0; i < boxes.length; i++) {
  boxes[i].addEventListener("click", function (e) {
    if (start) {
      humanMove(this);
    } else {
      alert("please Select the level And Press Start game to start the game");
    }
  });
}

function dumbComputerMove() {
  let row = Math.floor(Math.random() * 3);
  let col = Math.floor(Math.random() * 3);
  if (isSpotAvailable()) {
    while (board[row][col] !== " ") {
      row = Math.floor(Math.random() * 3);
      col = Math.floor(Math.random() * 3);
    }
  } else {
    return;
  }
  board[row][col] = Computer;
  turnText.textContent = "Computer Played at: " + (row * 3 + col + 1);
  let state = checkBoardState();
  if (state) {
    winningDisplay(state);
  }
  renderBoard();
}

function humanMove(ele) {
  let flag = false;
  let num = parseInt(ele.getAttribute("id")) - 1;
  let row = Math.floor(num / 3);
  let col = num % 3;
  if (board[row][col] === " ") {
    flag = true;
    board[row][col] = human;
    renderBoard();
  }
  let state = checkBoardState();
  if (flag && state) {
    winningDisplay(state);
    return;
  }
  if (flag) {
    computerPlay();
  }
}

function isSpotAvailable() {
  let cnt = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === " ") {
        cnt++;
      }
    }
  }
  return cnt > 0;
}

function winningDisplay(state) {
  start = false;
  flag = false;
  if (state === "tie") {
    winText.textContent = "It's a Tie";
  } else {
    winText.textContent = state + " won!!";
  }
}
function checkBoardState() {
  let winner = " ";

  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] !== " " &&
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2]
    ) {
      winner = board[i][0];
      return winner;
    }
  }
  for (let i = 0; i < 3; i++) {
    if (
      board[0][i] !== " " &&
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i]
    ) {
      winner = board[0][i];
      return winner;
    }
  }
  if (
    board[0][0] !== " " &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  ) {
    winner = board[0][0];
    return winner;
  }
  if (
    board[0][2] !== " " &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  ) {
    winner = board[0][2];
    return winner;
  }
  if (!isSpotAvailable()) {
    return "tie";
  }
  return null;
}

function Minimax(board, computer, human, maximizing) {
  winner = checkBoardState();
  if (winner === human) {
    return -1;
  } else if (winner === computer) {
    return 1;
  } else if (winner === "tie") {
    return 0;
  }

  if (maximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === " ") {
          board[i][j] = Computer;
          bestScore = Math.max(
            bestScore,
            Minimax(board, computer, human, false)
          );
          board[i][j] = " ";
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === " ") {
          board[i][j] = human;
          bestScore = Math.min(
            bestScore,
            Minimax(board, computer, human, true)
          );
          board[i][j] = " ";
        }
      }
    }
    return bestScore;
  }
}

function smartComputer() {
  let move;
  let bestScore = -Infinity;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === " ") {
        board[i][j] = Computer;
        let score = Minimax(board, Computer, human, false);
        if (bestScore < score) {
          bestScore = score;
          move = [i, j];
        }
        board[i][j] = " ";
      }
    }
  }
  let row = move[0];
  let col = move[1];
  board[row][col] = Computer;
  turnText.textContent = "Computer Played at: " + (row * 3 + col + 1);
  let state = checkBoardState();
  if (state) {
    winningDisplay(state);
  }
  renderBoard();
}

function computerPlay() {
  if (level === "easy") {
    dumbComputerMove();
  } else if (level === "medium") {
    HybridComputer();
  } else {
    smartComputer();
  }
}

function HybridComputer() {
  let turn = Math.random() < 0.5;
  if (turn) {
    smartComputer();
    turn = !turn;
  } else {
    dumbComputerMove();
    turn = !turn;
  }
}

function getCheckedButton() {
  var button = document.getElementsByName("level");
  for (let i = 0; i < button.length; i++) {
    if (button[i].checked) {
      return button[i].value;
    }
  }
}
