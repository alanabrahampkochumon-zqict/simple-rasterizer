import {describe, expect, test} from "vitest";
import {Vec3} from "../../src/math/Vec3";

describe("Vec3", () => {

    test("Ctor initializes a 3D vector with passed-in values", () => {
        const vec = new Vec3(1, 2, 3);
        expect(vec.x).toStrictEqual(1)
        expect(vec.y).toStrictEqual(2)
        expect(vec.z).toStrictEqual(3)
    })


    test("Dot product returns valid scalar", () => {
        const vecA = new Vec3(1, 2, 3)
        const vecB = new Vec3(4, 5, 6)
        expect(vecA.dot(vecB)).toStrictEqual(32)
    })
})