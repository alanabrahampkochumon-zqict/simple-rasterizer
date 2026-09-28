import {Vec3} from "@/math/Vec3.ts";

export class Plane {
    normal: Vec3
    D: number

    constructor(normal: Vec3, D: number) {
        this.normal = normal
        this.D = D
    }
}