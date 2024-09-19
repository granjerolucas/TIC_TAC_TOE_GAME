import { PANEL_STATE, MOVE1, MOVE2 } from "./game.js";
import {
  changeTurn,
  cleanPanelState,
  findWinner,
  getBox,
  isCellEmpty,
} from "./utils.js";
console.log(PANEL_STATE);
function getBaseState () {
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
  }
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
// myModal.show()
console.log(btnGame);

btnGame.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    console.log(e.target.value);

    if (e.target.value === "quit") {
      myModal.classList.remove("show");
      start()
    } else {
      cleanGame(true);
    }

    myModal.classList.remove("show");
  });
});

btnRestarCondition.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    console.log(e.target.value);
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
  modalRestart.classList.add("show");
  
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
    const modBody = myModal.querySelector(".modal-body");

    if (!res.success) {
      changeTurn(GAME_STATE, eleCurrentPlayer);
      if (res.tie) {
        GAME_STATE.player1.score++;
        GAME_STATE.player2.score++;
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
      console.log("chuchas", [...PANEL_STATE]);
      gameBoard.querySelectorAll("button").forEach((btn) => {
        console.log(res.condition);
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
    console.log("resultado", res);
  }
  // console.log(e.currentTarget);
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
    btn.addEventListener("click", clickCard);
  });
}

function init (reset = false) {
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
  cleanGame(reset);
};


function start () {
  containerGame.classList.add("d-none");
  optionsGame.classList.remove("d-none");
  console.log('lanotaaaaaaaaaaa',{ ...getBaseState() });
  GAME_STATE = getBaseState();
  console.log('lanotaaaaaaaaaaa2',{ ...GAME_STATE });
  // init();
}
start();
// init();
