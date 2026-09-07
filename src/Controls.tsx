import {type ChangeEvent, useEffect, useState} from "react";
import {parseObject} from "./parsers/ObjectParser.ts";
import type {MeshObject} from "./MeshObject.ts";
import {Vec3} from "@/math/Vec3.ts";
import SliderInput from "@/components/SliderInput.tsx";
import {Slider} from "radix-ui";

export function Controls({setMesh, updateCameraCoordinates}: {
    setMesh: (mesh: MeshObject) => void,
    updateCameraCoordinates: (cameraCoordinates: Vec3) => void
}) {

    const [xValue, setXValue] = useState(0);
    const [yValue, setYValue] = useState(0);
    const [zValue, setZValue] = useState(0);

    async function handleFileChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        const mesh = await parseObject(file)
        setMesh(mesh)
    }

    useEffect(() => {
        updateCameraCoordinates(new Vec3(xValue, yValue, zValue));
    }, [updateCameraCoordinates, xValue, yValue, zValue])

    return <aside className="w-full h-full">
        <h2 className="text-xl p-4 font-bold text-purple-600">Controls(WIP)</h2>
        <input type="file" onChange={handleFileChange}/>
        <form className="flex flex-col gap-4 mt-4 pl-4 pr-4">
            <h3 className="font-semibold text-slate-900 pt-4 text-lg pb-1">Camera Controls</h3>
            <SliderInput label="X" id={"xValue"} value={xValue} step={0.1} minValue={-10} maxValue={10}
                         onChange={setXValue}/>
            <SliderInput label="Y" id={"yValue"} value={yValue} step={0.1} minValue={-10} maxValue={10}
                         onChange={setYValue}/>
            <SliderInput label="Z" id={"zValue"} value={zValue} step={0.1} minValue={-10} maxValue={10}
                         onChange={setZValue}/>
        </form>
    </aside>
}