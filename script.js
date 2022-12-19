// Declare global variables.
// =========================================================================================
let board = [];
let numRows = 6;
let numCols = 7;
let currentPlayer = "YELLOW";
let results = false;

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

  statusElement.innerText = `${currentPlayer}'S TURN`; // player is set as global variable, hence can access here
  statusElement.setAttribute("class", currentPlayer);

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
    }
  }

  if (results === "TIE") {
    statusElement.innerText = `It's a TIE!`;
    statusElement.setAttribute("class", "GREY");
    return;
  } else if (results === "YELLOW" || results === "RED") {
    statusElement.innerText = `${results} player WINS!`;
    statusElement.setAttribute("class", results);
    return;
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
        checkSpaceHasPlayerColor(row, col, player) && // is this"YELLOW?
        checkSpaceHasPlayerColor(row, col + 1, player) && // is this also"YELLOW?
        checkSpaceHasPlayerColor(row, col + 2, player) && // is this also"YELLOW?
        checkSpaceHasPlayerColor(row, col + 3, player) // is this also"YELLOW?
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

// To Do
// =========================================================================================
// DONE
// tie game
// rearrange functions for readability (order of sequence), so to do that need to change arrow function to declarative function (has hoisting)
// rematch button
// player's turn to light up according to color
// display last circle before showing win alert
// press wrong circle alert ugly - fix for now is to comment out alert, considered done

// INTRO PAGE
// =========================================================================================
// Enter name, store names on first page (use local storage) OR don't put seperate page, use same page and use a big div to hide the board first - then show the FIRST div with the hello and start (3)
// Press start (2)
// Classic mode or Spaceship mode (if spaceship, change css to make it spacelike) (4)
// Choice of bigger board
// How to play - put a button and when click, pop out the instructions in another div (3)

// GAME PAGE
// =========================================================================================
// when user clicks, ball drops (animation) (5) - tuesday morning flappy bird, afternoon do
// ball bounces (animation) - tuesday morning flappy bird, afternoon do
// ball lands on last unoccupied space of column - use function(yPos, xPos) - tuesday afternoon
// moving spaceship on top (5) - tuesday evening
// highlight winning 4 on board with animation (3)
// keep and show score of total yellow and total red (3)
// readme on github (1)
// local storage (2)

// LAST DAY - NICE TO HAVE
// =========================================================================================
// more graphics to make it nice somehow
// moving clouds moving stars etc
// waving flag
// insert border for circles and/or animate when click

/*
console.log("Testing for tie");
board = JSON.parse(
  '[["RED","YELLOW","RED","YELLOW","RED","YELLOW","RED"],["RED","RED","YELLOW","RED","YELLOW","YELLOW","RED"],["YELLOW","RED","YELLOW","RED","YELLOW","RED","YELLOW"],["YELLOW","RED","YELLOW","RED","YELLOW","RED","YELLOW"],["RED","YELLOW","RED","YELLOW","RED","YELLOW","RED"],["YELLOW","RED","YELLOW","RED","YELLOW","RED","YELLOW"]]'
);
console.log(checkWin());
*/
