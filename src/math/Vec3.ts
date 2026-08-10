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
