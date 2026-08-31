import {Vec4} from "./Vec4.ts";

export class Mat4 {
    data: number[]


    // Column Major Ordering
    constructor(
        m00: number, m01: number, m02: number, m03: number,
        m10: number, m11: number, m12: number, m13: number,
        m20: number, m21: number, m22: number, m23: number,
        m30: number, m31: number, m32: number, m33: number,
    ) {
        this.data = []
        this.data.length = 16

        this.data[0] = m00
        this.data[1] = m10
        this.data[2] = m20
        this.data[3] = m30

        this.data[4] = m01
        this.data[5] = m11
        this.data[6] = m21
        this.data[7] = m31

        this.data[8] = m02
        this.data[9] = m12
        this.data[10] = m22
        this.data[11] = m32

        this.data[12] = m03
        this.data[13] = m13
        this.data[14] = m23
        this.data[15] = m33
    }


    get(row: number, column: number): number {
        return this.data[column * 4 + row];
    }

    /**
     * Compute the product of this matrix with another in-place.
     *
     * @param matrix The matrix to multiply
     *
     * @return A reference to this matrix.
     */
    matMul(matrix: Mat4): Mat4 {

        // First Row
        const m00 = this.data[0] * matrix.data[0] + this.data[4] * matrix.data[1] + this.data[8] * matrix.data[2] + this.data[12] * matrix.data[3]
        const m01 = this.data[0] * matrix.data[4] + this.data[4] * matrix.data[5] + this.data[8] * matrix.data[6] + this.data[12] * matrix.data[7]
        const m02 = this.data[0] * matrix.data[8] + this.data[4] * matrix.data[9] + this.data[8] * matrix.data[10] + this.data[12] * matrix.data[11]
        const m03 = this.data[0] * matrix.data[12] + this.data[4] * matrix.data[13] + this.data[8] * matrix.data[14] + this.data[12] * matrix.data[15]

        // Second Row
        const m10 = this.data[1] * matrix.data[0] + this.data[5] * matrix.data[1] + this.data[9] * matrix.data[2] + this.data[13] * matrix.data[3]
        const m11 = this.data[1] * matrix.data[4] + this.data[5] * matrix.data[5] + this.data[9] * matrix.data[6] + this.data[13] * matrix.data[7]
        const m12 = this.data[1] * matrix.data[8] + this.data[5] * matrix.data[9] + this.data[9] * matrix.data[10] + this.data[13] * matrix.data[11]
        const m13 = this.data[1] * matrix.data[12] + this.data[5] * matrix.data[13] + this.data[9] * matrix.data[14] + this.data[13] * matrix.data[15]

        // Third Row
        const m20 = this.data[2] * matrix.data[0] + this.data[6] * matrix.data[1] + this.data[10] * matrix.data[2] + this.data[14] * matrix.data[3]
        const m21 = this.data[2] * matrix.data[4] + this.data[6] * matrix.data[5] + this.data[10] * matrix.data[6] + this.data[14] * matrix.data[7]
        const m22 = this.data[2] * matrix.data[8] + this.data[6] * matrix.data[9] + this.data[10] * matrix.data[10] + this.data[14] * matrix.data[11]
        const m23 = this.data[2] * matrix.data[12] + this.data[6] * matrix.data[13] + this.data[10] * matrix.data[14] + this.data[14] * matrix.data[15]

        // Fourth Row
        const m30 = this.data[3] * matrix.data[0] + this.data[7] * matrix.data[1] + this.data[11] * matrix.data[2] + this.data[15] * matrix.data[3]
        const m31 = this.data[3] * matrix.data[4] + this.data[7] * matrix.data[5] + this.data[11] * matrix.data[6] + this.data[15] * matrix.data[7]
        const m32 = this.data[3] * matrix.data[8] + this.data[7] * matrix.data[9] + this.data[11] * matrix.data[10] + this.data[15] * matrix.data[11]
        const m33 = this.data[3] * matrix.data[12] + this.data[7] * matrix.data[13] + this.data[11] * matrix.data[14] + this.data[15] * matrix.data[15]

        this.data[0] = m00
        this.data[1] = m10
        this.data[2] = m20
        this.data[3] = m30

        this.data[4] = m01
        this.data[5] = m11
        this.data[6] = m21
        this.data[7] = m31

        this.data[8] = m02
        this.data[9] = m12
        this.data[10] = m22
        this.data[11] = m32

        this.data[12] = m03
        this.data[13] = m13
        this.data[14] = m23
        this.data[15] = m33
        return this;
    }


