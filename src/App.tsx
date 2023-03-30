import { ThemeProvider } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import * as ReactDOM from "react-dom/client";
import ChatList from "./renderer/chat/ChatList";
import DownloadBtn from "./renderer/features/download/DownloadBtn";
import NavBar from "./renderer/layout/Navbar";
import { initializeTheme } from "./renderer/layout/Theme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const theme = initializeTheme();

root.render(
  <ThemeProvider theme={theme}>
    <NavBar />

    <Container
      data-testid="page-container"
      maxWidth={false}
      sx={{ marginTop: 5 }}
    >
      <Grid columnGap={2} container>
        <Grid item xs>
          Left
        </Grid>
        <Grid item style={{ width: "300px" }}>
          <ChatList />
          <DownloadBtn />
        </Grid>
      </Grid>

      {/* <SimpleList
        items={[
          { id: 1, name: "file1" },
          { id: 2, name: "file2" },
        ]}
      /> */}
    </Container>
  </ThemeProvider>
);

// Clears the annoying "Download the React DevTools for a better development experience" text
// console.clear();
