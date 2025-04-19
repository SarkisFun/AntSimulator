const EMPTY = 0;
const WALL = 1;

export class MapGrid {

    constructor(tileSize, width, height) {
        this.tileWidth = tileSize;
        this.tileHeight = tileSize;
        this.mapWidth = Math.floor(width / tileSize);
        this.mapHeight = Math.floor(height / tileSize);
        this.grid = new Array(this.mapWidth);
        for (let i = 0; i < this.mapWidth; i++) {
            this.grid[i] = new Array(this.mapHeight);  
            for (let j = 0; j < this.mapHeight; j++) {
                this.grid[i][j] = EMPTY;
            }   
        }
    }

    draw(canvas) {
        let ctx = canvas.getContext('2d');

        for (let i = 0; i < this.mapWidth; i++) {
            for (let j = 0; j < this.mapHeight; j++) {
                switch (this.grid[i][j]) {
                    case WALL:
                        ctx.fillStyle = "grey";
                        ctx.fillRect(this.tileWidth * i, this.tileHeight * j, this.tileWidth, this.tileHeight);
                        break;
                }
            }            
        }
    }

    createWall(canvas, mouseX, mouseY, radius) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((mouseX - rect.left) / this.tileWidth);
        const y = Math.floor((mouseY - rect.top) / this.tileHeight);

        for (let i = -radius; i <= radius; i++) {
            for (let j = -radius; j <= radius; j++) {
                const newX = x + i;
                const newY = y + j;

                // Che if coordinates are within bounds and radius
                if (newX >= 0 && newX < this.mapWidth && newY >= 0 &&
                     newY < this.mapHeight &&
                     Math.sqrt(i * i + j * j) <= radius) { // Check if Euclidean distance is within radius
                    this.grid[newX][newY] = WALL;
                }
            }   
        }
        this.draw(canvas);
    }

    update(canvas) {
        this.draw(canvas);
    }
}