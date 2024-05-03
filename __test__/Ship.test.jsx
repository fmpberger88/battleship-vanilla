// Ship.test.jsx
import { Ship } from "../src/Ship.jsx";
import { describe, it, expect, beforeEach } from 'vitest'

describe("Ship tests", () => {
    let ship;
    beforeEach(() => {
        ship = new Ship("Titanic", 5);
    });

    it("Should return the ship", () => {
        expect(ship).toBeInstanceOf(Ship);
    });

    it("Should return the ship with size", () => {
        expect(ship.size).toBe(5);
    });

    it("Should return the ship's name", () => {
        expect(ship.name).toBe("Titanic");
    });

    it("Should start with zero hits", () => {
        expect(ship.getHits()).toBe(0);
    });

    it("Should record hits", () => {
        ship.hit();
        expect(ship.getHits()).toBe(1);
    });

    it("Should record multiple hits", () => {
        ship.hit();
        ship.hit();
        expect(ship.getHits()).toBe(2);
    });

    it("Should not sink initially", () => {
        expect(ship.getIsSunk()).toBe(false);
    });

    it("Should sink after sufficient hits", () => {
        for (let i = 0; i < ship.size; i++) {
            ship.hit();
        }
        expect(ship.getIsSunk()).toBe(true);
    });
});
