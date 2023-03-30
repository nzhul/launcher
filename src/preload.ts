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
  },
  extractFile: async (path: string) => {
    return await ipcRenderer.invoke("extract-file", path);
  },
  onExtractProgress: (listener: (currentFile: string) => void) => {
    ipcRenderer.on("extract-progress", (event, currentFile) => {
      listener(currentFile);
    });
  },
});
