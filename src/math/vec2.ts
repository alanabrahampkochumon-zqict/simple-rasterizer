export class Vec2 {

    x: number
    y: number

    constructor(x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }


    static Add(res: Vec2, a: Vec2, b: Vec2): Vec2 {
        res.x = a.x + b.x
        res.y = a.y + b.y
        return res
    }

    static Sub(res: Vec2, a: Vec2, b: Vec2): Vec2 {
        res.x = a.x - b.x
        res.y = a.y - b.y

        return res
    }

    static Mul(res: Vec2, a: Vec2, scalar: number): Vec2 {
        res.x = a.x * scalar
        res.y = a.y * scalar
        return res
    }

    static Div(res: Vec2, a: Vec2, scalar: number): Vec2 {
        res.x = a.x / scalar
        res.y = a.y / scalar

        return res
    }
}