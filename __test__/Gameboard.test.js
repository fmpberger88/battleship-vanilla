import { Gameboard } from '../classes/Gameboard.js';
import { Ship } from '../classes/Ship.js';
import { expect, describe, test } from 'vitest';

describe('Gameboard', () => {
    const gameboard = new Gameboard(10, 10);
    const ship = new Ship("Titanic", 5); // Assuming the ship is initialized correctly.

    test('constructor', () => {
        expect(gameboard.rows).toBe(10);  // Verify rows and cols initialization
        expect(gameboard.cols).toBe(10);
        expect(gameboard.totalShips).toBe(0); // Initially, totalShips should be 0
    });

    test('placeShip', () => {
        gameboard.placeShip(ship, {x: 0, y: 0}, 'horizontal');
        expect(gameboard.totalShips).toBe(1); // After placing one ship, totalShips should be 1
        expect(gameboard.ships.length).toBe(1); // The placed ship should be in ships array
    });

    test('canPlaceShip', () => {
        const result = gameboard.canPlaceShip(ship, {x: 0, y: 0}, 'horizontal');
        expect(result).toBe(false); // The ship is already placed at this position, so it should return false
    });

    test('getTotalShips', () => {
        expect(gameboard.getTotalShips()).toBe(1); // The total number of ships should be 1
    });

    test('getShipAt', () => {
        const result = gameboard.getShipAt(0, 0);
        expect(result).toBe(ship);  // The returned object should match the placed ship
    });

    test('clone', () => {
        const clonedGameboard = gameboard.clone();
        expect(clonedGameboard).not.toBe(gameboard); // They should not be the same object
        expect(clonedGameboard.totalShips).toBe(gameboard.totalShips); // But the properties should be identical
    });
});