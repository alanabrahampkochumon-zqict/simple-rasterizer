import {test, describe, expect} from "vitest";
import {Mat4} from "../../src/math/Mat4";
import {Vec4} from "../../src/math/Vec4";


describe('Mat4 Accessor', () => {
    test.each([
        [0, 0, 1], [0, 1, 2], [0, 2, 3], [0, 3, 4],
        [1, 0, 5], [1, 1, 6], [1, 2, 7], [1, 3, 8],
        [2, 0, 9], [2, 1, 10], [2, 2, 11], [2, 3, 12],
        [3, 0, 13], [3, 1, 14], [3, 2, 15], [3, 3, 16]
    ])("get(%i, %i) return a valid value", (row, col, value) => {
        const mat = new Mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)
        expect(mat.get(row, col)).toStrictEqual(value)
    })
});

describe("Mat4 Multiplication Tests", () => {
    test("matMul returns a valid matrix", () => {
        const matA = new Mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)
        const matB = new Mat4(10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25)
        const expected = new Mat4(180, 190, 200, 210, 436, 462, 488, 514, 692, 734, 776, 818, 948, 1006, 1064, 1122);
        expectMatrixEq(matA.matMul(matB), expected)
    })

    test("vecMul returns a valid vector", () => {
        const mat = new Mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)
        const vec = new Vec4(1, 2, 3, 4)
        const expected = new Vec4(30, 70, 110, 150)
        expectVecEq(mat.vecMul(vec), expected)
    })
})

function expectVecEq(a: Vec4, b: Vec4) {
    expect(a.x).toStrictEqual(b.x)
    expect(a.y).toStrictEqual(b.y)
    expect(a.z).toStrictEqual(b.z)
    expect(a.w).toStrictEqual(b.w)
}

function expectMatrixEq(a: Mat4, b: Mat4) {
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            expect(a.get(i, j)).toStrictEqual(b.get(i, j))
        }
    }
}