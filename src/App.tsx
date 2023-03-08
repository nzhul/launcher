import { Button, Container } from "@mui/material";
import React from "react";
import * as ReactDOM from "react-dom/client";
import SimpleList from "./renderer/common/SimpleList";
import NavBar from "./renderer/layout/Navbar";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <>
    <NavBar />

    <Container data-testid="page-container" sx={{ marginTop: 5 }}>
      <Button variant="contained">
        <span>Contained</span>
      </Button>

      <SimpleList
      items={[
        { id: 1, name: "file1" },
        { id: 2, name: "file2" },
      ]}
    />
    </Container>
  </>
);

// Clears the annoying "Download the React DevTools for a better development experience" text
// console.clear();
