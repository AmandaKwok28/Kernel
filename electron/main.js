// electron/main.js
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const isDev = !app.isPackaged;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let py = null;
let pyBuffer = "";
const pending = new Map(); // id -> { resolve, reject }
let nextId = 1;

function startPython() {
    const scriptPath = path.join(__dirname, "kernel.py");

    // Use -u for unbuffered stdout so responses arrive immediately
    py = spawn("python", ["-u", scriptPath], {
        stdio: ["pipe", "pipe", "pipe"],
    });

    py.on("exit", (code) => {
        console.error("Python exited with code", code);
        py = null;
    });

    py.stderr.on("data", (data) => {
        // Kernel sends errors via stdout JSON, but also log raw stderr
        console.error("PY STDERR:", data.toString());
    });

    py.stdout.on("data", (chunk) => {
        pyBuffer += chunk.toString();

        // JSONL parsing: split on newlines
        let idx;
        while ((idx = pyBuffer.indexOf("\n")) !== -1) {
            const line = pyBuffer.slice(0, idx).trim();
            pyBuffer = pyBuffer.slice(idx + 1);

            if (!line) continue;

            let msg;
            try {
                msg = JSON.parse(line);
            } catch (e) {
                console.error("Bad JSON from python:", line);
                continue;
            }

            const id = msg.id;
            const waiter = pending.get(id);
            if (waiter) {
                pending.delete(id);
                waiter.resolve(msg);
            }
        }
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
        },
    });

    win.webContents.on("before-input-event", (event, input) => {
        const isSave =
        (input.control || input.meta) && input.key.toLowerCase() === "s";

        if (isSave) {
        event.preventDefault();
        win.webContents.send("app:save");
        }
    });

    // win.loadFile(path.join(__dirname, "../web/dist/index.html"));
    if (isDev) {
        // Vite dev server
        win.loadURL("http://localhost:5173");
        win.webContents.openDevTools();
    } else {
        // Production build
        win.loadFile(path.join(__dirname, "../web/dist/index.html"));
    }
 
}


app.whenReady().then(() => {
    startPython();
    createWindow();
});

// IPC handlers
ipcMain.handle("py:run", async (_evt, { code }) => {
    if (!py) throw new Error("Python not running");

    const id = nextId++;
    const payload = JSON.stringify({ id, op: "exec", code }) + "\n";

    const p = new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    py.stdin.write(payload);
    return await p;
});

ipcMain.handle("py:reset", async () => {
    if (!py) throw new Error("Python not running");

    const id = nextId++;
    const payload = JSON.stringify({ id, op: "reset" }) + "\n";

    const p = new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    py.stdin.write(payload);
    return await p;
});
