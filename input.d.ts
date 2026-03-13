import { Vec2 } from "./helpers.js";
export declare class Mouse {
    pos: Vec2;
    shift: Vec2;
    scroll: number;
    private down;
    private click;
    constructor();
    isDown(k: number): boolean;
    clicked(k: number): boolean;
    update(): void;
}
export declare class Keyboard {
    private down;
    private pressed;
    constructor();
    isDown(k: string): boolean;
    isPressed(k: string): boolean;
    update(): void;
}
//# sourceMappingURL=input.d.ts.map