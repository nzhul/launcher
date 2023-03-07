export {}

declare global {
  interface Window {
    API: {
      getFiles: (directoryName: string) => Promise<File[]>
    }
  }
}