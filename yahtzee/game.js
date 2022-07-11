// Game logic and page manipulation for Yahtzee
// Credit for card pictures: kenney.nl

const diceClasses = ["diceOne", "diceTwo", "diceThree", "diceFour", "diceFive", "diceSix"];
const diceRedClasses = ["diceOneRed", "diceTwoRed", "diceThreeRed", "diceFourRed", "diceFiveRed", "diceSixRed"];
const dice = document.getElementsByTagName("img");
const diceLocks = [false, false, false, false, false];

let turnsLeft;
let rollsLeft;
let points = [];
let totalPoints;
let upperUntilBonus;

for (let i = 0; i < dice.length; i++) {
    dice[i].onclick = () => {
        if (diceLocks[i]) {
            dice[i].className = diceClasses[diceRedClasses.findIndex(element => element === dice[i].className)];
            diceLocks[i] = false;
        } else {
            dice[i].className = diceRedClasses[diceClasses.findIndex(element => element === dice[i].className)];
            diceLocks[i] = true;
        }
    };
}

document.getElementById("midGame").hidden = true;

function startGame(turns) {
    turnsLeft = turns;
    rollsLeft = 3;
    totalPoints = 0;
    upperUntilBonus = 63;

    document.getElementById("turnsLeft").innerText = "Turns left: " + turnsLeft;
    document.getElementById("midGame").hidden = false;
    document.getElementById("gameOver").hidden = true;

    for (let i = 0; i < 13; i++) {
        document.getElementById("potential" + i).className = "tableButton";
        document.getElementById("points" + i).innerText = "";
    }
    document.getElementById("pointsBonus").innerText = "";
    document.getElementById("pointsTotal").innerText = "";
    unlockDice();
    rollDice();
}

function endGame() {
    for (let i = 0; i < 13; i++) {
        document.getElementById("potential" + i).className = "";
        document.getElementById("potential" + i).innerText = "";
    }
    document.getElementById("gameOver").innerText = "Game Over. Total Score: " + totalPoints;
    document.getElementById("gameOver").hidden = false;
    document.getElementById("midGame").hidden = true;
}

function rollDice() {
    if (rollsLeft > 0 && turnsLeft) {
        rollsLeft--;
        document.getElementById("rollsLeft").innerText = "Rolls left: " + rollsLeft;
        for (let i = 0; i < dice.length; i++) {
            if (!diceLocks[i]) {
                dice[i].className = diceClasses[Math.floor(Math.random() * 6)];
            }
        }
        calculateAll();
        for (let i = 0; i < 13; i++) {
            const element = document.getElementById("potential" + i);
            if (element.className === "tableButton") {
                element.innerText = "+" + points[i];
            }
        }
    }
}

function addPoints(pointNr) {
    if (turnsLeft === 0) {
        return;
    }
    if (document.getElementById("potential" + pointNr).className === "tableClicked") {
        return;
    }
    unlockDice();
    // Hide potential points button
    const element = document.getElementById("potential" + pointNr);
    element.className = "tableClicked";
    element.innerText = "";

    document.getElementById("points" + pointNr).innerText = points[pointNr]; // Update shown text
    totalPoints += points[pointNr];
    if (pointNr < 6 && upperUntilBonus) {
        upperUntilBonus -= points[pointNr];
        if (upperUntilBonus < 1) {
            upperUntilBonus = 0;
            document.getElementById("pointsBonus").innerText = "35";
            totalPoints += 35;
        }
    }
    document.getElementById("pointsTotal").innerText = totalPoints;
    turnsLeft--;
    if (turnsLeft === 0) { // If game over
        endGame();
        return;
    }
    document.getElementById("turnsLeft").innerText = "Turns left: " + turnsLeft;
    rollsLeft = 3;
    rollDice();
}

function unlockDice() {
    for (let i = 0; i < dice.length; i++) {
        if (diceLocks[i]) {
            dice[i].className = diceClasses[diceRedClasses.findIndex(element => element === dice[i].className)];
            diceLocks[i] = false;
        }
    }
}

function calculateAll() {
    points = [];
    const diceValues = [];
    for (let i = 0; i < dice.length; i++) {
        if (diceLocks[i]) {
            diceValues.push(diceRedClasses.findIndex(element => element === dice[i].className) + 1);
        } else {
            diceValues.push(diceClasses.findIndex(element => element === dice[i].className) + 1);
        }
    }
    // Upper section
    points.push(count(diceValues, 1)); // Aces
    points.push(count(diceValues, 2) * 2); // Twos
    points.push(count(diceValues, 3) * 3); // Threes
    points.push(count(diceValues, 4) * 4); // Fours
    points.push(count(diceValues, 5) * 5); // Fives
    points.push(count(diceValues, 6) * 6); // Sixes
    // Lower Section
    const sum = diceValues.reduce((a, b) => a + b, 0);
    // Three-Of-A-Kind and Four-Of-A-Kind
    let biggestCount = 0;
    for (let i = 1; i < 7; i++) {
        biggestCount = Math.max(count(diceValues, i), biggestCount);
    }
    if (biggestCount > 3) {
        points.push(sum, sum);
    } else if (biggestCount === 3) {
        points.push(sum, 0);
    } else {
        points.push(0, 0);
    }

    const diceCounts = valueCounts(diceValues);
    // Full House
    if (diceCounts.filter(x => x === 2).length === 1 && diceCounts.filter(x => x === 3).length === 1) {
        points.push(25);
    } else {
        points.push(0);
    }
    // Small straight
    if (diceCounts[2] && diceCounts[3] && (
        diceCounts[0] && diceCounts[1] ||
            diceCounts[1] && diceCounts[4] ||
            diceCounts[4] && diceCounts[5])) {
        points.push(30);
    } else {
        points.push(0);
    }
    // Large Straight
    if (diceCounts[1] && diceCounts[2] && diceCounts[3] && diceCounts[4] && (
        diceCounts[0] || diceCounts[5])) {
        points.push(40);
    } else {
        points.push(0);
    }
    // Yahtzee
    if (diceCounts.filter(x => x === 5).length === 1) {
        points.push(50);
    } else {
        points.push(0);
    }
    points.push(sum); // Chance
}

function count(list, value) {
    let count = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i] === value) {
            count++;
        }
    }
    return count;
}

function valueCounts(list) {
    let values = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < list.length; i++) {
        values[list[i] - 1]++;
    }
    return values;
}