const MIN_SPEED = 1.6;
const MAX_SEED = 2.6
const DEFAULT_SIZE = 5;

export class AntWorker {
    static img;
    static scale = 10; // TODO scale should depend of size

    constructor(posX, posY){
        AntWorker.img = new Image();
        AntWorker.img.src = './img/worker.png';
        this.posX = posX - AntWorker.scale /2;
        this.posY = posY - AntWorker.scale /2;
        this.speed = Math.random() * (MAX_SEED - MIN_SPEED) + MIN_SPEED;
        this.size = DEFAULT_SIZE;
        this.angle = Math.random() * Math.PI * 2;
        this.carryingFood = false;
    }
    
    // Moves ant and returns rotation angle to draw properly
    move(canvas, map) {
        this.angle += (Math.random() - 0.5) * 0.1;
        let dx = Math.cos(this.angle) * this.speed;
        let dy = Math.sin(this.angle) * this.speed;

        let nextPosX = this.posX + dx;
        let nextPosY = this.posY + dy;

        // Check for wall collisions
        if (map.isInGrid(nextPosX, nextPosY)) {
            if (map.isWall(nextPosX, nextPosY)) {
                dx *= -1;
                dy *=-1;
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
        }
        return Math.atan2(dy, dx);
    }

    draw(ctx, rotationAngle) {
      ctx.save();
      ctx.translate(this.posX, this.posY);
      ctx.rotate(rotationAngle + Math.PI / 2);
      if (AntWorker.img.complete) {
          ctx.drawImage(AntWorker.img, 0, 0, AntWorker.scale, AntWorker.scale);
      } else {
          AntWorker.img.onload = () => {
            ctx.drawImage(AntWorker.img, 0, 0, AntWorker.scale, AntWorker.scale);
          };
      }
      ctx.restore();
    }

    update(canvas, map) {
        let ctx = canvas.getContext('2d');

        let rotationAngle = this.move(canvas, map);

        this.draw(ctx, rotationAngle);
        }
  }