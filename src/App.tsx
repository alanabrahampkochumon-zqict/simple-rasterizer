import {useRef} from 'react'
import {Application} from "./Application.ts";
import {IVec3} from "./math/ivec3.ts";
import {Controls} from "./Controls.tsx";

function App() {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    if (canvasRef.current != null) {
        const app = new Application(canvasRef.current);
        app.setClearColor(new IVec3(27, 27, 27));
        app.clearScreen();
        app.run()

        // TODO: Move to a dedicated panel
        // canvas.addEventListener("click", async () => {
// TODO: Fix Rendering artifacting on face
// TEST CODEs
//             const file = await openFile()
//             const mesh = await parseObject(file)
//             const translation = new Vec3(0, 0, 7)
//             app.renderObject(mesh.vertices.map(vertex => Vec3.Add(new Vec3(0, 0, 0), vertex, translation)), mesh.indices)
//         })
    }
    return <div className="w-screen h-screen grid grid-cols-[1fr_400px]">
        <canvas ref={canvasRef} className="w-full h-full"/>
        {/*<canvas className="w-full h-full bg-yellow-300"/>*/}
        <Controls/>
    </div>
}

export default App
