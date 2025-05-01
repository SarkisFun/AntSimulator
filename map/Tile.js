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

    addPheromone(ctx, x, y, type) {
        this.content = PHEROMONED;
        this.pheromoneType = type;
        this.pheromoneIntensity = 100;
        this.drawPheromone(ctx, x, y)
    }

    drawPheromone(ctx, x, y) {
        this.pheromoneCenterX = x;
        this.pheromoneCenterY = y;
        ctx.beginPath();
        ctx.arc(this.pheromoneCenterX, this.pheromoneCenterY,
            Tile.width * 2, // Radius of the circle
            0, 
            Math.PI * 2
        );
        ctx.fillStyle = "blue";
        ctx.fill();
    }

    erasePheromone(ctx) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(
            this.pheromoneCenterX,
            this.pheromoneCenterY,
            Tile.width * 2 + 1, // Radius of the circle
            0, 
            Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
    } 
}