import { Ship } from '../src/Ship.jsx';
import { Gameboard } from '../src/Gameboard.jsx';
import { describe, it, expect, beforeEach } from 'vitest'

describe('Gameboard', () => {
    let gameboard;
    let myShip;
    beforeEach(() => {
        gameboard = new Gameboard(12, 12);
        myShip = new Ship('Titanic', 5);
    });

    it('Should place the ship', () => {
        gameboard.placeShip(myShip, { x: 0, y: 0}, 'horizontal');
        expect(gameboard.getShipAt(0, 0)).toBe(myShip);
    })

    it('Should throw Error if ships overlapping', () => {
        expect(() => {
                    gameboard.placeShip(myShip, { x: 0, y: 0}, 'horizontal');
                    gameboard.placeShip(new Ship('Ship2', 3), { x: 0, y: 0}, 'horizontal');
                }).toThrowError();
    });

    it('Should throw Error if attacking outside the board', () => {
        expect(() => {
                    gameboard.attack(13, 12);
                }).toThrowError();
    });

    it('Should handle attacks correctly', () => {
        gameboard.placeShip(myShip, { x: 0, y: 0}, 'horizontal');
        gameboard.attack(0, 0);
        expect(myShip.getHits()).toBe(1);
    })

    it('Should return false for missed attacks', () => {
        expect(gameboard.attack(1, 1)).toBe(false);
    })

    it('Should report ship sunk correctly', () => {
        gameboard.placeShip(myShip, { x: 0, y: 0}, 'vertical');
        for (let i = 0; i < myShip.size; i++) {
            gameboard.attack(i, 0);
        }

        expect(myShip.getIsSunk()).toBe(true);
    });

    it('Should report all ships sunk correctly', () => {
        gameboard.placeShip(myShip, { x: 0, y: 0}, 'horizontal');
        for (let i = 0; i < myShip.size; i++) {
            gameboard.attack(0, i);
        }
        expect(gameboard.allShipsSunk()).toBe(true);
    });

    it('Should place ship vertically correctly', () => {
        gameboard.placeShip(myShip, { x: 0, y: 0}, 'vertical');
        for (let i = 0; i < myShip.size; i++) {
            expect(gameboard.getShipAt(i, 0)).toBe(myShip);
        }
    });

    it('Should not allow ships to be placed outside the board', () => {
        expect(() => gameboard.placeShip(myShip, { x: 12, y: 12}, 'horizontal')).toThrowError();
        expect(() => gameboard.placeShip(myShip, { x: -1, y: -1}, 'horizontal')).toThrowError();
        expect(() => gameboard.placeShip(myShip, { x: 8, y: 0}, 'vertical')).toThrowError(); // Assuming ship size is 5 and would exceed the board boundary
    });

})