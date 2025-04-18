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
        //this.speed = DEFAULT_SPEED;
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

    update(canvas) {
      let ctx = canvas.getContext('2d');

      this.angle += (Math.random() - 0.5) * 0.1;
      let dx = Math.cos(this.angle) * this.speed;
      let dy = Math.sin(this.angle) * this.speed;

      this.posX += dx;
      this.posY += dy;

      // Detect and bounce off edges
      if (this.posX - this.size < 0 || this.posX + this.size > canvas.width) {
        //dx *= -1;
        this.angle = Math.PI - this.angle;
        this.posX = Math.max(0, Math.min(canvas.width, this.posX));
      }
      if (this.posY - this.size < 0 || this.posY + this.size > canvas.height) {
        //dy *= -1;
        this.angle = -this.angle;
        this.posY = Math.max(0, Math.min(canvas.height, this.posY));
      } 

      let rotationAngle = Math.atan2(dy, dx) /*+ Math.PI / 2*/;

      this.draw(ctx, rotationAngle);
    }
  }