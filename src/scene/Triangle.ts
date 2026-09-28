import type {Vec3} from "@/math/Vec3.ts";

export default class Triangle {
    v1: Vec3
    v2: Vec3
    v3: Vec3

    constructor(v1: Vec3, v2: Vec3, v3: Vec3) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
    }
}