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
      extractFile: (path: string) => Promise<string>;
      onExtractProgress: (listener: (currentFile: string) => void) => void;
      startGame: () => void;
      onQuitGame: (listener: (code: number) => void) => void;
      uninstallGame: () => Promise<void>;
      onUninstallProgress: (listener: (currentFile: string) => void) => void;

      // -- Tray icons
      closeApp: () => void;
      maximizeApp: () => void;
      unmaximizeApp: () => void;
      minimizeApp: () => void;
      // ---
      revealInExplorer: () => void;
    };
  }
}
