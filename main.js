import { Vec2, emptyVector, clamp } from "./helpers.js";
import { Mouse, Keyboard } from "./input.js";
import { Cell, Empty, Wall } from "./cells.js";
import { drawCursor } from "./cursors.js";
const can = document.getElementById("canvas"), c = can.getContext("2d"), canvasResizeBuffer = 50;
let mouse = new Mouse(), keyboard = new Keyboard(), mapPos = emptyVector.copy(), zoom = 1.0, canvasResizeCount = 1, heldCell = null, heldCellRot = { angle: 0, angularVel: 0 };
new Empty(1, 0);
new Empty(-2, 0);
new Empty(1, 1);
new Empty(0, 1);
new Empty(2, 0);
new Empty(2, 1);
new Empty(3, 2);
// screen = {width}
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//          C O R E   L O O P S
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function loop() {
    resetScreen();
    c.lineCap = "round";
    c.lineJoin = "round";
    c.fillStyle = "#F0F";
    c.fillRect(mouse.pos.x, mouse.pos.y, 10, 10);
    Cell.drawAllCells(100 * zoom, c, mapPos);
    updateGrid();
    drawCellGuides();
    drawCursor(c, mouse.pos.x, mouse.pos.y);
    // wall3.draw(100 * zoom, c)
    mouse.update();
    keyboard.update();
}
function updateGrid() {
    const oldZoom = zoom;
    zoom = clamp(0.5, zoom - mouse.scroll / 1000, 2);
    if (zoom !== oldZoom) {
        const scale = zoom / oldZoom;
        mapPos.x = mouse.pos.x - (mouse.pos.x - mapPos.x) * scale;
        mapPos.y = mouse.pos.y - (mouse.pos.y - mapPos.y) * scale;
    }
    if (mouse.isDown(2))
        mapPos.add(mouse.shift);
}
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//        L E V E L   E D I T O R
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function drawCellGuides() {
    c.lineCap = "round";
    c.lineJoin = "round";
    c.lineWidth = 1.25 * zoom;
    c.strokeStyle = "#444";
    c.setLineDash([5 * zoom, 5 * zoom]);
    let cellSize = 100 * zoom;
    for (let x = mapPos.x % cellSize - cellSize; x < can.width; x += cellSize)
        for (let y = mapPos.y % cellSize - cellSize; y < can.height; y += cellSize) {
            c.beginPath();
            c.moveTo(x, y);
            c.lineTo(x + cellSize, y);
            c.lineTo(x + cellSize, y + cellSize);
            c.stroke();
        }
    c.setLineDash([0, 0]);
    drawEditorUI();
}
function drawEditorUI() {
    const cellSize = 100 * zoom;
    const height = can.height * 0.1;
    const width = can.width * 0.8;
    const cornerRad = height * 0.1;
    c.fillStyle = "#191919";
    c.beginPath();
    c.roundRect(can.width * 0.1, can.height - (height * 1.2), width, height, [cornerRad]);
    c.fill();
    heldCell = new Empty(0, 0, false);
    const x = mouse.pos.x;
    const y = mouse.pos.y;
    const targetAngle = -Math.PI;
    let diff = targetAngle - heldCellRot.angle;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    heldCellRot.angularVel += diff * 0.15 + mouse.shift.x * 0.01;
    heldCellRot.angularVel *= 0.85;
    heldCellRot.angle += heldCellRot.angularVel;
    c.save();
    c.translate(x, y);
    c.rotate(heldCellRot.angle);
    heldCell.placeholderDraw(cellSize, c, new Vec2(-cellSize / 2, -cellSize * 0.9));
    c.restore();
    if (mouse.isDown(0)) {
        const CellType = heldCell.constructor;
        new CellType(Math.floor((mouse.pos.x - mapPos.x) / cellSize), Math.floor((mouse.pos.y - mapPos.y) / cellSize));
    }
}
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//         C A N V A S   S H I T
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function resetScreen() {
    c.fillStyle = "#151515";
    c.fillRect(0, 0, can.width, can.height);
}
function load() {
    resizeCanvas();
    window.addEventListener("resize", () => {
        setTimeout(resizeCanvas, canvasResizeBuffer);
        canvasResizeCount++;
    });
    setInterval(loop, 1);
}
function resizeCanvas() {
    canvasResizeCount--;
    if (canvasResizeCount == 0) {
        can.width = window.innerWidth;
        can.height = window.innerHeight;
    }
}
window.addEventListener("load", load);
//# sourceMappingURL=main.js.map