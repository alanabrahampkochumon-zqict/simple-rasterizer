export class Vec3 {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static Dot(a: Vec3, b: Vec3): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    static Sub(res: Vec3, a: Vec3, b: Vec3): Vec3 {
        res.x = a.x - b.x;
        res.y = a.y - b.y;
        res.z = a.z - b.z;
        return res;
    }

    static Add(res: Vec3, a: Vec3, b: Vec3): Vec3 {
        res.x = a.x + b.x;
        res.y = a.y + b.y;
        res.z = a.z + b.z;

        return res;
    }
}
