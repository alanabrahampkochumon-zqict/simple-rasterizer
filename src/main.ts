import {Application} from "./application";
import "./style.css";
import {IVec3} from "./math/ivec3.ts";
import {openFile} from "./File.ts";
import {parseObject} from "./parsers/ObjectParser.ts";
import {Vec3} from "./math/vec3.ts";

const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;

if (canvas != null) {
    const app = new Application(canvas);
    app.setClearColor(new IVec3(125, 125, 255));
    app.clearScreen();
    app.run()

    window.addEventListener("resize", () => {
        app.resize();
    });

    // TODO: Move to a dedicated panel
    canvas.addEventListener("click", async () => {

// TEST CODEs
        const file = await openFile()
        const mesh = await parseObject(file)
        const translation = new Vec3(-1.5, 0, 7)
        app.renderObject(mesh.vertices.map(vertex => Vec3.Add(new Vec3(0, 0, 0), vertex, translation)), mesh.indices)
    })
}
