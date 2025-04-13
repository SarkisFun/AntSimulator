import { Colony } from "./ant/Colony.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

var c = new Colony(ctx, canvas, 1000, 500, 700);

c.update();