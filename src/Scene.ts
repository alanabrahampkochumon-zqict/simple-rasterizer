import {Vec3} from "./math/Vec3.ts";
import {IVec3} from "./math/ivec3.ts";
import {Mat4} from "./math/depr/mat4.ts";
import {Mat3} from "./math/Mat3.ts";


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
    color: IVec3

    /**
     * Create a model instance that share vertices in the scene.
     *
     * @param triangleIndices The indices for the vertices that make up each triangle of the model.
     * @param transform       The model transformation
     * @param color           The color of the object
     * @param name            A name for the object, for debugging purposes.
     */
    constructor(triangleIndices: Vec3[], transform: Transform, color: IVec3 = new IVec3(255, 255, 255), name: string) {
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

    constructor(position: Vec3, orientation: Vec3 = new Vec3(0, 0, 0), scale: number = 1) {
        this.position = position
        this.orientation = orientation
        this.scale = scale
    }

    // Applies transformation in translation, rotation, scale
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
}