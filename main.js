import { PANEL_STATE, MOVE1, MOVE2 } from "./game.js";
import {
  changeTurn,
  cleanPanelState,
  findWinner,
  getBox,
  isCellEmpty,
} from "./utils.js";
console.log(PANEL_STATE);

const GAME_STATE = {
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

const gameBoard = document.querySelector(".game-board");
const optionsGame = document.querySelector(".options-game");
const containerGame = document.querySelector(".container-game");
const btnRestart = document.querySelector(".restart button");
const btnPlay = document.querySelectorAll(".btn-play");
const eleCurrentPlayer = document.querySelector(".current-player");
const choiseMark = document.querySelectorAll(".choise-mark button");

const boxPlayerA = document.querySelector(".playerA");
const boxPlayerTies = document.querySelector(".playerTies");
const boxPlayerB = document.querySelector(".playerB");

const myModal = new bootstrap.Modal('#exampleModal')

console.log(choiseMark);

btnPlay.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.value === "cpu") {
      GAME_STATE.player1.isCpu = false;
      GAME_STATE.player2.isCpu = true;
    } else {
      GAME_STATE.player1.isCpu = false;
      GAME_STATE.player2.isCpu = false;
    }

    init(true);
  });
});
// gameBoard.addEventListener("click", );

// function rrrr(prevValue, indexRow = 0, indexCol = 0) {
//   console.log(prevValue, indexRow, indexCol);
//   let current = GAME_STATE[indexRow][indexCol];
//   if (prevValue == current) {
//     return rrrr(current, indexRow, indexCol + 1);
//   } else {
//     return rrrr(current, indexRow + 1, 0);
//   }
// }
choiseMark.forEach((btn) => {
  console.log(btn);
  btn.addEventListener("click", () => {
    console.log(btn.parentNode);
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
  console.log("restart");
  init(true);
  console.log(GAME_STATE);
});
const clickCard = (e) => {
  console.log(e);
  console.log(e.currentTarget);
  const target = e.currentTarget;
  // const btn = target.closest("button");
  if (e.currentTarget) {
    const [row, col] = e.currentTarget.value.split("-");
    if (!isCellEmpty(row, col)) {
      console.log("ocupado");
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
    console.log(span);
    console.log(PANEL_STATE);
    e.currentTarget.replaceChild(span, e.currentTarget.firstChild);
    let res = findWinner([], GAME_STATE.currentMove);
    if (!res.success) {
      changeTurn(GAME_STATE, eleCurrentPlayer);
    } else {
      console.log("resultado", "Show modal", res.player, { ...GAME_STATE });
      if (+res.player.id === +GAME_STATE.player1.moveType.id) {
        GAME_STATE.player1.score++;
      } else {
        GAME_STATE.player2.score++;
      }
      drawScore();
      cleanGame(true);
      console.log('chuchas', [...PANEL_STATE]);
    }
    console.log("resultado", res);
  }
  // console.log(e.currentTarget);
};
function drawScore() {
  boxPlayerTies.querySelector("span").innerText = GAME_STATE.ties;
  if (GAME_STATE.player1.id === MOVE1.id) {
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
          console.log(prev, curr);
        }
        // let prev = GAME_STATE[i - 1][j - 1];
      }
    }
  }
  // GAME_STATE.forEach((val, i) => {
  //   val.forEach((valS, j) => {
  //     console.log(i, j);

  //   });
  // });
}

// getWinner();

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
    //   GAME_STATE.player1.score = 0;
    //   GAME_STATE.player1.score = 0;
    //   GAME_STATE.cpu = 0;
    //   GAME_STATE.ties = 0;
    changeTurn(GAME_STATE, eleCurrentPlayer);
  }
  // } else {
  // }
  gameBoard.querySelectorAll("button").forEach((btn) => {
    console.log(btn);
    btn.addEventListener("click", clickCard);
  });
}

const init = (reset = false) => {
  containerGame.classList.remove("d-none");
  optionsGame.classList.add("d-none");
  console.log({ ...GAME_STATE });

  if (GAME_STATE.player1.moveType.id === MOVE1.id) {
    boxPlayerA.querySelector("p").innerText = `X (PLAYER 1)`;
    boxPlayerB.querySelector("p").innerText = `O (PLAYER 2)`;

    boxPlayerA.querySelector("span").innerText = GAME_STATE.player1.score;
    boxPlayerB.querySelector("span").innerText = GAME_STATE.player2.score;
  } else {
    boxPlayerA.querySelector("p").innerText = `X (PLAYER 2)`;
    boxPlayerB.querySelector("p").innerText = `O (PLAYER 1)`;
  }
  boxPlayerTies.querySelector("span").innerText = 0;
  boxPlayerB.querySelector("span").innerText = 0;
  boxPlayerA.querySelector("span").innerText = 0;
  cleanGame();
};

// init();
