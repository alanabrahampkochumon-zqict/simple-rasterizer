import {test, describe, expect} from "vitest";
import {Mat4} from "../../src/math/Mat4";


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

    // test("Matrix Multiplication Returns Correct Result", () => {
    //     Mat4 matA = new Mat4(1, 2, 3, 4)
    // })
})