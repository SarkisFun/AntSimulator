import { AntWorker } from "./AntWorker.js";

export class Colony {
    static img = new Image();
    static scale = 70;
    static minZoom = 1;
    static maxZoom = 5;

    constructor(antNumber, x, y) {
        this.x = x - Colony.scale /2;
        this.y = y - Colony.scale /2;
        this.workers = [];
        for (let i = 0; i < antNumber; i++) {
            this.workers.push(new AntWorker(x, y));
        }
        Colony.img.src = "./img/colony.png";
        this.zoomScale = 1;
    }

    draw(canvas) {
        let ctx = canvas.getContext('2d');
        if (Colony.img.complete) {
            ctx.drawImage(Colony.img, this.x, this.y, Colony.scale, Colony.scale);
        } else {
            Colony.img.onload = () => {
                ctx.drawImage(Colony.img, this.x, this.y, Colony.scale, Colony.scale);
            };
        }
        
    }

    update(canvas) {
        let ctx = canvas.getContext('2d');
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(this.zoomScale, this.zoomScale);
        this.draw(canvas)
        this.workers.forEach(ant =>{
            ant.update(canvas);
        });
        ctx.restore();
    }
}