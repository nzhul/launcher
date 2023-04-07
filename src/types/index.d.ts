import { PauseInfo } from "../models/PauseInfo";
import { InstallInfo } from "../models/InstallInfo";
import { AppConfig } from "../models/infrastructure/AppConfig";

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

      // -- Tray icons
      closeApp: () => void;
      maximizeApp: () => void;
      unmaximizeApp: () => void;
      minimizeApp: () => void;

      // --- Game Settings Menu
      uninstallGame: () => Promise<void>;
      onUninstallProgress: (listener: (currentFile: string) => void) => void;
      revealInExplorer: () => void;

      // --- Install Dialog
      selectDirectory: () => Promise<string | undefined>;
      getDefaultDirectory: () => Promise<string | undefined>;

      // --- Login
      setWindowSize: (width: number, height: number) => void;
      getEnvVariables: () => Promise<AppConfig>;
    };
  }
}
