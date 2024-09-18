import { GAME_STATE, MOVE1, MOVE2, WIN_CONDITION } from "./game.js";

{
  /* <div class="card-action shadow-sm">
  <button value="0-0">A</button>
</div>; */
}
export function getBox(row, col) {
  let div = document.createElement("div");
  div.classList.add("card-action", "shadow-sm");
  let btn = document.createElement("button");
  let span = document.createElement("span");
  btn.value = `${row}-${col}`;
  // btn.innerText = "-";
  // btn.innerText = `${row}-${col}`;
  span.innerText = ``;
  btn.appendChild(span);
  div.appendChild(btn);
  return div;
}

export function findWinner(_panelState, currentMove) {
  let panelState = [...GAME_STATE];
  console.log("findWinner panelState", panelState);
  console.log("findWinner WIN_CONDITION", WIN_CONDITION);
  // let winCondition = WIN_CONDITION[currentMove.id - 1];
  let count = 0;
  for (let i = 0; i < WIN_CONDITION.length; i++) {
    let success = true;
    for (let j = 0; j < WIN_CONDITION[i].length; j++) {
      let [row, col] = WIN_CONDITION[i][j];

      if (GAME_STATE[row][col] === 0) {
        //   // continue;
        success = false;
        console.log("findWinner omitir en", row, col);
        continue;

        //   break;
      } else {
        console.log("findWinner cond", row, col);
        console.log("findWinner state", GAME_STATE[row][col]);
        if (currentMove.id !== GAME_STATE[row][col]) {
          success = false;
        }
      }
      count++;
    }
    if (success) {
      console.log("findWinner won", currentMove);
      // break;
      // return true;
      return {
        player: currentMove.id,
        success: true,
        tie: false
      };
    }
    // if (!success) {
    //   break;
    // }
    console.log("findWinner cond -----------------------");

    // let row = WIN_CONDITION[i][0];
    // let col = WIN_CONDITION[i][1];
    // console.log('findWinner', row, col);
    // if (panelState[row][col] === currentMove.id) {
    //   return panelState[row][col];
    // }
  }
  console.log("findWinner count isEmpate", count);
  // return false;
  return {
    player: 0,
    success: false,
    tie: count === 24
  };
}
/**
 *
 * @param {*} state
 * @param {HTMLDivElement}  nodeElement
 */
export function changeTurn(state, nodeElement) {
  let currentTurn = state.currentMove.id;
  const nextTurn = currentTurn === MOVE1.id ? MOVE2 : MOVE1;
  if (nextTurn.id !== MOVE1.id) {
    nodeElement.querySelector("button").classList.remove("x-turn");
    nodeElement.querySelector("button").classList.add("o-turn");
  } else {
    nodeElement.querySelector("button").classList.remove("o-turn");
    nodeElement.querySelector("button").classList.add("x-turn");
  }
  state.currentMove = nextTurn;
  nodeElement.querySelector(".current-turn").innerText = nextTurn.label;
}

export function isCellEmpty(row, col) {
  return GAME_STATE[row][col] === 0;
}
