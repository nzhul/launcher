import HorizontalRule from "@mui/icons-material/HorizontalRule";
import Close from "@mui/icons-material/Close";
import CropSquare from "@mui/icons-material/CropSquare";
import FilterNone from "@mui/icons-material/FilterNone";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu } from "@mui/material";
import NavButton from "./NavButton";

const NavBar = () => {
  const navigate = useNavigate();
  const [maximized, setMaximized] = useState<boolean>(false);

  // #dd1313 - red color, can be used for [ X ] background color.
  const systemButtonStyles = {
    WebkitAppRegion: "no-drag",
    minWidth: "40px",
    width: "40px",
    height: "30px",
    borderRadius: 0,
    color: "white",
    opacity: 0.5,
    "&:hover": {
      opacity: 1,
      backgroundColor: "rgba(255,255,255,0.15)",
    },
    mt: "-39px",
  };

  return (
    <Box sx={{ maxHeight: "60px", flexGrow: 1, WebkitAppRegion: "drag" }}>
      <AppBar
        elevation={3}
        position="static"
        sx={{
          backgroundColor: "primary.main",
          height: "60px",
        }}
      >
        <Toolbar disableGutters style={{ paddingLeft: 12 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              ml: 3,
              mr: 0,
            }}
          >
            <Button
              variant="text"
              onClick={() => {
                navigate("/main_window");
              }}
              sx={{
                WebkitAppRegion: "no-drag",
                color: "white",
              }}
            >
              Ancient Warriors
            </Button>
          </Typography>
          <Box sx={{ flexGrow: 1, ml: 5 }}>
            <NavButton
              title="Learn"
              sx={{ borderLeft: "2px solid #3D3D3D" }}
              onClick={() => {
                navigate("/learn");
              }}
            />
            <NavButton
              title="Store"
              onClick={() => {
                navigate("/store");
              }}
            />
          </Box>
          <Button
            onClick={() => {
              window.API.minimizeApp();
            }}
            sx={systemButtonStyles}
          >
            <HorizontalRule sx={{ width: "20px" }} />
          </Button>
          <Button
            onClick={() => {
              if (maximized) {
                window.API.unmaximizeApp();
                setMaximized(false);
              } else {
                window.API.maximizeApp();
                setMaximized(true);
              }
            }}
            sx={systemButtonStyles}
          >
            {maximized ? (
              <FilterNone sx={{ width: "20px" }} />
            ) : (
              <CropSquare sx={{ width: "20px" }} />
            )}
          </Button>
          <Button
            onClick={() => {
              window.API.closeApp();
            }}
            sx={systemButtonStyles}
          >
            <Close sx={{ width: "20px" }} />
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
