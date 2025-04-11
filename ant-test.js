const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

antPrime = new WorkerAnt(ctx, canvas, 800, 300);

antPrime.draw();

antPrime.update();