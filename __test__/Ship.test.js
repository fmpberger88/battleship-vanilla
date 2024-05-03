// Ship.test.js
import { Ship } from "../classes/Ship.js";
import { expect, describe, it, beforeEach } from 'vitest';

describe("Ship class tests", () => {
    let ship;

    beforeEach(() => {
        ship = new Ship("Titanic", 5);
    });

    it("Should return the ship's name", () => {
        expect(ship.getName()).toBe("Titanic");
    });

    it("Should return the size of the ship", () => {
        expect(ship.getSize()).toBe(5);
    });

    it("Should start with zero hits", () => {
        expect(ship.getHits()).toBe(0);
    });

    it("Should record a hit", () => {
        expect(ship.hit(1)).toBe(true);
        expect(ship.getHits()).toBe(1);
    });

    it("Should record multiple hits", () => {
        expect(ship.hit(0)).toBe(true);
        expect(ship.hit(1)).toBe(true);
        expect(ship.getHits()).toBe(2);
    });

    it("Should not sink initially", () => {
        expect(ship.getIsSunk()).toBe(false);
    });

    it("Should sink after sufficient hits", () => {
        for (let i = 0; i < ship.getSize(); i++) {
            expect(ship.hit(i)).toBe(true);
        }
        expect(ship.getIsSunk()).toBe(true);
    });

    it("Should not record hit if partIndex is out of bounds", () => {
        expect(ship.hit(6)).toBe(false);
        expect(ship.getHits()).not.toBe(6);
    });

    it("Should not double record hits at same part", () => {
        expect(ship.hit(2)).toBe(true);
        expect(ship.hit(2)).toBe(false);
        expect(ship.getHits()).toBe(1);
    });

});