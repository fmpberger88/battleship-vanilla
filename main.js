import {Ship} from "./classes/Ship.js";
import {Gameboard} from "./classes/Gameboard.js";
import {Player} from "./classes/Player.js";

import ship1 from '/barque_1198998.svg'
import ship2 from '/boat_2370811.svg'
import ship3 from '/boat_2989213.svg'
import ship4 from '/boat_7436540.svg'

let currentShipOrientation = null;
let currentShipSize = null;

let shipTypes = [
    { name: 'Zerstörer', size: 2, svg: ship1 },
    { name: 'U-Boot', size: 3, svg: ship2 },
    { name: 'Kreuzer', size: 4, svg: ship3 },
    { name: 'Schlachtschiff', size: 5, svg: ship4 }
];

// Initialisierung der Spielbretter und Spieler
const humanBoard = new Gameboard(10, 10);
const computerBoard = new Gameboard(10, 10);
const humanPlayer = new Player('Human', humanBoard);
const computerPlayer = new Player('Computer', computerBoard);

document.addEventListener('DOMContentLoaded', () => {
    createBoard(humanBoard, document.getElementById('humanBoard'), false);
    createBoard(computerBoard, document.getElementById('computerBoard'), true);

    startGame();

    //setupShips(humanBoard);
    setupShips(computerBoard);

    // Update the boards to display ships for testing purposes
    renderShips(humanBoard, document.getElementById('humanBoard'), true);
    renderShips(computerBoard, document.getElementById('computerBoard'), false);
});

function createBoard(gameboard, boardElement, isClickable) {
    for (let i = 0; i < gameboard.rows; i++) {
        for (let j = 0; j < gameboard.cols; j++) {
            const cell = document.createElement('div');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.classList.add('cell'); // Zusätzliche Klasse für allgemeines Styling
            if (isClickable) {
                cell.addEventListener('click', function onClick() {
                    const x = parseInt(cell.dataset.row);
                    const y = parseInt(cell.dataset.col);
                    const ship = gameboard.getShipAt(x, y)
                    userAttack(parseInt(i), parseInt(j));
                    cell.removeEventListener('click', onClick); // Entfernt den Event Listener nach dem Klick
                    if (ship && ship.parts[gameboard.getShipPartIndexAt(x, y)].hit) {
                        cell.classList.add('hit')
                    } else {
                        cell.classList.add('attacked'); // Optional: Stil für bereits angegriffene Zellen
                    }
                });
            }
            boardElement.appendChild(cell);
        }
    }
}


function setupShips(gameboard) {
    const shipTypes = [
        { name: 'Zerstörer', size: 2 , svg: ship1},
        { name: 'U-Boot', size: 3, svg: ship2 },
        { name: 'Kreuzer', size: 4, svg: ship3 },
        { name: 'Schlachtschiff', size: 5, svg: ship4 }
    ];

    shipTypes.forEach(shipType => {
        let placed = false;
        while (!placed) {
            const startPosition = {
                x: Math.floor(Math.random() * gameboard.rows),
                y: Math.floor(Math.random() * gameboard.cols)
            };
            const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';

            const ship = new Ship(shipType.name, shipType.size);
            try {
                gameboard.placeShip(ship, startPosition, orientation);
                placed = true;
            } catch (error) {
                console.error(`Error placing ${shipType.name}: ${error.message}`);
                // Keine Aktion, versuche es einfach noch einmal (während-Schleife)
            }
        }
    });
}

function getShipIndex(shipName) {
    return shipTypes.findIndex(shipType => shipType.name === shipName);
}


function renderShips(gameboard, boardElement, showShips = false) {
    boardElement.childNodes.forEach(cell => {
        const x = parseInt(cell.dataset.row);
        const y = parseInt(cell.dataset.col);
        const ship = gameboard.getShipAt(x, y);

        if (ship && (showShips || ship.parts[gameboard.getShipPartIndexAt(x, y)].hit)) {
            cell.classList.add('ship');
        }
        if(ship && ship.getIsSunk()) {
            cell.classList.add('sunk');
            cell.classList.remove('ship', 'hit', 'attacked');
        }
        else if (ship && ship.parts[gameboard.getShipPartIndexAt(x, y)].hit) {
            cell.classList.remove('attacked');
            cell.classList.add('hit');
        } else if (!ship && cell.classList.contains('attacked')) {
            cell.classList.add('miss');
        }
    });
}




