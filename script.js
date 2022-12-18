// DECLARE global variables
let gameMode = true;
let round = "1";
let round1Colored = 0;
let topCircle = 0;

const leftCol = [7, 14, 21, 28, 35];
const topRow = [37, 38, 39, 40, 41];
const rightCol = [1, 8, 15, 22, 29];
const leftCorner = [42];
const rightCorner = [36];
const body = [
  2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 23, 24, 25, 26, 27, 30,
  31, 32, 33, 34,
];

const clickedArray = [];
const topArrayToCheck = [];
const leftArrayToCheck = [];
const rightArrayToCheck = [];
const bodyArrayToCheck = [];
const firstRowToCheck = [1, 2, 3, 4, 5, 6, 7];

// LOG NUMBER: Refer to above to see clicked number belongs to which arrays. Then using that, add clicked number into clicked array and surrounding numbers of clicked number into the respective arrays.
const logID = (e) => {
  let clickedID = Number(e.target.id);
  if (clickedArray.includes(clickedID) === false) {
    clickedArray.push(clickedID);
    if (leftCol.includes(clickedID)) {
      topArrayToCheck.push(clickedID + 7);
      rightArrayToCheck.push(clickedID - 1);
    } else if (topRow.includes(clickedID)) {
      leftArrayToCheck.push(clickedID + 1);
      rightArrayToCheck.push(clickedID - 1);
    } else if (rightCol.includes(clickedID)) {
      topArrayToCheck.push(clickedID + 7);
      leftArrayToCheck.push(clickedID + 1);
    } else if (leftCorner.includes(clickedID)) {
      rightArrayToCheck.push(clickedID - 1);
    } else if (rightCorner.includes(clickedID)) {
      leftArrayToCheck.push(clickedID + 1);
    } else if (body.includes(clickedID)) {
      topArrayToCheck.push(clickedID + 7);
      leftArrayToCheck.push(clickedID + 1);
      rightArrayToCheck.push(clickedID - 1);
    }
  }
};

// CHECK if e.target.id is in clickedArray, if yes, return false
// If e.target.id is in any of the other arrays AND the bottom circle has been clicked before, return true
const checkID = (e) => {
  let clickedID = Number(e.target.id);
  if (clickedArray.includes(clickedID) === true) {
    return false;
  } else if (firstRowToCheck.includes(clickedID)) {
    return true;
  } else if (
    (topArrayToCheck.includes(clickedID) === true ||
      leftArrayToCheck.includes(clickedID) === true ||
      rightArrayToCheck.includes(clickedID) === true ||
      bodyArrayToCheck.includes(clickedID) === true ||
      firstRowToCheck.includes(clickedID) === true) &&
    clickedArray.includes(clickedID - 7) === true
  ) {
    return true;
  }
};

const diagRight = [];

// CHECK if won - first 4 to reach horizontally, vertically or diagonally
const checkWin = (e) => {
  let clicked = document.getElementById(Number(e.target.id)).classList[1];
  if (
    (clicked ===
      document.getElementById(Number(e.target.id) + 6).classList[1] &&
      clicked ===
        document.getElementById(Number(e.target.id) + 12).classList[1] &&
      clicked ===
        document.getElementById(Number(e.target.id) + 18).classList[1]) ||
    (clicked ===
      document.getElementById(Number(e.target.id) - 6).classList[1] &&
      clicked ===
        document.getElementById(Number(e.target.id) - 12).classList[1] &&
      clicked ===
        document.getElementById(Number(e.target.id) - 18).classList[1])
  ) {
    document.querySelector("#output").innerText = clicked + " WINS!";
  } else if (
    (clicked ===
      document.getElementById(Number(e.target.id) + 8).classList[1] &&
      clicked ===
        document.getElementById(Number(e.target.id) + 16).classList[1] &&
      clicked ===
        document.getElementById(Number(e.target.id) + 24).classList[1]) ||
    (clicked ===
      document.getElementById(Number(e.target.id) - 8).classList[1] &&
      clicked ===
        document.getElementById(Number(e.target.id) - 16).classList[1] &&
      clicked ===
        document.getElementById(Number(e.target.id) - 24).classList[1])
  ) {
    document.querySelector("#output").innerText = clicked + " WINS!";
  } else if (
    (clicked ===
      document.getElementById(Number(e.target.id) + 7).classList[1] &&
      clicked ===
        document.getElementById(Number(e.target.id) + 14).classList[1] &&
      clicked ===
        document.getElementById(Number(e.target.id) + 21).classList[1]) ||
    (clicked ===
      document.getElementById(Number(e.target.id) - 7).classList[1] &&
      clicked ===
        document.getElementById(Number(e.target.id) - 14).classList[1] &&
      clicked ===
        document.getElementById(Number(e.target.id) - 21).classList[1])
  ) {
    document.querySelector("#output").innerText = clicked + " WINS!";
  } else if (
    (clicked ===
      document.getElementById(Number(e.target.id) + 1).classList[1] &&
      clicked ===
        document.getElementById(Number(e.target.id) + 2).classList[1] &&
      clicked ===
        document.getElementById(Number(e.target.id) + 3).classList[1]) ||
    (clicked ===
      document.getElementById(Number(e.target.id) - 1).classList[1] &&
      clicked ===
        document.getElementById(Number(e.target.id) - 2).classList[1] &&
      clicked === document.getElementById(Number(e.target.id) - 3).classList[1])
  ) {
    document.querySelector("#output").innerText = clicked + " WINS!";
  }
};

