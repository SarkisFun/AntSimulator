const ZOOM_SCALE_FACTOR = 1.1;

import { Colony } from "../ant/Colony.js";

export class Simulation {
    static canvas;
    static ctx;
    static minZoom = 1;
    static maxZoom = 5;
    
    constructor(canvas) {
        Simulation.canvas = canvas;
        Simulation.ctx = canvas.getContext('2d'); 
        this.colony;

        // Zoom atributes
        this.scale = 1;
        this.scaleFactor = ZOOM_SCALE_FACTOR;
        
    }

    setZoom(zoomScale) {
        this.scale = zoomScale;
    }

    start() {
        this.colony = new Colony(1000, canvas.width/2, canvas.height/2);

        this.animationLoop();
    }

    animationLoop() {
        this.colony.update(canvas);
        requestAnimationFrame(this.animationLoop.bind(this));
    }
}