import {describe, expect, test} from "vitest";
import {Vec4} from "../../src/math/Vec4";

describe("Vec4", () => {
    test("Ctor create a vector with correct values", () => {
        const vec = new Vec4(1, 2, 3, 4)
        expect(vec.x).toStrictEqual(1)
        expect(vec.y).toStrictEqual(2)
        expect(vec.z).toStrictEqual(3)
        expect(vec.w).toStrictEqual(4)
    })


    test("Zero returns a zero vector", () => {
        const vec = Vec4.zero()

        expect(vec.x).toStrictEqual(0)
        expect(vec.y).toStrictEqual(0)
        expect(vec.z).toStrictEqual(0)
        expect(vec.w).toStrictEqual(0)
    })


    test("Point returns a vector with a w value of 1 and other values as specified", () => {
        const point = Vec4.Point3(1, 2, 3)

        expect(point.x).toStrictEqual(1)
        expect(point.y).toStrictEqual(2)
        expect(point.z).toStrictEqual(3)
        expect(point.w).toStrictEqual(1)
    })
})