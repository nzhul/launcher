import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          navigate("/main_window");
        }}
      >
        Login
      </Button>
    </>
  );
};

export default LoginPage;
