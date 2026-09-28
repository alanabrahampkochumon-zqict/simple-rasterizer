import {Vec3} from "@/math/Vec3.ts";
import {Mat4} from "@/math/Mat4.ts";

export default class Transform {
    position: Vec3
    orientation: Vec3
    scale: Vec3
    transformMat: Mat4

    constructor(position: Vec3, orientation: Vec3 = Vec3.fill(0), scale: Vec3 = Vec3.fill(1)) {
        this.position = position
        this.orientation = orientation
        this.scale = scale
        this.transformMat = Mat4.I()
        this.transformMat = new Mat4(
            scale.x, 0, 0, position.x,
            0, scale.y, 0, position.y,
            0, 0, scale.z, position.z,
            0, 0, 0, 1
        )
        this.transformMat = this.transformMat.matMul(Mat4.rotX(orientation.x).matMul(Mat4.rotY(orientation.y)).matMul(Mat4.rotZ(orientation.z)))
    }

    static default() {
        return new Transform(
            Vec3.fill(0)
        )
    }

    // Applies transformation in translation, rotation, scale
    /**
     * @deprecated
     */
    // apply(vertex: Vec3): Vec3 {
    //     // Apply scale
    //     const scaledVec = new Vec3(0, 0, 0);
    //     Vec3.Mul(scaledVec, vertex, this.scale);
    //
    //     // Apply Rotation
    //     const xRotMat = Mat3.rotX(this.orientation.x);
    //     const yRotMat = Mat3.rotY(this.orientation.y);
    //     const zRotMat = Mat3.rotZ(this.orientation.z);
    //
    //     const rotMat = Mat3.I()
    //     Mat3.multiply(rotMat, Mat3.multiply(Mat3.I(), xRotMat, yRotMat), zRotMat)
    //
    //     const rotVec = new Vec3(0, 0, 0);
    //     Mat3.multiplyVec(rotVec, rotMat, scaledVec);
    //
    //     // Apply translation
    //     const translatedVec = new Vec3(0, 0, 0);
    //     return Vec3.Add(translatedVec, rotVec, this.position)
    // }
    //
    // applyAffine(vertex: Vec3): Vec4 {
    //     const rotation = Mat4.rotX(this.orientation.x).matMul(Mat4.rotY(this.orientation.y).matMul(Mat4.rotZ(this.orientation.z)))
    //     const scale = Mat4.scale(this.scale, this.scale, this.scale)
    //     const translation = Mat4.translate(this.position.x, this.position.y, this.position.z)
    //
    //     const combined = translation.matMul(scale.matMul(rotation))
    //     return combined.vecMul(Vec4.Point3(vertex.x, vertex.y, vertex.z))
    // }
}