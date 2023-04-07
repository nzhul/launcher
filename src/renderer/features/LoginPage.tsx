import Person from "@mui/icons-material/Person";
import Lock from "@mui/icons-material/Lock";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  Link,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import agent from "../../api/agent";
import { useEffect } from "react";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const result = await agent.Users.login({
      username: "nzhul",
      password: "password",
    });
    console.log(result);
  };

  useEffect(() => {
    // HACK: Fix for broken characters in <TextField>
    // Characters are broken after the app is packaged.
    document.querySelectorAll(".notranslate").forEach((e) => {
      e.innerHTML = "&ZeroWidthSpace;";
    });
  }, []);

  return (
    <>
      <Grid
        columnGap={2}
        rowGap={2}
        container
        columns={{ xs: 12 }}
        sx={{ mt: 12, pl: 2, pr: 2 }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TextField
            type={"text"}
            placeholder="Username"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
            sx={{ width: "100%" }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TextField
            type={"password"}
            placeholder="Password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
            sx={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={12} sx={{ ml: 2 }}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Remember me?"
              sx={{ mt: -1 }}
            />
          </FormGroup>
        </Grid>

        <Grid item xs={12} sx={{ mt: 5 }}>
          <Button
            variant="contained"
            sx={{ width: "100%", height: "70px", fontSize: 20 }}
            onClick={() => {
              // navigate("/main_window");
              handleLogin();
            }}
          >
            Login
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: -0.5,
          }}
        >
          <span style={{ fontSize: 14 }}>
            <Link>Register a free account</Link> or <Link>Play as Guest</Link>
          </span>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: -1.5,
          }}
        >
          <span style={{ fontSize: 14 }}>
            <Link>Can't log in?</Link>
          </span>
        </Grid>
      </Grid>
    </>
  );
};

export default LoginPage;
