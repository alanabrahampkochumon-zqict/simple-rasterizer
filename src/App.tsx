import {useEffect, useRef, useState} from 'react'
import {Application} from "./Application.ts";
import {IVec3} from "./math/ivec3.ts";
import {Controls} from "./Controls.tsx";
import type {MeshObject} from "./MeshObject.ts";
import {Vec3} from "./math/Vec3.ts";


const WindowParams = {width: 0, height: 0}

function App() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [mesh, setMesh] = useState<MeshObject | undefined>(undefined)
    const [windowParams, setWindowParams] = useState(WindowParams);
    useEffect(() => {
        if (canvasRef.current != null) {
            const app = new Application(canvasRef.current);
            app.setClearColor(new IVec3(27, 27, 27));
            app.clearScreen();
            if (mesh != undefined)
                app.submitMesh(mesh)
            app.run()


            const onResizeEvt = (evt) => {
                // console.log(`Event:${evt}`)
                const width = canvasRef.current?.width || windowParams.width
                const height = canvasRef.current?.height || windowParams.height
                setWindowParams({width, height});
            }

            canvasRef.current.addEventListener('resize', onResizeEvt)

            // return () => {
            //     canvasRef.current.removeEventListener('resize', onResizeEvt)
            // }
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
    }, [canvasRef, windowParams.height, windowParams.width, mesh])


    useEffect(() => {
        // console.log(`WindowParams: ${windowParams.width}, WindowParams: ${windowParams.width}`)
    }, [windowParams])

    return <div className="w-screen h-screen grid grid-cols-[1fr_400px]">
        <canvas ref={canvasRef} className="w-full h-full"/>
        {/*<canvas className="w-full h-full bg-yellow-300"/>*/}
        <Controls setMesh={setMesh}/>
    </div>
}

export default App
