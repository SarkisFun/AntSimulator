const DEFAULT_SPEED = 1;
const DEFAULT_SIZE = 5;

class WorkerAnt {
    static img;
    static scale = 14;
    static ctx;
    static canvas;

      constructor(ctx, canvas, posX, posY){
          WorkerAnt.img = new Image();
          WorkerAnt.img.src = './img/worker.png';  
          WorkerAnt.ctx = ctx;
          WorkerAnt.canvas = canvas;
          this.posX = posX - WorkerAnt.scale /2;
          this.posY = posY - WorkerAnt.scale /2;
          this.speed = DEFAULT_SPEED;
          this.size = DEFAULT_SIZE;
          this.angle = Math.random() * Math.PI * 2;
      }
      
      draw(rotationAngle) {
         WorkerAnt.ctx.save();
        WorkerAnt.ctx.translate(this.posX, this.posY);
        WorkerAnt.ctx.rotate(rotationAngle + Math.PI / 2);
        if (WorkerAnt.img.complete) {
            // Draw the image if it's already loaded
            //WorkerAnt.ctx.drawImage(WorkerAnt.img, this.posX, this.posY, WorkerAnt.scale, WorkerAnt.scale);
            WorkerAnt.ctx.drawImage(WorkerAnt.img, 0, 0, WorkerAnt.scale, WorkerAnt.scale);
        } else {
            // Set up an onload listener to draw once the image is loaded
            WorkerAnt.img.onload = () => {
              //WorkerAnt.ctx.drawImage(WorkerAnt.img, this.posX, this.posY, WorkerAnt.scale, WorkerAnt.scale);
              WorkerAnt.ctx.drawImage(WorkerAnt.img, 0, 0, WorkerAnt.scale, WorkerAnt.scale);
            };
        }

        WorkerAnt.ctx.restore();

      }

      update() {
        WorkerAnt.ctx.clearRect(0, 0, WorkerAnt.canvas.width, WorkerAnt.canvas.height);

        //let dx = (Math.random() * 4 * this.speed) * (Math.random() < 0.5 ? 1 : -1);
        //let dy = (Math.random() * 4 * this.speed) * (Math.random() < 0.5 ? 1 : -1);
        this.angle += (Math.random() - 0.5) * 0.1;
        let dx = Math.cos(this.angle) * this.speed;
        let dy = Math.sin(this.angle) * this.speed;

        this.posX += dx;
        this.posY += dy;

        // Detect and bounce off edges
        if (this.posX - this.size < 0 || this.posX + this.size > WorkerAnt.canvas.width) {
          //dx *= -1;
          this.angle = Math.PI - this.angle;
          this.posX = Math.max(0, Math.min(WorkerAnt.canvas.width, this.posX));
        }
        if (this.posY - this.size < 0 || this.posY + this.size > WorkerAnt.canvas.height) {
          //dy *= -1;
          this.angle = -this.angle;
          this.posY = Math.max(0, Math.min(WorkerAnt.canvas.height, this.posY));
        } 

        let rotationAngle = Math.atan2(dy, dx) /*+ Math.PI / 2*/;

        this.draw(rotationAngle);
        requestAnimationFrame(this.update.bind(this));
      }
  }