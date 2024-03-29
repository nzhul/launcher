import { Typography, Box, useTheme } from '@mui/material';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Logo = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const theme = useTheme();

  return (
    <Typography
      variant="h6"
      component="div"
      sx={{
        ml: 2,
        mr: -5.8,
      }}
    >
      <Box
        onClick={() => {
          if (!isAuthenticated) {
            return;
          }

          console.log('Clicked');
          navigate('/');
        }}
        sx={{
          WebkitAppRegion: isAuthenticated ? 'no-drag' : 'drag',
          color: 'white',
          position: 'relative',
          top: '16px',
          left: isAuthenticated ? '0px' : '20px',
          width: '270px',
          height: '94px',
          cursor: isAuthenticated ? 'pointer' : 'default',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          zIndex: 99,
        }}
      >
        <svg
          style={{ position: 'fixed', top: '-2px' }}
          width="270"
          height="101"
          viewBox="0 0 270 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_143_338)">
            <path
              d="M266 2H4L14 80H52.1875L55 95H215L217.812 80H256L266 2Z"
              fill={theme.palette.primary.light}
            />
          </g>
          <defs>
            <filter
              id="filter0_d_143_338"
              x="0"
              y="0"
              width="270"
              height="101"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_143_338"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_143_338"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
        <span
          style={{
            position: 'fixed',
            top: '12px',
            textAlign: 'center',
            lineHeight: 1,
            letterSpacing: 2,
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          ANCIENT <br /> WARRIORS
        </span>
        <span
          style={{
            position: 'fixed',
            top: '65px',
            fontSize: 14,
            fontWeight: 400,
            letterSpacing: 2,
          }}
        >
          AWAKENING
        </span>
      </Box>
    </Typography>
  );
};

export default Logo;
