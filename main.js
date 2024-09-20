import { PANEL_STATE, MOVE1, MOVE2 } from "./game.js";
import {
  changeTurn,
  cleanPanelState,
  findWinner,
  getBox,
  isCellEmpty,
} from "./utils.js";
function getBaseState() {
  return {
    player1: {
      moveType: MOVE1,
      isCpu: false,
      score: 0,
    },
    player2: {
      moveType: MOVE2,
      isCpu: false,
      score: 0,
    },
    ties: 0,
    currentMove: MOVE1,
    isVsPlayer: false,
  };
}
var GAME_STATE = getBaseState();

const gameBoard = document.querySelector(".game-board");
const optionsGame = document.querySelector(".options-game");
const containerGame = document.querySelector(".container-game");
const btnRestart = document.querySelector(".restart button");
const btnPlay = document.querySelectorAll(".btn-play");
const eleCurrentPlayer = document.querySelector(".current-player");
const choiseMark = document.querySelectorAll(".choise-mark button");
const btnGame = document.querySelectorAll("#exampleModal .btn-game");
const btnRestarCondition = document.querySelectorAll("#modalRestart .btn-game");

const boxPlayerA = document.querySelector(".playerA");
const boxPlayerTies = document.querySelector(".playerTies");
const boxPlayerB = document.querySelector(".playerB");

const myModal = document.querySelector("#exampleModal");
const modalRestart = document.querySelector("#modalRestart");

btnGame.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (e.target.value === "quit") {
      myModal.classList.remove("show");
      start();
    } else {
      //next
      cleanGame(true);
      initCpu();
    }

    myModal.classList.remove("show");
  });
});

btnRestarCondition.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (e.target.value === "yes") {
      // cleanGame(true);
      modalRestart.classList.remove("show");
      start();
    } else {
      modalRestart.classList.remove("show");
    }
  });
});

btnPlay.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.value === "cpu") {
      GAME_STATE.player1.isCpu = false;
      GAME_STATE.player2.isCpu = true;
      // if (GAME_STATE.player1.moveType.id === MOVE1.id) {
      //   GAME_STATE.player1.isCpu = false;
      //   GAME_STATE.player2.isCpu = true;
      // } else {
      //   GAME_STATE.player1.isCpu = true;
      //   GAME_STATE.player2.isCpu = false;
      // }
      GAME_STATE.isVsPlayer = true;
    } else {
      GAME_STATE.player1.isCpu = false;
      GAME_STATE.player2.isCpu = false;
    }
    init(true);
  });
});

