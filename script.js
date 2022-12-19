// Declare global variables.
// =========================================================================================
let board = [];
let player = "BLUE";

// Create array of arrays, storing "" as value.
// =========================================================================================
// Example: const board = [
//   ["", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", ""],
// ];
for (let x = 1; x <= 6; x++) {
  let innerboard = [];
  board.push(innerboard);
  for (let y = 1; y <= 7; y++) {
    innerboard.push("");
  }
}

// Display board using values stored in array.
// =========================================================================================
function displayBoard(board) {
  // reset board each time function is called, so as to display latest state of array
  document.querySelector("#board").innerHTML = "";
  document.querySelector("#current-turn").innerText = `${player}'S TURN`; // player is set as global variable, hence can access here
  for (let row = 0; row < board.length; row++) {
    const newRow = document.createElement("tr");
    newRow.setAttribute("class", "row");
    document.querySelector("#board").append(newRow);
    for (let col = 0; col < board[row].length; col++) {
      const circle = document.createElement("td");
      circle.innerText = row + ", " + col;
      circle.setAttribute("yPos", row);
      circle.setAttribute("xPos", col);
      circle.setAttribute("class", "circle");
      // add class to change color (refer to line 49 above)
      if (board[row][col] !== "") {
        circle.classList.add(board[row][col]);
      }
      newRow.append(circle);
      circle.addEventListener("click", handleClick);
    }
  }
}
displayBoard(board);

// Handle click by user.
// =========================================================================================
function handleClick(e) {
  let yPos = Number(e.target.getAttribute("yPos"));
  let xPos = Number(e.target.getAttribute("xPos"));
  if (
    checkIfNotOccupied(yPos, xPos) === true &&
    checkIfSpaceBelowIsOccupied(yPos, xPos) === true
  ) {
    board[yPos][xPos] = player;

    checkWin(player);
    if (player === "BLUE") {
      player = "RED";
    } else {
      player = "BLUE";
    }
    displayBoard(board);
  } else {
    return alert("Please select another circle");
  }
}

// Check if space is occupied, if occupied, cannot place move.
// =========================================================================================
function checkIfNotOccupied(yPos, xPos) {
  if (board[yPos][xPos] !== "") {
    return false;
  }
  return true;
}

// This check is not applicable for first row. Check if space below is occupied, if occupied, can place move.
// =========================================================================================
function checkIfSpaceBelowIsOccupied(yPos, xPos) {
  if (yPos <= 4) {
    if (board[yPos + 1][xPos] !== "") {
      return true;
    }
    return false;
  } else {
    return true;
  }
}

// Check for four straights for every position
// =========================================================================================
function checkWin(player) {
  let count = 0;
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === "") {
        count += 0;
      } else {
        count += 1;
      }
      if (count > 41) {
        return alert(`It's a tie!`);
      }
      // check 4 to the right same color
      if (
        checkPositionMatchesPlayer(row, col, player) && // is this blue?
        checkPositionMatchesPlayer(row, col + 1, player) && // is this also blue?
        checkPositionMatchesPlayer(row, col + 2, player) && // is this also blue?
        checkPositionMatchesPlayer(row, col + 3, player) // is this also blue?
      ) {
        return alert(`${player} wins!`);
      }

      // check 4 below to the same color
      if (
        checkPositionMatchesPlayer(row, col, player) &&
        checkPositionMatchesPlayer(row + 1, col, player) &&
        checkPositionMatchesPlayer(row + 2, col, player) &&
        checkPositionMatchesPlayer(row + 3, col, player)
      ) {
        return alert(`${player} wins!`);
      }
      // check 4 diagnonally left up to the same color
      if (
        checkPositionMatchesPlayer(row, col, player) &&
        checkPositionMatchesPlayer(row - 1, col - 1, player) &&
        checkPositionMatchesPlayer(row - 2, col - 2, player) &&
        checkPositionMatchesPlayer(row - 3, col - 3, player)
      ) {
        return alert(`${player} wins!`);
      }
      // check 4 diagnonally right up to the same color
      if (
        checkPositionMatchesPlayer(row, col, player) &&
        checkPositionMatchesPlayer(row - 1, col + 1, player) &&
        checkPositionMatchesPlayer(row - 2, col + 2, player) &&
        checkPositionMatchesPlayer(row - 3, col + 3, player)
      ) {
        return alert(`${player} wins!`);
      }
    }
  }
}

// Check if player has a token in that position, i.e. if color of position === color of player
// =========================================================================================
function checkPositionMatchesPlayer(yPos, xPos, player) {
  return getTokenInPosition(yPos, xPos) === player;
}

// Return color of position (i.e. value of "BLUE" or "RED") based on coordinates (yPos, xPos) passed in.
// =========================================================================================
function getTokenInPosition(yPos, xPos) {
  if (
    yPos >= 0 &&
    yPos < board.length &&
    xPos >= 0 &&
    xPos < board[yPos].length
  ) {
    return board[yPos][xPos];
  }
  return "";
}

// To Do ==================
// tie game - done
// rearrange functions for readability (order of sequence), so to do that need to change arrow function to declarative function (has hoisting) - done
// rematch button
// display last circle before showing win alert
// intro page to press PLAY
// animation drop from above, maybe spaceship, beam a ball down
// game instructions on page
// readme on github
