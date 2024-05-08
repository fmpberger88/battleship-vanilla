import {Player} from "./Player.js";

export class HumanPlayer extends Player {
    constructor(name, gameboard) {
        super(name, gameboard);
    }

    attack(x, y, gameboard) {
        // Verwenden Sie 'board' anstatt 'this.gameboard'
        return super.attack(x, y, gameboard);
    }
}