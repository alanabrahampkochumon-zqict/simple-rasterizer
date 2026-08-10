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


}