choiseMark.forEach((btn) => {
  btn.addEventListener("click", () => {
    for (let i = 0; i < btn.parentNode.children.length; i++) {
      btn.parentNode.children[i].classList.remove("active");
    }
    btn.classList.add("active");
    [MOVE1, MOVE2].forEach((move) => {
      if (+move.id === +btn.value) {
        GAME_STATE.player1.moveType = move;
      } else {
        GAME_STATE.player2.moveType = move;
      }
    });
  });
});
btnRestart.addEventListener("click", () => {
  modalRestart.classList.add("show");
});
const clickCard = (e) => {
  if (e.currentTarget) {
    const [row, col] = e.currentTarget.value.split("-");
    if (!isCellEmpty(row, col)) {
      return;
    }
    PANEL_STATE[row][col] = GAME_STATE.currentMove.id;
    const span = document.createElement("span");
    span.innerText = `${GAME_STATE.currentMove.label}`;
    if (GAME_STATE.currentMove.id === MOVE1.id) {
      span.classList.add("x-move");
    } else {
      span.classList.add("o-move");
    }
    e.currentTarget.replaceChild(span, e.currentTarget.firstChild);
    let res = findWinner([], GAME_STATE.currentMove);
    const modBody = myModal.querySelector(".modal-body");

    if (!res.success) {
      changeTurn(GAME_STATE, eleCurrentPlayer);
      if (
        GAME_STATE.isVsPlayer &&
        GAME_STATE.player2.moveType.id === GAME_STATE.currentMove.id
      ) {
        moveCpu(GAME_STATE.player2);
      }
      if (res.tie) {
        GAME_STATE.ties++;
        drawScore();
        modBody.querySelectorAll("p")[0].innerText = "TIE!";
        myModal.classList.add("show");
      }
    } else {
      if (+res.player.id === +GAME_STATE.player1.moveType.id) {
        GAME_STATE.player1.score++;
      } else {
        GAME_STATE.player2.score++;
      }

      drawScore();
      // cleanGame(true);
      gameBoard.querySelectorAll("button").forEach((btn) => {
        res.condition.forEach((val) => {
          if (btn.value === `${val[0]}-${val[1]}`) {
            btn.classList.add("win");
          }
        });
      });
      modBody.querySelectorAll("p")[0].innerText = "YOU WON!";

      if (res.player.id === MOVE1.id) {
        modBody.classList.add("x-win");
        modBody.classList.remove("o-win");
        modBody.querySelector("span").innerText = "X";
      } else {
        modBody.classList.add("o-win");
        modBody.classList.remove("x-win");
        modBody.querySelector("span").innerText = "O";
      }

      myModal.classList.add("show");
    }
  }
};
function drawScore() {
  boxPlayerTies.querySelector("span").innerText = GAME_STATE.ties;
  if (GAME_STATE.player1.moveType.id === MOVE1.id) {
    boxPlayerA.querySelector("span").innerText = GAME_STATE.player1.score;
    boxPlayerB.querySelector("span").innerText = GAME_STATE.player2.score;
  } else {
    boxPlayerA.querySelector("span").innerText = GAME_STATE.player2.score;
    boxPlayerB.querySelector("span").innerText = GAME_STATE.player1.score;
  }
}
function getWinner() {
  for (let i = 0; i < PANEL_STATE.length; i++) {
    for (let j = 0; j < PANEL_STATE[i].length; j++) {
      if (PANEL_STATE[i][j] !== 0) {
        if (i !== 0 && j !== 0) {
          let prev = PANEL_STATE[i][j];
          let curr = PANEL_STATE[i][j];
        }
        // let prev = GAME_STATE[i - 1][j - 1];
      }
    }
  }
}

function moveCpu(cpuPlayer) {
  setTimeout(() => {
    let row = Math.floor(Math.random() * 3);
    let col = Math.floor(Math.random() * 3);
    while (!isCellEmpty(row, col)) {
      row = Math.floor(Math.random() * 3);
      col = Math.floor(Math.random() * 3);
    }
    document.getElementById(`cell-${row}-${col}`).click();
  }, 1000);
}

function cleanGame(reset = false) {
  gameBoard.innerHTML = "";

  for (let i = 0; i < PANEL_STATE.length; i++) {
    for (let j = 0; j < PANEL_STATE[i].length; j++) {
      gameBoard.appendChild(getBox(i, j));
    }
  }
  cleanPanelState();
  if (reset) {
    GAME_STATE.currentMove = MOVE2;
    changeTurn(GAME_STATE, eleCurrentPlayer);
  }

  gameBoard.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", clickCard);
  });
}

function init(reset = false) {
  containerGame.classList.remove("d-none");
  optionsGame.classList.add("d-none");

  if (GAME_STATE.player1.moveType.id === MOVE1.id) {
    boxPlayerA.querySelector("p").innerText = `X (PLAYER 1)`;
    boxPlayerB.querySelector("p").innerText = `O (${
      GAME_STATE.isVsPlayer ? "CPU" : "PLAYER 2"
    })`;

    boxPlayerA.querySelector("span").innerText = GAME_STATE.player1.score;
    boxPlayerB.querySelector("span").innerText = GAME_STATE.player2.score;
  } else {
    boxPlayerA.querySelector("p").innerText = `X (${
      GAME_STATE.isVsPlayer ? "CPU" : "PLAYER 2"
    })`;
    boxPlayerB.querySelector("p").innerText = `O (PLAYER 1)`;
  }
  boxPlayerTies.querySelector("span").innerText = 0;
  boxPlayerB.querySelector("span").innerText = 0;
  boxPlayerA.querySelector("span").innerText = 0;
  cleanGame(reset);
  initCpu();
}

function initCpu() {
  if (GAME_STATE.isVsPlayer) {
    if (
      GAME_STATE.player2.moveType.id === MOVE1.id &&
      GAME_STATE.player2.isCpu
    ) {
      moveCpu(GAME_STATE.player2);
    }
  }
}

function start() {
  containerGame.classList.add("d-none");
  optionsGame.classList.remove("d-none");
  GAME_STATE = getBaseState();
}
start();
