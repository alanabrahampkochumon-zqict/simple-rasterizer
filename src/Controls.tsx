import {type ChangeEvent, useEffect, useState} from "react";
import {parseObject} from "./parsers/ObjectParser.ts";
import type {MeshObject} from "./MeshObject.ts";
import {Vec3} from "@/math/Vec3.ts";
import SliderInput from "@/components/SliderInput.tsx";

export function Controls({setMesh, updateCamera}: {
    setMesh: (mesh: MeshObject) => void,
    updateCamera: (cameraTranslation: Vec3, cameraRotation: Vec3) => void
}) {

    const [translationX, setTranslationX] = useState(0);
    const [translationY, setTranslationY] = useState(0);
    const [translationZ, setTranslationZ] = useState(0);


    const [rotationX, setRotationX] = useState(0);
    const [rotationY, setRotationY] = useState(0);
    const [rotationZ, setRotationZ] = useState(0);

    async function handleFileChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        const mesh = await parseObject(file)
        setMesh(mesh)
    }

    useEffect(() => {
        updateCamera(new Vec3(translationX, translationY, translationZ), new Vec3(rotationX, rotationY, rotationZ));
    }, [updateCamera, translationX, translationY, translationZ, rotationX, rotationY, rotationZ])

    return <aside className="w-full h-full">
        <h2 className="text-xl p-4 font-bold text-purple-600">Controls(WIP)</h2>
        <input type="file" onChange={handleFileChange}/>
        <form className="flex flex-col gap-4 mt-4 pb-6 pl-4 pr-4 bg-slate-50">
            <h3 className="font-semibold text-slate-900 pt-4 text-lg pb-1">Camera Controls</h3>
            <h4 className=" text-slate-800 pt-1 text-base pb-1">Translation</h4>
            <SliderInput label="X" id={"translationX"} value={translationX} step={0.1} minValue={-10} maxValue={10}
                         onChange={setTranslationX}/>
            <SliderInput label="Y" id={"translationY"} value={translationY} step={0.1} minValue={-10} maxValue={10}
                         onChange={setTranslationY}/>
            <SliderInput label="Z" id={"translationZ"} value={translationZ} step={0.1} minValue={-10} maxValue={10}
                         onChange={setTranslationZ}/>
            <h4 className=" text-slate-800 pt-4 text-base pb-1">Rotation</h4>
            <SliderInput label="X" id={"rotationX"} value={rotationX} step={0.01} minValue={-6.18} maxValue={6.18} // 2PI
                         onChange={setRotationX}/>
            <SliderInput label="Y" id={"rotationY"} value={rotationY} step={0.01} minValue={-6.18} maxValue={6.18}
                         onChange={setRotationY}/>
            <SliderInput label="Z" id={"rotationZ"} value={rotationZ} step={0.01} minValue={-6.18} maxValue={6.18}
                         onChange={setRotationZ}/>
        </form>
    </aside>
}