import {Vec3} from "./vec3.ts";

export class Vec4{
    x: number
    y: number
    z: number
    w: number

    constructor(x: number, y: number, z: number, w: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    static Point3(x: number, y: number, z: number) {
        return new Vec4(x, y, z, 1);
    }


    perspectiveDivide(): Vec3 {
        const factor = 1.0 / this.w;
        return new Vec3(this.x * factor, this.y * factor, this.z * factor);
    }
}