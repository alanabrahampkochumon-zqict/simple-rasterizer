import type {ChangeEvent} from "react";
import {parseObject} from "./parsers/ObjectParser.ts";
import type {MeshObject} from "./MeshObject.ts";

export function Controls({setMesh}: { setMesh: (mesh: MeshObject) => void }) {

    async function handleFileChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        const mesh = await parseObject(file)
        setMesh(mesh)
    }

    return <aside className="w-full h-full">
        <h2 className="text-xl p-4 font-bold text-purple-600">Controls(WIP)</h2>
        <input type="file" onChange={handleFileChange}/>
    </aside>
}