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
        this.transformMat = Mat4.translate(this.position.x, this.position.y, this.position.z)
        this.transformMat = this.transformMat.matMul(Mat4.rotX(orientation.x).matMul(Mat4.rotY(orientation.y)).matMul(Mat4.rotZ(orientation.z)))
        this.transformMat = this.transformMat.matMul(Mat4.scale(this.scale.x, this.scale.y, this.scale.z))
    }

    static default() {
        return new Transform(
            Vec3.fill(0)
        )
    }
}