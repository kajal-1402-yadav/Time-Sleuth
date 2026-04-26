const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;
let currentUserId = null;

// ✅ receive user from dashboard
ipcMain.on("set-user", (event, userId) => {
  console.log("User stored in Electron:", userId);
  currentUserId = userId;
});

// ✅ always return latest user
ipcMain.handle("get-user", async () => {
  return currentUserId;
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(createWindow);