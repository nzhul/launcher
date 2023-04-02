import { Grid } from "@mui/material";
import ChatList from "../chat/ChatList";
import DownloadBtn from "./download/DownloadBtn";

const HomePage = () => {
  return (
    <Grid columnGap={2} container>
      <Grid item xs>
        Left
      </Grid>
      <Grid item style={{ width: "300px" }}>
        <ChatList />
        <DownloadBtn />
      </Grid>
    </Grid>
  );
};

export default HomePage;
