import { createTheme } from "@mui/material";

// colors
const PRIMARY_COLOR = "#3BA55C";
const PRIMARY_TEXT_COLOR = "#FFFFFF";
const SECONDARY_COLOR = "#FFE700";
const INFO_COLOR = "#90A0AC";
const ERROR_COLOR = "#ff285a";

const initializeTheme = () => {
  return createTheme({
    components: {
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: "#3A3A3A",
            backgroundImage: "none",
            border: "1px solid #5E5E5E",
            padding: "0px 8px 0 8px",
            borderRadius: 0,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: "rgba(255,255,255,0.8)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.05)",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: ({ ownerState }) => {
            let styles = {};

            if (
              ownerState.disabled &&
              ownerState.variant === "contained" &&
              ownerState.color === "primary"
            ) {
              styles = {
                backgroundColor: "#717171!important",
                color: "#ABABAB!important",
              };
            }

            if (
              !ownerState.disabled &&
              ownerState.variant === "contained" &&
              ownerState.color === "primary"
            ) {
              styles = {
                color: "white",
                // background: "linear-gradient(to right, #0081C1, #0099DA)",
                borderBottom: "1px solid #0081C1",
                transition: "transform 0.2s ease-out",
                "&:hover": {
                  background: "linear-gradient(to right, #0099DA, #0081C1)",
                  transform: "translateY(-3px)",
                },
              };
            }

            if (
              ownerState.variant === "contained" &&
              ownerState.color === "secondary"
            ) {
              styles = {
                color: "#0099DA",
                background: `linear-gradient(to right, #FFD300, ${SECONDARY_COLOR})`,
                borderBottom: "1px solid #FFC000",
                transition: "transform 0.2s ease-out",
                "&:hover": {
                  background: `linear-gradient(to right, ${SECONDARY_COLOR}, #FFD300)`,
                  transform: "translateY(-3px)",
                },
                "& .MuiTouchRipple-child": {
                  backgroundColor: "white",
                },
              };
            }

            // I am using info here because otherwise I need to do a ton of extension in order to have custom color
            // See: https://stackoverflow.com/questions/50069724/how-to-add-custom-mui-palette-colors
            if (
              ownerState.variant === "contained" &&
              ownerState.color === "info"
            ) {
              styles = {
                background: `linear-gradient(to right, ${INFO_COLOR}, #A6B3BC)`,
                borderBottom: `1px solid ${INFO_COLOR}`,
                "&:hover": {
                  transform: "translateY(-3px)",
                  background: `linear-gradient(to right, #A6B3BC, ${INFO_COLOR})`,
                },
              };
            }

            if (
              ownerState.variant === "contained" &&
              ownerState.color === "error"
            ) {
              styles = {
                background: `linear-gradient(to right, ${ERROR_COLOR}, #ff4771)`,
                borderBottom: `1px solid ${ERROR_COLOR}`,
                "&:hover": {
                  transform: "translateY(-3px)",
                  background: `linear-gradient(to right, #ff4771, ${ERROR_COLOR})`,
                },
              };
            }

            return {
              borderRadius: 5,
              paddingTop: 8,
              transition: "transform 0.2s ease-out",
              ...styles,
            };
          },
        },
      },
    },
    palette: {
      mode: "dark",
      primary: {
        main: "#359adc",
        dark: "#035d88",
      },
      secondary: {
        main: SECONDARY_COLOR,
      },
      text: {
        primary: PRIMARY_TEXT_COLOR,
      },
    },
    typography: {
      fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
      fontSize: 14,
    },
  });
};

export { initializeTheme };
