import {MeshObject} from "../MeshObject.ts";
import {Vec3} from "../math/vec3.ts";
import {IVec3} from "../math/ivec3.ts";

export async function parseObject(file: any): Promise<MeshObject> {
    const meshObject = new MeshObject()

    const reader = new FileReader()

    if (reader === null) {
        throw new Error("There was an error instantiating the reader!")
    }
    reader.readAsText(file)

    return new Promise((resolve, reject) => {

        reader.onloadend = (e) => {
            if (!e.target || !e.target?.result)
                return reject("failed to read file target results")

            const result = e.target.result.toString()

            const lines = result.split("\n")

            for (const line of lines) {
                if (line.startsWith("vn")) {
                    // TODO: Vertex normal
                } else if (line.startsWith("vt")) {
                    // TODO:
                } else if (line.startsWith("v")) {
                    // Vertex

                    const vertices = line.split(/\s+/).map(Number)
                    if (vertices.length < 4) continue // Invalid vertex

                    // 0th index contains the letter "v"
                    meshObject.vertices.push(new Vec3(vertices[1], vertices[2], vertices[3]))

                } else if (line.startsWith("f")) {
                    // Face indices
                    const indices = line.split(/\s+/).splice(1).map((indexStr) => {
                        return indexStr.split(/\//).map(Number)
                    })
                    // 0 -> Face, 1 -> Texture, 2 -> Normal

                    // Face Indices
                    for (let i = 2; i < indices.length; ++i) {
                        // Triangulation if required (Convex Poly ONLY)
                        // Obj indices are 1-based so we need to subtract 1
                        meshObject.indices.push(new IVec3(indices[0][0] - 1, indices[i - 1][0] - 1, indices[i][0] - 1))
                    }
                }
            }
            resolve(meshObject)

        }
    })


}