import { Colony } from "../ant/Colony.js";

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
        this.colony = new Colony();
        this.foodQuantity = 0;

        for (let i = 0; i < this.mapWidth; i++) {
            this.grid[i] = new Array(this.mapHeight);  
            for (let j = 0; j < this.mapHeight; j++) {
                this.grid[i][j] = {
                    content: EMPTY,
                    pheromoneType: null,
                    pheromoneIntensity:0
                };
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
        return this.grid[coordinates[0]][coordinates[1]].content === WALL; 
    }

    containsItem(x, y, radius, item) {
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
                    if (this.grid[newX][newY].content === item) {
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
        this.grid[coordinates[0]][coordinates[1]].content = EMPTY;
        this.offScreenCtx.clearRect(this.tileWidth * coordinates[0], 
            this.tileHeight * coordinates[1], this.tileWidth, this.tileHeight);
    }

    createColony(canvasX, canvasY) {
        let gridCoords = this.getGridCoordinates(canvasX, canvasY);
        
        if (this.colony.x != -1) {
            this.grid[gridCoords[0]][gridCoords[1]].content = EMPTY;
        }

        

        this.colony.x = gridCoords[0];
        this.colony.y = gridCoords[1];

        this.grid[this.colony.x][this.colony.y].content = COLONY;
        this.colony.setCoordinates(canvasX, canvasY)
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
                     this.grid[newX][newY].content != COLONY) { 
                    if (this.grid[newX][newY].content === FOOD) {
                        this.foodQuantity--;
                    }
                    this.grid[newX][newY].content = WALL;

                    this.offScreenCtx.fillStyle = "grey";
                    this.offScreenCtx.fillRect(this.tileWidth * newX,
                         this.tileHeight * newY, this.tileWidth, this.tileHeight);
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
                     this.grid[newX][newY].content != WALL && this.grid[newX][newY].content != COLONY &&
                     this.grid[newX][newY].content != FOOD) { 
                    this.grid[newX][newY].content = FOOD;
                    this.foodQuantity++;

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

    eraser(canvas, mouseX, mouseY, radius) {
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
                    this.grid[newX][newY].content != COLONY) {   
                    
                    if (this.grid[newX][newY].content == FOOD){
                        this.foodQuantity--;
                    }
                    this.grid[newX][newY].content = EMPTY;

                    this.offScreenCtx.clearRect(this.tileWidth * newX,
                        this.tileHeight * newY, this.tileWidth, this.tileHeight);
               }
            }
        }
        this.draw(canvas);
    }

    draw(canvas) {
        let ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.offScreenCanvas, 0, 0);
        if (this.colony.x != -1) {
            this.colony.draw(canvas);    
        }
    }

    update(canvas) {
        this.draw(canvas);
    }
}