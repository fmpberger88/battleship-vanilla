export class Player {
    constructor(name, gameboard) {
        this.name = name;
        this.gameboard = gameboard;
    }

    attack(x, y, gameboard) {
        const status = gameboard.attack(x, y);
        return {
            status: status,
            cell: {
                row: x,
                col: y
            }
        };
    }

    autoAttack(board) {
        try {
            const x = this.getRandomInt(0, board.rows - 1);
            const y = this.getRandomInt(0, board.cols - 1);
            return this.attack(x, y, board);
        } catch (error) {
            console.error('Ein Fehler ist während autoAttack aufgetreten:', error);
            return false;
        }
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        if (min < 0 || max < 0) {
            throw new Error('Ungültiger Bereich für getRandomInt');
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}