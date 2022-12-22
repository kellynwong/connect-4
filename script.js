// Declare global variables.
// =========================================================================================
let board = [];
let numRows = 6;
let numCols = 7;
let currentPlayer = "YELLOW";
let player1 = "";
let player2 = "";
let results = false;
let yellowWins = 0;
let redWins = 0;
let winningArray = [];
let gameMode = "";
let startX = 0;
let endX = 0;

// Load sounds
// =========================================================================================
var win = new Audio();
win.src = "Sounds/winsquare-6993.mp3";

var drop = new Audio();
drop.src = "Sounds/stone-dropping-6843.mp3";

var laser = new Audio();
laser.src = "Sounds/beam-8-43831.mp3";

var start = new Audio();
start.src = "Sounds/game-start-6104.mp3";

// Display popup instructions upon clicking on instructions
// =========================================================================================
function displayInstructions() {
  let popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}

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

  let currentPlayerName = "";
  if (currentPlayer === "YELLOW") {
    currentPlayerName = player1;
  } else {
    currentPlayerName = player2;
  }

  document.querySelector(".yellow-wins").innerText = `${player1} Total Wins:`;
  document.querySelector(".red-wins").innerText = `${player2} Total Wins:`;

  // player is set as global variable, hence can access here
  statusElement.innerText = `${currentPlayerName}'S TURN`;
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
      circle.setAttribute("id", row + "," + col);

      // add class to change color
      if (board[row][col] !== "") {
        circle.classList.add(board[row][col]);
      }

      // add this circle to the row
      newRow.append(circle);
      circle.addEventListener("click", handleClick);
    }
  }

  // display final results of game
  if (results === "TIE") {
    statusElement.innerText = `It's a TIE!`;
    statusElement.setAttribute("class", "GREY");
  } else if (results === "YELLOW" || results === "RED") {
    for (let b = 0; b < winningArray.length; b++) {
      const winningCircle = winningArray[b];
      document
        .getElementById(`${winningCircle[0]},${winningCircle[1]}`)
        .classList.add("winning-row");
    }

    if (results === "YELLOW") {
      currentPlayerName = player1;
    } else {
      currentPlayerName = player2;
    }
    statusElement.innerText = `${currentPlayerName} WINS!`;
    statusElement.setAttribute("class", results);
    statusElement.classList.add("winning-box");
    win.play();
    // change color
  }

  let startOfSpaceship = document.getElementById("0,0").getBoundingClientRect();
  startX = startOfSpaceship["x"];
  let endOfSpaceship = document.getElementById("0,6").getBoundingClientRect();
  endX = endOfSpaceship["x"];
  document.getElementById("spaceship").animate(
    [
      { transform: `translateX(${startX - 30}px)` }, // this is x px from resting place (defined in style.css - 0 currently)
      { transform: `translateX(${endX + 30}px)` }, // this is ending position of the animation
    ],
    { duration: 2000, iterations: 1000, direction: "alternate" }
  );
}

let uiBusy = false;
// Handle click by user.
// =========================================================================================
function handleClick(e) {
  if (gameMode === "special") {
    return;
  }
  if (uiBusy === true) {
    return;
  }
  uiBusy = true;
  if (results) {
    // if there is a result for the current game, then it's completed so don't let the user click
    return;
  }

  let yPos = Number(e.target.getAttribute("yPos"));
  let xPos = Number(e.target.getAttribute("xPos"));

  // if (
  //   checkIfNotOccupied(yPos, xPos) === true &&
  //   checkIfSpaceBelowIsOccupied(yPos, xPos) === true
  // ) {
  const { yFinal, xFinal } = getRestingPlace(yPos, xPos);
  if (yFinal < 0) {
    uiBusy = false;
    return;
  }
  dropPiece(yFinal, xFinal);

  board[yFinal][xFinal] = currentPlayer; // assign the space on the board to the player

  results = checkWin(currentPlayer); // check the winner and store in the results
  drop.play();

  // move the turn to the next player
  if (currentPlayer === "YELLOW") {
    currentPlayer = "RED";
  } else {
    currentPlayer = "YELLOW";
  }

  setTimeout(function () {
    uiBusy = false;
    displayBoard(board);
  }, 400);
  // return alert("Please select another circle");
}

