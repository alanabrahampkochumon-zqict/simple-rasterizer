import { Application } from "./application";
import "./style.css";
import {IVec3} from "./math/ivec3.ts";

const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;

if (canvas != null) {
    const app = new Application(canvas!!);
    app.setClearColor(new IVec3(125, 125, 255));
    app.clearScreen();
    // app.updateScreen();

    // TODO: Loop
    app.run()
    // main(canvas);

    window.addEventListener("resize", () => {
        app.resize();
    });

}

//
// function resize(canvas: HTMLCanvasElement | null) {
//     if (canvas == null) return;
//
//     // Resize canvas with account for device pixel ratio
//     const dpr = window.devicePixelRatio || 1;
//     const canvasRect = canvas.getBoundingClientRect();
//     canvas.height = canvasRect.height * dpr;
//     canvas.width = canvasRect.width * dpr;
// }

// function main(canvas: HTMLCanvasElement) {
//     app.setClearColor(new IVec3(125, 125, 255));
//     app.clearScreen();
//     // app.updateScreen();
//
//     // TODO: Loop
//     app.run()
// }