// COLOR circles by player - blue is assigned to 1st round, red is assigned to 2nd round
// 1st round: only 1 to 7 can be colored
// 2nd round: (only 1 to 7 can be colored - except that one circled colored in 1st round) && (top of circle colored in 1st round)
// 3rd round onwards: only circles top or sides of circles that are colored
const colorCircle = (e) => {
  ////////////////////////////////////////////////////////
  ///////////////////1st Round////////////////////////////
  ////////////////////////////////////////////////////////
  if (
    gameMode === true &&
    round === "1" &&
    e.target.id >= 1 &&
    e.target.id <= 7
  ) {
    e.target.classList.add("BLUE");
    round1Colored = Number(e.target.id);
    topCircle = round1Colored + 7;
    gameMode = false;
    round = "2";
    document.querySelector("#current-turn").innerText = `Red's Turn!`;
    logID(e);
  }
  ////////////////////////////////////////////////////////
  ///////////////////2nd Round////////////////////////////
  ////////////////////////////////////////////////////////
  else if (
    gameMode === false &&
    round === "2" &&
    ((e.target.id >= 1 &&
      e.target.id <= 7 &&
      Number(e.target.id) !== round1Colored) ||
      Number(e.target.id) === topCircle)
  ) {
    e.target.classList.add("RED");
    gameMode = true;
    round = "go on";
    document.querySelector("#current-turn").innerText = `Blue's Turn!`;
    logID(e);
  }
  ////////////////////////////////////////////////////////
  ///////////////////3rd Round Onwards////////////////////
  ////////////////////////////////////////////////////////
  if (gameMode === true && round === "go on" && checkID(e)) {
    e.target.classList.add("BLUE");
    gameMode = false;
    logID(e);
    document.querySelector("#current-turn").innerText = `Red's Turn!`;
    checkWin(e);
  } else if (gameMode === false && round === "go on" && checkID(e)) {
    e.target.classList.add("RED");
    gameMode = true;
    logID(e);
    document.querySelector("#current-turn").innerText = `Blue's Turn!`;
    checkWin(e);
  }
};

// Set timeout to display whose turn

// GENERATE a board of 7 column, 6 rows
count = 43;
const generateBoard = (num) => {
  let noOfRows = num / 7;
  for (let row = 1; row <= noOfRows; row++) {
    const newRow = document.createElement("tr");
    newRow.setAttribute("class", "row");
    document.querySelector("#board").append(newRow);

    for (let col = 1; col <= 7; col++) {
      const circle = document.createElement("td");
      count -= 1;
      circle.innerText = count;
      circle.setAttribute("id", count);
      circle.setAttribute("class", "circle");
      newRow.append(circle);
      circle.addEventListener("click", colorCircle);
    }
  }
};
generateBoard(42);

// Variation: PopOut starts the same as traditional gameplay, with an empty board and players alternating turns placing their own colored discs into the board. During each turn, a player can either add another disc from the top, or if one has any discs of their own color on the bottom row, remove (or "pop out") a disc of one's own color from the bottom. Popping a disc out from the bottom drops every disc above it down one space, changing their relationship with the rest of the board and changing the possibilities for a connection. The first player to connect four of their discs horizontally, vertically, or diagonally wins the game.

// Animation: Drop from above, or puzzle bobble style