function userAttack(row, col) {
    const result = humanPlayer.attack(row, col, computerBoard);

    if (result.status) {
        console.log(`Treffer bei (${row}, ${col})`);
    } else {
        console.log(`Verfehlt bei (${row}, ${col})`);
    }

    // Zeichnen Sie das Spielbrett neu, unabhängig vom Ergebnis des Angriffs
    renderShips(computerBoard, document.getElementById('computerBoard'), false);

    // Überprüfen, ob alle Schiffe auf dem ComputerBoard versenkt wurden
    if (computerBoard.allShipsSunk()) {
        console.log("Alle Schiffe des Computers wurden versenkt! Der Spieler gewinnt!");
        gameOver(computerBoard, "Alle Schiffe des Computers wurden versenkt! Der Spieler gewinnt!")
    } else {
        // Führe nach einer kurzen Verzögerung einen Gegenangriff des Computers durch
        setTimeout(computerAttack, 1000);  // Verzögerung von 1000 Millisekunden (1 Sekunde)
    }
}

function computerAttack() {
    const result = computerPlayer.autoAttack(humanBoard);

    const { row, col } = result.cell;
    markCellAsAttackedBoard(document.getElementById('humanBoard'), row, col);

    if (result.status) {
        console.log("Computer hat getroffen");
    }

    // Zeichnen Sie das Spielbrett neu, unabhängig vom Ergebnis des Angriffs
    renderShips(humanBoard, document.getElementById('humanBoard'), true);

    // Überprüfen, ob alle Schiffe auf dem HumanBoard versenkt wurden
    if (humanBoard.allShipsSunk()) {
        console.log("Alle Schiffe des Spielers wurden versenkt! Der Computer gewinnt!");
        gameOver(humanBoard, "Alle Schiffe des Spielers wurden versenkt! Der Computer gewinnt!")
    }
}

function markCellAsAttackedBoard(boardElement, row, col) {
    // Hole alle Kinder (Zellen) des übergebenen boardElements
    let cells = Array.from(boardElement.childNodes);

    // Finde die Zelle, die dem angegriffenen (row, col) koordiniert entspricht
    const attackedCell = cells.find((cell) => {
        return (
            parseInt(cell.dataset.row) === row && parseInt(cell.dataset.col) === col
        );
    });

    // Füge die Klasse 'attacked' zu dieser Zelle hinzu
    if (attackedCell) {
        attackedCell.classList.add("attacked");
    }
}

const gameOver = (board, message) => {
    if (board.getTotalShipsSunk()) {
        let gameOverMessage = document.querySelector('#game-over-message');
        gameOverMessage.textContent = message;

        let playAgainButton = document.querySelector('#newGameButton');
        playAgainButton.addEventListener('click', () => {
            location.reload();
        });
    }

    let modal = document.querySelector('#modal');
    modal.style.display = 'block';
}

