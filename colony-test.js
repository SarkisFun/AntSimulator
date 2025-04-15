import { Colony } from "./ant/Colony.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

// zoom variables
var scale = 1;
var scaleFactor = 1.1;

var c = new Colony(canvas, 1000, 500, 700);

canvas.addEventListener("wheel", (event) => {
    event.preventDefault();

    // Zoom direction (in or out)
    if (event.deltaY < 0 && scale < Colony.maxZoom) {
        scale *= scaleFactor;
    } else if (event.deltaY > 0 && scale > Colony.minZoom) {
        scale /= scaleFactor;
    }
    c.setZoom(scale);
});



c.update();

