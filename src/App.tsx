import Container from "@mui/material/Container";
import React from "react";
import * as ReactDOM from "react-dom/client";
import SimpleList from "./renderer/common/SimpleList";
import DownloadBtn from "./renderer/DownloadBtn";
import NavBar from "./renderer/layout/Navbar";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <>
    <NavBar />

    <Container data-testid="page-container" sx={{ marginTop: 5 }}>
      <DownloadBtn />
      {/* <SimpleList
        items={[
          { id: 1, name: "file1" },
          { id: 2, name: "file2" },
        ]}
      /> */}
    </Container>
  </>
);

// Clears the annoying "Download the React DevTools for a better development experience" text
// console.clear();
