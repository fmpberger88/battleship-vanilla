import {Player} from './Player.js';

export class ComputerPlayer extends Player {
    constructor(name, gameboard) {
        super(name, gameboard);
    }

    autoAttack(board) {
        try {
            const x = this.getRandomInt(0, board.rows-1);
            const y = this.getRandomInt(0, board.cols-1);
            return board.attack(x, y);
        } catch (error) {
            console.error('Ein Fehler ist während autoAttack aufgetreten:', error);
            return false;
        }
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        if (min < 0 || max < 0) { // Stellen Sie sicher, dass max mindestens 0 ist, um die Erzeugung negativer Zahlen zu verhindern
            throw new Error('Ungültiger Bereich für getRandomInt');
        }
        // Generiere zufällige Zahl im Bereich [min, max]
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}