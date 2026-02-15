// electron/preload.js  (COMMONJS — IMPORTANT)
const { contextBridge, ipcRenderer } = require("electron");

console.log("PRELOAD LOADED");

contextBridge.exposeInMainWorld("kernel", {
  run: (code) => ipcRenderer.invoke("py:run", { code }),
  reset: () => ipcRenderer.invoke("py:reset"),
});

contextBridge.exposeInMainWorld("app", {
  onSave: (callback) => {
    ipcRenderer.on("app:save", callback);
    return () => {
      ipcRenderer.removeListener("app:save", callback);
    };
  },
});
