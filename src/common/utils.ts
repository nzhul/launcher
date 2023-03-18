export function extractVersion(fileName: string): number {
  return parseInt(fileName.match(/-v(\d+)\.zip$/)[1]);
}
