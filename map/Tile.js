const PHEROMONE_DECAY_RATE = 0.1;

// Tile content types
const EMPTY = 0;
const WALL = 1;
const COLONY = 2;
const FOOD = 3;
const PHEROMONED = 4;

// Pheromone types
const TO_HOME = 0;
const TO_FOOD = 1;

export class Tile {
    static width;
    static height;

    constructor() {
        this.content = EMPTY;
    }

    addPheromone(ctx, x, y, type, steps = null) {
        this.content = PHEROMONED;
        this.pheromoneType = type;
        if (type === TO_HOME) {
            this.pheromoneSteps = steps;
        }
        this.pheromoneIntensity = 100;
        this.drawPheromone(ctx, x, y, type)
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
        switch (this.pheromoneType) {
            case TO_HOME:
                ctx.fillStyle = "rgba(0, 0, 255)";
                break;
            case TO_FOOD:
                ctx.fillStyle = "rgba(0, 255, 0)";
                break;
        }
        ctx.fill();
    }

    decayPheromone(ctx) {
        this.pheromoneIntensity -= PHEROMONE_DECAY_RATE;
        if (this.pheromoneIntensity <= 0) {
            this.erasePheromone(ctx);
            this.content = EMPTY;
            this.pheromoneSteps = null;
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
            switch (this.pheromoneType) {
                case TO_HOME:
                    ctx.fillStyle = `rgba(0, 0, 255, ${alpha})`;
                    break;
                case TO_FOOD:
                    ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
                    break;
            }
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
            Tile.width + 0.3, // Radius of the circle
            0, 
            Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
    } 
}