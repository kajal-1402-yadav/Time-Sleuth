const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  setUser: (userId) => ipcRenderer.send("set-user", userId),
  getUser: () => ipcRenderer.invoke("get-user"),
});