import { Colony } from "../ant/Colony.js";
import { Tile } from "./Tile.js";

// Tile content types
const EMPTY = 0;
const WALL = 1;
const COLONY = 2;
const FOOD = 3;
const PHEROMONED = 4;

// Pheromone types
const TO_HOME = 0;
const TO_FOOD = 1;

export class MapGrid {

    constructor(tileSize, width, height) {
        Tile.width = tileSize;
        Tile.height = tileSize;
        this.mapWidth = Math.floor(width / tileSize);
        this.mapHeight = Math.floor(height / tileSize);
        this.grid = new Array(this.mapWidth);
        this.offScreenCanvas = document.createElement('canvas');
        this.offScreenCanvas.width = width;
        this.offScreenCanvas.height = height;
        this.offScreenCtx = this.offScreenCanvas.getContext('2d');
        this.colony = new Colony();
        this.foodAvaliable = 0;
        this.foodInTransit = 0;
        this.foodAtColony = 0;
        this.showPheromones = true;
        this.maxPossibleDistance = Math.sqrt(
            Math.pow(this.mapWidth * Tile.width, 2) +
            Math.pow(this.mapHeight * Tile.height, 2)
        );

        for (let i = 0; i < this.mapWidth; i++) {
            this.grid[i] = new Array(this.mapHeight);  
            for (let j = 0; j < this.mapHeight; j++) {
                this.grid[i][j] = new Tile();
            }   
        }
    }

    getGridCoordinates(x, y) {
        let coordinates = [];
        coordinates[0] = Math.floor(x / Tile.width);
        coordinates[1] = Math.floor(y / Tile.height);
        return coordinates;
    }

    getRealCoordinates(gridCoordinates) {
        return [gridCoordinates[0] * Tile.width, gridCoordinates[1] * Tile.height];
    }

