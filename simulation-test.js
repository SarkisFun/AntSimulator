import { Simulation } from "./simulation/Simulation.js";

const canvas = document.getElementById("canvas");

window.addEventListener("load", () => {
    const vpWidth = window.innerWidth;
    const vpHeight = window.innerHeight;
    const extraWidthMargin = 0.03 * vpWidth; // 3viewportWidth extra for margin and gap 
    const extraHeightMargin = 0.02 * vpHeight;

    const menuWidth = parseFloat(getComputedStyle(menu).width);

    canvas.width = vpWidth - menuWidth - extraWidthMargin;
    canvas.height = vpHeight - extraHeightMargin;
})

var simulation = new Simulation(canvas, 0);
var txtAntsPerColony = document.getElementById("txtAntsPerColony");
var btnPlay = document.getElementById("btnPlay");
var btnStop = document.getElementById("btnStop");


txtAntsPerColony.addEventListener("change", function(event) {
    simulation.setAntsPerColony(event.target.value);
    btnPlay.disabled = false;
})

btnPlay.addEventListener("click", function(event) {
    btnStop.disabled = false;    
    if (event.target.value === "\u25BA Play simulation") {
        event.target.value = "\u275A\u275A Pause simulation";
        txtAntsPerColony.disabled = true;
        simulation.start();    
    } else {
        event.target.value = "\u25BA Play simulation";
        simulation.pause();
    }
    
});

btnStop.addEventListener("click", function(event) {
    simulation.stop();
    event.target.disabled = true;
    txtAntsPerColony.disabled = false;
    btnPlay.value = "\u25BA Play simulation";
})