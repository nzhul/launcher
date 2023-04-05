import { ThemeProvider } from "@mui/material";
import Container from "@mui/material/Container";
import * as ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "./renderer/context/AuthProvider";
import HomePage from "./renderer/features/HomePage";
import LearnPage from "./renderer/features/LearnPage";
import LoginPage from "./renderer/features/LoginPage";
import StorePage from "./renderer/features/StorePage";
import NavBar from "./renderer/layout/Navbar";
import { initializeTheme } from "./renderer/layout/Theme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const theme = initializeTheme();

root.render(
  <HashRouter>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <NavBar />

        <Container
          data-testid="page-container"
          maxWidth={false}
          sx={{ marginTop: 5 }}
        >
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/main_window" element={<HomePage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/store" element={<StorePage />} />
          </Routes>
        </Container>
      </AuthProvider>
    </ThemeProvider>
  </HashRouter>
);

// Clears the annoying "Download the React DevTools for a better development experience" text
// console.clear();
