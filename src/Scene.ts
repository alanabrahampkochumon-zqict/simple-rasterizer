import {Vec3} from "./math/Vec3.ts";
import {Mat4} from "./math/Mat4.ts";
import {Mat3} from "./math/Mat3.ts";
import {Vec4} from "@/math/Vec4.ts";


export class Scene {
    vertices: Vec3[]
    instances: ModelInstance[]

    /**
     * Create a scene with shared vertex information.
     *
     * @param vertices The collection of all the vertices in the scene.
     * @param instance All model instances in the scene.
     */
    constructor(vertices: Vec3[], instances: ModelInstance[]) {
        this.vertices = vertices
        this.instances = instances
    }
}

export class ModelInstance {
    name: string
    transform: Transform
    triangleIndices: Vec3[]
    color: Vec3

    /**
     * Create a model instance that share vertices in the scene.
     *
     * @param triangleIndices The indices for the vertices that make up each triangle of the model.
     * @param transform       The model transformation
     * @param color           The color of the object
     * @param name            A name for the object, for debugging purposes.
     */
    constructor(triangleIndices: Vec3[], transform: Transform, color: Vec3 = new Vec3(255, 255, 255), name: string) {
        this.name = name
        this.triangleIndices = triangleIndices
        this.transform = transform
        this.color = color
    }
}


export class Transform {
    position: Vec3
    orientation: Vec3 // X, Y, and Z rotation
    scale: number // TODO: Change to vector
    transformMat: Mat4

    constructor(position: Vec3, orientation: Vec3 = new Vec3(0, 0, 0), scale: number = 1) {
        this.position = position
        this.orientation = orientation
        this.scale = scale
        this.transformMat = Mat4.I()
        this.transformMat = new Mat4(
            scale, 0, 0, position.x,
            0, scale, 0, position.y,
            0, 0, scale, position.z,
            0, 0, 0, 1
        )
        this.transformMat = this.transformMat.matMul(Mat4.rotX(orientation.x).matMul(Mat4.rotY(orientation.y)).matMul(Mat4.rotZ(orientation.z)))
    }

    // Applies transformation in translation, rotation, scale
    /**
     * @deprecated
     */
    apply(vertex: Vec3): Vec3 {
        // Apply scale
        const scaledVec = new Vec3(0, 0, 0);
        Vec3.Mul(scaledVec, vertex, this.scale);

        // Apply Rotation
        const xRotMat = Mat3.rotX(this.orientation.x);
        const yRotMat = Mat3.rotY(this.orientation.y);
        const zRotMat = Mat3.rotZ(this.orientation.z);

        const rotMat = Mat3.I()
        Mat3.multiply(rotMat, Mat3.multiply(Mat3.I(), xRotMat, yRotMat), zRotMat)

        const rotVec = new Vec3(0, 0, 0);
        Mat3.multiplyVec(rotVec, rotMat, scaledVec);

        // Apply translation
        const translatedVec = new Vec3(0, 0, 0);
        return Vec3.Add(translatedVec, rotVec, this.position)
    }

    applyAffine(vertex: Vec3): Vec4 {
        const rotation = Mat4.rotX(this.orientation.x).matMul(Mat4.rotY(this.orientation.y).matMul(Mat4.rotZ(this.orientation.z)))
        const scale = Mat4.scale(this.scale, this.scale, this.scale)
        const translation = Mat4.translate(this.position.x, this.position.y, this.position.z)

        const combined = translation.matMul(scale.matMul(rotation))
        return combined.vecMul(Vec4.Point3(vertex.x, vertex.y, vertex.z))
    }
}

////// INTERSECTION CODE WIP

export class Plane {
    normal: Vec3
    D: number

    constructor(normal: Vec3, D: number) {
        this.normal = normal
        this.D = D
    }
}

function clipScene(scene: Scene, planes: Plane[]) {
    const clippedInstances: ModelInstance[] = []
    // Iterate through each instance in the scene
    // and clip it against our frustum planes
    for (const instance of scene.instances) {
        const clippedInstance = clipInstance(instance, planes)
        if (clippedInstance == null) {
            clippedInstances.push(clippedInstance)
        }
    }

    // Create a new scene and return it.
    const newScene = {...scene};
    newScene.instances = clippedInstances;
    return newScene;
}

function clipInstance(instance: ModelInstance, planes: Plane[]): ModelInstance | null {
    // Iterate through each plane and clip the instance against it
    let clippedInstance;
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
        const clippedInstance = {...instance};
        instance.triangleIndices = clipTrianglesAgainstPlane(instance.triangleIndices, plane)
        return clippedInstance;
    }
}

function clipTrianglesAgainstPlane(triangleIndices: Vec3[], plane: Vec3): Vec3[] {
    // Iterate through each triangle and clip them against the planes
    const clippedTriangles = []
    for (const triangle in triangleIndices) {
        clippedTriangles.push(clipCircle(triangle, plane));
    }
    return clippedTriangles;
}


function clipTriangle(triangle: Vec3, plane: Plane): Vec3[] {
    const d0 = signedDistance(plane, triangle.x)
    const d1 = signedDistance(plane, triangle.y)
    const d2 = signedDistance(plane, triangle.z)
    // Filter out the positive distance
    // This can be used to determine which points are inside or outside the clipping plane.
    const fullDistancePair: number[][] = [[d0, triangle.x], [d1, triangle.y], [d2, triangle.z]];
    const distances = fullDistancePair.filter(distance => distance[0] > 0)
    const outsideDistances = fullDistancePair.filter((distance) => distance[0] < 0)
    if (distances.length == 3) {
        // All the distances are greater than 0
        // Triangle is inside the plane and doesn't need to be clipped
        return [triangle]
    } else if (distances.length == 0) {
        // All the vertices of the triangle falls outside the plane, hence we can
        // discard it.
        return []
    } else if (distances.length == 1) {
        // If only 1 vertex is inside then we need to create a new triangle with the other two
        // vertices as the points of intersection
        const firstVertex = intersection(distances[0][1], outsideDistances[0][1], plane)
        const secondVertex = intersection(distances[0][1], outsideDistances[1][1], plane)
        return Vec3(firstVertex, secondVertex, distances[0][1])
    } else if (distances.length == 2) { // Divide the shapes into two triangles
        const firstIntersection = intersection(distances[0][1], outsideDistances[0][1], plane)
        const secondIntersection = intersection(distances[1][1], outsideDistances[0][1], plane)

        return [Vec3(distances[0][0], distances[0][1], firstIntersection), Vec3(distances[0][0], distances[0][1], secondIntersection)]
    }
    return []
}


function signedDistance(plane: Plane, vertex: Vec3) {
    // d = Ax + By + Cz + D
    return (vertex.x * plane.normal.x) + (vertex.y * plane.normal.y) + (vertex.z * plane.normal.z) + plane.D
}


function intersection(a, b) {// TODO: Impl}