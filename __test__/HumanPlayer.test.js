import { HumanPlayer } from "../classes/HumanPlayer.js";
import { Gameboard } from "../classes/Gameboard.js";
import { beforeEach, describe, test, expect } from "vitest";

describe('HumanPlayer class tests', () => {
    let board1, board2, player;

    beforeEach(() => {
        board1 = new Gameboard(10, 10);  // Assuming your board is 10x10
        board2 = new Gameboard(10, 10);  // Assuming your board is 10x10
        player = new HumanPlayer("player1", board1);
    });

    test('Should correctly create a new HumanPlayer', () => {
        expect(player).toBeInstanceOf(HumanPlayer);
        expect(player.name).toEqual("player1");
        expect(player.gameboard).toEqual(board1);
    });

    test('Should attack correctly', () => {
        const result = player.attack(4, 4, board2);

        // Adapt the expected result to your context
        // Here it checks whether attack function returned true
        expect(result.x).toBe(4);  // expect x coordinate to be 4
        expect(result.y).toBe(4);  // expect y coordinate to be 4
        expect(result.status).toBe(false); // expect the status to be false since no ship is placed
    });
});