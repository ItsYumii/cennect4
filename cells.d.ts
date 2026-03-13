import { Vec2 } from "./helpers.js";
export declare abstract class Cell {
    static map: (Cell | null)[][];
    static groups: [Vec2, Vec2, Vec2][];
    protected static minX: number;
    protected static minY: number;
    protected static maxX: number;
    protected static maxY: number;
    pos: Vec2;
    protected constructor(x: number, y: number);
    protected drawOutlines(cellSize: number, ctx: CanvasRenderingContext2D, mapPos: Vec2, type: Function, cornerJoins?: boolean): number[];
    protected static add(x: number, y: number, cell: Cell): void;
    static drawAllCells(cellSize: number, ctx: CanvasRenderingContext2D, mapPos: Vec2): void;
    abstract draw(cellSize: number, ctx: CanvasRenderingContext2D, mapPos: Vec2): void;
    abstract placeholderDraw(cellSize: number, ctx: CanvasRenderingContext2D, mapPos: Vec2): void;
}
export declare class Wall extends Cell {
    constructor(x: number, y: number, register?: boolean);
    draw(cellSize: number, ctx: CanvasRenderingContext2D, mapPos: Vec2): void;
    placeholderDraw(cellSize: number, ctx: CanvasRenderingContext2D, mapPos: Vec2): void;
}
export declare class Empty extends Cell {
    constructor(x: number, y: number, register?: boolean);
    draw(cellSize: number, ctx: CanvasRenderingContext2D, mapPos: Vec2): void;
    placeholderDraw(cellSize: number, ctx: CanvasRenderingContext2D, mapPos: Vec2): void;
}
//# sourceMappingURL=cells.d.ts.map