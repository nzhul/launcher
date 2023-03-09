process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

import { app, BrowserWindow, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 1500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// ==============================================

ipcMain.on("get-files", (event, directoryName) => {
  // Get the list of files in the directory
  const files = fs.readdirSync(directoryName);
  // Map each file name to an object with name, path and size properties
  const fileObjects = files.map((file) => ({
    name: file,
    path: path.join(directoryName, file),
    size: fs.statSync(path.join(directoryName, file)).size,
  }));
  // Send back the file objects to the renderer process
  event.reply("get-files-reply", fileObjects);
});

ipcMain.handle("download-file", async (event, url: string) => {
  // eslint-disable-next-line no-debugger
  console.log("Download start");
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download file ${response.statusText}`);
  }

  const contentLength = response.headers.get("content-length");
  const total = contentLength ? parseInt(contentLength, 10) : NaN;
  let loaded = 0;

  const fileStream = fs.createWriteStream("C:\\Downloads\\video.mp4");
  response.body.pipe(fileStream);

  response.body.on("data", (chunk: Buffer) => {
    loaded += chunk.length;
    const progress = isNaN(total) ? NaN : loaded / total;
    event.sender.send("download-progress", progress);
  });

  return new Promise<void>((resolve, reject) => {
    fileStream.on("close", resolve);
    fileStream.on("error", reject);
  });
});
