import { Simulation } from "./simulation/Simulation.js";

// Drawing tools
const NO_TOOL = 0;
const COLONY_TOOL = 1;
const WALL_TOOL = 2;
const FOOD_TOOL = 3;

const canvas = document.getElementById("canvas");
const txtAntsPerColony = document.getElementById("txtAntsPerColony");
const btnPlay = document.getElementById("btnPlay");
const btnStop = document.getElementById("btnStop");
var simulation = null;
var selectedTool;
var placedColony;
var mouseDown = false;

window.addEventListener("load", () => {
    const vpWidth = window.innerWidth;
    const vpHeight = window.innerHeight;
    const extraWidthMargin = 0.03 * vpWidth; // 3viewportWidth extra for margin and gap 
    const extraHeightMargin = 0.02 * vpHeight;

    const menuWidth = parseFloat(getComputedStyle(menu).width);

    canvas.width = vpWidth - menuWidth - extraWidthMargin;
    canvas.height = vpHeight - extraHeightMargin;

    simulation = new Simulation(canvas);
    selectedTool = NO_TOOL;
    placedColony = false;

    simulation.setAntsPerColony(txtAntsPerColony.value);
})

// Ant number text listener
txtAntsPerColony.addEventListener("change", function(event) {
    simulation.setAntsPerColony(event.target.value);
    btnPlay.disabled = !placedColony;
})

// Play button listener
btnPlay.addEventListener("click", function(event) {
    btnStop.disabled = false;
    selectedTool = NO_TOOL;
    canvas.style.cursor = "auto";
    if (event.target.value === "\u25BA Reproducir") {
        event.target.value = "\u275A\u275A Pausar";
        txtAntsPerColony.disabled = true;
        simulation.start();    
    } else {
        event.target.value = "\u25BA Reproducir";
        simulation.pause();
    }   
});

// Stop button listener
btnStop.addEventListener("click", function(event) {
    simulation.stop();
    event.target.disabled = true;
    txtAntsPerColony.disabled = false;
    placedColony = false;
    btnPlay.value = "\u25BA Reproducir";
})

// Colony drawing tool
document.getElementById("btnDrawColony").addEventListener("click", () => {
    if (selectedTool != COLONY_TOOL) {
        selectedTool = COLONY_TOOL;
        canvas.style.cursor = "url('img/colonyCursor.png') 32 32,auto";
    } else {
        selectedTool = NO_TOOL;
        canvas.style.cursor = "auto";
    }
})

// Wall drawing tool
document.getElementById("btnDrawWall").addEventListener("click", () => {
    if (selectedTool != WALL_TOOL) {
        selectedTool = WALL_TOOL;
        canvas.style.cursor = "url('img/wall.png') 64 45,auto";
    } else {
        selectedTool = NO_TOOL;
        canvas.style.cursor = "auto";
    }
})

document.getElementById("btnDrawFood").addEventListener("click", () => {
    if (selectedTool != FOOD_TOOL) {
        selectedTool = FOOD_TOOL;
        canvas.style.cursor = "url('img/food.png') 21 15,auto";
    } else {
        selectedTool = NO_TOOL;
        canvas.style.cursor = "auto";
    }
})

// Draw on canvas listener
canvas.addEventListener("click", function(event) {
    switch (selectedTool) {
        case COLONY_TOOL:
            simulation.setColony(event.clientX, event.clientY);
            placedColony = true;
            btnPlay.disabled = false;
            selectedTool = NO_TOOL;
            canvas.style.cursor = "auto";
            break;
    }
})

// Draw on canvas listeners (mouse hold)
canvas.addEventListener("mousedown", () => {
    mouseDown = true;
})

canvas.addEventListener("mouseup", () => {
    mouseDown = false;
})

canvas.addEventListener("mousemove", function(event) {
    if (selectedTool === WALL_TOOL && mouseDown) {
        simulation.paintWall(canvas, event.clientX, event.clientY, 15);
    }
    if (mouseDown) {
        switch (selectedTool) {
            case WALL_TOOL:
                simulation.paintWall(canvas, event.clientX, event.clientY, 15);
                break;
            case FOOD_TOOL:
                simulation.paintFood(canvas, event.clientX, event.clientY, 5);
                break;
        }
    }
})
///////////////////////////////////////
