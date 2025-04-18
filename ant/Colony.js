import { AntWorker } from "./AntWorker.js";

export class Colony {
    static img = new Image();
    static scale = 70;

    constructor(antNumber, x, y) {
        this.antNumber = antNumber;
        this.topLeftX = x - Colony.scale/2;
        this.topLeftY = y - Colony.scale/2;
        this.x = x;
        this.y = y;
        this.resetAnts()
        Colony.img.src = "./img/colony.png";
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

    update(canvas) {
        this.draw(canvas)
        this.workers.forEach(ant =>{
            ant.update(canvas);
        });
    }
}