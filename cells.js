import { emptyVector, Vec2 } from "./helpers.js";
export class Cell {
    constructor(x, y) {
        this.pos = new Vec2(x, y);
    }
    drawOutlines(cellSize, ctx, mapPos, type, cornerJoins = true) {
        let corners = [];
        for (const [i, [e1, e2, c]] of Cell.groups.entries()) {
            const edgeACell = Cell.map[this.pos.y - (Cell.minY - 1) + e1.y]?.[this.pos.x - (Cell.minX - 1) + e1.x];
            const edgeBCell = Cell.map[this.pos.y - (Cell.minY - 1) + e2.y]?.[this.pos.x - (Cell.minX - 1) + e2.x];
            const cornerCell = Cell.map[this.pos.y - (Cell.minY - 1) + c.y]?.[this.pos.x - (Cell.minX - 1) + c.x];
            const edgeA = edgeACell instanceof type || !edgeACell;
            const edgeB = edgeBCell instanceof type || !edgeBCell;
            const corner = cornerCell instanceof type || !cornerCell;
            const edges = [[e1, !edgeA], [e2, !edgeB]];
            const camera = emptyVector.copy();
            if (edgeA || edgeB)
                corners[(i + 2) % 4] = 0;
            else
                corners[(i + 2) % 4] = cellSize / 10;
            // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
            //       D R A W I N G   E D G E S
            // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
            for (const [e, exists] of edges) {
                if (!exists)
                    continue;
                const x = (this.pos.x + (e.x + 1) / 2 - e.x / 40) * cellSize + mapPos.x;
                const y = (this.pos.y + (e.y + 1) / 2 - e.y / 40) * cellSize + mapPos.y;
                ctx.beginPath();
                if (e.y !== 0) {
                    ctx.moveTo(x - cellSize / 2.45, y);
                    ctx.lineTo(x + cellSize / 2.45, y);
                }
                else {
                    ctx.moveTo(x, y - cellSize / 2.45);
                    ctx.lineTo(x, y + cellSize / 2.45);
                }
                ctx.stroke();
            }
            // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
            //     D R A W I N G   C O R N E R S
            // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
            if (!corner && edgeA != edgeB)
                for (const [e, exists] of edges) {
                    if (!exists)
                        continue;
                    const x = (this.pos.x + (c.x + 1) / 2 - e.x / 40) * cellSize + mapPos.x;
                    const y = (this.pos.y + (c.y + 1) / 2 - e.y / 40) * cellSize + mapPos.y;
                    ctx.beginPath();
                    if (e.y !== 0) {
                        ctx.moveTo(x - cellSize / 10, y);
                        ctx.lineTo(x + cellSize / 10, y);
                    }
                    else {
                        ctx.moveTo(x, y - cellSize / 10);
                        ctx.lineTo(x, y + cellSize / 10);
                    }
                    ctx.stroke();
                }
            else if (!corner || (!edgeA && !edgeB)) {
                let shiftDirX = -1.28;
                let shiftDirY = -1.28;
                let shiftRot = 0;
                let radiusMultiplier = 0.8;
                if (edgeA && edgeB) {
                    shiftDirX = 0.8;
                    shiftDirY = 0.8;
                    shiftRot = Math.PI;
                    radiusMultiplier = 1.2;
                }
                else if (!edgeA && !edgeB && corner && cornerJoins) {
                    if (i % 2 == 0) {
                        shiftDirY = 0.8;
                        shiftDirX = -0.8;
                    }
                    else {
                        shiftDirY = -0.8;
                        shiftDirX = 0.8;
                    }
                    shiftRot = -Math.PI / 2;
                    radiusMultiplier = 1.2;
                }
                const radius = cellSize / 10;
                const x = (this.pos.x + (c.x + 1) / 2) * cellSize + c.x * radius * radiusMultiplier * shiftDirX + mapPos.x;
                const y = (this.pos.y + (c.y + 1) / 2) * cellSize + c.y * radius * radiusMultiplier * shiftDirY + mapPos.y;
                ctx.beginPath();
                ctx.moveTo(x + Math.cos(i * Math.PI / 2 + shiftRot) * radius * radiusMultiplier, y + Math.sin(i * Math.PI / 2 + shiftRot) * radius * radiusMultiplier);
                ctx.arc(x, y, radius * radiusMultiplier, i * Math.PI / 2 + shiftRot, (i + 1) * Math.PI / 2 + shiftRot);
                ctx.stroke();
            }
        }
        return corners;
    }
    static add(x, y, cell) {
        const contentMinX = Math.min(this.minX, x);
        const contentMaxX = Math.max(this.maxX, x);
        const contentMinY = Math.min(this.minY, y);
        const contentMaxY = Math.max(this.maxY, y);
        const newMinX = contentMinX - 1;
        const newMaxX = contentMaxX + 1;
        const newMinY = contentMinY - 1;
        const newMaxY = contentMaxY + 1;
        const newWidth = newMaxX - newMinX + 1;
        const newHeight = newMaxY - newMinY + 1;
        const newMap = [];
        for (let yy = 0; yy < newHeight; yy++) {
            newMap[yy] = [];
            for (let xx = 0; xx < newWidth; xx++) {
                const worldX = xx + newMinX;
                const worldY = yy + newMinY;
                // filler border / empty space
                // @ts-ignore
                newMap[yy][xx] = new Wall(worldX, worldY, false);
            }
        }
        // copy old cells
        for (let yy = this.minY; yy <= this.maxY; yy++) {
            for (let xx = this.minX; xx <= this.maxX; xx++) {
                const oldCell = this.map[yy - (this.minY - 1)]?.[xx - (this.minX - 1)];
                if (!oldCell)
                    continue;
                const ny = yy - newMinY;
                const nx = xx - newMinX;
                // @ts-ignore
                newMap[ny][nx] = oldCell;
            }
        }
        // place the new cell
        // @ts-ignore
        newMap[y - newMinY][x - newMinX] = cell;
        this.map = newMap;
        this.minX = contentMinX;
        this.maxX = contentMaxX;
        this.minY = contentMinY;
        this.maxY = contentMaxY;
    }
    static drawAllCells(cellSize, ctx, mapPos) {
        for (const cy of Cell.map)
            for (const c of cy)
                if (c)
                    c.draw(cellSize, ctx, mapPos);
    }
}
Cell.map = [];
Cell.groups = [
    [new Vec2(0, 1), new Vec2(1, 0), new Vec2(1, 1)], // bottom-right
    [new Vec2(-1, 0), new Vec2(0, 1), new Vec2(-1, 1)], // bottom-left
    [new Vec2(0, -1), new Vec2(-1, 0), new Vec2(-1, -1)], // top-left
    [new Vec2(1, 0), new Vec2(0, -1), new Vec2(1, -1)], // top-right
];
Cell.minX = Number.MAX_SAFE_INTEGER;
Cell.minY = Number.MAX_SAFE_INTEGER;
Cell.maxX = Number.MIN_SAFE_INTEGER;
Cell.maxY = Number.MIN_SAFE_INTEGER;
export class Wall extends Cell {
    constructor(x, y, register = true) {
        super(x, y);
        if (register)
            Cell.add(x, y, this);
    }
    draw(cellSize, ctx, mapPos) {
        ctx.strokeStyle = "#252525";
        ctx.lineWidth = cellSize / 20;
        this.drawOutlines(cellSize, ctx, mapPos, Wall);
    }
}
export class Empty extends Cell {
    constructor(x, y) {
        super(x, y);
        Cell.add(x, y, this);
    }
    draw(cellSize, ctx, mapPos) {
        ctx.lineWidth = cellSize / 20;
        ctx.strokeStyle = "#191919";
        ctx.fillStyle = "#191919";
        let corners = this.drawOutlines(cellSize, ctx, mapPos, Empty, false);
        ctx.beginPath();
        ctx.roundRect(this.pos.x * cellSize + mapPos.x, this.pos.y * cellSize + mapPos.y, cellSize, cellSize, corners);
        ctx.fill();
        ctx.strokeStyle = "#252525";
        for (const [e1, e2, c] of Cell.groups) {
            const edgeA = Cell.map[this.pos.y - (Cell.minY - 1) + e1.y]?.[this.pos.x - (Cell.minX - 1) + e1.x] instanceof Empty;
            const edgeB = Cell.map[this.pos.y - (Cell.minY - 1) + e2.y]?.[this.pos.x - (Cell.minX - 1) + e2.x] instanceof Empty;
            const corner = Cell.map[this.pos.y - (Cell.minY - 1) + c.y]?.[this.pos.x - (Cell.minX - 1) + c.x] instanceof Empty;
            if (corner && edgeA && edgeB) {
                const x = (this.pos.x + (c.x + 1) / 2) * cellSize + mapPos.x;
                const y = (this.pos.y + (c.y + 1) / 2) * cellSize + mapPos.y;
                ctx.beginPath();
                ctx.moveTo(x - cellSize / 10, y);
                ctx.lineTo(x + cellSize / 10, y);
                ctx.moveTo(x, y - cellSize / 10);
                ctx.lineTo(x, y + cellSize / 10);
                ctx.stroke();
            }
        }
    }
}
//# sourceMappingURL=cells.js.map