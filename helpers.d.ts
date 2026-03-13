export declare class Vec2 {
    x: number;
    y: number;
    constructor(x: number, y: number);
    add(v: Vec2): void;
    copy(): Vec2;
}
export declare function clamp(min: number, n: number, max: number): number;
export declare function bigger_equal_smaller_equal(min: number, n: number, max: number): boolean;
export declare function bigger_equal_smaller(min: number, n: number, max: number): boolean;
export declare function bigger_smaller_equal(min: number, n: number, max: number): boolean;
export declare function bigger_smaller(min: number, n: number, max: number): boolean;
export declare const emptyVector: Vec2;
//# sourceMappingURL=helpers.d.ts.map