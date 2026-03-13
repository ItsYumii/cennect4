import { emptyVector, Vec2 } from "./helpers.js";
export class Mouse {
    constructor() {
        this.pos = emptyVector.copy();
        this.down = new Set();
        this.click = new Set();
        this.shift = emptyVector.copy();
        this.scroll = 0;
        addEventListener("mousemove", (e) => {
            this.shift.x += e.movementX;
            this.shift.y += e.movementY;
            this.pos.x = e.offsetX;
            this.pos.y = e.offsetY;
        });
        addEventListener("mousedown", (e) => {
            if (!this.down.has(e.button))
                this.click.add(e.button);
            this.down.add(e.button);
        });
        addEventListener("mouseup", (e) => {
            this.down.delete(e.button);
        });
        addEventListener("wheel", (e) => {
            this.scroll += e.deltaY;
        });
        addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });
    }
    isDown(k) {
        return this.down.has(k);
    }
    clicked(k) {
        return this.click.has(k);
    }
    update() {
        this.click.clear();
        this.scroll = 0;
        this.shift.x = 0;
        this.shift.y = 0;
    }
}
export class Keyboard {
    constructor() {
        this.down = new Set();
        this.pressed = new Set();
        addEventListener("keydown", e => {
            if (!this.down.has(e.code))
                this.pressed.add(e.code);
            this.down.add(e.code);
        });
        addEventListener("keyup", e => {
            this.down.delete(e.code);
        });
    }
    isDown(k) {
        return this.down.has(k);
    }
    isPressed(k) {
        return this.pressed.has(k);
    }
    update() {
        this.pressed.clear();
    }
}
//# sourceMappingURL=input.js.map