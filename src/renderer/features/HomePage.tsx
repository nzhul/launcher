import { Avatar, Box, Grid, Typography, useTheme } from '@mui/material';
import { useContext } from 'react';
import ChatList from '../chat/ChatList';
import AuthContext from '../context/AuthContext';
import FeedItem from './news/FeedItem';
import DownloadBtn from './download/DownloadBtn';
import ProfileSettingsBtn from './profile/ProfileSettingsBtn';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();

  return (
    <Grid columnGap={2} container>
      <Grid
        item
        xs
        sx={{
          mt: 10.4,
          height: '90vh',
          overflowX: 'hidden',
          pr: 1.5,
          ':after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            background: 'linear-gradient(to bottom, rgba(61,61,61,0), #313338)',
            width: '100%',
            height: '80px',
          },
        }}
      >
        <FeedItem />
        <FeedItem />
        <FeedItem />
        <FeedItem />
      </Grid>
      <Grid item sx={{ width: '300px', mt: 1.5 }}>
        <Grid container columnGap={0} columns={{ xs: 12 }}>
          <Grid item xs={3}>
            <Box
              sx={{
                cursor: 'pointer',
              }}
              onClick={() => {
                console.log('clicked');
              }}
            >
              <Avatar
                variant="square"
                alt="Remy Sharp"
                src="static://assetsrenderer/avatars/00_lord-of-terror.png"
                sx={{
                  width: 55,
                  height: 55,
                  bgcolor: '#45A2DF',
                  border: '2px solid #5E5E5E',
                  '&:hover': {
                    border: `2px solid ${theme.palette.primary.main}`,
                  },
                }}
              />
              <Box
                sx={{
                  position: 'relative',
                  width: '10px',
                  height: '10px',
                  bottom: '10px',
                  right: '-50px',
                  backgroundColor: '#00FF00',
                  border: '2px solid #1C431E',
                  mb: '-12px',
                }}
              ></Box>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ ml: -1.3 }}>
              <Typography variant="body1" color="primary.main">
                {user?.username}
              </Typography>
              <Typography variant="body2">Online </Typography>
            </Box>
          </Grid>
          <Grid item xs={5}>
            <ProfileSettingsBtn />
          </Grid>
        </Grid>
        <ChatList />
        <DownloadBtn />
      </Grid>
    </Grid>
  );
};

export default HomePage;
