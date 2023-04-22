import ArrowBack from '@mui/icons-material/ArrowBack';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { Box, Button, Grow, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RegisterSuccessPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Grow in={true} mountOnEnter unmountOnExit>
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 10,
            }}
          >
            <CheckCircle
              sx={{
                fontSize: 150,
                color: '#61B9F2',
              }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 3,
            }}
          >
            <Typography
              variant="body2"
              component="p"
              sx={{
                fontSize: 14,
              }}
            >
              SUCCESSFULL REGISTRATION!
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 10,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              sx={{
                borderColor: 'white',
                color: 'white',
                borderRadius: 0,
              }}
              onClick={() => {
                navigate('/login');
              }}
            >
              Back to login
            </Button>
          </Box>
        </Box>
      </Grow>
    </>
  );
};

export default RegisterSuccessPage;
