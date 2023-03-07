import React from "react";
import * as ReactDOM from "react-dom/client";
import SimpleList from "./renderer/common/SimpleList";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <div>
    <h1>Directory files</h1>
    <SimpleList
      items={[
        { id: 1, name: "file1" },
        { id: 2, name: "file2" },
      ]}
    />
  </div>
);

// Clears the annoying "Download the React DevTools for a better development experience" text
// console.clear();
