import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatList from '../chat/ChatList';
import AuthContext from '../context/AuthContext';
import FeedItem from './news/FeedItem';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Settings from '@mui/icons-material/Settings';
import DownloadBtn from './download/DownloadBtn';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  console.log(window.innerHeight);

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
            background: 'linear-gradient(to bottom, rgba(61,61,61,0), #3d3d3d)',
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
                    border: '2px solid #45A2DF',
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
              <Typography variant="body1" color={'skyblue'}>
                {user?.username}
              </Typography>
              <Typography variant="body2">Online </Typography>
            </Box>
          </Grid>
          <Grid item xs={5}>
            <IconButton
              sx={{
                position: 'relative',
                float: 'right',
                mt: '6px',
                color: 'rgba(255,255,255,0.5)',
                backgroundColor: 'none',
                '&:hover': {
                  color: 'white',
                },
              }}
            >
              <Settings sx={{ fontSize: 30 }} />
            </IconButton>
          </Grid>
        </Grid>
        <ChatList />
        <DownloadBtn />
      </Grid>
    </Grid>
  );
};

export default HomePage;
