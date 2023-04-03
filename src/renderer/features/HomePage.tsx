import { Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChatList from "../chat/ChatList";
import DownloadBtn from "./download/DownloadBtn";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Grid columnGap={2} container>
      <Grid item xs>
        <Button
          variant="contained"
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </Button>
      </Grid>
      <Grid item style={{ width: "300px" }}>
        <ChatList />
        {/* <DownloadBtn /> */}
      </Grid>
    </Grid>
  );
};

export default HomePage;
