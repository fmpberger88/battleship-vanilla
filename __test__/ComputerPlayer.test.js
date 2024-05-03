import { describe, expect, test } from 'vitest';
import { ComputerPlayer } from '../classes/ComputerPlayer';
import { Gameboard } from '../classes/Gameboard';

describe('ComputerPlayer', () => {

    test('autoAttack should generate attacks within board dimensions', () => {
        const rows = 10, cols = 10;
        const board = new Gameboard(rows, cols);
        const computerPlayer = new ComputerPlayer('AI', board);

        for (let attempt = 0; attempt < 100; attempt++) {
            const result = computerPlayer.autoAttack(board);

            expect(result.x).toBeGreaterThanOrEqual(0);
            expect(result.x).toBeLessThanOrEqual(rows - 1);

            expect(result.y).toBeGreaterThanOrEqual(0);
            expect(result.y).toBeLessThanOrEqual(cols - 1);
        }
    });

    test('getRandomInt returns values within range', () => {
        const player = new ComputerPlayer('AI', null);
        for (let i = 0; i < 100; i++) {
            const rngValue = player.getRandomInt(0, 9);
            expect(rngValue).toBeGreaterThanOrEqual(0);
            expect(rngValue).toBeLessThanOrEqual(9);
        }
    });

    test('getRandomInt should throw error for negative min or max', () => {
        const player = new ComputerPlayer('AI', null);
        expect(() => {
            player.getRandomInt(-1, 10);
        }).toThrow('Ungültiger Bereich für getRandomInt');

        expect(() => {
            player.getRandomInt(10, -1);
        }).toThrow('Ungültiger Bereich für getRandomInt');
    });
});