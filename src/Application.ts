import {Vec3} from "./math/Vec3.ts"
import {Vec2} from "./math/vec2.ts";
import {MeshObject} from "./MeshObject.ts";
import {ModelInstance, Scene, Transform} from "./Scene.ts";
import {Mat4} from "@/math/Mat4.ts";
import {Vec4} from "@/math/Vec4.ts";

export class Application {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    targetSurface: ImageData;
    clearColor: Vec3;
    mesh: MeshObject;
    camTranslation: Vec3;

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
        this.clearColor = new Vec3(0, 0, 0);
        this.camTranslation = new Vec3(0, 0, 0);

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
    }

    /**
     * Sets the clear color of the renderer.
     * @remarks This doesn't clear the buffer or update the screen.
     *
     * @param color The clear color to set.
     */
    setClearColor(color: Vec3) {
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
    #putPixel(x: number, y: number, color: Vec3) {
        // Wrap around fix
        if (x < 0 || y < 0 || x >= this.width || y >= this.height)
            return

        const colorChannels = 4
        // Without rounding the floating point math can throw off indices
        // often times creating jittery lines, or nothing besides a dot
        x = x | 0;
        y = y | 0;

        const flatIndex = colorChannels * (y * this.width + x)


        // Only color if the flatIndex is in-bounds
        // Since we need to move at least 3 places from the flatIndex,
        // we are ensuring that there is enough indices eg: if size is 500 and flatIndex is 496
        // then we can use 496, 497, 498, 499(last index), but if its 497, then i + 3 is out-of-bounds
        // flatIndex < this.targetSurface.data.length - 3 && blitColor(this.targetSurface.data);

        this.targetSurface.data[flatIndex] = color.x;
        this.targetSurface.data[flatIndex + 1] = color.y;
        this.targetSurface.data[flatIndex + 2] = color.z;
        this.targetSurface.data[flatIndex + 3] = 255; // Full opacity on alpha channel

    }


    // The coordinates we are getting are from -width/2 to width/2
    // and height/2(top) to -height/2(bottom)
    // but we need to convert that to 0 to width and 0 to height
    #putPixelNormalized(x: number, y: number, color: Vec3) {
        x = x + this.width / 2;
        y = -y + this.height / 2;
        this.#putPixel(x, y, new Vec3(color.x, color.y, color.z))
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

    #drawLineV(p0: Vec2, p1: Vec2, color: Vec3) {
        if (p0.y > p1.y) {
            const temp = p0
            p0 = p1
            p1 = temp
        }

        // Slope is flipped, so m = δx/δy
        const m = (p1.x - p0.x) / (p1.y - p0.y)
        let x = p0.x

        for (let y = p0.y; y < p1.y; ++y) {
            this.#putPixelNormalized(x, y, color)
            x += m
        }
    }

    #drawLineH(p0: Vec2, p1: Vec2, color: Vec3) {
        // Slope(m) = change in y / change in x
        // Line Eq: y = mx + b

        // If line is moving from right to left
        // since the drawing order doesn't matter
        // we can just swap them
        if (p0.x > p1.x) {
            const temp = p0
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
            this.#putPixelNormalized(x, y, color)
            y += m
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
    drawLineNonInterpolated(p0: Vec2, p1: Vec2, color: Vec3) {
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

        for (let i = i0; i <= i1; ++i) {
            const d = d0 + m * (i - i0)
            interpolatedValues.push(d)
        }

        return interpolatedValues
    }


    // FIX NOTE: Indices must be rounded, else they can give undefined values
    // FIX NOTE: Rounding has been changed to | 0, inspired by Gabriel Gambetta's code
    // While it gives a better accuracy, it's not a 100% as there are still some artifacts.
    drawLine(p0: Vec2, p1: Vec2, color: Vec3) {
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
                this.#putPixelNormalized(x, values[(x - p0.x) | 0], color)
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
                this.#putPixelNormalized(values[(y - p0.y) | 0], y, color)

        }
    }

    /**
     * Perform a simple perspective projection.
     * @param vec The vertex(vector) to perform the perspective projection on.
     * @param d   The distance between the camera and the viewport.
     *
     * @returns A 2D vector with perspective projection applied.
     */
    perspectiveProj(vec: Vec3, d: number): Vec2 {
        const zFactor = 1 / vec.z
        return new Vec2(vec.x * d * zFactor, vec.y * d * zFactor);
    }


    // TODO: Relabel and use this
    perspective(vec: Vec3, zFar: number, zNear: number, fov: number, aspect: number) {
        const invTan = 1.0 / Math.tan(fov / 2);
        const zFactor = zFar / (zFar - zNear);
        const newX = aspect * invTan * vec.x;
        const newY = invTan * vec.y;

        const newZ = (vec.z - zNear) * zFactor

        return new Vec2(newX, newY);
    }

    viewportToCanvas(vec: Vec2, viewportWidth: number, viewportHeight: number, canvasWidth: number, canvasHeight: number): Vec2 {
        // Since HTML canvas start from 0, 0 at top to height width at bottom we need to translate the transformed point after scaling
        // with respect to the viewport
        const scaledX = vec.x / viewportWidth * canvasWidth
        const scaledY = -vec.y / viewportHeight * canvasHeight
        return new Vec2(scaledX + canvasWidth / 2, scaledY + canvasHeight / 2)
    }


    drawTriangleWireframe(p0: Vec2, p1: Vec2, p2: Vec2, color: Vec3) {
        // 0 to 1, 1 to 2, 2 to 0
        this.drawLine(p0, p1, color)
        this.drawLine(p1, p2, color)
        this.drawLine(p2, p0, color)
    }

    drawTriangle(p0: Vec2, p1: Vec2, p2: Vec2, color: Vec3) {
        // Must round the vertices before interpolated to prevent artifacting
        // due to incomplete interpolation
        p0 = new Vec2(p0.x | 0, p0.y | 0)
        p1 = new Vec2(p1.x | 0, p1.y | 0)
        p2 = new Vec2(p2.x | 0, p2.y | 0)
        // Sort the vertices in the increasing order of y value
        const [a, b, c] = [p0, p1, p2].sort((a, b) => a.y - b.y)
        const h0 = .5, h1 = .25, h2 = 1.0 // TODO: Update Intensities at each vertex

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
        const xABC = xAB.concat(xBC)

        // Join shorter sides of color intensities
        hAB.pop()
        const hABC = [...hAB, ...hBC]

        // Find the left and right side
        const midpointIndex = (xAC.length / 2) | 0
        // By comparing hte x values(interpolated values) for the middle of the sides we can determine which is the left side
        let left, right, leftH, rightH; // Int -> Intensity
        // Draw line for each x and y values
        // Clarity
        const interpolatedColor = new Vec3(0, 0, 0); // A holder var to hold the interpolated colors
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
        const minY = a.y
        const maxY = c.y

        // Both interpolation
        for (let y = minY; y <= maxY; ++y) {
            const yDelta = (y - minY) | 0
            const xLeft = (left[yDelta]) | 0
            const xRight = (right[yDelta]) | 0

            // Interpolate the color intensities from left to right with for each y value with respect
            // to the interpolated left and right x values
            const hSegment = this.interpolate(xLeft, leftH[yDelta], xRight, rightH[yDelta])

            for (let x = xLeft; x <= xRight; ++x) {
                const xDelta = (x - xLeft) | 0

                Vec3.Mul(interpolatedColor, color, hSegment[xDelta]) // Subtraction required to bring the index down to 0..n

                this.#putPixelNormalized(x, y, color)
            }
        }

    }


    translation = 0.0;

    rotate(output: Vec3, input: Vec3, angle: number) {
        const c = Math.cos(angle)
        const s = Math.sin(angle)

        // output.x = input.x * c - input.y * s;
        // output.y = input.x * s + input.y * c;
        // output.z = input.z + 7;

        output.x = input.x * c + input.z * s;
        output.y = input.y;
        output.z = (-input.x * s + input.z * c) + 7;
        return output;
    }

    rotationY = 0;
    rotationSpeed = 0.01;

    run() {
        this.clearScreen()
        // TODO: Add back
        // const translationVec = new Vec3(0, 0, 7 + this.translation)
        // if (this.mesh != undefined)
        //     this.renderObject(this.mesh.vertices.map(vertex => this.rotate(new Vec3(0, 0, 0), vertex, this.translation)), this.mesh.indices)
        // this.testRender()
        // this.translation += 0.05
        this.rotationY += this.rotationSpeed;
        this.testSceneRender()
        this.updateScreen()
        // requestAnimationFrame(() => this.run())

    }


    /**
     *********************
     *     TEST CODE
     *********************
     */

    testRender() {
        // this.testDrawHAndV()
        // this.testColorUV()
        // this.drawLineTest()
        // this.drawTriWireframeTest()
        // this.drawCubeProjTest()
        // this.drawCubeProjTest2()
        // this.drawCubeTest()
    }

    testDrawHAndV() {
        this.#drawLineV(new Vec2(0, 0), new Vec2(100, 100), new Vec3(255, 255, 255))
        this.#drawLineV(new Vec2(0, -1000), new Vec2(0, 1000), new Vec3(0, 255, 255))
        this.#drawLineV(new Vec2(0, 0), new Vec2(0, -100), new Vec3(0, 0, 255))
        this.#drawLineV(new Vec2(0, 0), new Vec2(0, 100), new Vec3(0, 255, 0))
        this.#drawLineH(new Vec2(0, 0), new Vec2(100, 0), new Vec3(0, 255, 0))
        this.#drawLineH(new Vec2(0, 0), new Vec2(-100, 0), new Vec3(0, 0, 255))
    }

    testColorUV() {
        // Test Code: Renders UV
        for (let i = this.height / 2; i >= -this.height / 2; --i) // Top Down
            for (let j = -this.width / 2; j < this.width / 2; ++j) // Left to right
                this.#putPixelNormalized(j, i, new Vec3(j / this.width * 255, i / this.height * 255, 0))
    }

    drawLineTest() {
        const topLeft = new Vec2(10, 10)
        const bottomLeft = new Vec2(10, 500)
        const topRight = new Vec2(500, 10)
        const bottomRight = new Vec2(500, 500)

        this.drawLine(new Vec2(topLeft.x, topLeft.y), new Vec2(topRight.x, topRight.y), new Vec3(255, 0, 255)) // Horizontal Line
        this.drawLine(new Vec2(topLeft.x, topLeft.y), new Vec2(bottomLeft.x, bottomLeft.y), new Vec3(255, 0, 255)) // Can't draw vertical line since slope == 0
        this.drawLine(new Vec2(topLeft.x, topLeft.y), new Vec2(bottomRight.x, bottomRight.y), new Vec3(255, 0, 255))// Cross

        this.drawLine(new Vec2(bottomLeft.x, bottomLeft.y), new Vec2(bottomRight.x, bottomRight.y), new Vec3(255, 0, 255)) // Bottom Horizontal line
        this.drawLine(new Vec2(topRight.x, topRight.y), new Vec2(bottomRight.x, bottomRight.y), new Vec3(255, 0, 255)) // Can't draw vertical line since slope == 0
        this.drawLine(new Vec2(bottomLeft.x, bottomLeft.y), new Vec2(topRight.x, topRight.y), new Vec3(255, 0, 255)) // Cross

        this.drawLine(new Vec2(0, 0), new Vec2(this.width, this.height), new Vec3(255, 225, 22))

        // Right to left line
        this.drawLine(new Vec2(800, 100), new Vec2(50, 50), new Vec3(255, 255, 0))
        this.drawLine(new Vec2(500, 500), new Vec2(450, 40), new Vec3(255, 255, 0))
    }


    drawTriWireframeTest() {
        const verts = [
            new Vec2(400, 50),
            new Vec2(800, 400),
            new Vec2(50, 400)
        ]
        const color = new Vec3(10, 255, 255)

        this.drawTriangleWireframe(verts[0], verts[1], verts[2], new Vec3(50, 255, 0))
        this.drawTriangle(verts[0], verts[1], verts[2], color)
    }


    renderObject(vertices: Vec3[], indices: Vec3[]) {
        const viewportDistance = 2
        const viewportWidth = 2
        const viewportHeight = 2

        const projectVertices = vertices.map((vertex) => this.viewportToCanvas(this.perspectiveProj(vertex, viewportDistance), viewportWidth, viewportHeight, this.width, this.height))
        for (const {x, y, z} of indices) {
            this.drawTriangle(projectVertices[x], projectVertices[y], projectVertices[z], new Vec3(255, 255, 0))
        }

        this.updateScreen()
    }

    submitMesh(mesh: MeshObject) {
        this.mesh = mesh;
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


        const RED = new Vec3(255, 255, 0)
        const GREEN = new Vec3(0, 255, 0)
        const BLUE = new Vec3(0, 0, 255)
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


        this.drawTriangle(this.viewportToCanvas(
                this.perspectiveProj(vAb, viewportDist), 1, 1, this.width, this.height),
            this.viewportToCanvas(this.perspectiveProj(vBb, viewportDist), 1, 1, this.width, this.height),
            this.viewportToCanvas(this.perspectiveProj(vCb, viewportDist), 1, 1, this.width, this.height),
            new Vec3(0, 255, 255))
        this.drawTriangle(this.viewportToCanvas(
                this.perspectiveProj(vCb, viewportDist), 1, 1, this.width, this.height),
            this.viewportToCanvas(this.perspectiveProj(vDb, viewportDist), 1, 1, this.width, this.height),
            this.viewportToCanvas(this.perspectiveProj(vAb, viewportDist), 1, 1, this.width, this.height),
            GREEN)

        // Sides
        this.drawTriangle(this.viewportToCanvas(
                this.perspectiveProj(vAf, viewportDist), 1, 1, this.width, this.height),
            this.viewportToCanvas(this.perspectiveProj(vBf, viewportDist), 1, 1, this.width, this.height),
            this.viewportToCanvas(this.perspectiveProj(vAb, viewportDist), 1, 1, this.width, this.height),
            new Vec3(255, 255, 255))

        this.drawTriangle(this.viewportToCanvas(
                this.perspectiveProj(vBf, viewportDist), 1, 1, this.width, this.height),
            this.viewportToCanvas(this.perspectiveProj(vBb, viewportDist), 1, 1, this.width, this.height),
            this.viewportToCanvas(this.perspectiveProj(vCf, viewportDist), 1, 1, this.width, this.height),
            new Vec3(255, 0, 255))

        this.drawTriangle(this.viewportToCanvas(
                this.perspectiveProj(vCf, viewportDist), 1, 1, this.width, this.height),
            this.viewportToCanvas(this.perspectiveProj(vDb, viewportDist), 1, 1, this.width, this.height),
            this.viewportToCanvas(this.perspectiveProj(vDf, viewportDist), 1, 1, this.width, this.height),
            new Vec3(255, 0, 255))

        this.drawTriangle(this.viewportToCanvas(
                this.perspectiveProj(vCb, viewportDist), 1, 1, this.width, this.height),
            this.viewportToCanvas(this.perspectiveProj(vCf, viewportDist), 1, 1, this.width, this.height),
            this.viewportToCanvas(this.perspectiveProj(vDb, viewportDist), 1, 1, this.width, this.height),
            new Vec3(255, 255, 0))


        this.drawTriangle(this.viewportToCanvas(
                this.perspectiveProj(vAf, viewportDist), 1, 1, this.width, this.height),
            this.viewportToCanvas(this.perspectiveProj(vBf, viewportDist), 1, 1, this.width, this.height),
            this.viewportToCanvas(this.perspectiveProj(vCf, viewportDist), 1, 1, this.width, this.height),
            RED)
        this.drawTriangle(this.viewportToCanvas(
                this.perspectiveProj(vCf, viewportDist), 1, 1, this.width, this.height),
            this.viewportToCanvas(this.perspectiveProj(vDf, viewportDist), 1, 1, this.width, this.height),
            this.viewportToCanvas(this.perspectiveProj(vAf, viewportDist), 1, 1, this.width, this.height),
            BLUE)

    }

    private drawCubeProjTest() {
        // Front Vertices
        const vAf = new Vec3(400, 400, 2)
        const vBf = new Vec3(600, 400, 2)
        const vCf = new Vec3(600, 600, 2)
        const vDf = new Vec3(400, 600, 2)


        // Back vertices
        const vAb = new Vec3(440, 360, 3)
        const vBb = new Vec3(640, 360, 3)
        const vCb = new Vec3(640, 560, 3)
        const vDb = new Vec3(440, 560, 3)

        const RED = new Vec3(120, 0, 0)
        const GREEN = new Vec3(0, 120, 0)
        const BLUE = new Vec3(0, 0, 120)
        const viewportDist = 2

        // TODO: Use full perspective projection
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
            new Vec3(0, 1, 2),
            new Vec3(0, 2, 3),
            new Vec3(4, 0, 3),
            new Vec3(4, 3, 7),
            new Vec3(5, 4, 7),
            new Vec3(5, 7, 6),
            new Vec3(1, 6, 2),
            new Vec3(4, 5, 1),
            new Vec3(4, 1, 0),
            new Vec3(2, 6, 7),
            new Vec3(2, 7, 3),
        ]

        const translation = new Vec3(-1.5, 0, 8)

        this.renderObject(vertices.map(vertex => Vec3.Add(new Vec3(0, 0, 0), vertex, translation)), indices)

    }

    testSceneRender() {
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
            new Vec3(0, 1, 2),
            new Vec3(0, 2, 3),
            new Vec3(4, 0, 3),
            new Vec3(4, 3, 7),
            new Vec3(5, 4, 7),
            new Vec3(5, 7, 6),
            new Vec3(1, 5, 6),
            new Vec3(1, 6, 2),
            new Vec3(4, 5, 1),
            new Vec3(4, 1, 0),
            new Vec3(2, 6, 7),
            new Vec3(2, 7, 3),
        ]

        const scene = new Scene(vertices, [
            new ModelInstance(indices, new Transform(new Vec3(0, -2, 12), new Vec3(0, Math.PI / 4, 0), 1), new Vec3(128, 255, 25), "Cube 1"),
            new ModelInstance(indices, new Transform(new Vec3(0, 2, 12), new Vec3(0, 0, 0),), new Vec3(20, 120, 180), "Cube 2")
        ])

        this.renderScene(scene);
    }


    /**
     * Render a 3D scene to the canvas.
     *
     * @param scene The scene to render.
     */
    renderScene(scene: Scene) {
        for (const model of scene.instances) {
            this.renderInstance(scene.vertices, model);
        }
    }

    /**
     * Render a single instance from the scene.
     * @param vertices The whole scene vertices.
     * @param instance Each instance from the scene.
     */
    renderInstance(vertices: Vec3[], instance: ModelInstance) {

        // Camera transforms are applied in reverse since when we me the camera to the left
        // the view moves to the right and so on
        // so we need to take the inverse transform matrix, which for rotation is the transpose
        // and for translation is the negated values, applied in the opposite direction so Translation * Rotation
        // since (A.B)^T = B^T . A^T
        const camTx = this.camTranslation.x, camTy = this.camTranslation.y, camTz = this.camTranslation.z;
        // NOTE: Inverse of translation matrix is the negated components not transpose(since translation matrix isn't orthogonal)
        const cameraTranslation = new Mat4(1, 0, 0, -camTx,
            0, 1, 0, -camTy,
            0, 0, 1, -camTz,
            0, 0, 0, 1)
        const cameraRotation = Mat4.rotX(0).matMulBin(Mat4.rotY(0).matMulBin(Mat4.rotZ(0))).transpose()
        const cameraTransform = cameraTranslation.matMulBin(cameraRotation)


        for (const triangle of instance.triangleIndices) {
            const triangleVerts = []
            for (const index of [triangle.x, triangle.y, triangle.z]) {

                // const translatedVec = instance.transform.applyAffine(vertices[index])
                const perspectiveProj = Mat4.persScreenProj(1, 1, 1, this.width, this.height)
                // TODO: Refactor
                const camViewMatrix = cameraTransform.matMulBin(instance.transform.transformMat)
                const newVec = camViewMatrix.vecMul(Vec4.Point3(vertices[index].x, vertices[index].y, vertices[index].z))


                triangleVerts.push(perspectiveProj.vecMul(newVec).castVec3().perspDiv())
            }
            this.drawTriangle(triangleVerts[0], triangleVerts[1], triangleVerts[2], instance.color);
        }
    }
}
