import { Player } from '../src/Player.jsx';
import { Gameboard } from "../src/Gameboard.jsx";
import {describe, it, beforeEach, expect} from "vitest";

describe("Player test", () => {

    let gameboard;
    let player;
    beforeEach(() => {
        gameboard = new Gameboard(12, 12);
        player = new Player("John", gameboard);
    })

    it("Should create a Player without an empty player", () => {
        expect(player.name).toBe("John");
        expect(player.gameboard).toBe(gameboard);
    })
})