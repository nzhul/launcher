// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("API", {
  getFiles: async (directoryName: string) => {
    // Send a message to the main process to get the files
    ipcRenderer.send("get-files", directoryName);
    // Wait for a response from the main process
    return new Promise((resolve) => {
      ipcRenderer.once("get-files-reply", (event, files) => {
        resolve(files);
      });
    });
  },
  getState: async () => {
    return await ipcRenderer.invoke("get-state");
  },
  downloadFile: async (url: string, resume?: boolean) => {
    return await ipcRenderer.invoke("download-file", url, resume);
  },
  downloadPause: async () => {
    ipcRenderer.send("download-pause");
  },
  onDownloadProgress: (
    listener: (status: { progress: number; speed: number }) => void
  ) => {
    ipcRenderer.on("download-progress", (event, status) => {
      listener(status);
    });
  },
  onDownloadComplete: (listener: (downloadPath: string) => void) => {
    ipcRenderer.on("download-complete", (event, downloadPath) => {
      listener(downloadPath);
    });
  },
  removeListener: () => {
    ipcRenderer.removeAllListeners("download-progress");
    ipcRenderer.removeAllListeners("download-complete");
    ipcRenderer.removeAllListeners("extract-progress");
    ipcRenderer.removeAllListeners("uninstall-progress");
  },
  extractFile: async (path: string) => {
    return await ipcRenderer.invoke("extract-file", path);
  },
  onExtractProgress: (listener: (currentFile: string) => void) => {
    ipcRenderer.on("extract-progress", (event, currentFile) => {
      listener(currentFile);
    });
  },
  startGame: async () => {
    ipcRenderer.send("start-game");
  },
  onQuitGame: (listener: (code: number) => void) => {
    ipcRenderer.on("on-quit-game", (event, code) => {
      listener(code);
    });
  },

  // --- Tray icons
  closeApp: async () => {
    ipcRenderer.send("close-app");
  },
  maximizeApp: async () => {
    ipcRenderer.send("maximize-app");
  },
  unmaximizeApp: async () => {
    ipcRenderer.send("unmaximize-app");
  },
  minimizeApp: async () => {
    ipcRenderer.send("minimize-app");
  },

  // --- Game Settings Menu
  uninstallGame: async () => {
    return await ipcRenderer.invoke("uninstall-game");
  },
  onUninstallProgress: (listener: (currentFile: string) => void) => {
    ipcRenderer.on("uninstall-progress", (event, currentFile) => {
      listener(currentFile);
    });
  },
  revealInExplorer: async () => {
    ipcRenderer.send("reveal-in-explorer");
  },

  // --- Install Dialog
  selectDirectory: async () => {
    return await ipcRenderer.invoke("select-directory");
  },
  getDefaultDirectory: async () => {
    return await ipcRenderer.invoke("get-default-directory");
  },

  // --- Login
  setWindowSize: (width: string, height: string) => {
    ipcRenderer.send("set-window-size", width, height);
  },
});
