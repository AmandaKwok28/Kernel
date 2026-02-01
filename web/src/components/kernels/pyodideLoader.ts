import { loadPyodide } from "pyodide";

export const createPyodide = async() => {
    return await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.2/full/",
    });
};