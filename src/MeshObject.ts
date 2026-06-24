import type {Vec3} from "./math/vec3.ts";
import type {IVec3} from "./math/ivec3.ts";

export class  MeshObject{
    vertices: Vec3[]
    indices: IVec3[]

    constructor() {
        this.vertices = []
        this.indices = []
    }
}