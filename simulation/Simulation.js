const ZOOM_SCALE_FACTOR = 1.1;

import { Colony } from "../ant/Colony.js";

export class Simulation {
    static canvas;
    static ctx;
    static scale = 1;
    static scaleFactor = ZOOM_SCALE_FACTOR;
    static minZoom = 1;
    static maxZoom = 5;

    constructor(canvas) {
        Simulation.canvas = canvas;
        Simulation.ctx = canvas.getContext('2d');
        this.mouseWheelListener();
    }

    mouseWheelListener(){
        Simulation.canvas.addEventListener("wheel", (event) => {
            event.preventDefault();

            const oldScale = Simulation.scale;

            // Zoom direction (in or out)
            if (event.deltaY < 0 && Simulation.scale < Colony.maxZoom) {
                Simulation.scale *= Simulation.scaleFactor;
            } else if (event.deltaY > 0 && Simulation.scale > Colony.minZoom) {
                Simulation.scale /= Simulation.scaleFactor;
            }
            Simulation.ctx.setTransform(Simulation.scale, 0, 0, Simulation.scale, 0, 0); // Reset and apply new scale
        });
    }

    start() {
        this.colony = new Colony(1000, canvas.width/2, canvas.height/2);

        this.animationLoop();
    }

    animationLoop() {
        this.colony.update(Simulation.canvas);
        requestAnimationFrame(this.animationLoop.bind(this));
    }   
}