    /**
     * Compute the product of this matrix with another and return a new matrix.
     *
     * @param matrix The matrix to multiply
     *
     * @return A reference to this matrix.
     */
    matMulBin(matrix: Mat4): Mat4 {

        // First Row
        const m00 = this.data[0] * matrix.data[0] + this.data[4] * matrix.data[1] + this.data[8] * matrix.data[2] + this.data[12] * matrix.data[3]
        const m01 = this.data[0] * matrix.data[4] + this.data[4] * matrix.data[5] + this.data[8] * matrix.data[6] + this.data[12] * matrix.data[7]
        const m02 = this.data[0] * matrix.data[8] + this.data[4] * matrix.data[9] + this.data[8] * matrix.data[10] + this.data[12] * matrix.data[11]
        const m03 = this.data[0] * matrix.data[12] + this.data[4] * matrix.data[13] + this.data[8] * matrix.data[14] + this.data[12] * matrix.data[15]

        // Second Row
        const m10 = this.data[1] * matrix.data[0] + this.data[5] * matrix.data[1] + this.data[9] * matrix.data[2] + this.data[13] * matrix.data[3]
        const m11 = this.data[1] * matrix.data[4] + this.data[5] * matrix.data[5] + this.data[9] * matrix.data[6] + this.data[13] * matrix.data[7]
        const m12 = this.data[1] * matrix.data[8] + this.data[5] * matrix.data[9] + this.data[9] * matrix.data[10] + this.data[13] * matrix.data[11]
        const m13 = this.data[1] * matrix.data[12] + this.data[5] * matrix.data[13] + this.data[9] * matrix.data[14] + this.data[13] * matrix.data[15]

        // Third Row
        const m20 = this.data[2] * matrix.data[0] + this.data[6] * matrix.data[1] + this.data[10] * matrix.data[2] + this.data[14] * matrix.data[3]
        const m21 = this.data[2] * matrix.data[4] + this.data[6] * matrix.data[5] + this.data[10] * matrix.data[6] + this.data[14] * matrix.data[7]
        const m22 = this.data[2] * matrix.data[8] + this.data[6] * matrix.data[9] + this.data[10] * matrix.data[10] + this.data[14] * matrix.data[11]
        const m23 = this.data[2] * matrix.data[12] + this.data[6] * matrix.data[13] + this.data[10] * matrix.data[14] + this.data[14] * matrix.data[15]

        // Fourth Row
        const m30 = this.data[3] * matrix.data[0] + this.data[7] * matrix.data[1] + this.data[11] * matrix.data[2] + this.data[15] * matrix.data[3]
        const m31 = this.data[3] * matrix.data[4] + this.data[7] * matrix.data[5] + this.data[11] * matrix.data[6] + this.data[15] * matrix.data[7]
        const m32 = this.data[3] * matrix.data[8] + this.data[7] * matrix.data[9] + this.data[11] * matrix.data[10] + this.data[15] * matrix.data[11]
        const m33 = this.data[3] * matrix.data[12] + this.data[7] * matrix.data[13] + this.data[11] * matrix.data[14] + this.data[15] * matrix.data[15]


        return new Mat4(
            m00, m01, m02, m03,
            m10, m11, m12, m13,
            m20, m21, m22, m23,
            m30, m31, m32, m33
        );
    }

    /**
     * Compute the product of this matrix with a column vector.
     *
     * @param vec The vector to multiply.
     *
     * @return A new vector transformed by this matrix.
     * @constructor
     */
    vecMul(vec: Vec4): Vec4 {
        const resVec = Vec4.zero()

        resVec.x = this.data[0] * vec.x + this.data[4] * vec.y + this.data[8] * vec.z + this.data[12] * vec.w;
        resVec.y = this.data[1] * vec.x + this.data[5] * vec.y + this.data[9] * vec.z + this.data[13] * vec.w;
        resVec.z = this.data[2] * vec.x + this.data[6] * vec.y + this.data[10] * vec.z + this.data[14] * vec.w;
        resVec.w = this.data[3] * vec.x + this.data[7] * vec.y + this.data[11] * vec.z + this.data[15] * vec.w;

        return resVec;

    }


