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

    getGridCoordinates(x, y) {
        let coordinates = [];
        coordinates[0] = Math.floor(x / this.tileWidth);
        coordinates[1] = Math.floor(y / this.tileHeight);
        return coordinates;
    }

    getRealCoordinates(gridCoordinates) {
        return [gridCoordinates[0] * this.tileWidth, gridCoordinates[1] * this.tileHeight];
    }

    isInGrid(x, y) {
        let coordinates = this.getGridCoordinates(x, y);
        return coordinates[0] >= 0 && coordinates[0] < this.grid.length && coordinates[1] >= 0 && coordinates[1] < this.grid[0].length;
    }

    isWall(x, y) {
        let coordinates = this.getGridCoordinates(x, y);
        return this.grid[coordinates[0]][coordinates[1]] === WALL; 
    }

    containsFood(x, y, radius) {
        let coordinates = this.getGridCoordinates(x, y);
        let minDistance = Infinity;
        let nearestFood = [false, null, null];

        for (let i = -radius; i <= radius; i++) {
            for (let j = -radius; j <= radius; j++) {
                const newX = coordinates[0] + i;
                const newY = coordinates[1] + j;
    
                // Check if coordinates are within bounds and radius
                if (newX >= 0 && newX < this.mapWidth && newY >= 0 &&
                    newY < this.mapHeight &&
                    Math.sqrt(i * i + j * j) <= radius) { // Check if Euclidean distance is within radius
                    if (this.grid[newX][newY] === FOOD) {
                        nearestFood[0] = true;
                        const distance = Math.sqrt(i * i + j * j);
                        if (distance < minDistance) {
                            minDistance = distance;
                            //nearestFood = [newX, newY];
                            nearestFood[1] = newX;
                            nearestFood[2] = newY;
                        }
                    }
                }
            }
        }
        if (nearestFood[0]) {
            let coordinates = this.getRealCoordinates([nearestFood[1], nearestFood[2]]);
            nearestFood[1] = coordinates[0];
            nearestFood[2] = coordinates[1]
        }
        return nearestFood;
    }

    takeFood(foodX, foodY) {
        let coordinates = this.getGridCoordinates(foodX, foodY);
        this.grid[coordinates[0]][coordinates[1]] = EMPTY;
        this.offScreenCtx.clearRect(this.tileWidth * foodX, 
            this.tileHeight * foodY, this.tileWidth, this.tileHeight);
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