export class Ship {
    constructor(name, size) {
        this.name = name;
        this.size = size;
        this.parts = Array.from({length: size}, () => ({hit: false}));
    }

    getName() {
        return this.name;
    }

    getSize() {
            return this.size;
        }

    hit(partIndex) {
        if (partIndex >= 0 && partIndex < this.size && !this.parts[partIndex].hit) {
            this.parts[partIndex].hit = true;
            console.log('Ship got a hit');
            return true;
        }
        return false;
    }

    getHits () {
        return this.parts.reduce((acc, part) => acc + (part.hit ? 1 : 0), 0);
    }

    getIsSunk() {
        return this.parts.every(part => part.hit);
    }

    clone() {
        const newShip = Object.create(this);
        newShip.parts = [...this.parts];
        return newShip;
    }
}