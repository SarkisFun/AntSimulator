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

    addPheromone(ctx, x, y, type, showPheromones) {
        this.content = PHEROMONED;
        this.pheromoneType = type;
        this.pheromoneIntensity = 100;
        this.drawPheromone(ctx, x, y, type, showPheromones)
    }

    drawPheromone(ctx, x, y, showPheromones) {
        this.pheromoneCenterX = x;
        this.pheromoneCenterY = y;
        if (showPheromones) {
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
    }

    decayPheromone(ctx, showPheromones) {
        this.pheromoneIntensity -= PHEROMONE_DECAY_RATE;
        if (this.pheromoneIntensity <= 0) {
            this.erasePheromone(ctx);
            this.content = EMPTY;
        } else {
            this.erasePheromone(ctx);
            if (showPheromones) {
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