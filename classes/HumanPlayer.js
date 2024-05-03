import {Player} from "./Player.js";

export class HumanPlayer extends Player {
    constructor(name, gameboard) {
        super(name, gameboard);
    }

    attack(x, y, board) {
        // Verwenden Sie 'board' anstatt 'this.gameboard'
        return super.attack(x, y, board);
    }
}