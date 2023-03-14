export {};

declare global {
  interface Window {
    API: {
      getFiles: (directoryName: string) => Promise<File[]>;
      getState: () => Promise<{
        downloadedBytes: number;
        progress: number;
        totalBytes: number;
      }>;
      downloadFile: (url: string, resume?: boolean) => Promise<void>;
      downloadPause: () => void;
      onDownloadProgress: (
        listener: (status: { progress: number; speed: number }) => void
      ) => void;
      onDownloadComplete: (listener: (downloadPath: string) => void) => void;
      removeListener: () => void;
    };
  }
}
