export type KernelStatus = "idle" | "running" | "error";

export type ExecutionResult = {
    stdout: string;
    stderr: string;
    result?: unknown;
    error?: string;
}

export type Kernel = {
    pyodide: any;
    status: KernelStatus;
    lastUsed: number;
}