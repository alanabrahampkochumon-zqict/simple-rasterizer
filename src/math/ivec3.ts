export class IVec3 {
    r: number;
    g: number;
    b: number;

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    static Mul(res: IVec3, a: IVec3, s: number): IVec3 {
        res.r = s * a.r
        res.g = s * a.g
        res.b = s * a.b

        return res
    }
}
