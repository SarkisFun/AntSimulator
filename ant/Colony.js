import { AntWorker } from "./AntWorker.js";

export class Colony {
    static img = new Image();
    static scale = 70;
    static ctx;
    static canvas;
    static minZoom = 1;
    static maxZoom = 5;

    constructor(ctx, canvas, antNumber, x, y) {
        Colony.ctx = ctx;
        Colony.canvas = canvas;
        this.x = x - Colony.scale /2;
        this.y = y - Colony.scale /2;
        this.workers = [];
        for (let i = 0; i < antNumber; i++) {
            this.workers.push(new AntWorker(ctx, canvas, x, y));
        }
        Colony.img.src = "./img/colony.png";
        this.zoomScale = 1;
    }

    setZoom(zoomScale) {
        this.zoomScale = zoomScale;
    }

    draw() {
        if (Colony.img.complete) {
            Colony.ctx.drawImage(Colony.img, this.x, this.y, Colony.scale, Colony.scale);
        } else {
            Colony.img.onload = () => {
                Colony.ctx.drawImage(Colony.img, this.x, this.y, Colony.scale, Colony.scale);
            };
        }
        
    }

    update() {
        Colony.ctx.save();
        Colony.ctx.clearRect(0, 0, canvas.width, canvas.height);
        Colony.ctx.scale(this.zoomScale, this.zoomScale);
        this.draw()
        this.workers.forEach(ant =>{
            ant.update();
        });
        Colony.ctx.restore();

        requestAnimationFrame(this.update.bind(this));
    }
}