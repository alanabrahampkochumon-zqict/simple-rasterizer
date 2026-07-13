import {useState} from 'react'

function App() {
    return <h1>Hello world!</h1>
}
// const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
//
// if (canvas != null) {
//     const app = new Application(canvas);
//     app.setClearColor(new IVec3(125, 125, 255));
//     app.clearScreen();
//     app.run()
//
//     window.addEventListener("resize", () => {
//         app.resize();
//     });
//
//     // TODO: Move to a dedicated panel
//     canvas.addEventListener("click", async () => {
// // TODO: Fix Rendering artifacting on face
// // TEST CODEs
//         const file = await openFile()
//         const mesh = await parseObject(file)
//         const translation = new Vec3(0, 0, 7)
//         app.renderObject(mesh.vertices.map(vertex => Vec3.Add(new Vec3(0, 0, 0), vertex, translation)), mesh.indices)
//     })
// }

export default App
