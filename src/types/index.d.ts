export {};

declare global {
  interface Window {
    API: {
      getFiles: (directoryName: string) => Promise<File[]>;
      downloadFile: (url: string, resume?: boolean) => Promise<void>;
      downloadPause: () => void;
      onDownloadProgress: (
        listener: (status: { progress: number; speed: number }) => void
      ) => void;
      removeListener: () => void;
    };
  }
}