    /**
     * Construct a rotation matrix around the x-axis.
     * @param angle The angle of rotation in radians.
     *
     * @return The rotation matrix.
     * @constructor
     */
    static rotX(angle: number): Mat4 {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        return new Mat4(
            1, 0, 0, 0,
            0, c, -s, 0,
            0, s, c, 0,
            0, 0, 0, 1
        )
    }

    /**
     * Construct a rotation matrix around the y-axis.
     * @param angle The angle of rotation in radians.
     *
     * @return The rotation matrix.
     * @constructor
     */
    static rotY(angle: number): Mat4 {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        return new Mat4(
            c, 0, s, 0,
            0, 1, 0, 0,
            -s, 0, c, 0,
            0, 0, 0, 1
        )
    }


    /**
     * Construct a rotation matrix around the z-axis.
     * @param angle The angle of rotation in radians.
     *
     * @return The rotation matrix.
     * @constructor
     */
    static rotZ(angle: number): Mat4 {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        return new Mat4(
            c, -s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
    }


    /**
     * Construct a translation matrix.
     * @param x The translation in x-axis.
     * @param y The translation in y-axis.
     * @param z The translation in z-axis.
     *
     * @return The translation matrix.
     * @constructor
     */
    static translate(x: number, y: number, z: number): Mat4 {
        return new Mat4(
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1
        )
    }


    /**
     * Construct a scale matrix.
     * @param x The scale factor in x-axis.
     * @param y The scale factor in y-axis.
     * @param z The scale factor in z-axis.
     *
     * @return The scale matrix.
     * @constructor
     */
    static scale(x: number, y: number, z: number): Mat4 {
        return new Mat4(
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        )
    }


    /**
     * Construct an identity matrix.
     * @constructor
     */
    static I(): Mat4 {
        return new Mat4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }


    /**
     * Construct a combined perspective and screen projection matrix.
     *
     * @param d  The distance to the projection plane.
     * @param vw Viewport width
     * @param vh Viewport height
     * @param sw Screen width
     * @param sh Screen height
     * @constructor
     */
    static persScreenProj(d: number, vw: number, vh: number, sw: number, sh: number): Mat4 {
        return new Mat4(
            d * sw / vw, 0, 0, 0,
            0, d * sh / vh, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }

    static makeAffine(rX: number, rY: number, rZ: number, tX: number, tY: number, tZ: number) {
        const mat = this.rotX(rX).matMulBin(this.rotY(rY).matMulBin(this.rotZ(rZ)))
        console.log(mat)
        mat.data[3] = tX;
        mat.data[7] = tY;
        mat.data[11] = tZ;
        return mat
    }

    /**
     * Get the transpose(row-column swapped along the diagonal)
     */
    transpose(): Mat4 {
        return new Mat4(
            this.data[0], this.data[1], this.data[2], this.data[3],
            this.data[4], this.data[5], this.data[6], this.data[7],
            this.data[8], this.data[9], this.data[10], this.data[11],
            this.data[12], this.data[13], this.data[14], this.data[15]
        )
    }


    /**
     * Returns a camera transform matrix as if the camera was an entity.
     *
     * @privateRemarks Since camera matrix is an inverse transformation matrix and we can calculate it faster
     *                 without taking the actual inverse(via transpose), we can separate it to make the computation faster.
     *
     * @param rX Rotation in the x-axis
     * @param rY Rotation in the y-axis
     * @param rZ Rotation in the z-axis
     * @param tX Translation in the x-axis
     * @param tY Translation in the y-axis
     * @param tZ Translation in the z-axis
     */
    static makeCameraTransform(rX: number, rY: number, rZ: number, tX: number, tY: number, tZ: number) {
        let mat = this.rotX(rX).matMulBin(this.rotY(rY).matMulBin(this.rotZ(rZ)))
        mat = mat.transpose() // For a rotation matrix transpose is the inverse

        mat.data[3] = -tX;
        mat.data[7] = -tY;
        mat.data[11] = -tZ;
        return mat
    }


}