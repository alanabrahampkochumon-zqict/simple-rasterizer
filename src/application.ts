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
        // Without rounding the floating point math can throw off indices
        // often times creating jittery lines, or nothing besides a dot
        y = Math.round(y)
        x = Math.round(x)
        const flatIndex = colorChannels * (y * this.width + x)

        // Only color if the flatIndex is in-bounds
        // Since we need to move at least 3 places from the flatIndex,
        // we are ensuring that there is enough indices eg: if size is 500 and flatIndex is 496
        // then we can use 496, 497, 498, 499(last index), but if its 497, then i + 3 is out-of-bounds
        flatIndex < this.targetSurface.data.length - 3 && blitColor(this.targetSurface.data);

        function blitColor(buffer: ImageDataArray) {
            buffer[flatIndex] = color.r;
            buffer[flatIndex + 1] = color.g;
            buffer[flatIndex + 2] = color.b;
            buffer[flatIndex + 3] = 255; // Full opacity on alpha channel
        }

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



    #drawLineH(p0: Vec2, p1: Vec2, color: IVec3) {
        // Slope(m) = change in y / change in x
        // Line Eq: y = mx + b

        // If line is moving from right to left
        // since the drawing order doesn't matter
        // we can just swap them
        if (p0.x > p1.x) {
            let temp = p0
            p0 = p1
            p1 = temp
        }

        // Optimization
        // Since the slope is one factor that is changing from y0 to y1
        // We can calculate the initial y0 and add slope to it to get the next y
        const m = (p1.y - p0.y) / (p1.x - p0.x)
        let y = p0.y


        // Note: Must iterate until p1.x inclusive
        for (let x = p0.x; x <= p1.x; ++x) {
            this.#putPixel(x, y, color)
            console.log(`x: ${x}, y: ${y}`)
            y += m
        }

    }

    #drawLineV(p0: Vec2, p1: Vec2, color: IVec3) {
        if (p0.y > p1.y) {
            let temp = p0
            p0 = p1
            p1 = temp
        }

        // Slope is flipped, so m = δx/δy
        const m = (p1.x - p0.x) / (p1.y - p0.y)
        let x = p0.x

        for (let y = p0.y; y < p1.y; ++y) {
            this.#putPixel(x, y, color)
            x += m
        }
    }

    /**
     * Draws a line between p0 and p1.
     *
     * @privateRemarks Left for benchmarking
     *
     * @param p0 The first point to draw the line.
     * @param p1 The second point to draw the line.
     * @param color The color to paint the line stroke.
     * @private
     *
     * @deprecated
     */
    drawLineNonInterpolated(p0: Vec2, p1: Vec2, color: IVec3) {
        const deltaX = Math.abs(p1.x - p0.x)
        const deltaY = Math.abs(p1.y - p0.y)
        if (deltaX > deltaY) {
            this.#drawLineH(p0, p1, color)
        } else {
            this.#drawLineV(p0, p1, color)
        }
    }


    /**
     * Interpolates between two values returning the interpolated values as a list.
     * @param i0 The initial value for independent variable.
     * @param d0 The initial value for dependent variable.
     * @param i1 The final value for independent variable.
     * @param d1 The final value for dependent variable.
     *
     * @return The interpolated values for the y (second term).
     */
    interpolate(i0: number, d0: number, i1: number, d1: number) {
        if (i0 == i1) {
            return [d0]
        }
        const interpolatedValues = []

        const m = (d1 - d0) / (i1 - i0)
        let y = d0

        for(let x = i0; x <= i1; ++x) {
            interpolatedValues.push(y)
            y += m
        }

        return interpolatedValues
    }

    drawLine(p0: Vec2, p1: Vec2, color: IVec3) {
        const deltaX = Math.abs(p1.x - p0.x)
        const deltaY = Math.abs(p1.y - p0.y)
        if (deltaX > deltaY) {
            // Line is horizontalish (i.e, there are more x values
            // so we can use x to iterating interpolating y

            // If initial x value is greater then, we need to swap as we are looping from
            // smaller value to bigger value
            if (p0.x > p1.x) {
                // TODO: Extract
                const temp = p0
                p0 = p1
                p1 = temp
            }

            const values = this.interpolate(p0.x, p0.y, p1.x, p1.y)
            for(let x = p0.x; x <= p1.x; ++x) {
                this.#putPixel(x, values[x - p0.x], color)
            }
        } else {
            // Line is verticalish
            // i.e, there are more vertical points to interpolate
            if (p0.y > p1.y) {
                // TODO: Extract
                const temp = p0
                p0 = p1
                p1 = temp
            }

            const values = this.interpolate(p0.y, p0.x, p1.y, p1.x)
            for(let y = p0.y; y <= p1.y; ++y)
                this.#putPixel(values[y - p0.y], y, color)

        }
    }


    drawTriangleWireframe(p0: Vec2, p1: Vec2, p2: Vec2, color: IVec3) {
        // 0 to 1, 1 to 2, 2 to 0
        this.drawLine(p0, p1, color)
        this.drawLine(p1, p2, color)
        this.drawLine(p2, p0, color)
    }

    drawTriangle(p0: Vec2, p1: Vec2, p2: Vec2, color: IVec3) {
        // Sort the vertices in the increasing order of y value
        const [a, b, c] = [p0, p1, p2].sort((a, b) => a.y - b.y)

        // Interpolate the vertices
        // Since we are drawing horizontal lines
        // We are taking x as the dependent variable
        // const xAB = this.interpolate(a.x, a.)
    }


    render() {
        this.colorUVTest()
        this.drawLineTest()
        this.drawTriWireframeTest()
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

    drawLineTest() {
        const topLeft = new Vec2(10, 10)
        const bottomLeft = new Vec2(10, 500)
        const topRight = new Vec2(500, 10)
        const bottomRight = new Vec2(500, 500)


        // Draws only horizontal lines + sloped
        // this.drawLineH(new Vec2(topLeft.x, topLeft.y), new Vec2(topRight.x, topRight.y), new IVec3(255, 255, 255)) // Horizontal Line
        // this.drawLineH(new Vec2(topLeft.x, topLeft.y), new Vec2(bottomLeft.x, bottomLeft.y), new IVec3(255, 255, 255)) // Can't draw vertical line since slope == 0
        // this.drawLineH(new Vec2(topLeft.x, topLeft.y), new Vec2(bottomRight.x, bottomRight.y), new IVec3(255, 255, 255))// Cross
        //
        // this.drawLineH(new Vec2(bottomLeft.x, bottomLeft.y), new Vec2(bottomRight.x, bottomRight.y), new IVec3(255, 255, 255)) // Bottom Horizontal line
        // this.drawLineH(new Vec2(topRight.x, topRight.y), new Vec2(bottomRight.x, bottomRight.y), new IVec3(255, 255, 255)) // Can't draw vertical line since slope == 0
        // this.drawLineH(new Vec2(bottomLeft.x, bottomLeft.y), new Vec2(topRight.x, topRight.y), new IVec3(255, 255, 255)) // Cross
        //
        // // Right to left line
        // this.drawLineH(new Vec2(800, 100), new Vec2(50, 50), new IVec3(0, 255, 255))
        //
        //
        // // Draws only vertical lines + sloped
        // this.drawLineV(new Vec2(topLeft.x, topLeft.y), new Vec2(topRight.x, topRight.y), new IVec3(255, 0, 255)) // Horizontal Line
        // this.drawLineV(new Vec2(topLeft.x, topLeft.y), new Vec2(bottomLeft.x, bottomLeft.y), new IVec3(255, 0, 255)) // Can't draw vertical line since slope == 0
        // this.drawLineV(new Vec2(topLeft.x, topLeft.y), new Vec2(bottomRight.x, bottomRight.y), new IVec3(255, 0, 255))// Cross
        //
        // this.drawLineV(new Vec2(bottomLeft.x, bottomLeft.y), new Vec2(bottomRight.x, bottomRight.y), new IVec3(255, 0, 255)) // Bottom Horizontal line
        // this.drawLineV(new Vec2(topRight.x, topRight.y), new Vec2(bottomRight.x, bottomRight.y), new IVec3(255, 0, 255)) // Can't draw vertical line since slope == 0
        // this.drawLineV(new Vec2(bottomLeft.x, bottomLeft.y), new Vec2(topRight.x, topRight.y), new IVec3(255, 0, 255)) // Cross
        //
        // // Right to left line
        // this.drawLineV(new Vec2(800, 100), new Vec2(50, 50), new IVec3(255, 0, 255))

        // this.#drawLineSlow(new Vec2(topLeft.x, topLeft.y), new Vec2(topRight.x, topRight.y), new IVec3(255, 0, 255)) // Horizontal Line
        // this.#drawLineSlow(new Vec2(topLeft.x, topLeft.y), new Vec2(bottomLeft.x, bottomLeft.y), new IVec3(255, 0, 255)) // Can't draw vertical line since slope == 0
        // this.#drawLineSlow(new Vec2(topLeft.x, topLeft.y), new Vec2(bottomRight.x, bottomRight.y), new IVec3(255, 0, 255))// Cross
        //
        // this.#drawLineSlow(new Vec2(bottomLeft.x, bottomLeft.y), new Vec2(bottomRight.x, bottomRight.y), new IVec3(255, 0, 255)) // Bottom Horizontal line
        // this.#drawLineSlow(new Vec2(topRight.x, topRight.y), new Vec2(bottomRight.x, bottomRight.y), new IVec3(255, 0, 255)) // Can't draw vertical line since slope == 0
        // this.#drawLineSlow(new Vec2(bottomLeft.x, bottomLeft.y), new Vec2(topRight.x, topRight.y), new IVec3(255, 0, 255)) // Cross
        //
        // this.#drawLineSlow(new Vec2(0, 0), new Vec2(this.width, this.height), new IVec3(255, 255, 255))
        //
        // // Right to left line
        // this.#drawLineSlow(new Vec2(800, 100), new Vec2(50, 50), new IVec3(255, 255, 0))

        this.drawLine(new Vec2(topLeft.x, topLeft.y), new Vec2(topRight.x, topRight.y), new IVec3(255, 0, 255)) // Horizontal Line
        this.drawLine(new Vec2(topLeft.x, topLeft.y), new Vec2(bottomLeft.x, bottomLeft.y), new IVec3(255, 0, 255)) // Can't draw vertical line since slope == 0
        this.drawLine(new Vec2(topLeft.x, topLeft.y), new Vec2(bottomRight.x, bottomRight.y), new IVec3(255, 0, 255))// Cross

        this.drawLine(new Vec2(bottomLeft.x, bottomLeft.y), new Vec2(bottomRight.x, bottomRight.y), new IVec3(255, 0, 255)) // Bottom Horizontal line
        this.drawLine(new Vec2(topRight.x, topRight.y), new Vec2(bottomRight.x, bottomRight.y), new IVec3(255, 0, 255)) // Can't draw vertical line since slope == 0
        this.drawLine(new Vec2(bottomLeft.x, bottomLeft.y), new Vec2(topRight.x, topRight.y), new IVec3(255, 0, 255)) // Cross

        this.drawLine(new Vec2(0, 0), new Vec2(this.width, this.height), new IVec3(255, 255, 255))

        // Right to left line
        this.drawLine(new Vec2(800, 100), new Vec2(50, 50), new IVec3(255, 255, 0))
        this.drawLine(new Vec2(500, 500), new Vec2(450, 40), new IVec3(255, 255, 0))
    }


    drawTriWireframeTest() {
        const verts = [
            new Vec2(400, 50),
            new Vec2(800, 400),
            new Vec2(50, 400)
        ]
        const color = new IVec3(10, 255, 255)

        this.drawTriangleWireframe(verts[0], verts[1], verts[2], color)
    }

    colorUVTest() {
        // Test Code: Renders UV
        for (let i = 0; i < this.height; ++i)
            for (let j = 0; j < this.width; ++j)
                this.#putPixel(j, i, new IVec3(j / this.width * 255, i / this.height * 255, 0))
    }
}
