import {Vec3} from "@/math/Vec3.ts";

export default class BoundingSphere {
    center: Vec3
    radius: number;

    constructor(center: Vec3 = Vec3.fill(0), radius: number = 1) {
        this.center = center
        this.radius = radius
    }
}