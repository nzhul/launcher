import React, { useEffect } from "react";

const SimpleList: React.FC<{ items: LazyListItem[] }> = ({ items }) => {
  const getFiles = async (directoryName: string) => {
    const files = await window.API.getFiles(directoryName);
    console.log(files);
  };

  useEffect(() => {
    getFiles("C:\\local-nugets");
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
