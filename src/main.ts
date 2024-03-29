process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

import {
  app,
  autoUpdater,
  BrowserWindow,
  dialog,
  ipcMain,
  screen,
  session,
  shell,
} from 'electron';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import yauzl from 'yauzl';
import { spawn, execFile } from 'child_process';
import { PauseInfo } from './models/PauseInfo';
import { InstallInfo } from './models/InstallInfo';
import { extractVersion } from './common/utils';
import { AppConfig } from './models/infrastructure/AppConfig';
import {
  clearCredentials,
  getCredentials,
  storeCredentials,
} from './main/store';
import { LoginRequest } from './models/users/loginRequest';

// import * as dotenv from "dotenv";
// dotenv.config({ path: ".env.development" });

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const SPLASH_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let mainWindow: BrowserWindow;
let splashWindow: BrowserWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): BrowserWindow => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 508,
    width: 365,
    resizable: true,
    backgroundColor: '#313338',
    frame: false,
    show: app.isPackaged ? false : true, // TODO: use `false` when you have splash  screen enabled.
    webPreferences: {
      devTools: process.env.NODE_ENV === 'development' ? true : false,
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (process.env.NODE_ENV === 'development') {
    // mainWindow.webContents.openDevTools();
  }

  session.defaultSession.protocol.registerFileProtocol(
    'static',
    (request, callback) => {
      const fileUrl = request.url.replace('static://', '');
      const filePath = path.join(
        app.getAppPath(),
        '.webpack/renderer',
        fileUrl,
      );
      callback(filePath);
    },
  );

  return mainWindow;
};

const createSplashWindow = (): BrowserWindow => {
  const win = new BrowserWindow({
    height: 508,
    width: 365,
    backgroundColor: '#313338',
    frame: false,
  });

  // win.loadFile("./src/splash.html");
  win.loadURL(SPLASH_WEBPACK_ENTRY);

  return win;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

let configFilePath: string;

if (app.isPackaged) {
  configFilePath = path.join(process.resourcesPath, 'app.prod.json');
} else {
  configFilePath = path.join(__dirname, 'assets/app.json');
}

const configString = fs.readFileSync(configFilePath, 'utf-8');
const appConfig: AppConfig = JSON.parse(configString);

app.on('ready', () => {
  if (app.isPackaged) {
    const server = 'https://hazel-nzhul.vercel.app';
    const url = `${server}/update/${process.platform}/${app.getVersion()}`;
    autoUpdater.setFeedURL({ url });
    autoUpdater.checkForUpdates();

    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 60000);
  }

  mainWindow = createWindow();

  // TODO: Uncomment for splash
  if (app.isPackaged) {
    splashWindow = createSplashWindow();
    mainWindow.once('ready-to-show', () => {
      setTimeout(() => {
        splashWindow.destroy();
        setTimeout(() => {
          // this duplicated settimeout fixes strange bug when app loads the main windows is not focused.
          mainWindow.show();
          mainWindow.focus();
        }, 200);
      }, 1000);
    });
  }
});

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail:
      'A new version has been downloaded. Restart the application to apply the updates.',
  };

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall();
  });
});

