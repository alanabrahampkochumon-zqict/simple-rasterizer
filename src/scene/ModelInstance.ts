import type Triangle from "@/scene/Triangle.ts";
import {Vec3} from "@/math/Vec3.ts";
import type Transform from "@/scene/Transform.ts";

export default class ModelInstance {
    name: string
    transform: Transform
    triangles: Triangle[]
    color: Vec3

    constructor(triangles: Triangle[], transform: Transform, color: Vec3 = Vec3.fill(255), name: string) {
        this.name = name
        this.triangles = triangles;
        this.transform = transform
        this.color = color
    }
}