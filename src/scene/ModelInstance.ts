import type Triangle from "@/scene/Triangle.ts";
import {Vec3} from "@/math/Vec3.ts";
import type Transform from "@/scene/Transform.ts";
import BoundingSphere from "@/scene/BoundingSphere.ts";

export default class ModelInstance {
    name: string
    transform: Transform
    triangles: Triangle[]
    color: Vec3
    sphere: BoundingSphere /// Bounding sphere for model culling

    constructor(triangles: Triangle[], transform: Transform, color: Vec3 = Vec3.fill(255), name: string) {
        this.name = name
        this.triangles = triangles;
        this.transform = transform
        this.color = color

        this.sphere = new BoundingSphere()
        this.generateBoundingSphere()
    }

    generateBoundingSphere() {
        const vertices = this.triangles.flatMap((tri) => [tri.v1, tri.v2, tri.v3])
        // NOTE: This is an approximation
        // We can find the centroid of the model by using the average of vertices
        const center = vertices.reduce((average, vertex) => {
            return average.add(vertex);
        }, Vec3.fill(0));
        center.div(vertices.length);

        // Compute the longest distance between the center and the vertices and take the difference to find the radius
        const radiusSq = vertices.reduce((radius, vertex) => {
            const newRadius = vertex.distSq(center)
            if (newRadius > radius) {
                return newRadius;
            }
            return radius;
        }, 0);

        this.sphere.radius = Math.sqrt(radiusSq);
        this.sphere.center = center;
    }
}