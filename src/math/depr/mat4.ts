import type {Vec4} from "../vec4.ts";

export class Mat4 {

    data: Float32Array


    // Row major ordering
    constructor(
        m00: number, m01: number, m02: number, m03: number,
        m10: number, m11: number, m12: number, m13: number,
        m20: number, m21: number, m22: number, m23: number,
        m30: number, m31: number, m32: number, m33: number,
    ) {
        this.data = new Float32Array(16)
        this.data[0] = m00
        this.data[1] = m01
        this.data[2] = m02
        this.data[3] = m03

        this.data[4] = m10
        this.data[5] = m11
        this.data[6] = m12
        this.data[7] = m13

        this.data[8] = m20
        this.data[9] = m21
        this.data[10] = m22
        this.data[11] = m23

        this.data[12] = m30
        this.data[13] = m31
        this.data[14] = m32
        this.data[15] = m33
    }


    static Add(res: Mat4, a: Mat4, b: Mat4): Mat4 {
        res.data[0] = a.data[0] + b.data[0]
        res.data[1] = a.data[1] + b.data[1]
        res.data[2] = a.data[2] + b.data[2]
        res.data[3] = a.data[3] + b.data[3]

        res.data[4] = a.data[4] + b.data[4]
        res.data[5] = a.data[5] + b.data[5]
        res.data[6] = a.data[6] + b.data[6]
        res.data[7] = a.data[7] + b.data[7]

        res.data[8] = a.data[8] + b.data[8]
        res.data[9] = a.data[9] + b.data[9]
        res.data[10] = a.data[10] + b.data[10]
        res.data[11] = a.data[11] + b.data[11]

        res.data[12] = a.data[12] + b.data[12]
        res.data[13] = a.data[13] + b.data[13]
        res.data[14] = a.data[14] + b.data[14]
        res.data[15] = a.data[15] + b.data[15]

        return res;
    }

    static Sub(res: Mat4, a: Mat4, b: Mat4): Mat4 {
        res.data[0] = a.data[0] - b.data[0]
        res.data[1] = a.data[1] - b.data[1]
        res.data[2] = a.data[2] - b.data[2]
        res.data[3] = a.data[3] - b.data[3]

        res.data[4] = a.data[4] - b.data[4]
        res.data[5] = a.data[5] - b.data[5]
        res.data[6] = a.data[6] - b.data[6]
        res.data[7] = a.data[7] - b.data[7]

        res.data[8] = a.data[8] - b.data[8]
        res.data[9] = a.data[9] - b.data[9]
        res.data[10] = a.data[10] - b.data[10]
        res.data[11] = a.data[11] - b.data[11]

        res.data[12] = a.data[12] - b.data[12]
        res.data[13] = a.data[13] - b.data[13]
        res.data[14] = a.data[14] - b.data[14]
        res.data[15] = a.data[15] - b.data[15]

        return res;
    }

    static Mul(res: Mat4, a: Mat4, s: number): Mat4 {
        res.data[0] = a.data[0] * s
        res.data[1] = a.data[1] * s
        res.data[2] = a.data[2] * s
        res.data[3] = a.data[3] * s

        res.data[4] = a.data[4] * s
        res.data[5] = a.data[5] * s
        res.data[6] = a.data[6] * s
        res.data[7] = a.data[7] * s

        res.data[8] = a.data[8] * s
        res.data[9] = a.data[9] * s
        res.data[10] = a.data[10] * s
        res.data[11] = a.data[11] * s

        res.data[12] = a.data[12] * s
        res.data[13] = a.data[13] * s
        res.data[14] = a.data[14] * s
        res.data[15] = a.data[15] * s

        return res;
    }

    static Div(res: Mat4, a: Mat4, s: number): Mat4 {
        const factor = 1.0 / s
        res.data[0] = a.data[0] * factor
        res.data[1] = a.data[1] * factor
        res.data[2] = a.data[2] * factor
        res.data[3] = a.data[3] * factor

        res.data[4] = a.data[4] * factor
        res.data[5] = a.data[5] * factor
        res.data[6] = a.data[6] * factor
        res.data[7] = a.data[7] * factor

        res.data[8] = a.data[8] * factor
        res.data[9] = a.data[9] * factor
        res.data[10] = a.data[10] * factor
        res.data[11] = a.data[11] * factor

        res.data[12] = a.data[12] * factor
        res.data[13] = a.data[13] * factor
        res.data[14] = a.data[14] * factor
        res.data[15] = a.data[15] * factor

        return res;
    }

