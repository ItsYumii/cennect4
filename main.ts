import { emptyVector, clamp } from "./helpers.js";
import { Mouse, Keyboard } from "./input.js"
import {Cell, Empty, Wall } from "./cells.js"

const 
    can = document.getElementById("canvas") as HTMLCanvasElement,
    c = can.getContext("2d") as CanvasRenderingContext2D,
    canvasResizeBuffer = 50;
let
    mouse = new Mouse(),
    keyboard = new Keyboard(),
    mapPos = emptyVector.copy(),
    zoom = 1.0,
    canvasResizeCount = 1;




new Empty(1, 0)
new Empty(-2, 0)
new Empty(1, 1)
new Empty(0, 1)
new Empty(2, 0)
new Empty(2, 1)
new Empty(3, 2)
// screen = {width}


// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//          C O R E   L O O P S
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

function loop() {
    resetScreen()

    c.lineCap = "round"
    c.lineJoin = "round"

    c.fillStyle = "#F0F";
    c.fillRect(mouse.pos.x, mouse.pos.y, 10, 10)
    Cell.drawAllCells(100 * zoom, c, mapPos);
    updateGrid()

    drawCellGuides()


    // wall3.draw(100 * zoom, c)
    mouse.update()
    keyboard.update()
}

function updateGrid() {
    zoom = clamp(0.5, zoom - mouse.scroll / 1000, 2)
    if (mouse.isDown(2)) mapPos.add(mouse.shift)
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//        L E V E L   E D I T O R
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

function drawCellGuides(): void {
    c.lineCap = "round"
    c.lineJoin = "round"
    c.lineWidth = 1.25 * zoom
    c.strokeStyle = "#444"
    c.setLineDash([5 * zoom, 5 * zoom])

    let cellSize = 100 * zoom

    for (let x = mapPos.x % cellSize - cellSize; x < can.width; x += cellSize)
        for (let y = mapPos.y % cellSize - cellSize; y < can.height; y += cellSize) {
            c.beginPath()
            c.moveTo(x,            y)
            c.lineTo(x + cellSize, y)
            c.lineTo(x + cellSize, y + cellSize)
            c.stroke()
        }

    c.setLineDash([0, 0])
}

function resetScreen() {
    c.fillStyle = "#151515";
    c.fillRect(0, 0, can.width, can.height);
}

function load(){
    resizeCanvas();
    window.addEventListener("resize",()=>{
        setTimeout(resizeCanvas,canvasResizeBuffer);
        canvasResizeCount++;
    });

    setInterval(loop, 1);
}

function resizeCanvas(){
    canvasResizeCount--;
    if(canvasResizeCount==0){
        can.width = window.innerWidth;
        can.height = window.innerHeight;
    }
}

window.addEventListener("load",load);