const PHEROMONE_DECAY_RATE = 0.2;

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
            Tile.width, // Radius of the circle
            0, 
            Math.PI * 2
        );
        ctx.fillStyle = "rgba(0, 0, 255)";
        ctx.fill();
    }

    decayPheromone(ctx) {
        this.pheromoneIntensity -= PHEROMONE_DECAY_RATE;
        if (this.pheromoneIntensity <= 0) {
            this.erasePheromone(ctx);
            this.content = EMPTY;
        } else {
            this.erasePheromone(ctx);
            const alpha = this.pheromoneIntensity / 100; // Calculate transparency
            ctx.save();
            ctx.beginPath();
            ctx.arc(
                this.pheromoneCenterX,
                this.pheromoneCenterY,
                Tile.width, // Radius of the circle
                0,
                Math.PI * 2
            );
            ctx.fillStyle = `rgba(0, 0, 255, ${alpha})`; // Blue color with dynamic transparency
            ctx.fill();
            ctx.restore();
            }
    }

    erasePheromone(ctx) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(
            this.pheromoneCenterX,
            this.pheromoneCenterY,
            Tile.width+ 1, // Radius of the circle
            0, 
            Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
    } 
}