// Check for final resting place
// =========================================================================================
function getRestingPlace(yPos, xPos) {
  let array = [];
  for (let i = 5; i >= 0; i--) {
    if (board[i][xPos] !== "") {
      array.push(board[i][xPos]);
    }
  }
  yFinal = 5 - array.length;
  xFinal = xPos;

  return { yFinal, xFinal };
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
        winningArray.push([row, col]);
        winningArray.push([row, col + 1]);
        winningArray.push([row, col + 2]);
        winningArray.push([row, col + 3]);

        return player;
      }

      // check 4 below to the same color
      if (
        checkSpaceHasPlayerColor(row, col, player) &&
        checkSpaceHasPlayerColor(row + 1, col, player) &&
        checkSpaceHasPlayerColor(row + 2, col, player) &&
        checkSpaceHasPlayerColor(row + 3, col, player)
      ) {
        winningArray.push([row, col]);
        winningArray.push([row + 1, col]);
        winningArray.push([row + 2, col]);
        winningArray.push([row + 3, col]);
        return player;
      }
      // check 4 diagnonally left up to the same color
      if (
        checkSpaceHasPlayerColor(row, col, player) &&
        checkSpaceHasPlayerColor(row - 1, col - 1, player) &&
        checkSpaceHasPlayerColor(row - 2, col - 2, player) &&
        checkSpaceHasPlayerColor(row - 3, col - 3, player)
      ) {
        winningArray.push([row, col]);
        winningArray.push([row - 1, col - 1]);
        winningArray.push([row - 2, col - 2]);
        winningArray.push([row - 3, col - 3]);
        return player;
      }
      // check 4 diagnonally right up to the same color
      if (
        checkSpaceHasPlayerColor(row, col, player) &&
        checkSpaceHasPlayerColor(row - 1, col + 1, player) &&
        checkSpaceHasPlayerColor(row - 2, col + 2, player) &&
        checkSpaceHasPlayerColor(row - 3, col + 3, player)
      ) {
        winningArray.push([row, col]);
        winningArray.push([row - 1, col + 1]);
        winningArray.push([row - 2, col + 2]);
        winningArray.push([row - 3, col + 3]);
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

// Drop piece at wherever user clicks
// =========================================================================================
function dropPiece(yPos, xPos) {
  // xPos: column; yPos: row
  let clickedCircle = document
    .getElementById(`${yPos},${xPos}`)
    .getBoundingClientRect(); // this gets the absolute position of the circle, i.e. from top of screen (y) and left of screen (x)
  let x = clickedCircle["x"]; // from left of screen
  let y = clickedCircle["y"]; // from top of screen
  let dropPiece = document.getElementById("drop-piece");

  dropPiece.style.left = x + "px";
  dropPiece.style.visibility = "visible";
  if (currentPlayer === "YELLOW") {
    dropPiece.style.backgroundColor = "rgb(255, 246, 0)";
  } else {
    dropPiece.style.backgroundColor = "rgb(255, 32, 32)";
  }

  document.getElementById("drop-piece").animate(
    [
      { transform: "translateY(0px)", opacity: 0.4 }, // this is 0px from resting place (defined in style.css)
      { transform: `translateY(${y - 320}px)`, opacity: 1 }, // this is ending position of the animation // 320 is from top of page
    ],
    { duration: 400, iterations: 1 }
  );
  setTimeout(function () {
    dropPiece.style.visibility = "hidden";
  }, 400);
}

// Starts a match, or generate new board when user clicks "Rematch" button"
// =========================================================================================
function startMatch(e) {
  start.play();
  player1 = document.getElementById("name1").value;
  player1 = player1.toUpperCase();
  player2 = document.getElementById("name2").value;
  player2 = player2.toUpperCase();
  let cover = document.getElementById("cover");
  cover.setAttribute("class", "hide");

  generateBoard();
  results = "";
  winningArray = [];
  displayBoard(board);
}
document.querySelector("button").addEventListener("click", startMatch);

// SPECIAL MODE: What happens when user clicks PLAY SPECIAL in intro page
// =========================================================================================
function startSpecialMatch() {
  gameMode = "special";
  spaceship.style.visibility = "visible";
  document.body.style.backgroundImage = "url('Images/night1.jpeg')";

  startMatch();
  document.addEventListener("keydown", dropPieceFromSpaceship); //accepts pressing after board is up
}

// SPECIAL MODE: Drop piece at whenever there is a keydown event
// =========================================================================================
function dropPieceFromSpaceship(e) {
  e.preventDefault();
  if (results) {
    // if there is a result for the current game, then it's completed so don't let the user click
    return;
  }

  let spaceshipPosition = document
    .getElementById("spaceship")
    .getBoundingClientRect();
  let eachColLength = (endX - startX) / 7;
  let row = 0;
  let col = 0;
  // 0,0: startX AND startX + eachColLength
  // 0,1: startX + eachColLength AND startX + 2* eachColLength
  // 0,2: startX + 2* eachColLength AND startX + 3* eachColLength
  // 0,3: startX + 3* eachColLength AND startX + 4* eachColLength
  // 0,4: startX + 4* eachColLength AND startX + 5* eachColLength
  // 0,5: startX + 5* eachColLength AND startX + 6* eachColLength
  // 0,6: startX + 6* eachColLength AND endX

  // 0,0
  if (spaceshipPosition["x"] < startX + eachColLength) {
    row = 0;
    col = 0;
  }
  if (
    spaceshipPosition["x"] < startX + 2 * eachColLength &&
    spaceshipPosition["x"] > startX + eachColLength
  ) {
    row = 0;
    col = 1;
  }
  if (
    spaceshipPosition["x"] < startX + 3 * eachColLength &&
    spaceshipPosition["x"] > startX + 2 * eachColLength
  ) {
    row = 0;
    col = 2;
  }
  if (
    spaceshipPosition["x"] < startX + 4 * eachColLength &&
    spaceshipPosition["x"] > startX + 3 * eachColLength
  ) {
    row = 0;
    col = 3;
  }

  if (
    spaceshipPosition["x"] < startX + 5 * eachColLength &&
    spaceshipPosition["x"] > startX + 4 * eachColLength
  ) {
    row = 0;
    col = 4;
  }

  if (
    spaceshipPosition["x"] < startX + 6 * eachColLength &&
    spaceshipPosition["x"] > startX + 5 * eachColLength
  ) {
    row = 0;
    col = 5;
  }

  if (spaceshipPosition["x"] > startX + 6 * eachColLength) {
    row = 0;
    col = 6;
  }

  const { yFinal, xFinal } = getRestingPlace(row, col);
  if (yFinal < 0) {
    uiBusy = false;
    return;
  }
  dropPiece(yFinal, xFinal);
  board[yFinal][xFinal] = currentPlayer; // assign the space on the board to the player

  results = checkWin(currentPlayer); // check the winner and store in the results
  laser.play();

  // move the turn to the next player
  if (currentPlayer === "YELLOW") {
    currentPlayer = "RED";
  } else {
    currentPlayer = "YELLOW";
  }

  setTimeout(function () {
    uiBusy = false;
    displayBoard(board);
  }, 400);
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
