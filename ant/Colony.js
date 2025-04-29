import { AntWorker } from "./AntWorker.js";

export class Colony {
    static img = new Image();
    static scale = 70;

    constructor() {
        Colony.img.src = "./img/colony.png";
        this.x = -1;
        this.y = -1;
    }

    setAntNumber(antNumber) {
        this.antNumber = antNumber;
        this.resetAnts();
    }

    setCoordinates(x, y) {
        this.x = x;
        this.y = y;
        this.topLeftX = x - Colony.scale/2;
        this.topLeftY = y - Colony.scale/2;
    }

    resetAnts() {
        this.workers = [];
        for (let i = 0; i < this.antNumber; i++) {
            this.workers.push(new AntWorker(this.x, this.y));
        }
    }

    draw(canvas) {
        let ctx = canvas.getContext('2d');
        if (Colony.img.complete) {
            //ctx.drawImage(Colony.img, this.x, this.y, Colony.scale, Colony.scale);
            ctx.drawImage(Colony.img, this.x - Colony.scale/2, this.y - Colony.scale/2, Colony.scale, Colony.scale);
        } else {
            Colony.img.onload = () => {
                //ctx.drawImage(Colony.img, this.x, this.y, Colony.scale, Colony.scale);
                ctx.drawImage(Colony.img, this.x - Colony.scale/2, this.y - Colony.scale/2, Colony.scale, Colony.scale);
            };
        }       
    }

    drawAnts(canvas) {
        let ctx = canvas.getContext('2d');

        for (const ant of this.workers) {
            ant.draw(ctx);
        }
    }

    update(canvas, map) {
        this.draw(canvas)
        this.workers.forEach(ant =>{
            ant.update(canvas, map);
        });
    }
}