    calculateDistanceToColony(x, y) {
        return Math.sqrt(Math.pow(x - this.colony.x, 2) + Math.pow(y - this.colony.y, 2))
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
            nearestFood[2] = coordinates[1];
        }
        return nearestFood;
    }

    getPheromoneScore(distanceToColony, pheromoneIntensity, preferCloser = true) {
        const distanceWeight = 2;
        const intensityWeight = 1;
        // Normalize distance (closer is better, so invert)
        let normalizedDistance = 1 - (distanceToColony / this.maxPossibleDistance);
        if (!preferCloser) {
            normalizedDistance = 1 - normalizedDistance;
        }
        // Normalize intensity (0 to 1)
        const normalizedIntensity = (pheromoneIntensity) / 100;
        return (distanceWeight * normalizedDistance) + (intensityWeight * normalizedIntensity);
    }

    containsHomePheromone(x, y, radius) {
        let coordinates = this.getGridCoordinates(x, y);
        //let bestDistance = Infinity;
        let bestScore = -Infinity;
        let preferedPheromone = [false, null, null];
        let myDistanceToColony = this.calculateDistanceToColony(x, y);

        for (let i = -radius; i <= radius; i++) {
            for (let j = -radius; j <= radius; j++) {
                const newX = coordinates[0] + i;
                const newY = coordinates[1] + j;
                
                // Check if coordinates are within bounds and radius
                if (newX >= 0 && newX < this.mapWidth && newY >= 0 &&
                    newY < this.mapHeight &&
                    Math.sqrt(i * i + j * j) <= radius) { // Check if Euclidean distance is within radius

                    if (this.grid[newX][newY].content === PHEROMONED &&
                        this.grid[newX][newY].pheromoneType === TO_HOME) {
                        let pheromoneCoords = this.getRealCoordinates([newX, newY]);
                        let pheromoneDistance = this.calculateDistanceToColony(pheromoneCoords[0], pheromoneCoords[1]);
                        if (pheromoneDistance < myDistanceToColony) {
                            // Prioritize pheromones leading closer to the goal
                            let score = this.getPheromoneScore(pheromoneDistance, this.grid[newX][newY].pheromoneIntensity);
                            if (score > bestScore) {
                                bestScore = score;
                                preferedPheromone = [true, newX, newY];
                            }
                        }
                    }
                }
            }
        }
        if (preferedPheromone[0]) {
            let coordinates = this.getRealCoordinates([preferedPheromone[1], preferedPheromone[2]]);
            preferedPheromone[1] = coordinates[0];
            preferedPheromone[2] = coordinates[1];
        }
        return preferedPheromone;
    }

    containsFoodPheromone(x, y, radius) {
        let coordinates = this.getGridCoordinates(x, y);
        //let maxDistance = -Infinity;
        let bestScore = -Infinity;
        let preferedPheromone = [false, null, null];
        let myDistanceToColony = this.calculateDistanceToColony(x, y);

        for (let i = -radius; i <= radius; i++) {
            for (let j = -radius; j <= radius; j++) {
                const newX = coordinates[0] + i;
                const newY = coordinates[1] + j;
                
                // Check if coordinates are within bounds and radius
                if (newX >= 0 && newX < this.mapWidth && newY >= 0 &&
                    newY < this.mapHeight &&
                    Math.sqrt(i * i + j * j) <= radius) { // Check if Euclidean distance is within radius

                    if (this.grid[newX][newY].content === PHEROMONED &&
                        this.grid[newX][newY].pheromoneType === TO_FOOD) {
                        let pheromoneCoords = this.getRealCoordinates([newX, newY]);
                        let pheromoneDistance = this.calculateDistanceToColony(pheromoneCoords[0], pheromoneCoords[1]);
                        if (pheromoneDistance > myDistanceToColony) {
                            // Prioritize pheromones leading closer to the goal
                            let score = this.getPheromoneScore(pheromoneDistance, this.grid[newX][newY].pheromoneIntensity, false);
                            if (score > bestScore) {
                                bestScore = score;
                                preferedPheromone = [true, newX, newY];
                            }
                        }
                        
                    }
                }
            }
        }
        if (preferedPheromone[0]) {
            let coordinates = this.getRealCoordinates([preferedPheromone[1], preferedPheromone[2]]);
            preferedPheromone[1] = coordinates[0];
            preferedPheromone[2] = coordinates[1];
        }
        return preferedPheromone;
    }

    takeFood(foodX, foodY) {
        let coordinates = this.getGridCoordinates(foodX, foodY);
        this.grid[coordinates[0]][coordinates[1]].content = EMPTY;
        this.offScreenCtx.clearRect(Tile.width * coordinates[0], 
            Tile.height * coordinates[1], Tile.width, Tile.height);
    }

    addPheromone(x, y, type) {
        let coordinates = this.getGridCoordinates(x, y);
        if(this.grid[coordinates[0]][coordinates[1]].content === EMPTY) {
            this.grid[coordinates[0]][coordinates[1]].addPheromone(this.offScreenCtx, x, y, type, this.showPheromones);
            if (this.showPheromones) {
                this.draw(canvas);
            }
            
        }
    }

    clearPheromones(canvas) {
        for (let i = 0; i < this.mapWidth; i++) {
            for (let j = 0; j < this.mapHeight; j++) {
                if (this.grid[i][j].content === PHEROMONED) {
                    this.grid[i][j].erasePheromone(this.offScreenCtx, i, j);
                    this.grid[i][j].content = EMPTY;
                }
            }
        }
        this.draw(canvas);
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
        const x = Math.floor((mouseX - rect.left) / Tile.width);
        const y = Math.floor((mouseY - rect.top) / Tile.height);

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
                        this.foodAvaliable--;
                    }
                    this.grid[newX][newY].content = WALL;

                    this.offScreenCtx.fillStyle = "grey";
                    this.offScreenCtx.fillRect(Tile.width * newX,
                         Tile.height * newY, Tile.width, Tile.height);
                }
            }   
        }
        this.draw(canvas);       
    }

    createFood(canvas, mouseX, mouseY, radius) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((mouseX - rect.left) / Tile.width);
        const y = Math.floor((mouseY - rect.top) / Tile.height);

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
                    this.foodAvaliable++;

                    this.offScreenCtx.beginPath();
                    this.offScreenCtx.arc(
                        Tile.width * newX + Tile.width / 2, // Center X
                        Tile.height * newY + Tile.height / 2, // Center Y
                        Tile.width / 2, // Radius of the circle
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
        const x = Math.floor((mouseX - rect.left) / Tile.width);
        const y = Math.floor((mouseY - rect.top) / Tile.height);

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
                        this.foodAvaliable--;
                    }
                    this.grid[newX][newY].content = EMPTY;

                    this.offScreenCtx.clearRect(Tile.width * newX,
                        Tile.height * newY, Tile.width, Tile.height);
               }
            }
        }
        this.draw(canvas);
    }

    decayPheromones() {
        for (let i = 0; i < this.mapWidth; i++) {
            for (let j = 0; j < this.mapHeight; j++) {
                if (this.grid[i][j].content === PHEROMONED) {
                    this.grid[i][j].decayPheromone(this.offScreenCtx, this.showPheromones);
                }
            }
        }
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
        this.decayPheromones();
        this.draw(canvas);
    }
}