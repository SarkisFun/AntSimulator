import { Colony } from "../ant/Colony.js";

// Global
const ZOOM_SCALE_FACTOR = 1.1;
const MAX_ZOOM = 5;

// Statuses
const STOPPED = 0;
const STARTED = 1;
const PAUSED = 2;

export class Simulation {
    static canvas;
    static ctx;
    static scale = 1;
    static scaleFactor = ZOOM_SCALE_FACTOR;
    static minZoom = 1;
    static maxZoom = MAX_ZOOM;

    constructor(canvas) {
        Simulation.canvas = canvas;
        Simulation.ctx = canvas.getContext('2d');
        this.status = STOPPED;
        this.placedColony = false;
        this.colony = new Colony();
        this.mouseWheelListener();
    }

    setColony(mouseX, mouseY) {
        const rect = Simulation.canvas.getBoundingClientRect();
        const x = mouseX - rect.left;
        const y = mouseY - rect.top;

        if (this.status === STOPPED && !this.placedColony) {
            //this.colony = new Colony(this.antsPerColony, x, y);
            this.colony.setCoordinates(x, y);
            this.placedColony = true;
            Simulation.ctx.clearRect(0,0,Simulation.canvas.width, Simulation.canvas.height);
            this.colony.draw(Simulation.canvas);
        }
    }

    setAntsPerColony(antsPerColony) {
        this.antsPerColony = antsPerColony;
        this.colony.setAntNumber(antsPerColony);
    }

    mouseWheelListener(){
        Simulation.canvas.addEventListener("wheel", (event) => {
            event.preventDefault();

            // Rectangle around mouse cursor to zoom in
            const rect = Simulation.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const oldScale = Simulation.scale;

            // Zoom direction (in or out)
            if (event.deltaY < 0 && Simulation.scale < Simulation.maxZoom) {
                Simulation.scale *= Simulation.scaleFactor;
            } else if (event.deltaY > 0 && Simulation.scale > Simulation.minZoom) {
                Simulation.scale /= Simulation.scaleFactor;
            }

            Simulation.scale = Math.max(Simulation.minZoom, Math.min(Simulation.maxZoom, Simulation.scale));

            const scaleChange = Simulation.scale / oldScale;

            this.offsetX = mouseX - (mouseX - this.offsetX) * scaleChange;
            this.offsetY = mouseY - (mouseY - this.offsetY) * scaleChange;

            if (Simulation.scale <= Simulation.minZoom) {
                this.offsetX = (Simulation.canvas.width / 2) * (1 - Simulation.scale);
                this.offsetY = (Simulation.canvas.height / 2) * (1 - Simulation.scale);
            }
        });
    }

    start() {
        if (this.status === PAUSED) {
            this.status = STARTED;
            this.animationLoop();
            return;
        }

        if (this.status === STOPPED) {
            this.colony.resetAnts();

            this.offsetX = 0;
            this.offsetY = 0;

            this.status = STARTED;

            this.animationLoop();
        }
    }

    stop() {
        this.status = STOPPED;
        Simulation.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.colony.resetAnts();
        this.placedColony = false;
    }

    pause() {
        if (this.status === STARTED) {
            this.status = PAUSED;
        }
    }

    animationLoop() {
        Simulation.ctx.clearRect(0, 0, Simulation.canvas.width, Simulation.canvas.height); // Clear canvas once per frame
        
        Simulation.ctx.save();
        // zoom
        Simulation.ctx.translate(this.offsetX, this.offsetY);
        Simulation.ctx.scale(Simulation.scale, Simulation.scale);
        // animation
        this.colony.update(Simulation.canvas);

        Simulation.ctx.restore();

        switch (this.status) {
            case STARTED:
                requestAnimationFrame(this.animationLoop.bind(this));
                break;
            case STOPPED:
                Simulation.ctx.clearRect(0, 0, canvas.width, canvas.height);
                break;
        }
    }   
}