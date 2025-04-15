import { Simulation } from "./simulation/Simulation.js";

const canvas = document.getElementById("canvas");

var simulation = new Simulation(canvas);

simulation.start();