import { Box, Button, Grid } from '@mui/material';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatList from '../chat/ChatList';
import DownloadBtn from './download/DownloadBtn';
import AuthContext from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  console.log(user);

  return (
    <Grid columnGap={2} container>
      <Grid item xs>
        {user?.username}
      </Grid>
      <Grid item style={{ width: '300px' }}>
        <Grid justifyContent={'flex-end'} columnGap={2} container>
          <Grid item>
            <Button variant="contained" onClick={logout}>
              Logout
            </Button>
          </Grid>
        </Grid>
        <ChatList />
        {/* <DownloadBtn /> */}
      </Grid>
    </Grid>
  );
};

export default HomePage;
