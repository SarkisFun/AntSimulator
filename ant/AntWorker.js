const MIN_SPEED = 1.6;
const MAX_SEED = 2.6;
const DEFAULT_SIZE = 5;
const DEFAULT_PERCEPTION_RADIUS = 20;

// Status
const SCOUTING = 0;
const GOING_HOME = 1;

export class AntWorker {
    //static img;
    static scale = 10; // TODO scale should depend of size

    constructor(posX, posY){
        this.img = new Image();
        this.img.src = './img/worker.png';
        this.posX = posX - AntWorker.scale /2;
        this.posY = posY - AntWorker.scale /2;
        this.speed = Math.random() * (MAX_SEED - MIN_SPEED) + MIN_SPEED;
        this.size = DEFAULT_SIZE;
        this.angle = Math.random() * Math.PI * 2;
        this.carryingFood = false;
        this.perceptionRadius = DEFAULT_PERCEPTION_RADIUS;
        this.status = SCOUTING;
    }
    
    // Moves ant and returns rotation angle to draw properly
    move(canvas, map) {
        // Calculate new angle and direction
        this.angle += (Math.random() - 0.5) * 0.1;
        let dx = Math.cos(this.angle) * this.speed;
        let dy = Math.sin(this.angle) * this.speed;
        /*
        // Check if Ant is off grid
        if (map.isInGrid(nextPosX, nextPosY)) {
            console.err("ANT OFF GRID!!!");
        }
        */ 
        // Check for wall collisions
        if (map.isWall(this.posX + dx, this.posY + dy)) {
            dx *= -1;
            dy *= -1;
            this.angle += Math.PI; // Reverse the direction
        } else {
            this.posX += dx;
            this.posY += dy;

            // Detect and bounce off edges
            if (this.posX - this.size < 0) {
                this.angle = Math.PI - this.angle; // Reflect angle horizontally
                this.posX = this.size; // Ensure it's fully within bounds
            } else if (this.posX + this.size > canvas.width) {
                this.angle = Math.PI - this.angle;
                this.posX = canvas.width - this.size;
            }
            if (this.posY - this.size < 0) {
                this.angle = -this.angle;
                this.posY = this.size;
            } else if (this.posY + this.size > canvas.height) {
                this.angle = -this.angle;
                this.posY = canvas.height - this.size;
            }
        }

        return Math.atan2(dy, dx);
    }
    
    moveTowardsPoint(map, foodX, foodY) {
        // Calculate angle towards point
        let dx = foodX - this.posX;
        let dy = foodY - this.posY;
        this.angle = Math.atan2(dy, dx);

        // Calculate movement in direction of point
        let moveX = Math.cos(this.angle) * this.speed;
        let moveY = Math.sin(this.angle) * this.speed;

        this.posX += moveX;
        this.posY += moveY;

        return Math.atan2(dy, dx);
    }

    pickUpFood(map, foodX, foodY) {
        map.takeFood(foodX, foodY);
        this.carryingFood = true;
    }

    deliverFood() {
        this.carryingFood = false;
    }

    draw(ctx, rotationAngle) {
        if (this.carryingFood) {
            this.img.src = './img/workerWithFood.png';
        } else {
            this.img.src = './img/worker.png';
        }
        ctx.save();
        ctx.translate(this.posX, this.posY);
        ctx.rotate(rotationAngle + Math.PI / 2);
        if (this.img.complete) {
            ctx.drawImage(this.img, 0, 0, AntWorker.scale, AntWorker.scale);
        } else {
            this.img.onload = () => {
                ctx.drawImage(this.img, 0, 0, AntWorker.scale, AntWorker.scale);
            };
        }
        ctx.restore();
    }

    update(canvas, map) {
        let ctx = canvas.getContext('2d');

        if (!this.carryingFood) { // Ant has no food
            let detectedFood = map.containsItem(this.posX, this.posY, this.size, 3); // 3 = FOOD
            if (detectedFood[0]) { // Ant colliding with food
                this.pickUpFood(map, detectedFood[1], detectedFood[2]);
            } else { // Ant not colliding with food
                detectedFood = map.containsItem(this.posX, this.posY, this.perceptionRadius, 3); // 3 = FOOD
                if (detectedFood[0]) { // Ant perceives food
                    let rotationAngle = this.moveTowardsPoint(map, detectedFood[1], detectedFood[2]);
                    this.draw(ctx, rotationAngle);
                } else { // No food in Ant perception radius
                    let rotationAngle = this.move(canvas, map);
                    this.draw(ctx, rotationAngle);
                }       
            }
        } else { // Ant has food
            let detectedHome = map.containsItem(this.posX, this.posY, this.size, 2); // 2 = COLONY
            if (detectedHome[0]) {
                this.deliverFood();
            } else {
                detectedHome = map.containsItem(this.posX, this.posY, this.perceptionRadius, 2); // 2 = COLONY
                if (detectedHome[0]) {
                    let rotationAngle = this.moveTowardsPoint(map, detectedHome[1], detectedHome[2]);
                    this.draw(ctx, rotationAngle);
                } else {
                    let rotationAngle = this.move(canvas, map);
                    this.draw(ctx, rotationAngle);
                }
            }
        }
    }
}