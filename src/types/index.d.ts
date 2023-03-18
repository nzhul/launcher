import { PauseInfo } from "../models/PauseInfo";
import { InstallInfo } from "..//models/InstallInfo";

export {};

declare global {
  interface Window {
    API: {
      getFiles: (directoryName: string) => Promise<File[]>;
      getState: () => Promise<{
        pauseInfo: PauseInfo;
        installInfo: InstallInfo;
      }>;
      downloadFile: (url: string, resume?: boolean) => Promise<void>;
      downloadPause: () => void;
      onDownloadProgress: (listener: (status: PauseInfo) => void) => void;
      onDownloadComplete: (listener: (downloadPath: string) => void) => void;
      removeListener: () => void;
    };
  }
}
