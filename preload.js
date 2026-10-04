const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("desktop", {
  getVersion: () => ipcRenderer.invoke("app:version"),
  checkForUpdates: () => ipcRenderer.invoke("updates:check"),

  onUpdateStatus: (callback) => {
    ipcRenderer.on("updates:status", (_event, message) => {
      callback(message);
    });
  },
});