function manualShipPlacement(gameboard, boardElement) {
    let currentShipIndex = 0;
    const shipTypes = [
        { name: 'Zerstörer', size: 2, svg: ship1 },
        { name: 'U-Boot', size: 3, svg: ship2 },
        { name: 'Kreuzer', size: 4, svg: ship3 },
        { name: 'Schlachtschiff', size: 5, svg: ship4 }
    ];

    const orientationControls = document.getElementById('orientationControls');
    const horizontalButton = document.getElementById('horizontalButton');
    const verticalButton = document.getElementById('verticalButton');

    horizontalButton.addEventListener('click', () => {
        currentShipOrientation = 'horizontal';
    });
    verticalButton.addEventListener('click', () => {
        currentShipOrientation = 'vertical';
    });

    shipTypes.forEach((shipType, index) => {
        const shipElement = document.createElement('img');
        shipElement.id = `ship${index}`;
        shipElement.classList.add('shipSvg');
        shipElement.src = shipType.svg;
        shipElement.draggable = true;

        shipElement.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.id);
            e.dataTransfer.effectAllowed = 'move';
            currentShipIndex = index; // Aktualisiere den aktuellen Index beim Start des Ziehens
        });

        document.querySelector('#shipContainer').appendChild(shipElement);
    });

    boardElement.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('dragover', function(e) {
            e.preventDefault();
            showPotentialPlacement(cell, currentShipOrientation, shipTypes[currentShipIndex].size);
        });

        cell.addEventListener('dragenter', function(e) {
            e.preventDefault(); // Notwendig, um das drop-Event zu erlauben
        });

        cell.addEventListener('dragleave', function(e) {
            clearPotentialPlacement(boardElement);
        });

        cell.addEventListener('drop', function(e) {
            e.preventDefault();
            clearPotentialPlacement(boardElement);
            const shipId = e.dataTransfer.getData('text/plain');
            const shipElement = document.getElementById(shipId);
            if (!shipElement) {
                alert('Please select a ship first!');
                return;
            }

            const x = parseInt(cell.dataset.row);
            const y = parseInt(cell.dataset.col);
            placeShip(gameboard, shipElement, x, y, currentShipOrientation, shipTypes[currentShipIndex].size);
        });
    });
}


function showPotentialPlacement(cell, orientation, size) {
    let row = parseInt(cell.dataset.row);
    let col = parseInt(cell.dataset.col);
    let boardElement = cell.parentElement;

    clearPotentialPlacement(boardElement);

    for (let i = 0; i < size; i++) {
        let targetCell;
        if (orientation === 'horizontal') {
            targetCell = boardElement.querySelector(`.cell[data-row="${row}"][data-col="${col + i}"]`);
        } else {
            targetCell = boardElement.querySelector(`.cell[data-row="${row + i}"][data-col="${col}"]`);
        }
        if (targetCell) {
            targetCell.classList.add('hovered');
        } else {
            break;
        }
    }
}

function clearPotentialPlacement(boardElement) {
    boardElement.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('hovered');
    });
}

function placeShip(gameboard, shipElement, x, y, orientation, size) {
    const shipIndex = parseInt(shipElement.id.replace('ship', ''));
    const ship = new Ship(shipTypes[shipIndex].name, size);

    try {
        gameboard.placeShip(ship, { x, y }, orientation);

        // Gehe durch alle Zellen, die das Schiff belegen würde, und aktualisiere sie
        for (let i = 0; i < size; i++) {
            let targetCell;
            if (orientation === 'horizontal') {
                targetCell = document.querySelector(`.cell[data-row="${x}"][data-col="${y + i}"]`);
            } else {
                targetCell = document.querySelector(`.cell[data-row="${x + i}"][data-col="${y}"]`);
            }

            if (targetCell) {
                targetCell.classList.add('ship');
            }
        }

        // Entferne das Schiff-Element nach der Platzierung und deaktiviere das Ziehen
        shipElement.remove();
        shipElement.setAttribute('draggable', false);

        // Aktualisiere das gesamte Spielfeld
        renderShips(gameboard, document.getElementById('humanBoard'), true);
    } catch (error) {
        alert(`Error placing the ship: ${error.message}`);
    }
}





function startGame() {
    const humanBoardElement = document.getElementById('humanBoard');
    manualShipPlacement(humanBoard, humanBoardElement);

    // Button zum zufälligen Platzieren von Schiffen
    let randomPlacementButton = document.querySelector("#randomButton");
    randomPlacementButton.addEventListener('click', () => {
        setupShips(humanBoard);
        renderShips(humanBoard, humanBoardElement, true);
        // Entferne manuelle Platzierungselemente
        document.querySelectorAll('.shipSvg').forEach(elem => elem.remove());
        document.getElementById('orientationControls').style.display = 'none';
    });
}
