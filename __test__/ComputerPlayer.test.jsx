import { describe, it, expect, beforeEach } from 'vitest';
import { Gameboard } from '../src/Gameboard.jsx';
import { ComputerPlayer } from '../src/ComputerPlayer.jsx';

describe('ComputerPlayer', () => {
    let gameboard;
    let computerPlayer;

    beforeEach(() => {
        gameboard = new Gameboard(10, 10); // Ein 10x10 Spielbrett
        computerPlayer = new ComputerPlayer('AI', gameboard);
    });

    it('Should perform an auto attack on a valid cell', () => {
        const attackedCells = new Set();
        // Simulieren Sie eine große Anzahl von Angriffen, um eine breite Abdeckung zu gewährleisten
        for (let i = 0; i < 100; i++) {
            const result = computerPlayer.autoAttack();
            // Ergebnis könnte true oder false sein, abhängig von Treffern, aber Angriff sollte durchgeführt werden
            expect(result).toBeDefined();
            // Überprüfen Sie, ob die gleiche Zelle nicht mehrmals angegriffen wird
            gameboard.board.forEach((row, x) => {
                row.forEach((cell, y) => {
                    if (cell.attacked) {
                        expect(attackedCells.has(`${x},${y}`)).toBe(false);
                        attackedCells.add(`${x},${y}`);
                    }
                });
            });
        }
    });
});
