import type {Vec3} from "./math/vec3.ts";


class Scene {
    vertices: Vec3[]
    instance: ModelInstance

    /**
     * Create a scene with shared vertex information.
     *
     * @param vertices The collection of all the vertices in the scene.
     * @param instance A single model instance in the scene.
     */
    constructor(vertices: Vec3[], instance: ModelInstance) {
        this.vertices = vertices
        this.instance = instance
    }
}

class ModelInstance {
    name: string
    position: Vec3
    // orientation: Vec3
    triangleIndices: Vec3[]

    /**
     * Create a model instance that share vertices in the scene.
     *
     * @param triangleIndices The indices for the vertices that make up each triangle of the model.
     * @param position        The position of the instance in the world
     * @param name            A name for the object, for debugging purposes.
     */
    constructor(triangleIndices: Vec3[], position: Vec3, name: string) {
        this.name = name
        this.triangleIndices = triangleIndices
        this.position = position
    }
}