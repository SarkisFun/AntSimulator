const EMPTY = 0;
const WALL = 1;
const COLONY = 2;
const FOOD = 3;

export class MapGrid {

    constructor(tileSize, width, height) {
        this.tileWidth = tileSize;
        this.tileHeight = tileSize;
        this.mapWidth = Math.floor(width / tileSize);
        this.mapHeight = Math.floor(height / tileSize);
        this.grid = new Array(this.mapWidth);
        this.offScreenCanvas = document.createElement('canvas');
        this.offScreenCanvas.width = width;
        this.offScreenCanvas.height = height;
        this.offScreenCtx = this.offScreenCanvas.getContext('2d');
        this.colonyX = -1;
        this.colonyY = -1;

        for (let i = 0; i < this.mapWidth; i++) {
            this.grid[i] = new Array(this.mapHeight);  
            for (let j = 0; j < this.mapHeight; j++) {
                this.grid[i][j] = EMPTY;
            }   
        }
    }

    createColony(canvasX, canvasY) {
        if (this.colonyX != -1) {
            this.grid[this.colonyX][this.colonyY] = EMPTY;
        }

        this.colonyX = Math.floor(canvasX / this.tileWidth);
        this.colonyY = Math.floor(canvasY / this.tileHeight);

        this.grid[this.colonyX][this.colonyY] = COLONY;
    }

    createWall(canvas, mouseX, mouseY, radius) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((mouseX - rect.left) / this.tileWidth);
        const y = Math.floor((mouseY - rect.top) / this.tileHeight);

        for (let i = -radius; i <= radius; i++) {
            for (let j = -radius; j <= radius; j++) {
                const newX = x + i;
                const newY = y + j;

                // Check if coordinates are within bounds and radius
                if (newX >= 0 && newX < this.mapWidth && newY >= 0 &&
                     newY < this.mapHeight &&
                     Math.sqrt(i * i + j * j) <= radius && // Check if Euclidean distance is within radius
                     this.grid[newX][newY] != COLONY) { 
                    this.grid[newX][newY] = WALL;

                    this.offScreenCtx.fillStyle = "grey";
                    this.offScreenCtx.fillRect(
                    this.tileWidth * newX,
                    this.tileHeight * newY,
                    this.tileWidth,
                    this.tileHeight
                );
                }
            }   
        }
        this.draw(canvas);       
    }

    createFood(canvas, mouseX, mouseY, radius) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((mouseX - rect.left) / this.tileWidth);
        const y = Math.floor((mouseY - rect.top) / this.tileHeight);

        for (let i = -radius; i <= radius; i++) {
            for (let j = -radius; j <= radius; j++) {
                const newX = x + i;
                const newY = y + j;

                // Check if coordinates are within bounds and radius
                if (newX >= 0 && newX < this.mapWidth && newY >= 0 &&
                     newY < this.mapHeight &&
                     Math.sqrt(i * i + j * j) <= radius &&  // Check if Euclidean distance is within radius
                     this.grid[newX][newY] != WALL && this.grid[newX][newY] != COLONY) { 
                    this.grid[newX][newY] = FOOD;

                    this.offScreenCtx.beginPath();
                    this.offScreenCtx.arc(
                        this.tileWidth * newX + this.tileWidth / 2, // Center X
                        this.tileHeight * newY + this.tileHeight / 2, // Center Y
                        this.tileWidth / 2, // Radius of the circle
                        0, 
                        Math.PI * 2
                    );
                    this.offScreenCtx.fillStyle = "green";
                    this.offScreenCtx.fill();
                }
            }   
        }
        this.draw(canvas); 
    }

    draw(canvas) {
        let ctx = canvas.getContext('2d');

        ctx.drawImage(this.offScreenCanvas, 0, 0);
    }

    update(canvas) {
        this.draw(canvas);
    }
}