// Tile content types
const EMPTY = 0;
const WALL = 1;
const COLONY = 2;
const FOOD = 3;

// Pheromone types
const TO_HOME = 0;

export class Tile {
    static width;
    static height;

    constructor() {
        this.content = EMPTY;
        //this.pheromoneType = -1;
        //this.pheromoneIntensity = 0;
    }
}