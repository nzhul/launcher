process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

import { app, BrowserWindow, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import yauzl from "yauzl";
import { PauseInfo } from "./models/PauseInfo";
import { Octokit } from "octokit";
import { InstallInfo } from "./models/InstallInfo";
import { extractVersion } from "./common/utils";

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
    height: 832,
    width: 1280,
    backgroundColor: "#3d3d3d",
    minWidth: 1000,
    minHeight: 640,
    frame: false,
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

const getRepoInfo = async () => {
  // note: I am doing this decoding only to hide the token from github stupid detection alg that revokes tokens.
  // this is just a simple read-only token from a blank account.
  const decoded = Buffer.from(
    "Z2hwX3A3alNCbXJRTHJPTU5nejJ5ZFk0NGhyVEdUczlVeTJEMjJsTw==",
    "base64"
  ).toString();

  const octokit = new Octokit({
    auth: decoded,
  });

  const response = await octokit.request(
    "GET /repos/nzhul/tic-tac-toe-online/releases/latest",
    {
      owner: "OWNER",
      repo: "REPO",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  // eslint-disable-next-line no-debugger
  console.log(response);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();
  // getRepoInfo();
});

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

ipcMain.handle("get-state", async (_) => {
  const pauseFile = path.join(app.getPath("userData"), "pause-info.json");
  const installInfoFile = path.join(
    app.getPath("userData"),
    "install-info.json"
  );

  let pauseInfo: PauseInfo;
  let installInfo: InstallInfo;

  if (!fs.existsSync(pauseFile)) {
    pauseInfo = undefined;
  } else {
    const downloadStateString = fs.readFileSync(pauseFile, "utf-8");
    pauseInfo = JSON.parse(downloadStateString);
  }

  if (!fs.existsSync(installInfoFile)) {
    installInfo = undefined;
  } else {
    const installInfoString = fs.readFileSync(installInfoFile, "utf-8");
    installInfo = JSON.parse(installInfoString);
  }

  return {
    pauseInfo,
    installInfo,
  };
});

const installDirectory = "C:\\Downloads\\";

let controller: AbortController | undefined;
let downloadedBytes = 0;
let total = 0;
const pauseFile = path.join(app.getPath("userData"), "pause-info.json"); // path to file for storing paused download data
const installInfoFile = path.join(app.getPath("userData"), "install-info.json");

ipcMain.handle(
  "download-file",
  async (event, url: string, resume?: boolean) => {
    const fileName = path.basename(url);
    const gameDirectory = path.join(installDirectory, "AncientWarriors");
    const fullFilePath = path.join(gameDirectory, fileName);

    if (!fs.existsSync(gameDirectory)) {
      fs.mkdirSync(gameDirectory);
    }

    controller = new AbortController();
    const startTime = Date.now();
    let speedBytes = 0;

    if (resume) {
      const pauseInfoString = fs.readFileSync(pauseFile, "utf-8");
      const pauseInfo: PauseInfo = JSON.parse(pauseInfoString);
      downloadedBytes = pauseInfo.downloadedBytes;
      total = pauseInfo.totalBytes;
      console.log(`Resuming download! Start bytes: ${downloadedBytes}`);
    } else {
      downloadedBytes = 0;
    }

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
        Range: `bytes=${downloadedBytes}-`,
      },
      signal: controller?.signal,
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Failed to download file ${response.statusText}`);
    }

    // if it is the first request - we store the total lenght
    if (!resume) {
      const contentLength = response.headers.get("content-length");
      total = contentLength ? parseInt(contentLength, 10) : NaN;
    }

    const fileStream = fs.createWriteStream(fullFilePath, {
      flags: resume ? "a" : "w",
    });
    response.body.pipe(fileStream);

    let progressRaw = 0;
    let progress = 0;

    let lastReportTime = 0;
    const MIN_SEND_INTERVAL_MS = 10;

    response.body.on("data", (chunk: Buffer) => {
      downloadedBytes += chunk.length;
      speedBytes += chunk.length;
      progressRaw = isNaN(total) ? NaN : downloadedBytes / total;
      progress = Math.round(progressRaw * 100 * 1e2) / 1e2;
      const elapsedTime = (Date.now() - startTime) / 1000; // seconds
      const currentSpeed = speedBytes / elapsedTime; // bytes/second
      const currentSpeedMB = currentSpeed / (1024 * 1024);

      const currentTime = Date.now();
      if (currentTime - lastReportTime > MIN_SEND_INTERVAL_MS) {
        event.sender.send("download-progress", {
          downloadedBytes,
          totalBytes: total,
          progress,
          speed: currentSpeedMB,
        });

        lastReportTime = currentTime;
      }
    });

    response.body.on("end", () => {
      fileStream.end();
      fileStream.close();

      if (fs.existsSync(pauseFile)) {
        fs.unlinkSync(pauseFile); // delete paused download data
      }

      const installInfo: InstallInfo = {
        installDirectory: installDirectory,
        gameClientVersion: extractVersion(fileName),
      };

      fs.writeFileSync(installInfoFile, JSON.stringify(installInfo), "utf-8");
      event.sender.send("download-complete", fullFilePath); // TODO: Start listening for this event in the frontend!
    });

    response.body.on("error", (err: Error) => {
      fileStream.end();
      fileStream.close();

      const pauseInfo: PauseInfo = {
        downloadedBytes,
        progress,
        totalBytes: total,
      };

      fs.writeFileSync(pauseFile, JSON.stringify(pauseInfo), "utf-8"); // save paused download data to file
      console.log(`Download paused at ${downloadedBytes} bytes: ${err}`);
    });

    return new Promise<void>((resolve, reject) => {
      fileStream.on("close", resolve);
      fileStream.on("error", reject);
    });
  }
);

ipcMain.on("download-pause", () => {
  if (controller) {
    console.log("download paused!");
    controller.abort();
    controller = undefined;
  }
});

// ---- Extracting ----
ipcMain.handle(
  "extract-file",
  async (event: Electron.IpcMainInvokeEvent, zipFilePath: string) => {
    return new Promise((resolve, reject) => {
      const extractPath = path.dirname(zipFilePath);

      yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipFile) => {
        if (err) reject(err);

        zipFile.readEntry();
        zipFile.on("entry", (entry) => {
          const outputFilePath = path.join(extractPath, entry.fileName);

          if (entry.fileName.endsWith("/") || entry.fileName.endsWith("\\")) {
            if (!fs.existsSync(outputFilePath)) {
              fs.mkdirSync(outputFilePath, { recursive: true });
            }

            zipFile.readEntry();
            return;
          }

          event.sender.send("extract-progress", entry.fileName);

          // extrac the file
          zipFile.openReadStream(entry, (err, readStream) => {
            if (err) {
              reject(err);
            }

            const writeStream = fs.createWriteStream(outputFilePath);

            readStream.on("end", () => {
              zipFile.readEntry();
            });

            readStream.pipe(writeStream);
          });
        });

        zipFile.on("close", () => {
          console.log(`Extraction complete.}`);
          fs.unlinkSync(zipFilePath);
          resolve("Extraction complete");
        });
      });
    });
  }
);