autoUpdater.on('error', (message) => {
  console.error('There was a problem updating the application');
  console.error(message);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// ==============================================

ipcMain.on('get-files', (event, directoryName) => {
  // Get the list of files in the directory
  const files = fs.readdirSync(directoryName);
  // Map each file name to an object with name, path and size properties
  const fileObjects = files.map((file) => ({
    name: file,
    path: path.join(directoryName, file),
    size: fs.statSync(path.join(directoryName, file)).size,
  }));
  // Send back the file objects to the renderer process
  event.reply('get-files-reply', fileObjects);
});

ipcMain.handle('get-state', async (_) => {
  const pauseFile = path.join(app.getPath('userData'), 'pause-info.json');
  const installInfoFile = path.join(
    app.getPath('userData'),
    'install-info.json',
  );

  let pauseInfo: PauseInfo;
  let installInfo: InstallInfo;

  if (!fs.existsSync(pauseFile)) {
    pauseInfo = undefined;
  } else {
    const downloadStateString = fs.readFileSync(pauseFile, 'utf-8');
    pauseInfo = JSON.parse(downloadStateString);
  }

  if (!fs.existsSync(installInfoFile)) {
    installInfo = undefined;
  } else {
    const installInfoString = fs.readFileSync(installInfoFile, 'utf-8');
    installInfo = JSON.parse(installInfoString);
  }

  return {
    pauseInfo,
    installInfo,
  };
});

// const installDirectory = "C:\\Downloads\\";

let controller: AbortController | undefined;
let downloadedBytes = 0;
let total = 0;
const pauseFile = path.join(app.getPath('userData'), 'pause-info.json'); // path to file for storing paused download data
const installInfoFilePath = path.join(
  app.getPath('userData'),
  'install-info.json',
);
const gameDirectoryName = 'AncientWarriors';
const gameFileName = 'StandaloneWindows64.exe';

ipcMain.handle(
  'download-file',
  async (event, url: string, resume?: boolean) => {
    const installInfo = loadInstallInfo() || {
      installDirectory: getDefaultDirectory(),
    };
    const fileName = path.basename(url);
    const gameDirectory = path.join(
      installInfo.installDirectory,
      gameDirectoryName,
    );
    const fullFilePath = path.join(gameDirectory, fileName);

    if (!fs.existsSync(gameDirectory)) {
      fs.mkdirSync(gameDirectory);
    }

    controller = new AbortController();
    const startTime = Date.now();
    let speedBytes = 0;

    if (resume) {
      const pauseInfoString = fs.readFileSync(pauseFile, 'utf-8');
      const pauseInfo: PauseInfo = JSON.parse(pauseInfoString);
      downloadedBytes = pauseInfo.downloadedBytes;
      total = pauseInfo.totalBytes;
      console.log(`Resuming download! Start bytes: ${downloadedBytes}`);
    } else {
      downloadedBytes = 0;
    }

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/octet-stream',
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
      const contentLength = response.headers.get('content-length');
      total = contentLength ? parseInt(contentLength, 10) : NaN;
    }

    const fileStream = fs.createWriteStream(fullFilePath, {
      flags: resume ? 'a' : 'w',
    });
    response.body.pipe(fileStream);

    let progressRaw = 0;
    let progress = 0;

    let lastReportTime = 0;
    const MIN_SEND_INTERVAL_MS = 10;

    response.body.on('data', (chunk: Buffer) => {
      downloadedBytes += chunk.length;
      speedBytes += chunk.length;
      progressRaw = isNaN(total) ? NaN : downloadedBytes / total;
      progress = Math.round(progressRaw * 100 * 1e2) / 1e2;
      const elapsedTime = (Date.now() - startTime) / 1000; // seconds
      const currentSpeed = speedBytes / elapsedTime; // bytes/second
      const currentSpeedMB = currentSpeed / (1024 * 1024);

      const currentTime = Date.now();
      if (currentTime - lastReportTime > MIN_SEND_INTERVAL_MS) {
        event.sender.send('download-progress', {
          downloadedBytes,
          totalBytes: total,
          progress,
          speed: currentSpeedMB,
        });

        lastReportTime = currentTime;
      }
    });

    response.body.on('end', () => {
      fileStream.end();
      fileStream.close();

      if (fs.existsSync(pauseFile)) {
        fs.unlinkSync(pauseFile); // delete paused download data
      }

      const installInfoNew: InstallInfo = {
        installDirectory: installInfo.installDirectory,
        gameClientVersion: extractVersion(fileName),
      };

      fs.writeFileSync(
        installInfoFilePath,
        JSON.stringify(installInfoNew),
        'utf-8',
      );
      event.sender.send('download-complete', fullFilePath); // TODO: Start listening for this event in the frontend!
    });

    response.body.on('error', (err: Error) => {
      fileStream.end();
      fileStream.close();

      const pauseInfo: PauseInfo = {
        downloadedBytes,
        progress,
        totalBytes: total,
      };

      fs.writeFileSync(pauseFile, JSON.stringify(pauseInfo), 'utf-8'); // save paused download data to file
      console.log(`Download paused at ${downloadedBytes} bytes: ${err}`);
    });

    return new Promise<void>((resolve, reject) => {
      fileStream.on('close', resolve);
      fileStream.on('error', reject);
    });
  },
);

ipcMain.on('download-pause', () => {
  if (controller) {
    console.log('download paused!');
    controller.abort();
    controller = undefined;
  }
});

// ---- Extracting ----
ipcMain.handle(
  'extract-file',
  async (event: Electron.IpcMainInvokeEvent, zipFilePath: string) => {
    return new Promise((resolve, reject) => {
      const extractPath = path.dirname(zipFilePath);

      yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipFile) => {
        if (err) reject(err);

        zipFile.readEntry();
        zipFile.on('entry', (entry) => {
          const outputFilePath = path.join(extractPath, entry.fileName);

          if (entry.fileName.endsWith('/') || entry.fileName.endsWith('\\')) {
            if (!fs.existsSync(outputFilePath)) {
              fs.mkdirSync(outputFilePath, { recursive: true });
            }

            zipFile.readEntry();
            return;
          }

          const file = path.basename(entry.fileName);
          event.sender.send('extract-progress', file);

          // extrac the file
          zipFile.openReadStream(entry, (err, readStream) => {
            if (err) {
              reject(err);
            }

            const writeStream = fs.createWriteStream(outputFilePath);

            readStream.on('end', () => {
              zipFile.readEntry();
            });

            readStream.pipe(writeStream);
          });
        });

        zipFile.on('close', () => {
          console.log(`Extraction complete.}`);
          fs.unlinkSync(zipFilePath);
          resolve('Extraction complete');
        });
      });
    });
  },
);

