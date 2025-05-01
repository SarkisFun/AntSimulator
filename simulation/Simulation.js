
import { MapGrid } from "../map/mapGrid.js";

// Global
const ZOOM_SCALE_FACTOR = 1.1;
const MAX_ZOOM = 5;
const DEFAULT_TILE_SIZE = 3;
const STATS_WIDTH = 200;
const STATS_HEIGHT = 100;
const STATS_POS_X = 5;
const STATS_POS_Y = 5;

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
        this.showStats = true;
        this.map = new MapGrid(DEFAULT_TILE_SIZE, canvas.width, canvas.height);
        this.frameCounter = 0;
        this.fps = 0;

        this.mouseWheelListener();
    }

    setAntsPerColony(antsPerColony) {
            this.antsPerColony = antsPerColony;
            this.map.colony.setAntNumber(antsPerColony);
    }

    setColony(mouseX, mouseY) {
        const rect = Simulation.canvas.getBoundingClientRect();
        const x = mouseX - rect.left;
        const y = mouseY - rect.top;

        if (this.status === STOPPED) {
            this.map.createColony(x,y);
            this.placedColony = true;
            Simulation.ctx.clearRect(0,0,Simulation.canvas.width, Simulation.canvas.height);
            this.map.draw(Simulation.canvas);
            this.map.colony.draw(Simulation.canvas);

            if (this.showStats) {
                this.drawStats();   
            }
        }
    }

    paintWall(canvas, mouseX, mouseY, radius) {
        if (this.status === STOPPED) {
            this.map.createWall(canvas, mouseX, mouseY, radius);
            
            if (this.showStats) {
                this.drawStats();   
            }
        }
    }

    paintFood(canvas, mouseX, mouseY, radius) {
        if (this.status === STOPPED) {
            this.map.createFood(canvas, mouseX, mouseY, radius);

            if (this.showStats) {
                this.drawStats();   
            }
        }
    }

    eraser(canvas, mouseX, mouseY, radius) {
        if (this.status === STOPPED) {
            this.map.eraser(canvas, mouseX, mouseY, radius);
        }
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

            this.redrawCanvas();
        });
    }

    redrawCanvas() {
        Simulation.ctx.clearRect(0, 0, Simulation.canvas.width, Simulation.canvas.height);
    
        Simulation.ctx.save();
        // Apply zoom and translation
        Simulation.ctx.translate(this.offsetX, this.offsetY);
        Simulation.ctx.scale(Simulation.scale, Simulation.scale);
    
        // Redraw map and colony
        this.map.draw(Simulation.canvas);
        this.map.colony.draw(Simulation.canvas);
    
        if (this.status === PAUSED) {
            this.map.colony.drawAnts(Simulation.canvas);
        }
    
        Simulation.ctx.restore();
    }

    start() {
        if (this.status === PAUSED) {
            this.status = STARTED;
            this.animationLoop();
        } else {
            this.status = STARTED;
            this.map.colony.resetAnts();

            this.offsetX = 0;
            this.offsetY = 0;

            this.animationLoop();
        }

        if (this.status === STOPPED) {
            
        }
    }

    stop() {        
        if (this.status == PAUSED) {
            this.status = STOPPED;
            this.animationLoop();
            this.map.colony.resetAnts();
        } else {
            this.status = STOPPED;
            this.map.colony.resetAnts();
        }
        
    }

    pause() {
        if (this.status === STARTED) {
            this.status = PAUSED;
        }
    }

    drawStats() {
        Simulation.ctx.save();
        Simulation.canvas.fillStyle = "black";
        Simulation.ctx.fillRect(STATS_POS_X, STATS_POS_Y, STATS_WIDTH, STATS_HEIGHT);
        Simulation.ctx.fillStyle = "white";
        Simulation.ctx.font = "bold 16px Arial";
        Simulation.ctx.fillText("Estadísticas:", 51 + STATS_POS_X, 20 + STATS_POS_Y);
        Simulation.ctx.font = "16px Arial";
        Simulation.ctx.fillText(`FPS: ${this.fps}`, 10 + STATS_POS_X, 50 + STATS_POS_Y);
        Simulation.ctx.fillText(`Frame #: ${this.frameCounter}`, 10 + STATS_POS_X,
             70 + STATS_POS_Y);
        Simulation.ctx.fillStyle = "green";
        Simulation.ctx.fillText(`Comida disponible: ${this.map.foodQuantity}`,
             10 + STATS_POS_X, 90 + STATS_POS_Y);
        Simulation.ctx.restore();
    }

    eraseStats() {
        Simulation.ctx.save();
        Simulation.ctx.clearRect(0, 0, STATS_WIDTH, STATS_HEIGHT);
        Simulation.ctx.restore();
    }

    animationLoop() {
        // Calculate framerate
        const now = performance.now();
        if (!this.lastFrameTime) this.lastFrameTime = now;
        const delta = now - this.lastFrameTime;
        this.fps = Math.round(1000 / delta);
        this.lastFrameTime = now;
        this.frameCounter++;

        // Paint frame
        Simulation.ctx.clearRect(0, 0, Simulation.canvas.width, Simulation.canvas.height);
        
        Simulation.ctx.save();
        // zoom
        Simulation.ctx.translate(this.offsetX, this.offsetY);
        Simulation.ctx.scale(Simulation.scale, Simulation.scale);
        // animation
        this.map.update(Simulation.canvas);
        this.map.colony.update(Simulation.canvas, this.map);

        Simulation.ctx.restore();

        if (this.showStats) {
            this.drawStats();   
        }

        switch (this.status) {
            case STARTED:
                requestAnimationFrame(this.animationLoop.bind(this));
                break;
            case STOPPED:
                Simulation.ctx.clearRect(0, 0, canvas.width, canvas.height); 
                this.frameCounter = 0;
                this.fps = 0;
                this.map.draw(Simulation.canvas);
                this.map.colony.draw(Simulation.canvas);
                if (this.showStats) {
                    this.drawStats();   
                }
                break;              
            case PAUSED:
                this.map.draw(Simulation.canvas);
                this.map.colony.draw(Simulation.canvas);
                this.map.colony.drawAnts(canvas);
                if (this.showStats) {
                    this.drawStats();   
                }
                break;
        }
    }   
}