import { Application } from "./application";
import "./style.css";
import {IVec3} from "./math/ivec3.ts";

const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;

if (canvas != null) {
    const app = new Application(canvas);
    app.setClearColor(new IVec3(125, 125, 255));
    app.clearScreen();
    app.run()

    window.addEventListener("resize", () => {
        app.resize();
    });

}