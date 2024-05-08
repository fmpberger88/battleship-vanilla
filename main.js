import {Ship} from "./classes/Ship.js";
import {Gameboard} from "./classes/Gameboard.js";
import {Player} from "./classes/Player.js";

// Initialisierung der Spielbretter und Spieler
const humanBoard = new Gameboard(10, 10);
const computerBoard = new Gameboard(10, 10);
const humanPlayer = new Player('Human', humanBoard);
const computerPlayer = new Player('Computer', computerBoard);

document.addEventListener('DOMContentLoaded', () => {
    createBoard(humanBoard, document.getElementById('humanBoard'), false);
    createBoard(computerBoard, document.getElementById('computerBoard'), true);

    setupShips(humanBoard);
    setupShips(computerBoard);

    // Update the boards to display ships for testing purposes
    renderShips(humanBoard, document.getElementById('humanBoard'), true);
    renderShips(computerBoard, document.getElementById('computerBoard'), true);
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
        { name: 'Zerstörer', size: 2 },
        { name: 'U-Boot', size: 3 },
        { name: 'Kreuzer', size: 4 },
        { name: 'Schlachtschiff', size: 5 }
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
    renderShips(computerBoard, document.getElementById('computerBoard'), true);

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