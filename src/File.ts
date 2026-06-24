export async function openFile() {
    const pickerOpts = {
        types: [
            {
                description: "3D Files",
                accept: {
                    "model/obj": [".obj"],
                },
            },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
    };

    const [fileHandle] = await window.showOpenFilePicker(pickerOpts)
    const file = await fileHandle.getFile()
    return file
}