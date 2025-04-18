import { AntWorker } from "./AntWorker.js";

export class Colony {
    static img = new Image();
    static scale = 70;

    constructor(antNumber, x, y) {
        this.x = x - Colony.scale/2;
        this.y = y - Colony.scale/2;
        this.workers = [];
        for (let i = 0; i < antNumber; i++) {
            this.workers.push(new AntWorker(x, y));
        }
        Colony.img.src = "./img/colony.png";
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
        this.draw(canvas)
        this.workers.forEach(ant =>{
            ant.update(canvas);
        });
    }
}