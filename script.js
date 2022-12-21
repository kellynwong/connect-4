// Declare global variables.
// =========================================================================================
let board = [];
let numRows = 6;
let numCols = 7;
let currentPlayer = "YELLOW";
let results = false;
let yellowWins = 0;
let redWins = 0;

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
function generateBoard() {
  board = [];
  for (let x = 1; x <= numRows; x++) {
    let innerboard = [];
    board.push(innerboard);
    for (let y = 1; y <= numCols; y++) {
      innerboard.push("");
    }
  }
}

// Display board using values stored in array.
// =========================================================================================
function displayBoard(board) {
  const statusElement = document.querySelector("#current-turn");
  // reset board each time function is called, so as to display latest state of array
  document.querySelector("#board").innerHTML = "";

  // player is set as global variable, hence can access here
  statusElement.innerText = `${currentPlayer}'S 
  TURN`;
  statusElement.setAttribute("class", currentPlayer);

  // display scores on board
  if (results === "YELLOW") {
    yellowWins += 1;
  } else if (results === "RED") {
    redWins += 1;
  }
  document.querySelector("#yellow-wins").innerText = yellowWins;
  document.querySelector("#red-wins").innerText = redWins;

  for (let row = 0; row < board.length; row++) {
    // Make a new row
    const newRow = document.createElement("tr");
    newRow.setAttribute("class", "row");
    document.querySelector("#board").append(newRow);

    // Add circles to the row
    for (let col = 0; col < board[row].length; col++) {
      const circle = document.createElement("td");
      circle.innerText = row + ", " + col;
      circle.setAttribute("yPos", row);
      circle.setAttribute("xPos", col);
      circle.setAttribute("class", "circle");

      // add class to change color
      if (board[row][col] !== "") {
        circle.classList.add(board[row][col]);
      }

      // add this circle to the row
      newRow.append(circle);
      circle.addEventListener("click", handleClick);

      // display final results of game
      if (results === "TIE") {
        statusElement.innerText = `It's a TIE!`;
        statusElement.setAttribute("class", "GREY");
      } else if (results === "YELLOW" || results === "RED") {
        statusElement.innerText = `${results} 
        WINS!`;
        statusElement.setAttribute("class", results); // change color
      }
    }
  }

  // Handle click by user.
  // =========================================================================================
  function handleClick(e) {
    if (results) {
      // if there is a result for the current game, then it's completed so don't let the user click
      return;
    }
    let yPos = Number(e.target.getAttribute("yPos"));
    let xPos = Number(e.target.getAttribute("xPos"));
    if (
      checkIfNotOccupied(yPos, xPos) === true &&
      checkIfSpaceBelowIsOccupied(yPos, xPos) === true
    ) {
      board[yPos][xPos] = currentPlayer; // assign the space on the board to the player

      results = checkWin(currentPlayer); // check the winner and store in the results

      // move the turn to the next player
      if (currentPlayer === "YELLOW") {
        currentPlayer = "RED";
      } else {
        currentPlayer = "YELLOW";
      }

      displayBoard(board);
    } else {
      // return alert("Please select another circle");
    }
  }
}
// Check if space is occupied, if occupied, cannot place move.
// =========================================================================================
function checkIfNotOccupied(yPos, xPos) {
  // if the board space is empty then the player can place a piece there
  return board[yPos][xPos] === "";
}

// This check is not applicable for first row. Check if space below is occupied, if occupied, can place move.
// =========================================================================================
function checkIfSpaceBelowIsOccupied(yPos, xPos) {
  // if space below has a piece, player can place a piece on space
  // no need to check first row of board because anywhere can put (space below is ground)
  if (yPos === numRows - 1) {
    return true;
  }

  // if space below is not nothing then return true
  return board[yPos + 1][xPos] !== "";
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
      if (count >= numRows * numCols) {
        return "TIE";
      }
      // check 4 to the right same color
      if (
        checkSpaceHasPlayerColor(row, col, player) && // is this YELLOW?
        checkSpaceHasPlayerColor(row, col + 1, player) && // is this also YELLOW?
        checkSpaceHasPlayerColor(row, col + 2, player) && // is this also YELLOW?
        checkSpaceHasPlayerColor(row, col + 3, player) // is this also YELLOW?
      ) {
        return player;
      }

      // check 4 below to the same color
      if (
        checkSpaceHasPlayerColor(row, col, player) &&
        checkSpaceHasPlayerColor(row + 1, col, player) &&
        checkSpaceHasPlayerColor(row + 2, col, player) &&
        checkSpaceHasPlayerColor(row + 3, col, player)
      ) {
        return player;
      }
      // check 4 diagnonally left up to the same color
      if (
        checkSpaceHasPlayerColor(row, col, player) &&
        checkSpaceHasPlayerColor(row - 1, col - 1, player) &&
        checkSpaceHasPlayerColor(row - 2, col - 2, player) &&
        checkSpaceHasPlayerColor(row - 3, col - 3, player)
      ) {
        return player;
      }
      // check 4 diagnonally right up to the same color
      if (
        checkSpaceHasPlayerColor(row, col, player) &&
        checkSpaceHasPlayerColor(row - 1, col + 1, player) &&
        checkSpaceHasPlayerColor(row - 2, col + 2, player) &&
        checkSpaceHasPlayerColor(row - 3, col + 3, player)
      ) {
        return player;
      }
    }
  }
  return false;
}

// Check if player has a token in that position, i.e. if color of position === color of player
// =========================================================================================
function checkSpaceHasPlayerColor(yPos, xPos, player) {
  return getTokenInSpace(yPos, xPos) === player;
}

// Return color of position (i.e. value of "YELLOW" or "RED") based on coordinates (yPos, xPos) passed in.
// =========================================================================================
function getTokenInSpace(yPos, xPos) {
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

// Starts a match, or generate new board when user clicks rematch
// =========================================================================================
function startMatch(e) {
  generateBoard();
  results = "";
  displayBoard(board);
}

document.querySelector("button").addEventListener("click", startMatch);
startMatch();

// Display popup instructions upon clicking on instructions
function displayInstructions() {
  let popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}

// Get player 1 and 2 names
function getNames() {
  let player1 = document.getElementById("name1").value;
  let player2 = document.getElementById("name2").value;
  console.log(player1);
  console.log(player2);
  let cover = document.getElementById("cover");
  cover.classList.toggle("hide");
}

// For Testing
// =========================================================================================
/*
console.log("Testing for tie");
board = JSON.parse(
  '[["RED","YELLOW","RED","YELLOW","RED","YELLOW","RED"],["RED","RED","YELLOW","RED","YELLOW","YELLOW","RED"],["YELLOW","RED","YELLOW","RED","YELLOW","RED","YELLOW"],["YELLOW","RED","YELLOW","RED","YELLOW","RED","YELLOW"],["RED","YELLOW","RED","YELLOW","RED","YELLOW","RED"],["YELLOW","RED","YELLOW","RED","YELLOW","RED","YELLOW"]]'
);
console.log(checkWin());
*/