    static MulV(res: Vec4, vec: Vec4, mat: Mat4): Vec4 {
        res.x = vec.x * mat.data[0] + vec.y * mat.data[4] + vec.z * mat.data[8] + vec.w * mat.data[12]
        res.y = vec.x * mat.data[1] + vec.y * mat.data[5] + vec.z * mat.data[9] + vec.w * mat.data[13]
        res.z = vec.x * mat.data[2] + vec.y * mat.data[6] + vec.z * mat.data[10] + vec.w * mat.data[14]
        res.w = vec.x * mat.data[3] + vec.y * mat.data[7] + vec.z * mat.data[11] + vec.w * mat.data[15]

        return res;
    }

    static MulM(res: Mat4, lhs: Mat4, rhs: Mat4) {
        // First Row
        // 0,0 * 0,0 + 0,1 * 1,0 + 0,2 * 2,0 + 0,3 * 3,0
        res.data[0] = lhs.data[0] * rhs.data[0] + lhs.data[1] * rhs.data[4] + lhs.data[2] * rhs.data[8] + lhs.data[3] * rhs.data[12]
        // 0,0 * 0,1 + 0,1 * 1,1 + 0,2 * 2,1 + 0,3 * 3,1
        res.data[1] = lhs.data[0] * rhs.data[1] + lhs.data[1] * rhs.data[5] + lhs.data[2] * rhs.data[9] + lhs.data[3] * rhs.data[13]
        // 0,0 * 0,2 + 0,1 * 1,2 + 0,2 * 2,2 + 0,3 * 3,2
        res.data[2] = lhs.data[0] * rhs.data[2] + lhs.data[1] * rhs.data[6] + lhs.data[2] * rhs.data[10] + lhs.data[3] * rhs.data[14]
        // 0,0 * 0,3 + 0,1 * 1,3 + 0,2 * 2,3 + 0,3 * 3,3
        res.data[3] = lhs.data[0] * rhs.data[3] + lhs.data[1] * rhs.data[7] + lhs.data[2] * rhs.data[11] + lhs.data[3] * rhs.data[15]

        // Second Row
        // 1,0 * 0,0 + 1,1 * 1,0 + 1,2 * 2,0 + 1,3 * 3,0
        res.data[4] = lhs.data[4] * rhs.data[0] + lhs.data[5] * rhs.data[4] + lhs.data[6] * rhs.data[8] + lhs.data[7] * rhs.data[12]
        // 1,0 * 0,1 + 1,1 * 1,1 + 1,2 * 2,1 + 1,3 * 3,1
        res.data[5] = lhs.data[4] * rhs.data[1] + lhs.data[5] * rhs.data[5] + lhs.data[6] * rhs.data[9] + lhs.data[7] * rhs.data[13]
        // 1,0 * 0,2 + 1,1 * 1,2 + 1,2 * 2,2 + 1,3 * 3,2
        res.data[6] = lhs.data[4] * rhs.data[2] + lhs.data[5] * rhs.data[6] + lhs.data[6] * rhs.data[10] + lhs.data[7] * rhs.data[14]
        // 1,0 * 0,3 + 1,1 * 1,3 + 1,2 * 2,3 + 1,3 * 3,3
        res.data[7] = lhs.data[4] * rhs.data[3] + lhs.data[5] * rhs.data[7] + lhs.data[6] * rhs.data[11] + lhs.data[7] * rhs.data[15]

        // Third Row
        // 2,0 * 0,0 + 2,1 * 1,0 + 2,2 * 2,0 + 2,3 * 3,0
        res.data[8] = lhs.data[8] * rhs.data[0] + lhs.data[9] * rhs.data[4] + lhs.data[10] * rhs.data[8] + lhs.data[11] * rhs.data[12]
        // 2,0 * 0,1 + 2,1 * 1,1 + 2,2 * 2,1 + 2,3 * 3,1
        res.data[9] = lhs.data[8] * rhs.data[1] + lhs.data[9] * rhs.data[5] + lhs.data[10] * rhs.data[9] + lhs.data[11] * rhs.data[13]
        // 2,0 * 0,2 + 2,1 * 1,2 + 2,2 * 2,2 + 2,3 * 3,2
        res.data[10] = lhs.data[8] * rhs.data[2] + lhs.data[9] * rhs.data[6] + lhs.data[10] * rhs.data[10] + lhs.data[11] * rhs.data[14]
        // 2,0 * 0,3 + 2,1 * 1,3 + 2,2 * 2,3 + 2,3 * 3,3
        res.data[11] = lhs.data[8] * rhs.data[3] + lhs.data[9] * rhs.data[7] + lhs.data[10] * rhs.data[11] + lhs.data[11] * rhs.data[15]

        // Fourth Row
        // 3,0 * 0,0 + 3,1 * 1,0 + 3,2 * 2,0 + 3,3 * 3,0
        res.data[12] = lhs.data[12] * rhs.data[0] + lhs.data[13] * rhs.data[4] + lhs.data[14] * rhs.data[8] + lhs.data[15] * rhs.data[12]
        // 3,0 * 0,1 + 3,1 * 1,1 + 3,2 * 2,1 + 3,3 * 3,1
        res.data[13] = lhs.data[12] * rhs.data[1] + lhs.data[13] * rhs.data[5] + lhs.data[14] * rhs.data[9] + lhs.data[15] * rhs.data[13]
        // 3,0 * 0,2 + 3,1 * 1,2 + 3,2 * 2,2 + 3,3 * 3,2
        res.data[14] = lhs.data[12] * rhs.data[2] + lhs.data[13] * rhs.data[6] + lhs.data[14] * rhs.data[10] + lhs.data[15] * rhs.data[14]
        // 3,0 * 0,3 + 3,1 * 1,3 + 3,2 * 2,3 + 3,3 * 3,3
        res.data[15] = lhs.data[12] * rhs.data[3] + lhs.data[13] * rhs.data[7] + lhs.data[14] * rhs.data[11] + lhs.data[15] * rhs.data[15]

        return res;
    }


