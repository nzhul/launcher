export {};

declare global {
  interface Window {
    API: {
      getFiles: (directoryName: string) => Promise<File[]>;
      downloadFile: (url: string) => Promise<void>;
      onDownloadProgress: (listener: (progress: number) => void) => void;
      removeListener: () => void;
    };
  }
}
