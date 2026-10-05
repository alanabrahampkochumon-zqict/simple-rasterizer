import Triangle from "@/scene/Triangle.ts";
import {Vec3} from "@/math/Vec3.ts";
import Transform from "@/scene/Transform.ts";
import BoundingSphere from "@/scene/BoundingSphere.ts";

export default class ModelInstance {
    name: string
    transform: Transform
    triangles: Triangle[]
    color: Vec3
    boundingSphere: BoundingSphere /// Bounding sphere for model culling

    constructor(triangles: Triangle[] = [], transform: Transform = Transform.default(), color: Vec3 = Vec3.fill(255), name: string = "") {
        this.name = name
        // Copy the triangles
        this.triangles = triangles.map(tri => new Triangle(
            new Vec3(tri.v1.x, tri.v1.y, tri.v1.z),
            new Vec3(tri.v2.x, tri.v2.y, tri.v2.z),
            new Vec3(tri.v3.x, tri.v3.y, tri.v3.z)
        ));
        this.transform = transform
        this.color = color
        this.boundingSphere = new BoundingSphere()
        this.generateBoundingSphere()
    }

    generateBoundingSphere() {
        const vertices = this.triangles.flatMap((tri) => [tri.v1, tri.v2, tri.v3])
        if (vertices.length == 0) return;
        // NOTE: This is an approximation
        // We can find the centroid of the model by using the average of vertices
        const center = vertices.reduce((average, vertex) => {
            return average.add(vertex);
        }, Vec3.fill(0));
        center.div(vertices.length);

        // Compute the longest distance between the center and the vertices and take the difference to find the radius
        const radiusSq = vertices.reduce((radius, vertex) => {
            const newRadius = vertex.distSq(center)
            return newRadius > radius ? newRadius : radius;
        }, 0);

        // Transform the center of the sphere to the world center for clipping
        this.boundingSphere.center = this.transform.transformMat.vec3Mul(center);
        // Apply the maximum axis scale to the radius
        const maxScale = Math.max(this.transform.scale.x, this.transform.scale.y, this.transform.scale.z)
        this.boundingSphere.radius = Math.sqrt(radiusSq) * maxScale;
    }


    applyTransform() {
        for (const triangle of this.triangles) {
            triangle.v1 = this.transform.transformMat.vec3Mul(triangle.v1)
            triangle.v2 = this.transform.transformMat.vec3Mul(triangle.v2)
            triangle.v3 = this.transform.transformMat.vec3Mul(triangle.v3)
        }
    }
}