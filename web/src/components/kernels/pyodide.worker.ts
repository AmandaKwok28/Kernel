import { loadPyodide } from "pyodide";

let pyodide: any = null;

self.onmessage = async (e) => {
    const { type, code } = e.data;

    if (!pyodide) {
        pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.2/full/",
        })
    }

    if (type === "run") {
        let stdout = "";
        let stderr = "";
        pyodide.setStdout({ write: (s: string) => (stdout += s) });
        pyodide.setStderr({ write: (s: string) => (stderr += s) });

        try {
            const result = await pyodide.runPythonAsync(code);
            self.postMessage({ stdout, stderr, result });
        } catch (err) {
            self.postMessage({ stdout, stderr, error: String(err) });
        }
    }
}