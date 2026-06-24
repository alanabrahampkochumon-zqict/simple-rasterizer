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





}