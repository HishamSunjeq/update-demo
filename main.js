const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const { autoUpdater } = require("electron-updater");

let mainWindow;
let checking = false;

function sendStatus(message) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("updates:status", message);
  }
}

// For now, only check. We'll add downloading and installation next.
autoUpdater.autoDownload = false;

autoUpdater.on("checking-for-update", () => {
  sendStatus("Checking for updates...");
});

autoUpdater.on("update-available", (info) => {
  sendStatus(`Version ${info.version} is available.`);
});

autoUpdater.on("update-not-available", () => {
  sendStatus("You have the latest version.");
});

autoUpdater.on("error", (error) => {
  sendStatus(`Update check failed: ${error.message}`);
});

ipcMain.handle("app:version", () => app.getVersion());

ipcMain.handle("updates:check", async () => {
  if (!app.isPackaged) {
    sendStatus(
      "Update checks require the installed app. We'll test this after publishing a release.",
    );
    return;
  }

  if (checking) return;

  checking = true;

  try {
    await autoUpdater.checkForUpdates();
  } catch (error) {
    sendStatus(`Update check failed: ${error.message}`);
  } finally {
    checking = false;
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
