import type ModelInstance from "@/scene/ModelInstance.ts";

export default class Scene {
    instances: ModelInstance[]

    constructor(instances: ModelInstance[] = []) {
        this.instances = instances;
    }

}