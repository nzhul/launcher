import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const NavBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        elevation={0}
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
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
