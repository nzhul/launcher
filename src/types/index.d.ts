import { DownloadState } from "../../src/models/downloadState";

export {};

declare global {
  interface Window {
    API: {
      getFiles: (directoryName: string) => Promise<File[]>;
      getState: () => Promise<DownloadState>;
      downloadFile: (url: string, resume?: boolean) => Promise<void>;
      downloadPause: () => void;
      onDownloadProgress: (listener: (status: DownloadState) => void) => void;
      onDownloadComplete: (listener: (downloadPath: string) => void) => void;
      removeListener: () => void;
    };
  }
}
