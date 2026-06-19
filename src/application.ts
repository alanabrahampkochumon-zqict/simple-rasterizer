import {IVec3} from "./math/ivec3"

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

    run() {
        this.clearScreen()
        this.updateScreen()
        requestAnimationFrame(() => this.run())
    }
}
