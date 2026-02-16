// electron/preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("kernel", {
  run: (code) => ipcRenderer.invoke("py:run", { code }),
  reset: () => ipcRenderer.invoke("py:reset"),
});

contextBridge.exposeInMainWorld("app", {
  onSave: (callback) => {
    const handler = () => callback();
    ipcRenderer.on("app:save", handler);

    return () => {
      ipcRenderer.removeListener("app:save", handler);
    };
  },
});