// --- Game Session ---
ipcMain.on('start-game', (event) => {
  const installInfo = loadInstallInfo();
  const exePath = path.join(
    installInfo.installDirectory,
    gameDirectoryName,
    gameFileName,
  );

  // TODO: Use execFile if you face any issues with spawn
  // execFile should support also tacking.
  // const procc = execFile(exePath);
  // Mr_Chriwo:
  // By the way. i highly recommend you to use the execFile method instead of the spawn method.
  // spawn method creates an instance of a console which just "streams" the child process whereas execFile directly runs the application.
  // spawn method can leads to weird issues when trying to execute the game file. At least there were a few issues in my case which were fixed by using execFile

  const process = spawn(exePath);

  process.on('exit', (code) => {
    console.log(`Child process exited with code ${code}`);
    event.sender.send('on-quit-game', code);
  });

  process.on('error', (err) => {
    console.error('Failed to start child process: ', err);
  });
});

// --- Uninstall ---
ipcMain.handle('uninstall-game', async (event: Electron.IpcMainInvokeEvent) => {
  return new Promise((resolve, reject) => {
    const installInfo = loadInstallInfo();
    try {
      const gamePath = path.join(
        installInfo.installDirectory,
        gameDirectoryName,
      );

      deleteFolderRecursive(gamePath, event);
      deleteInstallState();
      resolve('deleted');
    } catch (error) {
      reject(error);
    }
  });
});

const deleteFolderRecursive = function (
  directoryPath: string,
  event: Electron.IpcMainInvokeEvent,
) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file, index) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath, event);
      } else {
        // delete file
        const fileName = path.basename(curPath);
        event.sender.send('uninstall-progress', fileName);
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
  }
};

const deleteInstallState = () => {
  const pauseFile = path.join(app.getPath('userData'), 'pause-info.json');
  const installFile = path.join(app.getPath('userData'), 'install-info.json');

  if (fs.existsSync(pauseFile)) {
    fs.unlinkSync(pauseFile);
  }

  if (fs.existsSync(installFile)) {
    fs.unlinkSync(installFile);
  }
};

// ---- Tray icons
ipcMain.on('close-app', () => {
  const windows = BrowserWindow.getAllWindows();
  windows.forEach((window) => {
    window.close();
  });
});

ipcMain.on('maximize-app', () => {
  mainWindow.maximize();
});

ipcMain.on('unmaximize-app', () => {
  mainWindow.unmaximize();
});

ipcMain.on('minimize-app', () => {
  mainWindow.minimize();
});

ipcMain.on('reveal-in-explorer', () => {
  const installInfo = loadInstallInfo();
  const exePath = path.join(
    installInfo.installDirectory,
    gameDirectoryName,
    gameFileName,
  );
  shell.showItemInFolder(exePath);
});

ipcMain.handle('select-directory', async () => {
  return new Promise((resolve, reject) => {
    const result = dialog.showOpenDialogSync({
      properties: ['openDirectory'],
    });

    if (result && result.length > 0) {
      const installInfo: InstallInfo = {
        installDirectory: result[0],
        gameClientVersion: 0,
      };

      fs.writeFileSync(
        installInfoFilePath,
        JSON.stringify(installInfo),
        'utf-8',
      );
    }

    return resolve(result);
  });
});

ipcMain.handle('get-default-directory', () => {
  return getDefaultDirectory();
});

// TODO: Test this!
ipcMain.on(
  'set-window-size',
  (
    event,
    width: number,
    height: number,
    resizable: boolean,
    minWidth: number,
    minHeight: number,
  ) => {
    mainWindow.unmaximize();
    mainWindow.setMinimumSize(minWidth, minHeight);
    mainWindow.setSize(width, height, true);
    mainWindow.setResizable(resizable);

    const winBounds = mainWindow.getBounds();
    const nearestDisplay = screen.getDisplayNearestPoint({
      x: winBounds.x,
      y: winBounds.y,
    });

    const workAreaSize = nearestDisplay.workAreaSize;
    const workArea = nearestDisplay.workArea;
    const x = Math.floor((workAreaSize.width - mainWindow.getSize()[0]) / 2);
    const y = Math.floor((workAreaSize.height - mainWindow.getSize()[1]) / 2);

    mainWindow.setPosition(workArea.x + x, workArea.y + y);
    // mainWindow.setAlwaysOnTop(true);
    // mainWindow.setAlwaysOnTop(false);
    // app.focus();
  },
);

ipcMain.handle('get-env-variables', async (): Promise<AppConfig> => {
  return new Promise((resolve, reject) => {
    resolve(appConfig);
  });
});

ipcMain.on('store-credentials', (event, credentials: LoginRequest) => {
  storeCredentials(credentials);
});

ipcMain.handle('get-credentials', async (): Promise<LoginRequest> => {
  return new Promise((resolve, reject) => {
    const credentials = getCredentials();

    if (credentials) {
      resolve(credentials);
    } else {
      resolve(undefined);
    }
  });
});

ipcMain.on('clear-credentials', (event) => {
  clearCredentials();
});

// --- main.ts common

const loadInstallInfo = (): InstallInfo | undefined => {
  let installInfo: InstallInfo | undefined;

  if (!fs.existsSync(installInfoFilePath)) {
    installInfo = undefined;
  } else {
    const installInfoString = fs.readFileSync(installInfoFilePath, 'utf-8');
    installInfo = JSON.parse(installInfoString);
  }

  return installInfo;
};

const getDefaultDirectory = () => {
  return app.getPath('home');
};
