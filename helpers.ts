export class Vec2 {
    constructor(public x: number, public y: number) {}

    add(v: Vec2) {
        this.x += v.x
        this.y += v.y
    }

    copy() {
        return new Vec2(this.x, this.y);
    }
}

export function clamp(min: number, n: number, max: number): number {
    return Math.max(min, Math.min(n, max))
}

export function bigger_equal_smaller_equal(min: number, n: number, max: number): boolean {
    return n >= min && n <= max;
}

export function bigger_equal_smaller(min: number, n: number, max: number): boolean {
    return n >= min && n < max;
}

export function bigger_smaller_equal(min: number, n: number, max: number): boolean {
    return n > min && n <= max;
}

export function bigger_smaller(min: number, n: number, max: number): boolean {
    return n > min && n < max;
}

export const emptyVector = new Vec2(0, 0)
