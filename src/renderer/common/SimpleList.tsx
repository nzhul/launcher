import { ipcRenderer } from "electron";
import { useEffect } from "react";
import fs from "fs-extra";

const SimpleList: React.FC<{ items: LazyListItem[] }> = ({ items }) => {
  useEffect(() => {
    async function ffiles(dir: string) {
      const files = await fs.readdir(dir);
      console.log(files);
    }

    ffiles("C:\\local-nugets");

    // async function fetchFiles() {
    //   ipcRenderer.send("get-files", "C:\\local-nugets");
    // }

    // ipcRenderer.on("files", (event, fetchedFiles) => {
    //   console.log(fetchedFiles);
    // });

    // fetchFiles();
  });

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

export default SimpleList;

export interface LazyListItem {
  id: number;
  name: string;
}
