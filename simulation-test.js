import { Simulation } from "./simulation/Simulation.js";

const canvas = document.getElementById("canvas");
var simulation = new Simulation(canvas);

window.addEventListener("load", () => {
    const vpWidth = window.innerWidth;
    const vpHeight = window.innerHeight;
    const extraWidthMargin = 0.03 * vpWidth; // 3viewportWidth extra for margin and gap 
    const extraHeightMargin = 0.02 * vpHeight;

    const menuWidth = parseFloat(getComputedStyle(menu).width);

    canvas.width = vpWidth - menuWidth - extraWidthMargin;
    canvas.height = vpHeight - extraHeightMargin;
})

document.getElementById("btnPlay").addEventListener("click", function(event) {
    document.getElementById("btnStop").disabled = false;    
    if (event.target.value === "\u25BA Play simulation") {
        event.target.value = "\u275A\u275A Pause simulation";
        simulation.start();    
    } else {
        event.target.value = "\u25BA Play simulation";
        simulation.pause();
    }
    
});

document.getElementById("btnStop").addEventListener("click", function(event) {
    simulation.stop();
    event.target.disabled = true;
    document.getElementById("btnPlay").value = "\u25BA Play simulation";
})