    // Rotation must be in radians
    static RotX(angle: number): Mat4 {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        return new Mat4(
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        )
    }

    // Rotation must be in radians
    static RotY(angle: number): Mat4 {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        return new Mat4(
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        )
    }

    // Rotation must be in radians
    static RotZ(angle: number): Mat4 {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        return new Mat4(
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
    }

    static Scale(x: number, y: number = 1, z: number = 1): Mat4 {
        return new Mat4(
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        )
    }

    static Translate(x: number, y: number, z: number): Mat4 {
        return new Mat4(
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1
        )
    }

    static I() {
        return new Mat4(1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1);
    }

    /**
     * Create a simple perspective projection matrix.
     *
     * @param d The distance to the projection plane.
     */
    static SimpleProj(d: number): Mat4 {
        return new Mat4(
            d, 0, 0, 0,
            0, d, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
    }


    /**
     * Create a screen projection matrix.
     *
     * @param vw Viewport width
     * @param vh Viewport height
     * @param sw Screen width
     * @param sh Screen height
     */
    static ScreenProj(vw: number, vh: number, sw: number, sh: number): Mat4 {
        return new Mat4(
            sw / vw, 0, 0, 0,
            0, sh / vh, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }


    /**
     * Create a combined projection matrix that does the perspective projection and screen space projection in one go.
     *
     * @param d    The distance to the projection plane.
     * @param vw Viewport width
     * @param vh Viewport height
     * @param sw Screen width
     * @param sh Screen height
     */
    static PersScreenProj(d: number, vw: number, vh: number, sw: number, sh: number): Mat4 {
        return new Mat4(
            d * sw / vw, 0, 0, 0,
            0, d * sh / vh, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }

    // TODO: Store camera transform and viewport transform in app
    // TODO: Store model transform in model(as matrix precomputed)
    // TODO: Add method to update the transformation matrix.
}