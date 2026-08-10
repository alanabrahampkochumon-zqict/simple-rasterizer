import {Vec3} from "./Vec3.ts";

export class Vec4 {
    x: number
    y: number
    z: number
    w: number

    /**
     * Construct a Vec4 with the <x, y, z, w> values.
     * @param x The x-coordinate of the vector.
     * @param y The y-coordinate of the vector.
     * @param z The z-coordinate of the vector.
     * @param w The w-coordinate of the vector.
     */
    constructor(x: number, y: number, z: number, w: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }


    /**
     * Construct a 3D point <x, y, z, 1>.
     * @param x The x-coordinate of the point.
     * @param y The y-coordinate of the point.
     * @param z The z-coordinate of the point.
     */
    static Point3(x: number, y: number, z: number) {
        return new Vec4(x, y, z, 1);
    }


    // TODO: Add tests
    /**
     * Create a Vec3 from this vector.
     *
     * @return A new Vec3 object.
     */
    castVec3(): Vec3 {
        return new Vec3(this.x, this.y, this.z)
    }


    perspectiveDivide(): Vec3 {
        const factor = 1.0 / this.w;
        return new Vec3(this.x * factor, this.y * factor, this.z * factor);
    }


    static zero() {
        return new Vec4(0, 0, 0, 0);
    }
}