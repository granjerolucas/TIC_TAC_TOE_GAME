import { GAME_STATE, MOVE1, MOVE2 } from "./game.js";
import { changeTurn, findWinner, getBox, isCellEmpty } from "./utils.js";
console.log(GAME_STATE);
const SCORE_STATE = {
  player: 0,
  cpu: 0,
  ties: 0,
  currentMove: MOVE1,
};

const gameBoard = document.querySelector(".game-board");
const btnRestart = document.querySelector(".restart button");
const eleCurrentPlayer = document.querySelector(".current-player");
console.log(eleCurrentPlayer);
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
btnRestart.addEventListener("click", () => {
  console.log("restart");
  init(true);
  console.log(SCORE_STATE);
});
const clickCard = (e) => {
  console.log(e);
  console.log(e.currentTarget);
  const target = e.currentTarget;
  // const btn = target.closest("button");
  if (e.currentTarget) {
   
    const [row, col] = e.currentTarget.value.split("-");
    if (!isCellEmpty(row, col)) {
      console.log('ocupado')
      return; 
    }
    GAME_STATE[row][col] = SCORE_STATE.currentMove.id;
    const span = document.createElement("span");
    span.innerText = `${SCORE_STATE.currentMove.label}`;
    if (SCORE_STATE.currentMove.id === MOVE1.id) {
      span.classList.add("x-move");
    } else {
      span.classList.add("o-move");
    }
    console.log(span);
    console.log(GAME_STATE);
    e.currentTarget.replaceChild(span, e.currentTarget.firstChild);
    let res = findWinner([], SCORE_STATE.currentMove);
    if (!res.success) {
      changeTurn(SCORE_STATE, eleCurrentPlayer);
    }
    console.log("resultado", res);
  }
  // console.log(e.currentTarget);
};
function getWinner() {
  for (let i = 0; i < GAME_STATE.length; i++) {
    for (let j = 0; j < GAME_STATE[i].length; j++) {
      if (GAME_STATE[i][j] !== 0) {
        if (i !== 0 && j !== 0) {
          let prev = GAME_STATE[i][j];
          let curr = GAME_STATE[i][j];
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

const init = (reset = false) => {
  gameBoard.innerHTML = "";

  for (let i = 0; i < GAME_STATE.length; i++) {
    for (let j = 0; j < GAME_STATE[i].length; j++) {
      gameBoard.appendChild(getBox(i, j));
    }
  }
  if (reset) {
    SCORE_STATE.currentMove = MOVE2;
    SCORE_STATE.player = 0;
    SCORE_STATE.cpu = 0;
    SCORE_STATE.ties = 0;
    changeTurn(SCORE_STATE, eleCurrentPlayer);
  } else {
    gameBoard.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", clickCard);
    });
  }
};

init();
