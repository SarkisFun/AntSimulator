const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

var ants = [];

for (let i=0; i< 1000; i++) {
    ants.push(new WorkerAnt(ctx, canvas, canvas.width/2, canvas.height/2));
    //ants.push(new WorkerAnt(ctx, canvas, Math.random() * canvas.width, Math.random() * canvas.height));
}

function updateAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ants.forEach(ant =>{
        ant.update();
    });

    requestAnimationFrame(updateAll);
}

updateAll();