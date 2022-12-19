// const board = [
//   ["", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", ""],
// ];

let board = [];
for (let x = 1; x <= 6; x++) {
  let innerboard = [];
  board.push(innerboard);
  for (let y = 1; y <= 7; y++) {
    innerboard.push("");
  }
}

const checkIfNotOccupied = (yPos, xPos) => {
  // check if the space is occupied
  if (board[yPos][xPos] !== "") {
    return false;
  }
  return true;
};

const checkIfSpaceBelowIsOccupied = (yPos, xPos) => {
  // check if space below is occupied
  if (yPos <= 4) {
    if (board[yPos + 1][xPos] !== "") {
      return true;
    }
    return false;
  } else {
    return true;
  }
};

let player = "BLUE";
const handleClick = (e) => {
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
};

const displayBoard = (board) => {
  document.querySelector("#board").innerHTML = "";
  document.querySelector("#current-turn").innerText = `${player}'S TURN`;
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
      if (board[row][col] !== "") {
        circle.classList.add(board[row][col]);
      }
      newRow.append(circle);
      circle.addEventListener("click", handleClick);
    }
  }
};
displayBoard(board);

const getTokenInPosition = (yPos, xPos) => {
  if (
    yPos >= 0 &&
    yPos < board.length &&
    xPos >= 0 &&
    xPos < board[yPos].length
  ) {
    return board[yPos][xPos];
  }
  return "";
};

const checkPositionMatchesPlayer = (yPos, xPos, player) => {
  // checks if player has a token in that position
  return getTokenInPosition(yPos, xPos) === player;
};

const checkWin = (player) => {
  // for every single position
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      // check 4 to the right same color
      if (
        getTokenInPosition(row, col) == player &&
        checkPositionMatchesPlayer(row, col + 1, player) &&
        checkPositionMatchesPlayer(row, col + 2, player) &&
        checkPositionMatchesPlayer(row, col + 3, player)
      ) {
        return alert(`{$player} wins!`);
      }

      // check 4 below to the same color
      if (
        checkPositionMatchesPlayer(row, col, player) &&
        checkPositionMatchesPlayer(row + 1, col, player) &&
        checkPositionMatchesPlayer(row + 2, col, player) &&
        checkPositionMatchesPlayer(row + 3, col, player)
      ) {
        return alert(`{$player} wins!`);
      }
      // check 4 diagnonally left up to the same color
      if (
        checkPositionMatchesPlayer(row, col, player) &&
        checkPositionMatchesPlayer(row - 1, col - 1, player) &&
        checkPositionMatchesPlayer(row - 2, col - 2, player) &&
        checkPositionMatchesPlayer(row - 3, col - 3, player)
      ) {
        return alert(`{$player} wins!`);
      }
      // check 4 diagnonally right up to the same color
      if (
        checkPositionMatchesPlayer(row, col, player) &&
        checkPositionMatchesPlayer(row - 1, col + 1, player) &&
        checkPositionMatchesPlayer(row - 2, col + 2, player) &&
        checkPositionMatchesPlayer(row - 3, col + 3, player)
      ) {
        return alert(`{$player} wins!`);
      }
    }
  }
};
