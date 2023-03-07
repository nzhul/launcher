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
});
