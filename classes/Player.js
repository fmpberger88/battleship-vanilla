export class Player {
    constructor(name, gameboard) {
        this.name = name;
        this.gameboard = gameboard;
        this.hitQueue = []; // Queue to store the hits
        this.visitedCells = new Set(); // Set to store visited cells
    }

    attack(x, y, gameboard) {
        const result = gameboard.attack(x, y);
        if (result.status) {
            const ship = gameboard.getShipAt(x, y);
            if (ship.getIsSunk()) {
                // Remove all parts of the sunk ship from hitQueue
                this.hitQueue = this.hitQueue.filter(hit => !ship.parts.includes(gameboard.board[hit.x][hit.y]));
            } else {
                this.hitQueue.push({ x, y });
            }
        }
        return {
            status: result.status,
            cell: {
                row: x,
                col: y
            }
        };
    }

    autoAttack(board) {
        try {
            let x, y;

            if (this.hitQueue.length > 0) {
                const lastHit = this.hitQueue[0];
                const potentialTargets = this.getAdjacentCells(lastHit.x, lastHit.y, board);
                for (const target of potentialTargets) {
                    if (!this.visitedCells.has(`${target.x},${target.y}`)) {
                        x = target.x;
                        y = target.y;
                        break;
                    }
                }

                // If no valid adjacent cells, process the next hit
                if (x === undefined || y === undefined) {
                    this.hitQueue.shift();
                    return this.autoAttack(board);
                }
            } else {
                do {
                    x = this.getRandomInt(0, board.rows - 1);
                    y = this.getRandomInt(0, board.cols - 1);
                } while (this.visitedCells.has(`${x},${y}`));
            }

            this.visitedCells.add(`${x},${y}`);
            return this.attack(x, y, board);
        } catch (error) {
            console.error('An error occurred during autoAttack:', error);
            return false;
        }
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        if (min < 0 || max < 0) {
            throw new Error('Invalid range for getRandomInt');
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getAdjacentCells(x, y, board) {
        const cells = [];
        if (x > 0) cells.push({ x: x - 1, y: y }); // left
        if (x < board.rows - 1) cells.push({ x: x + 1, y: y }); // right
        if (y > 0) cells.push({ x: x, y: y - 1 }); // up
        if (y < board.cols - 1) cells.push({ x: x, y: y + 1 }); // down
        return cells;
    }
}
