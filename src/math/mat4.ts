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

}