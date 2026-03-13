export class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
    }
    copy() {
        return new Vec2(this.x, this.y);
    }
}
export function clamp(min, n, max) {
    return Math.max(min, Math.min(n, max));
}
export function bigger_equal_smaller_equal(min, n, max) {
    return n >= min && n <= max;
}
export function bigger_equal_smaller(min, n, max) {
    return n >= min && n < max;
}
export function bigger_smaller_equal(min, n, max) {
    return n > min && n <= max;
}
export function bigger_smaller(min, n, max) {
    return n > min && n < max;
}
export const emptyVector = new Vec2(0, 0);
//# sourceMappingURL=helpers.js.map