import type { ExecutionResult, Kernel } from "./types";
import { $kernels, addKernel, deleteKernel } from "@/lib/kernels";
import { createPyodide } from "./pyodideLoader";

export const getKernel = async(fileId: number): Promise<Kernel> => {
    
    const kernels = $kernels.get();
    if (kernels[fileId]) return kernels[fileId];         // if a kernel has already been made, don't recreate it

    const pyodide = await createPyodide();

    const kernel: Kernel = {
        pyodide,
        status: "idle",
        lastUsed: Date.now(),
    }

    addKernel(fileId, kernel);
    return kernel;
}

export const runCell = async(fileId: number, code: string): Promise<ExecutionResult> => {

    const kernel = await getKernel(fileId);

    if (kernel.status === "running") {
        return {
            stdout: "",
            stderr: "",
            error: "Kernel is busy. Please wait until all processes have finished"
        }
    }

    kernel.status = "running";
    kernel.lastUsed = Date.now();

    let stdout = "";
    let stderr = "";

    const decoder = new TextDecoder("utf-8");

    kernel.pyodide.setStdout({
    write: (s: string | Uint8Array) => {
        if (typeof s === "string") {
            stdout += s;
            return s.length;
        } else {
            const text = decoder.decode(s);
            stdout += text;
            return s.length;
        }
    },
    });

    kernel.pyodide.setStderr({
        write: (s: string | Uint8Array) => {
                if (typeof s === "string") {
                stderr += s;
                return s.length;
            } else {
                const text = decoder.decode(s);
                stderr += text;
                return s.length;
            }
        },
    });



    try {
        const result = await kernel.pyodide.runPythonAsync(code);
        kernel.status = "idle";

        const res: ExecutionResult = {stdout, stderr, result};
        console.log(res);
        return res;
    } catch (err) {
        kernel.status = "error";
        return { stdout, stderr, error: String(err) };
    }

};


export const restartKernel = (fileId: number) => {

    deleteKernel(fileId);

}