import {Vec3} from "@/math/Vec3.ts";
import Scene from "@/scene/Scene.ts";
import type {Plane} from "@/scene/Plane.ts";
import ModelInstance from "@/scene/ModelInstance.ts";
import Triangle from "@/scene/Triangle.ts";

// Clipping pipeline
// We start with models which have bounding spheres around them
// On the first pass we clip the geometries
// Then we clip the triangles

export function clipScene(scene: Scene, planes: Plane[]) {
    const newScene = new Scene();
    // Iterate through each instance in the scene
    // and clip it against our frustum planes
    for (const instance of scene.instances) {
        const clippedInstance = clipInstance(instance, planes)
        if (clippedInstance != null) {
            newScene.instances.push(clippedInstance)
        }
    }
    return newScene;
}

export function clipInstance(instance: ModelInstance, planes: Plane[]): ModelInstance | null {
    // Iterate through each plane to test for intersection
    // If any one of them intersects we can return a null indicating
    // that this instance can be culled out.
    let clippedInstance: ModelInstance | null = null;
    for (const plane of planes) {
        clippedInstance = clipInstanceAgainstPlane(instance, plane)
        if (clippedInstance == null)
            return null;
    }
    return clippedInstance;
}


function clipInstanceAgainstPlane(instance: ModelInstance, plane: Plane): ModelInstance | null {
    // Get the signed distance between the bounding sphere and the plane
    const d = signedDistance(plane, instance.boundingSphere.center);
    const r = instance.boundingSphere.radius;
    // Check for intersection
    if (d > r) { // No intersection
        return instance;
    } else if (d < -r) { // Instance full outside the plane
        return null;
    } else {
        const clippedInstance = new ModelInstance()
        clippedInstance.triangles = clipTrianglesAgainstPlane(instance.triangles, plane)
        return clippedInstance;
    }
}


function clipTrianglesAgainstPlane(triangles: Triangle[], plane: Plane): Triangle[] {
    // Clip each triangle against the given plane.
    let clippedTriangles: Triangle[] = []
    for (const triangle of triangles) {
        clippedTriangles = [...clippedTriangles, ...clipTriangle(triangle, plane)]
    }
    return clippedTriangles;
}

type DistanceVertPair = {
    vert: Vec3,
    distance: number
}

function clipTriangle(triangle: Triangle, plane: Plane): Triangle[] {
    const d1 = signedDistance(plane, triangle.v1)
    const d2 = signedDistance(plane, triangle.v2)
    const d3 = signedDistance(plane, triangle.v3)

    // Filter out the positive distance
    // This can be used to determine which points are inside or outside the clipping plane.

    const insideVerts: DistanceVertPair[] = []
    const outsideVerts: DistanceVertPair[] = []
    if (d1 > 0) {
        insideVerts.push({vert: triangle.v1, distance: d1})
    } else {
        outsideVerts.push({vert: triangle.v1, distance: d1})
    }
    if (d2 > 0) {
        insideVerts.push({vert: triangle.v2, distance: d2})
    } else {
        outsideVerts.push({vert: triangle.v2, distance: d2})
    }
    if (d3 > 0) {
        insideVerts.push({vert: triangle.v3, distance: d3})
    } else {
        outsideVerts.push({vert: triangle.v3, distance: d3})
    }

    // All the vertices are inside the bounding box so return the triangle.
    if (insideVerts.length == 3) {
        return [triangle]
    } else if (insideVerts.length == 0) { // None of the triangles are inside, so discard the primitive
        return []
    } else if (insideVerts.length == 1) { // One Vertex is inside so we can return the triangle formed at the intersection
        // If only 1 vertex is inside then we need to create a new triangle with the other two
        // vertices as the points of intersection
        const firstVertex = intersection(insideVerts[0], outsideVerts[0], plane)
        const secondVertex = intersection(insideVerts[0], outsideVerts[1], plane)
        return [new Triangle(firstVertex, secondVertex, insideVerts[0].vert)]
    } else if (insideVerts.length == 2) { // Divide the shapes into two triangles

        const firstVertex = intersection(insideVerts[0], outsideVerts[0], plane)
        const secondVertex = intersection(insideVerts[1], outsideVerts[0], plane)

        return [
            new Triangle(insideVerts[0].vert, insideVerts[1].vert, firstVertex),
            new Triangle(insideVerts[0].vert, firstVertex, secondVertex)]
    }
    return []
}


function signedDistance(plane: Plane, vertex: Vec3) {
    // d = Ax + By + Cz + D
    return (vertex.x * plane.normal.x) + (vertex.y * plane.normal.y) + (vertex.z * plane.normal.z) + plane.D
}


function intersection(v0: Vec3, v1: Vec3, plane: Plane) {
    const t = (-plane.D - plane.normal.dot(v0)) / (plane.normal.dot(v1) - plane.normal.dot(v1))
    return new Vec3(
        v0.x + t * (v1.x - v0.x),
        v0.y + t * (v1.y - v0.y),
        v0.z + t * (v1.z - v0.z)
    )
}