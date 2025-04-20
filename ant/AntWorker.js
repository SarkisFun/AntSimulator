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

    update(canvas, grid, tileWidth) {
        let ctx = canvas.getContext('2d');

        this.angle += (Math.random() - 0.5) * 0.1;
        let dx = Math.cos(this.angle) * this.speed;
        let dy = Math.sin(this.angle) * this.speed;

        let nextPosX = this.posX + dx;
        let nextPosY = this.posY + dy;

        // Calculate the grid cell the ant is moving into
        let gridX = Math.floor(nextPosX / tileWidth);
        let gridY = Math.floor(nextPosY / tileWidth);

        const buffer = this.size; // Add a buffer equal to the ant's size

        // Check for wall collisions
        if (gridX >= 0 && gridX < grid.length && gridY >= 0 && gridY < grid[0].length) {
            if (grid[gridX][gridY] === 1) { // 1 represents WALL
                dx *= -1;
                dy *=-1;
                this.angle += Math.PI; // Reverse the direction
            } else {
                this.posX += dx;
                this.posY += dy;

                // Detect and bounce off edges
                if (this.posX - this.size < 0) {
                    this.angle = Math.PI - this.angle; // Reflect angle horizontally
                    this.posX = buffer; // Ensure it's fully within bounds
                } else if (this.posX + this.size > canvas.width) {
                    this.angle = Math.PI - this.angle; // Reflect angle horizontally
                    this.posX = canvas.width - buffer; // Ensure it's fully within bounds
                }
                if (this.posY - this.size < 0) {
                    this.angle = -this.angle; // Reflect angle vertically
                    this.posY = buffer; // Ensure it's fully within bounds
                } else if (this.posY + this.size > canvas.height) {
                    this.angle = -this.angle; // Reflect angle vertically
                    this.posY = canvas.height - buffer; // Ensure it's fully within bounds
                }
            }
        }   
        
        let rotationAngle = Math.atan2(dy, dx) /*+ Math.PI / 2*/;

        this.draw(ctx, rotationAngle);
        }
  }