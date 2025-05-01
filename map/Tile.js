// Tile content types
const EMPTY = 0;
const WALL = 1;
const COLONY = 2;
const FOOD = 3;
const PHEROMONED = 4;

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

    addPheromone(ctx, type) {
        this.content = PHEROMONED;
        this.pheromoneType = type;
        this.pheromoneIntensity = 100;
        this.drawPheromone(ctx)
    }

    drawPheromone(ctx) {
        ctx.beginPath();
                    ctx.arc(
                        Tile.width * newX + Tile.width / 2, // Center X
                        Tile.height * newY + Tile.height / 2, // Center Y
                        Tile.width * 2, // Radius of the circle
                        0, 
                        Math.PI * 2
                    );
                    ctx.fillStyle = "blue";
                    ctx.fill();
    }
}