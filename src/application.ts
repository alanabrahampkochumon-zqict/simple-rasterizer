import {IVec3} from "./math/ivec3"
import {Vec2} from "./math/vec2.ts";

export class Application {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    targetSurface: ImageData;
    clearColor: IVec3;

    counter: number = 0

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        if (ctx == null)
            throw new Error(
                "There was an error while retrieving the rendering context!",
            );

        this.context = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
        this.targetSurface = this.context.createImageData(
            canvas.width,
            canvas.height,
        );
        this.clearColor = new IVec3(0, 0, 0);

        this.resize()
    }

    resize() {
        // Resize canvas with account for device pixel ratio
        const dpr = window.devicePixelRatio || 1;
        const canvasRect = this.canvas.getBoundingClientRect();

        this.canvas.height = canvasRect.height * dpr;
        this.canvas.width = canvasRect.width * dpr;

        this.height = this.canvas.height
        this.width = this.canvas.width

        // Recreate the buffer as screen size changes
        this.targetSurface = this.context.createImageData(this.width, this.height)

        // console.log(`[Resized]: Height: ${this.height}, Width: ${this.width}`)
        // console.log(`[Resized]: Context Height: ${this.context.canvas.height}, Width: ${this.context.canvas.width}`)
        // console.log(`[Resized]: Buffer Height: ${this.targetSurface.height}, Width: ${this.targetSurface.width}`)
    }

    /**
     * Sets the clear color of the renderer.
     * @remarks This doesn't clear the buffer or update the screen.
     *
     * @param color The clear color to set.
     */
    setClearColor(color: IVec3) {
        this.clearColor = color;
    }

    /**
     * Puts a color on the corresponding pixel coordinate.
     * @param x The x-coordinate of the buffer
     * @param y The y-coordinate of the buffer
     * @param color The color to put at the x and y location.
     *
     * @private
     */
    #putPixel(x: number, y: number, color: IVec3) {
        const colorChannels = 4
        const flatIndex = colorChannels * (y * this.width + x)
        this.targetSurface.data[flatIndex] = color.r;
        this.targetSurface.data[flatIndex + 1] = color.g;
        this.targetSurface.data[flatIndex + 2] = color.b;
        this.targetSurface.data[flatIndex + 3] = 255; // Full opacity on alpha channel
    }

    /**
     * Clears the buffer.
     *
     * @remarks Does not update the screen. Call updateScreen to update the screen.
     */
    clearScreen() {
        for (let i = 0; i < this.height; ++i)
            for (let j = 0; j < this.width; ++j)
                this.#putPixel(j, i, this.clearColor);
    }

    updateScreen() {
        this.context.putImageData(this.targetSurface, 0, 0);
    }

    render() {
        this.colorUV()
        this.drawLineBox()
    }

    drawLineH(p0: Vec2, p1: Vec2, color: IVec3) {
        // Slope(m) = change in y / change in x
        // Line Eq: y = mx + b

        // If line is moving from right to left
        // since the drawing order doesn't matter
        // we can just swap them
        let x0 = p0.x;
        let x1 = p1.x;
        // if (x0 > x1) {
        //     let temp = x0;
        //     x0 = x1;
        //     x1 = temp;
        // }

        const m = (p1.y - p0.y) / (x1 - x0)

        // const b = p0.y - m * x0

        // Optimization 1
        // Since the slope is one factor that is changing from y0 to y1
        // We can calculate the initial y0 and add slope to it to get the next y

        let y = p0.y
        console.log(y)
        console.log(`x0: ${x0} --- x1 ${x1}`)


        // Note: Must iterate until p1.x inclusive
        for (let x = x0 + 1; x <= x1; ++x) {
            // const y = m * x + b
            this.#putPixel(x, y, color)
            y += m
            console.log(`x: ${x}, y: ${y}`)
            // y = y + b
        }

    }

    drawLineV(p0: Vec2, p1: Vec2, color: IVec3) {
        if (p0.y > p1.y) {
            let temp = p0
            p0 = p1
            p1 = temp
        }

        // Slope is flipped, so m = δx/δy
        const m = ( p1.x - p0.x ) / (p1.y - p0.y)
        let x = p0.x

        for (let y = p0.y; y < p1.y; ++y) {
            this.#putPixel(x, y, color)
            x += m
        }
    }


    run() {
        this.render()
        // this.clearScreen()
        this.updateScreen()
        // requestAnimationFrame(() => this.run())
    }


    /**
     ********************
     *     TEST CODE
     *********************
     */

    drawLineBox() {
        const topLeft = new Vec2(10, 10)
        const bottomLeft = new Vec2(10, 500)
        const topRight = new Vec2(500, 10)
        const bottomRight = new Vec2(500, 500)


        // Draws only horizontal lines + sloped
        this.drawLineH(new Vec2(topLeft.x, topLeft.y), new Vec2(topRight.x, topRight.y), new IVec3(255, 255, 255)) // Horizontal Line
        this.drawLineH(new Vec2(topLeft.x, topLeft.y), new Vec2(bottomLeft.x, bottomLeft.y), new IVec3(255, 255, 255)) // Can't draw vertical line since slope == 0
        this.drawLineH(new Vec2(topLeft.x, topLeft.y), new Vec2(bottomRight.x, bottomRight.y), new IVec3(255, 255, 255))// Cross

        this.drawLineH(new Vec2(bottomLeft.x, bottomLeft.y), new Vec2(bottomRight.x, bottomRight.y), new IVec3(255, 255, 255)) // Bottom Horizontal line
        this.drawLineH(new Vec2(topRight.x, topRight.y), new Vec2(bottomRight.x, bottomRight.y), new IVec3(255, 255, 255)) // Can't draw vertical line since slope == 0
        this.drawLineH(new Vec2(bottomLeft.x, bottomLeft.y), new Vec2(topRight.x, topRight.y), new IVec3(255, 255, 255)) // Cross

        // Right to left line
        this.drawLineH(new Vec2(800, 100), new Vec2(50, 50), new IVec3(0, 255, 255))


        // Draws only vertical lines + sloped
        this.drawLineV(new Vec2(topLeft.x, topLeft.y), new Vec2(topRight.x, topRight.y), new IVec3(255, 0, 255)) // Horizontal Line
        this.drawLineV(new Vec2(topLeft.x, topLeft.y), new Vec2(bottomLeft.x, bottomLeft.y), new IVec3(255, 0, 255)) // Can't draw vertical line since slope == 0
        this.drawLineV(new Vec2(topLeft.x, topLeft.y), new Vec2(bottomRight.x, bottomRight.y), new IVec3(255, 0, 255))// Cross

        this.drawLineV(new Vec2(bottomLeft.x, bottomLeft.y), new Vec2(bottomRight.x, bottomRight.y), new IVec3(255, 0, 255)) // Bottom Horizontal line
        this.drawLineV(new Vec2(topRight.x, topRight.y), new Vec2(bottomRight.x, bottomRight.y), new IVec3(255, 0, 255)) // Can't draw vertical line since slope == 0
        this.drawLineV(new Vec2(bottomLeft.x, bottomLeft.y), new Vec2(topRight.x, topRight.y), new IVec3(255, 0, 255)) // Cross

        // Right to left line
        this.drawLineV(new Vec2(800, 100), new Vec2(50, 50), new IVec3(255, 0, 255))

    }

    colorUV() {
        // Test Code: Renders UV
        for (let i = 0; i < this.height; ++i)
            for (let j = 0; j < this.width; ++j)
                this.#putPixel(j, i, new IVec3(j / this.width * 255, i / this.height * 255, 0))
    }
}
