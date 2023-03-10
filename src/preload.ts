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
  removeListener: () => {
    ipcRenderer.removeAllListeners("download-progress");
  },
});
