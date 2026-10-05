import {Vec2} from "@/math/vec2.ts";

export class Vec3 {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static fill(value: number) {
        return new Vec3(value, value, value);
    }

    static zero() {
        return this.fill(0);
    }

    add(other: Vec3): Vec3 {
        const res = Vec3.fill(0);
        res.x = this.x + other.x;
        res.y = this.y + other.y;
        res.z = this.z + other.z;

        return res;
    }

    sub(other: Vec3): Vec3 {
        const res = Vec3.fill(0);
        res.x = this.x - other.x;
        res.y = this.y - other.y;
        res.z = this.z - other.z;

        return res;
    }

    div(value: number) {
        const res = Vec3.fill(0);
        res.x = this.x / value;
        res.y = this.y / value;
        res.z = this.z / value;

        return res;
    }

    distSq(other: Vec3): number {
        return this.dot(other);
    }

    dist(other: Vec3): number {
        return Math.sqrt(this.distSq(other));
    }

    /**
     * Compute the dot product between this vector and another.
     *
     * @param other The other vector to dot this with.
     *
     * @return The dot product.
     */
    dot(other: Vec3): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    /**
     * TODO: Add test
     * Perform perspective divide and return 2D vector.
     * @return A new Vector after performing perspective divide.
     */
    perspDiv(): Vec2 {
        const factor = 1.0 / this.z
        return new Vec2(this.x * factor, this.y * factor)
    }

    /**
     * @deprecated
     */
    static Dot(a: Vec3, b: Vec3): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    /**
     * @deprecated
     */
    static Sub(res: Vec3, a: Vec3, b: Vec3): Vec3 {
        res.x = a.x - b.x;
        res.y = a.y - b.y;
        res.z = a.z - b.z;
        return res;
    }


    /**
     * @deprecated
     */
    static Add(res: Vec3, a: Vec3, b: Vec3): Vec3 {
        res.x = a.x + b.x;
        res.y = a.y + b.y;
        res.z = a.z + b.z;

        return res;
    }

    /**
     * @deprecated
     */
    static Mul(res: Vec3, a: Vec3, s: number): Vec3 {
        res.x = s * a.x
        res.y = s * a.y
        res.z = s * a.z

        return res
    }
}
