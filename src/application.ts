import {IVec3} from "./math/ivec3"
import {Vec2} from "./math/vec2.ts";
import {Vec3} from "./math/vec3.ts";

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
     * @return The interpolated values for the dependent variable.
     */
    interpolate(i0: number, d0: number, i1: number, d1: number) {
        if (i0 == i1) {
            return [d0]
        }
        const interpolatedValues = []

        const m = (d1 - d0) / (i1 - i0)
        let y = d0

        for (let x = i0; x <= i1; ++x) {
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
            for (let x = p0.x; x <= p1.x; ++x) {
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
            for (let y = p0.y; y <= p1.y; ++y)
                this.#putPixel(values[y - p0.y], y, color)

        }
    }

    /**
     * Perform a simple perspective projection.
     * @param vec The vertex(vector) to perform the perspective projection on.
     * @param d   The distance between the camera and the viewport.
     *
     * @returns A 3D vector with perspective projection applied.
     */
    perspectiveProj(vec: Vec3, d: number): Vec2 {
        return new Vec2((vec.x / vec.z) * d, (vec.y / vec.z) * d)
    }

    viewportToCanvas(vec: Vec2, viewportWidth: number, viewportHeight: number, canvasWidth: number, canvasHeight: number): Vec2 {
        // Since HTML canvas start from 0, 0 at top to height width at bottom we need to translate the transformed point after scaling
        // with respect to the viewport
        const scaledX = vec.x / viewportWidth * canvasWidth
        const scaledY = vec.y / viewportHeight * canvasHeight
        return new Vec2(scaledX + canvasWidth / 2, scaledY + canvasHeight / 2)
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
        const h0 = 0.2, h1 = 0.5, h2 = 1.0 // TODO: Update Intensities at each vertex

        // Interpolate the vertices
        // Since we are drawing horizontal lines
        // We are taking x as the dependent variable
        const xAB = this.interpolate(a.y, a.x, b.y, b.x);
        const xBC = this.interpolate(b.y, b.x, c.y, c.x);
        // We need to put the smaller value, which is `a` in this case, first
        // since the interpolation function internal iterators from `i0` to `i1`(so it must be that i0 <= i1)
        // where `i` indicate independent
        const xAC = this.interpolate(a.y, a.x, c.y, c.x); // Since `a` is the smallest and c is the largest y value this is our longest edge values

        // Interpolate the color intensities at each vertex with respect to y
        // Shorter sides
        const hAB = this.interpolate(a.y, h0, b.y, h1);
        const hBC = this.interpolate(b.y, h1, c.y, h2);
        // Longer Side
        const hAC = this.interpolate(a.y, h0, c.y, h2);

        // Join the shorter sides
        // But since we have one common value in both remove it from one of the interpolated arrays
        xAB.pop()
        const xABC = [...xAB, ...xBC]

        // Join shorter sides of color intensities
        hAB.pop()
        const hABC = [...hAB, ...hBC]

        // Find the left and right side
        const midpointIndex = Math.round(xAC.length / 2)
        // By comparing hte x values(interpolated values) for the middle of the sides we can determine which is the left side
        let left, right, leftH, rightH; // Int -> Intensity
        if (xAC[midpointIndex] < xABC[midpointIndex]) {
            // xCA is the left side
            left = xAC
            right = xABC

            leftH = hAC
            rightH = hABC
        } else {
            // xABC is on the left side
            left = xABC
            right = xAC

            leftH = hABC
            rightH = hAC
        }

        // Draw line for each x and y values
        // Clarity
        const interpolatedColor = new IVec3(0, 0, 0); // A holder var to hold the interpolated colors
        const minY = a.y
        const maxY = c.y
        for (let y = minY; y <= maxY; ++y) {
            const xLeft = left[y - minY]
            const xRight = right[y - minY]

            // Interpolate the color intensities from left to right with for each y value with respect
            // to the interpolated left and right x values
            const hSegment = this.interpolate(xLeft, leftH[y - minY], xRight, rightH[y - minY])

            for (let x = xLeft; x <= xRight; ++x) {
                // Interpolate the color
                IVec3.Mul(interpolatedColor, color, hSegment[x - xLeft]) // Subtraction required to bring the index down to 0..n
                this.#putPixel(x, y, interpolatedColor)
            }
        }

    }


    render() {
        this.colorUVTest()
        this.drawLineTest()
        this.drawTriWireframeTest()
        this.drawCubeProjTest()
        this.drawCubeProjTest2()
        this.drawCubeTest()
    }

    run() {
        this.render()
        // this.clearScreen()
        this.updateScreen()
        // requestAnimationFrame(() => this.run())
    }


    /**
     *********************
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

        this.drawLine(new Vec2(0, 0), new Vec2(this.width, this.height), new IVec3(255, 225, 22))

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

        // this.drawTriangleWireframe(verts[0], verts[1], verts[2], color)
        this.drawTriangle(verts[0], verts[1], verts[2], color)
    }

    colorUVTest() {
        // Test Code: Renders UV
        for (let i = 0; i < this.height; ++i)
            for (let j = 0; j < this.width; ++j)
                this.#putPixel(j, i, new IVec3(j / this.width * 255, i / this.height * 255, 0))
    }

    // TODO: Color
    renderObject(vertices: Vec3[], indices: IVec3[]) {
        const viewportDistance = 1
        const viewportWidth = 2
        const viewportHeight = 2

        const projectVertices = vertices.map((vertex) => this.viewportToCanvas(this.perspectiveProj(vertex, viewportDistance), viewportWidth, viewportHeight, this.width, this.height))
        // this.drawTriangle(projectVertices[5], projectVertices[4], projectVertices[7], new IVec3(255, 0, 0))
        for (const {r, g, b} of indices) {
            this.drawTriangleWireframe(projectVertices[r], projectVertices[g], projectVertices[b], new IVec3(255, 255, 255))
        }
    }


    private drawCubeProjTest2() {

        const transY = 1
        // Front Vertices
        const vAf = new Vec3(-2, -0.5 + transY, 4)
        const vBf = new Vec3(-2, 0.5 + transY, 4)
        const vCf = new Vec3(-1, 0.5 + transY, 4)
        const vDf = new Vec3(-1, -0.5 + transY, 4)

        // Back vertices
        const vAb = new Vec3(-2, -0.5 + transY, 4.75)
        const vBb = new Vec3(-2, 0.5 + transY, 4.75)
        const vCb = new Vec3(-1, 0.5 + transY, 4.75)
        const vDb = new Vec3(-1, -0.5 + transY, 4.75)


        const RED = new IVec3(255, 255, 0)
        const GREEN = new IVec3(0, 255, 0)
        const BLUE = new IVec3(0, 0, 255)
        const viewportDist = 1

        this.drawLine(this.viewportToCanvas(this.perspectiveProj(vAf, viewportDist), 1, 1, this.width, this.height), this.viewportToCanvas(this.perspectiveProj(vBf, viewportDist), 1, 1, this.width, this.height), RED)
        this.drawLine(this.viewportToCanvas(this.perspectiveProj(vBf, viewportDist), 1, 1, this.width, this.height), this.viewportToCanvas(this.perspectiveProj(vCf, viewportDist), 1, 1, this.width, this.height), RED)
        this.drawLine(this.viewportToCanvas(this.perspectiveProj(vCf, viewportDist), 1, 1, this.width, this.height), this.viewportToCanvas(this.perspectiveProj(vDf, viewportDist), 1, 1, this.width, this.height), RED)
        this.drawLine(this.viewportToCanvas(this.perspectiveProj(vDf, viewportDist), 1, 1, this.width, this.height), this.viewportToCanvas(this.perspectiveProj(vAf, viewportDist), 1, 1, this.width, this.height), RED)


        this.drawLine(this.viewportToCanvas(this.perspectiveProj(vAb, viewportDist), 1, 1, this.width, this.height), this.viewportToCanvas(this.perspectiveProj(vBb, viewportDist), 1, 1, this.width, this.height), GREEN)
        this.drawLine(this.viewportToCanvas(this.perspectiveProj(vBb, viewportDist), 1, 1, this.width, this.height), this.viewportToCanvas(this.perspectiveProj(vCb, viewportDist), 1, 1, this.width, this.height), GREEN)
        this.drawLine(this.viewportToCanvas(this.perspectiveProj(vCb, viewportDist), 1, 1, this.width, this.height), this.viewportToCanvas(this.perspectiveProj(vDb, viewportDist), 1, 1, this.width, this.height), GREEN)
        this.drawLine(this.viewportToCanvas(this.perspectiveProj(vDb, viewportDist), 1, 1, this.width, this.height), this.viewportToCanvas(this.perspectiveProj(vAb, viewportDist), 1, 1, this.width, this.height), GREEN)


        this.drawLine(this.viewportToCanvas(this.perspectiveProj(vAf, viewportDist), 1, 1, this.width, this.height), this.viewportToCanvas(this.perspectiveProj(vAb, viewportDist), 1, 1, this.width, this.height), BLUE)
        this.drawLine(this.viewportToCanvas(this.perspectiveProj(vBf, viewportDist), 1, 1, this.width, this.height), this.viewportToCanvas(this.perspectiveProj(vBb, viewportDist), 1, 1, this.width, this.height), BLUE)
        this.drawLine(this.viewportToCanvas(this.perspectiveProj(vCf, viewportDist), 1, 1, this.width, this.height), this.viewportToCanvas(this.perspectiveProj(vCb, viewportDist), 1, 1, this.width, this.height), BLUE)
        this.drawLine(this.viewportToCanvas(this.perspectiveProj(vDf, viewportDist), 1, 1, this.width, this.height), this.viewportToCanvas(this.perspectiveProj(vDb, viewportDist), 1, 1, this.width, this.height), BLUE)


        this.drawLine(this.perspectiveProj(vAf, viewportDist), this.perspectiveProj(vBf, viewportDist), BLUE)
        this.drawLine(this.perspectiveProj(vBf, viewportDist), this.perspectiveProj(vCf, viewportDist), BLUE)
        this.drawLine(this.perspectiveProj(vCf, viewportDist), this.perspectiveProj(vDf, viewportDist), BLUE)
        this.drawLine(this.perspectiveProj(vDf, viewportDist), this.perspectiveProj(vAf, viewportDist), BLUE)
    }

    private drawCubeProjTest() {
        // Front Vertices
        const vAf = new Vec3(400, 400, 2)
        const vBf = new Vec3(600, 400, 2)
        const vCf = new Vec3(600, 600, 2)
        const vDf = new Vec3(400, 600, 2)


        // Back vertices
        const vAb = new Vec3(440, 360, 1.75)
        const vBb = new Vec3(640, 360, 1.75)
        const vCb = new Vec3(640, 560, 1.75)
        const vDb = new Vec3(440, 560, 1.75)


        const RED = new IVec3(120, 0, 0)
        const GREEN = new IVec3(0, 120, 0)
        const BLUE = new IVec3(0, 0, 120)
        const viewportDist = 3

        //Note: drawLine takes 2d vector, but 3d vector works here since they have similar member variables
        this.drawLine(this.perspectiveProj(vAf, viewportDist), this.perspectiveProj(vBf, viewportDist), RED)
        this.drawLine(this.perspectiveProj(vBf, viewportDist), this.perspectiveProj(vCf, viewportDist), RED)
        this.drawLine(this.perspectiveProj(vCf, viewportDist), this.perspectiveProj(vDf, viewportDist), RED)
        this.drawLine(this.perspectiveProj(vDf, viewportDist), this.perspectiveProj(vAf, viewportDist), RED)

        this.drawLine(this.perspectiveProj(vAb, viewportDist), this.perspectiveProj(vBb, viewportDist), GREEN)
        this.drawLine(this.perspectiveProj(vBb, viewportDist), this.perspectiveProj(vCb, viewportDist), GREEN)
        this.drawLine(this.perspectiveProj(vCb, viewportDist), this.perspectiveProj(vDb, viewportDist), GREEN)
        this.drawLine(this.perspectiveProj(vDb, viewportDist), this.perspectiveProj(vAb, viewportDist), GREEN)

        this.drawLine(this.perspectiveProj(vAf, viewportDist), this.perspectiveProj(vAb, viewportDist), BLUE)
        this.drawLine(this.perspectiveProj(vBf, viewportDist), this.perspectiveProj(vBb, viewportDist), BLUE)
        this.drawLine(this.perspectiveProj(vCf, viewportDist), this.perspectiveProj(vCb, viewportDist), BLUE)
        this.drawLine(this.perspectiveProj(vDf, viewportDist), this.perspectiveProj(vDb, viewportDist), BLUE)
    }

    drawCubeTest() {
        const vertices = [
            new Vec3(1, 1, 1),
            new Vec3(-1, 1, 1),
            new Vec3(-1, -1, 1),
            new Vec3(1, -1, 1),
            new Vec3(1, 1, -1),
            new Vec3(-1, 1, -1),
            new Vec3(-1, -1, -1),
            new Vec3(1, -1, -1),
        ]

        const indices = [
            new IVec3(0, 1, 2),
            new IVec3(0, 2, 3),
            new IVec3(4, 0, 3),
            new IVec3(4, 3, 7),
            new IVec3(5, 4, 7),
            new IVec3(5, 7, 6),
            new IVec3(1, 6, 2),
            new IVec3(4, 5, 1),
            new IVec3(4, 1, 0),
            new IVec3(2, 6, 7),
            new IVec3(2, 7, 3),
        ]

        const translation= new Vec3(-1.5, 0, 7)

        this.renderObject(vertices.map(vertex => Vec3.Add(new Vec3(0, 0, 0), vertex, translation)), indices)

    }
}
