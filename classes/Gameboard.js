

export class Gameboard {
    constructor(rows, cols) {
        this.board = Array.from({ length: rows }, () => new Array(cols).fill(null));
        this.rows = rows;
        this.cols = cols;
        this.shipParts = {};
        this.totalShips = 0;
        this.ships = [];
        this.sunkShips = 0;
        this.shipObjects = {};
    }

    placeShip(ship, startPosition, orientation) {
        if (!this.canPlaceShip(ship, startPosition, orientation)) {
            throw new Error('Ship cannot be placed at the selected position');
        }

        for (let i = 0; i < ship.size; i++) {
            const x = startPosition.x + (orientation === 'vertical' ? i : 0);
            const y = startPosition.y + (orientation === 'horizontal' ? i : 0);

            this.board[x][y] = ship.parts[i];
            this.shipParts[`${x},${y}`] = i;
            this.shipObjects[`${x},${y}`] = ship;
        }

        this.totalShips += 1;
        this.ships.push(ship)
    }

    canPlaceShip(ship, startPosition, orientation) {
        for (let i = 0; i < ship.size; i++) {
            const x = startPosition.x + (orientation === 'vertical' ? i : 0);
            const y = startPosition.y + (orientation === 'horizontal' ? i : 0);

            // Überprüfen, ob die Position innerhalb des Spielbretts liegt
            if (x < 0 || x >= this.rows || y < 0 || y >= this.cols) {
                return false;
            }

            // Überprüfen, ob an der Position bereits ein Schiffsteil existiert
            if (this.board[x][y] !== null) {
                return false;
            }
        }

        // Wenn alle Positionen frei sind, kann das Schiff platziert werden
        return true;
    }

    getShipPartIndexAt(x, y) {
        // Returns the index of the ship part at this position
        return this.shipParts[`${x},${y}`];
    }

    getShipFromPartAt(x, y) {
        return this.shipObjects[`${x},${y}`];
    }

    attack(x, y) {
        const part = this.board[x][y];

        if (part) {
            console.log(`Hitting ship part at ${x}, ${y}`);
            const ship = this.getShipFromPartAt(x, y);
            const wasSunkBefore = ship.getIsSunk();

            ship.hit(this.getShipPartIndexAt(x, y));
            if (!wasSunkBefore && ship.getIsSunk()) {
                this.sunkShips += 1;
                console.log(`Ship sunk at ${x}, ${y}`);
            }

            return {x: x, y: y, status: true};  // Rückgabe als Objekt mit den Koordinaten und dem Status
        } else {
            console.log(`No ship at ${x}, ${y} to hit.`);
            return {x: x, y: y, status: false}; // Rückgabe als Objekt mit den Koordinaten und dem Status
        }
    }
    checkIfSunk() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const part = this.board[i][j];

                if (part) {
                    const ship = this.getShipFromPartAt(i, j);

                    // Überprüfen, ob das Schiff existiert, bevor Sie getIsSunk darauf aufrufen.
                    if (ship && !ship.getIsSunk() && ship.getHits() >= ship.size) {
                        console.log(`Ship sunk at ${i}, ${j}`);
                    }
                }
            }
        }
    }

    allShipsSunk() {
        return this.totalShips === this.sunkShips;
    }

    getTotalShips() {
        return this.ships.length;
    }

    getTotalShipsSunk() {
        return this.sunkShips;
    }

    getShipAt(x, y) {
        if (x >= 0 && x < this.rows && y >= 0 && y < this.cols) {
            if (this.board[x][y]) {
                return this.getShipFromPartAt(x, y);
            }
        }
        return null;
    }
}