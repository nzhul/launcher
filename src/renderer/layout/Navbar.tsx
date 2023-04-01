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

const NavBar = () => {
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
        }}
      >
        <Toolbar disableGutters style={{ paddingLeft: 12 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              "@media (max-width: 599px)": {
                mt: "0px",
              },
            }}
          >
            Ancient Warriors
          </Typography>
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
