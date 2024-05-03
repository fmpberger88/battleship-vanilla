export class Player {
    constructor(name, gameboard) {
        this.name = name;
        this.gameboard = gameboard;
    }

// Make sure the attack method in Player or Gameboard is correctly implemented
    attack(x, y) {
        return this.gameboard.attack(x, y);
    }

}